import { FilterResult } from '@/types/filter';

export const calculateSeverity = (
  matches: number, 
  categories: string[], 
  text: string, 
  aiAnalysis?: FilterResult['aiAnalysis']
): "low" | "medium" | "high" => {
  // Direct threats or self-harm content is always high severity
  const containsSelfHarm = /\b(k+\s*y+\s*s|s+\s*u+\s*i+\s*c+\s*i+\s*d+\s*e|d+\s*i+\s*e)\b/i.test(text);
  const containsDirectThreat = categories.includes('threats') && 
    /\b(k+\s*i+\s*l+\s*l|m+\s*u+\s*r+\s*d+\s*e+\s*r)\b/i.test(text);
  
  if (containsSelfHarm || containsDirectThreat) {
    return "high";
  }

  // Check AI analysis results with more nuanced thresholds
  if (aiAnalysis) {
    const maxToxicity = Math.max(
      aiAnalysis.toxicity,
      aiAnalysis.identity_attack,
      aiAnalysis.insult,
      aiAnalysis.threat
    );

    if (maxToxicity > 0.8) return "high";
    if (maxToxicity > 0.6) return "medium";
  }

  // Multiple categories of harmful content
  if (categories.length >= 2) {
    return "high";
  }

  // Check for contextual severity
  const hasPersonalAttack = /\b(y+\s*o+\s*u|u+\s*r|y+\s*o+\s*u+\s*r|u)\b.*\b(s+\s*u+\s*c+\s*k|s+\s*t+\s*i+\s*n+\s*k|s+\s*m+\s*e+\s*l+\s*l|u+\s*g+\s*l+\s*y|s+\s*t+\s*u+\s*p+\s*i+\s*d|d+\s*u+\s*m+\s*b)\b/i.test(text);
  if (hasPersonalAttack) {
    return "high";
  }

  // Check for bypass attempts with harmful intent
  const hasBypassPattern = /[^\w\s]{2,}|\d+|(.)\1{2,}/g.test(text);
  if (hasBypassPattern && categories.length > 0) {
    return "high";
  }

  if (matches >= 2 || categories.length > 0) {
    return "medium";
  }

  return "low";
};