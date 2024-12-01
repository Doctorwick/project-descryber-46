import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

try {
  new URL(supabaseUrl);
} catch (e) {
  throw new Error('Invalid Supabase URL. Please check your .env file and ensure the URL is correct.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface FilterResult {
  isHarmful: boolean;
  categories: string[];
  severity: "low" | "medium" | "high";
  confidence: number;
}

const harmfulPatterns = {
  profanity: /\b(fuck|shit|ass|bitch|damn|crap|piss|dick|cock|pussy|asshole)\b/i,
  harassment: /\b(kill|die|hate|stupid|idiot|dumb|retard|loser|fat|ugly)\b/i,
  threats: /\b(threat|kill|murder|hurt|attack|beat|fight|punch|shoot)\b/i,
  discrimination: /\b(nazi|nigger|fag|gay|lesbian|trans|queer|jew|muslim|islam|christian)\b/i,
  personalInfo: /\b(\d{3}[-.]?\d{3}[-.]?\d{4}|\w+@\w+\.\w{2,3}|(?:\d{1,3}\.){3}\d{1,3})\b/i
};

const calculateSeverity = (matches: number, confidence: number): "low" | "medium" | "high" => {
  if (confidence > 0.8) return "high";
  if (confidence > 0.5) return "medium";
  return "low";
};

export const analyzeMessage = async (text: string): Promise<FilterResult> => {
  const matches: string[] = [];
  let totalMatches = 0;
  let maxConfidence = 0;

  Object.entries(harmfulPatterns).forEach(([category, pattern]) => {
    const matchCount = (text.match(pattern) || []).length;
    if (matchCount > 0) {
      matches.push(category);
      totalMatches += matchCount;
      maxConfidence = Math.max(maxConfidence, matchCount * 0.3);
    }
  });

  if (matches.length > 0) {
    try {
      const { error: harmfulError } = await supabase
        .from('harmful_messages')
        .insert([
          {
            text,
            categories: matches,
            severity: calculateSeverity(totalMatches, maxConfidence),
            confidence: maxConfidence,
            timestamp: new Date().toISOString()
          }
        ]);

      if (harmfulError) {
        console.error('Error storing harmful message:', harmfulError);
        toast({
          variant: "destructive",
          title: "Database Error",
          description: "Failed to store message in history. The database table might not exist.",
        });
      }
    } catch (error) {
      console.error('Failed to store harmful message:', error);
    }
  }

  return {
    isHarmful: matches.length > 0,
    categories: matches,
    severity: calculateSeverity(totalMatches, maxConfidence),
    confidence: maxConfidence
  };
};