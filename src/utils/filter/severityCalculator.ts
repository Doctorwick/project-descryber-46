import { FilterResult } from '@/types/filter';

export const calculateSeverity = (
  matches: number, 
  categories: string[], 
  text: string, 
  aiAnalysis?: FilterResult['aiAnalysis']
): "low" | "medium" | "high" => {
  // Direct threats or self-harm content is always high severity
  const containsSelfHarm = /\b(kill yourself|suicide|die)\b/i.test(text);
  const containsDirectThreat = categories.includes('threats') && /\b(kill|murder)\b/i.test(text);
  
  if (containsSelfHarm || containsDirectThreat) {
    return "high";
  }

  // Check AI analysis results
  if (aiAnalysis) {
    if (
      aiAnalysis.toxicity > 0.8 ||
      aiAnalysis.identity_attack > 0.7 ||
      aiAnalysis.insult > 0.7 ||
      aiAnalysis.threat > 0.8
    ) {
      return "high";
    }

    if (
      aiAnalysis.toxicity > 0.6 ||
      aiAnalysis.identity_attack > 0.6 ||
      aiAnalysis.insult > 0.6 ||
      aiAnalysis.threat > 0.6
    ) {
      return "medium";
    }
  }

  // Multiple categories of harmful content
  if (categories.length >= 2) {
    return "high";
  }

  // Single category but multiple matches
  if (matches >= 3) {
    return "high";
  }

  // Check for contextual severity
  const hasPersonalAttack = /\b(you|ur|your|u)\b.*\b(suck|stink|smell|ugly|stupid|dumb)\b/i.test(text);
  if (hasPersonalAttack) {
    return "high";
  }

  if (matches >= 2 || categories.length > 0) {
    return "medium";
  }

  return "low";
};