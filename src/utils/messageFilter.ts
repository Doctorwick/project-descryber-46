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
  profanity: /\b(fuck|shit|ass|bitch|damn|crap|piss|dick|cock|pussy|asshole|wtf|stfu|fu|af|bs|pos)\b/gi,
  harassment: /\b(kill|die|hate|stupid|idiot|dumb|retard|loser|fat|ugly|kys|kms|gtfo|stfu|foff|fys)\b/gi,
  threats: /\b(threat|kill|murder|hurt|attack|beat|fight|punch|shoot|kys|kms|ys|rip|die)\b/gi,
  discrimination: /\b(nazi|nigger|fag|gay|lesbian|trans|queer|jew|muslim|islam|christian|n1g|f4g)\b/gi,
  personalInfo: /\b(\d{3}[-.]?\d{3}[-.]?\d{4}|\w+@\w+\.\w{2,3}|(?:\d{1,3}\.){3}\d{1,3})\b/gi
};

const calculateSeverity = (matches: number, categories: string[], text: string): "low" | "medium" | "high" => {
  // Check for direct threats or self-harm content
  const containsSelfHarm = /\b(kill yourself|suicide|die)\b/i.test(text);
  const containsDirectThreat = categories.includes('threats') && /\b(kill|murder)\b/i.test(text);
  
  if (containsSelfHarm || containsDirectThreat) {
    return "high";
  }
  
  // Multiple categories of harmful content
  if (categories.length >= 2) {
    return "high";
  }
  
  // Single category but multiple matches
  if (matches >= 3) {
    return "high";
  }
  
  if (matches >= 2 || categories.length > 0) {
    return "medium";
  }
  
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

  const severity = calculateSeverity(totalMatches, matches, text);

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