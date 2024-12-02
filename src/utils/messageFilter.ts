import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface FilterResult {
  isHarmful: boolean;
  categories: string[];
  severity: "low" | "medium" | "high";
  confidence: number;
}

const harmfulPatterns = {
  profanity: /\b(fuck|shit|ass|bitch|damn|crap|piss|dick|cock|pussy|asshole)\b/gi,
  harassment: /\b(kill|die|hate|stupid|idiot|dumb|retard|loser|fat|ugly)\b/gi,
  threats: /\b(threat|kill|murder|hurt|attack|beat|fight|punch|shoot)\b/gi,
  discrimination: /\b(nazi|nigger|fag|gay|lesbian|trans|queer|jew|muslim|islam|christian)\b/gi,
  personalInfo: /\b(\d{3}[-.]?\d{3}[-.]?\d{4}|\w+@\w+\.\w{2,3}|(?:\d{1,3}\.){3}\d{1,3})\b/gi
};

const calculateSeverity = (matches: number, confidence: number): "low" | "medium" | "high" => {
  if (matches >= 3 || confidence > 0.8) return "high";
  if (matches >= 2 || confidence > 0.5) return "medium";
  return "low";
};

export const analyzeMessage = async (text: string): Promise<FilterResult> => {
  const matches: string[] = [];
  let totalMatches = 0;
  let maxConfidence = 0;

  Object.entries(harmfulPatterns).forEach(([category, pattern]) => {
    const matchArray = text.match(pattern) || [];
    const matchCount = matchArray.length;
    if (matchCount > 0) {
      matches.push(category);
      totalMatches += matchCount;
      maxConfidence = Math.max(maxConfidence, matchCount * 0.3);
    }
  });

  const severity = calculateSeverity(totalMatches, maxConfidence);

  if (matches.length > 0) {
    try {
      const { error: harmfulError } = await supabase
        .from('harmful_messages')
        .insert([
          {
            text,
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
    isHarmful: matches.length > 0,
    categories: matches,
    severity,
    confidence: maxConfidence
  };
};