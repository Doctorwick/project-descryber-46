import { FilterResult } from '@/types/filter';

export const calculateSeverity = (
  matches: number, 
  categories: string[], 
  text: string, 
  aiAnalysis?: FilterResult['aiAnalysis']
): "low" | "medium" | "high" => {
  // Check for high toxicity in AI analysis
  if (aiAnalysis && (
    aiAnalysis.toxicity > 0.8 ||
    aiAnalysis.identity_attack > 0.7 ||
    aiAnalysis.insult > 0.7 ||    // Added insult threshold
    aiAnalysis.threat > 0.8
  )) {
    return "high";
  }

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
  
  // Medium severity for AI-detected toxicity above lower threshold
  if (aiAnalysis && (
    aiAnalysis.toxicity > 0.6 ||
    aiAnalysis.identity_attack > 0.6 ||
    aiAnalysis.insult > 0.6 ||
    aiAnalysis.threat > 0.6
  )) {
    return "medium";
  }
  
  if (matches >= 2 || categories.length > 0) {
    return "medium";
  }
  
  return "low";
};