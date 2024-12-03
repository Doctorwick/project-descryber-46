export interface FilterResult {
  isHarmful: boolean;
  categories: string[];
  severity: "low" | "medium" | "high";
  confidence: number;
  bypassAttempted?: boolean;
  aiAnalysis?: {
    toxicity: number;
    identity_attack: number;
    insult: number;
    threat: number;
  };
}

export interface PatternMatch {
  category: string;
  matches: string[];
}