import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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

  // Check against regex patterns
  Object.entries(harmfulPatterns).forEach(([category, pattern]) => {
    const matchCount = (text.match(pattern) || []).length;
    if (matchCount > 0) {
      matches.push(category);
      totalMatches += matchCount;
      maxConfidence = Math.max(maxConfidence, matchCount * 0.3);
    }
  });

  // Store harmful messages in Supabase
  if (matches.length > 0) {
    await supabase
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
  }

  return {
    isHarmful: matches.length > 0,
    categories: matches,
    severity: calculateSeverity(totalMatches, maxConfidence),
    confidence: maxConfidence
  };
};