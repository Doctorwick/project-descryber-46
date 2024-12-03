import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';
import { FilterResult } from '@/types/filter';
import { harmfulPatterns } from './filter/patterns';
import { normalizeText } from './filter/textNormalizer';
import { analyzeWithAI } from './filter/aiAnalyzer';
import { detectBypassAttempt } from './filter/bypassDetector';
import { calculateSeverity } from './filter/severityCalculator';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const analyzeMessage = async (text: string): Promise<FilterResult> => {
  const originalText = text;
  const normalizedText = normalizeText(text);
  
  const matches: string[] = [];
  let totalMatches = 0;
  let maxConfidence = 0;

  // Pattern-based analysis
  [originalText, normalizedText].forEach(textToCheck => {
    Object.entries(harmfulPatterns).forEach(([category, pattern]) => {
      const matchArray = textToCheck.match(pattern) || [];
      const matchCount = matchArray.length;
      if (matchCount > 0 && !matches.includes(category)) {
        matches.push(category);
        totalMatches += matchCount;
        maxConfidence = Math.max(maxConfidence, matchCount * 0.3);
      }
    });
  });

  // AI-powered analysis
  const aiAnalysis = await analyzeWithAI(originalText);
  
  // Combine pattern matching with AI analysis
  const bypassAttempted = detectBypassAttempt(originalText, normalizedText);
  const severity = calculateSeverity(totalMatches, matches, normalizedText, aiAnalysis);

  // Update confidence based on AI analysis
  if (aiAnalysis) {
    maxConfidence = Math.max(maxConfidence, aiAnalysis.toxicity);
  }

  // Consider message harmful if either pattern matching or AI analysis indicates it
  const isHarmful = matches.length > 0 || 
    (aiAnalysis && (
      aiAnalysis.toxicity > 0.7 ||
      aiAnalysis.identity_attack > 0.7 ||
      aiAnalysis.threat > 0.7
    ));

  if (isHarmful) {
    try {
      const { error: harmfulError } = await supabase
        .from('harmful_messages')
        .insert([
          {
            text: originalText,
            categories: matches,
            severity,
            confidence: maxConfidence,
            timestamp: new Date().toISOString()
          }
        ]);

      if (harmfulError) {
        console.error('Error storing harmful message:', harmfulError);
        toast({
          variant: "destructive",
          title: "Database Error",
          description: "Failed to store message in history.",
        });
      }
    } catch (error) {
      console.error('Failed to store harmful message:', error);
    }
  }

  return {
    isHarmful,
    categories: matches,
    severity,
    confidence: maxConfidence,
    bypassAttempted,
    aiAnalysis
  };
};