import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { FilterResult } from '@/types/filter';
import { harmfulPatterns } from './filter/patterns';
import { normalizeText } from './filter/textNormalizer';
import { analyzeContextAndIntent, isContextuallyAppropriate } from './filter/enhancedAiAnalyzer';
import { detectBypassAttempt } from './filter/bypassDetector';
import { calculateSeverity } from './filter/severityCalculator';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const analyzeMessage = async (text: string): Promise<FilterResult> => {
  const originalText = text;
  const normalizedText = normalizeText(text);
  
  const matches: string[] = [];
  let totalMatches = 0;
  let maxConfidence = 0;

  // Enhanced pattern-based analysis with reduced sensitivity
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

  // Enhanced AI analysis with context understanding
  const aiAnalysis = await analyzeContextAndIntent(originalText);
  const isAppropriate = isContextuallyAppropriate(originalText, aiAnalysis);
  
  // Bypass detection with improved accuracy
  const bypassAttempted = detectBypassAttempt(originalText, normalizedText);
  const severity = calculateSeverity(totalMatches, matches, normalizedText, aiAnalysis);

  // Update confidence based on enhanced AI analysis
  maxConfidence = Math.max(
    maxConfidence, 
    aiAnalysis.toxicity,
    aiAnalysis.identity_attack,
    aiAnalysis.insult,
    aiAnalysis.threat
  );

  // Consider message harmful only for medium/high severity content
  const isHarmful = !isAppropriate && (
    (severity === 'high') || 
    (severity === 'medium' && maxConfidence > 0.7) ||
    bypassAttempted
  );

  if (isHarmful) {
    try {
      const { error: harmfulError } = await supabase
        .from('harmful_messages')
        .insert([{
          text: originalText,
          categories: matches,
          severity,
          confidence: maxConfidence,
          timestamp: new Date().toISOString()
        }]);

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