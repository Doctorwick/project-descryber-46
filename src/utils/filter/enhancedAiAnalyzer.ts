import { FilterResult } from "@/types/filter";
import { normalizeText } from "./textNormalizer";
import { detectBypassAttempt } from "./bypassDetector";

interface AiAnalysisResult {
  toxicity: number;
  identity_attack: number;
  insult: number;
  threat: number;
  context_score: number;
}

export const analyzeContextAndIntent = async (text: string): Promise<AiAnalysisResult> => {
  try {
    const response = await fetch("/api/analyze-context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) throw new Error("Failed to analyze context");
    return await response.json();
  } catch (error) {
    console.error("Error in AI analysis:", error);
    return {
      toxicity: 0.5,
      identity_attack: 0,
      insult: 0,
      threat: 0,
      context_score: 0.5,
    };
  }
};

export const isContextuallyAppropriate = (
  text: string,
  aiResult: AiAnalysisResult
): boolean => {
  // Gaming context detection
  const gamingKeywords = /\b(game|play|server|lag|crash|bug|glitch)\b/i;
  const isGamingContext = gamingKeywords.test(text);
  
  // Frustration expression detection
  const frustrationPatterns = /\b(damn|shit|fuck|fck|f\*ck)\b.*\b(crash|lag|bug|glitch)\b/i;
  const isFrustrationContext = frustrationPatterns.test(text);

  return (
    (isGamingContext && isFrustrationContext && aiResult.context_score > 0.6) ||
    (aiResult.toxicity < 0.4 && aiResult.context_score > 0.7)
  );
};