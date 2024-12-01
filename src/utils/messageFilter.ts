interface FilterRule {
  pattern: RegExp;
  severity: 'low' | 'medium' | 'high';
  category: 'profanity' | 'harassment' | 'threat' | 'discrimination';
}

const filterRules: FilterRule[] = [
  // Profanity
  { pattern: /\b(stupid|dumb|idiot)\b/i, severity: 'low', category: 'profanity' },
  { pattern: /\b(fuck|shit|ass)\b/i, severity: 'medium', category: 'profanity' },
  
  // Harassment
  { pattern: /\b(ugly|fat|loser)\b/i, severity: 'medium', category: 'harassment' },
  { pattern: /\b(hate you|hate u|kys)\b/i, severity: 'high', category: 'harassment' },
  
  // Threats
  { pattern: /\b(kill|die|hurt|punch|beat)\b/i, severity: 'high', category: 'threat' },
  { pattern: /\b(find you|coming for|watch out)\b/i, severity: 'high', category: 'threat' },
  
  // Discrimination
  { pattern: /\b(racist|sexist|homophobic)\b/i, severity: 'high', category: 'discrimination' },
];

export interface FilterResult {
  isHarmful: boolean;
  severity: 'low' | 'medium' | 'high' | null;
  categories: string[];
  matches: string[];
}

export const analyzeMessage = (text: string): FilterResult => {
  const matches: string[] = [];
  const categories = new Set<string>();
  let maxSeverity: 'low' | 'medium' | 'high' | null = null;

  filterRules.forEach(rule => {
    if (rule.pattern.test(text)) {
      matches.push(rule.pattern.source);
      categories.add(rule.category);
      
      if (!maxSeverity || 
          (rule.severity === 'high') || 
          (rule.severity === 'medium' && maxSeverity === 'low')) {
        maxSeverity = rule.severity;
      }
    }
  });

  return {
    isHarmful: matches.length > 0,
    severity: maxSeverity,
    categories: Array.from(categories),
    matches
  };
};