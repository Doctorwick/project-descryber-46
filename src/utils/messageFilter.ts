import { FilterResult } from "@/types/filter";
import { analyzeWithAI } from "./filter/aiAnalyzer";
import { normalizeText, isContextuallyAllowed } from "./filter/textNormalizer";
import { detectBypassAttempt } from "./filter/bypassDetector";
import { calculateSeverity } from "./filter/severityCalculator";
import { harmfulPatterns } from "./filter/patterns";

export const analyzeMessage = async (text: string): Promise<FilterResult> => {
  const originalText = text;
  const normalizedText = normalizeText(text);
  
  const matches: string[] = [];
  let totalMatches = 0;
  let maxConfidence = 0;

  // Enhanced pattern-based analysis
  [originalText, normalizedText].forEach(textToCheck => {
    Object.entries(harmfulPatterns).forEach(([category, pattern]) => {
      const matchArray = textToCheck.match(pattern) || [];
      const matchCount = matchArray.length;
      if (matchCount > 0 && !matches.includes(category)) {
        matches.push(category);
        totalMatches += matchCount;
        maxConfidence = Math.max(maxConfidence, matchCount * 0.3);
      }
    });
  });

  // AI-powered analysis
  const aiAnalysis = await analyzeWithAI(originalText);
  const isAppropriate = isContextuallyAllowed(originalText, matches);
  
  const bypassAttempted = detectBypassAttempt(originalText, normalizedText);
  const severity = calculateSeverity(totalMatches, matches, normalizedText, aiAnalysis);

  // Update confidence based on AI analysis
  maxConfidence = Math.max(
    maxConfidence,
    aiAnalysis?.toxicity || 0,
    aiAnalysis?.identity_attack || 0,
    aiAnalysis?.insult || 0,
    aiAnalysis?.threat || 0
  );

  // More sophisticated harmful content detection
  const isHarmful = !isAppropriate && (
    (severity === 'high' && maxConfidence > 0.7) ||
    (severity === 'medium' && maxConfidence > 0.8) ||
    (bypassAttempted && severity !== 'low') ||
    matches.includes('threats') ||
    matches.includes('discrimination')
  );

  return {
    isHarmful,
    categories: matches,
    severity,
    confidence: maxConfidence,
    bypassAttempted,
    aiAnalysis
  };
};