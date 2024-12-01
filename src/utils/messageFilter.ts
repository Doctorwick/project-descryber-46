export interface FilterResult {
  isHarmful: boolean;
  categories: string[];
  severity: "low" | "medium" | "high";
  confidence: number;
}

const harmfulPatterns = {
  profanity: /\b(bad|words|here)\b/i,
  harassment: /\b(bully|harass|threat)\b/i,
  hate: /\b(hate|discriminate)\b/i,
  personal: /\b(address|phone|email)\b/i,
};

const calculateSeverity = (matches: number, confidence: number): "low" | "medium" | "high" => {
  if (confidence > 0.8) return "high";
  if (confidence > 0.5) return "medium";
  return "low";
};

export const analyzeMessage = (text: string): FilterResult => {
  const matches: string[] = [];
  let totalMatches = 0;

  Object.entries(harmfulPatterns).forEach(([category, pattern]) => {
    if (pattern.test(text)) {
      matches.push(category);
      totalMatches++;
    }
  });

  const confidence = totalMatches / Object.keys(harmfulPatterns).length;
  const severity = calculateSeverity(totalMatches, confidence);

  return {
    isHarmful: matches.length > 0,
    categories: matches,
    severity,
    confidence,
  };
};