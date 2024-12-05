import { allowedContexts } from './patterns';

export const normalizeText = (text: string): string => {
  let normalized = text.toLowerCase();

  // Remove zero-width characters and invisible characters
  normalized = normalized.replace(/[\u200B-\u200D\uFEFF]/g, '');

  // Replace common letter/number substitutions
  Object.entries(bypassPatterns.commonSubstitutions).forEach(([short, full]) => {
    // Create a pattern that matches the short form with optional special characters between letters
    const pattern = new RegExp(
      short.split('').join('[^\\w\\s]*'),
      'gi'
    );
    normalized = normalized.replace(pattern, full);
  });

  // Handle letter spacing and special characters
  normalized = normalized
    .replace(/\s+/g, ' ')  // Normalize spaces
    .replace(/[^\w\s]/g, '') // Remove special characters
    .trim();

  // Remove repeated characters (but keep at least two if they exist)
  normalized = normalized.replace(/(.)\1{2,}/g, '$1$1');

  // Handle common leetspeak patterns not covered by substitutions
  normalized = normalized
    .replace(/ph/g, 'f')
    .replace(/\$/g, 's')
    .replace(/@/g, 'a')
    .replace(/!/, 'i')
    .replace(/1/g, 'i')
    .replace(/0/g, 'o')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b')
    .replace(/9/g, 'g');

  return normalized;
};

export const isContextuallyAllowed = (text: string, profanity: string[]): boolean => {
  // Check each context pattern
  for (const context of allowedContexts) {
    if (context.pattern.test(text)) {
      // Check if all found profanity is in the allowed list for this context
      const disallowedProfanity = profanity.filter(word => 
        !context.allowedWords.includes(word.toLowerCase())
      );
      
      // Only allow if all profanity found is in the allowed list
      if (disallowedProfanity.length === 0) {
        // Additional check for mixed harmful content
        const hasOtherHarmfulContent = /\b(kill|die|hate|stupid|idiot|ugly)\b/i.test(text);
        return !hasOtherHarmfulContent;
      }
    }
  }
  
  return false;
};

export const detectBypassIntent = (originalText: string, normalizedText: string): boolean => {
  // Check for intentional character manipulation
  const specialCharRatio = (originalText.match(/[^\w\s]/g) || []).length / originalText.length;
  if (specialCharRatio > 0.15) return true;

  // Check for intentional spacing
  const spacingRatio = (originalText.match(/\s/g) || []).length / originalText.length;
  if (spacingRatio > 0.3) return true;

  // Check for significant text transformation
  const similarityScore = calculateSimilarity(originalText, normalizedText);
  return similarityScore < 0.6;
};

// Helper function to calculate text similarity
function calculateSimilarity(text1: string, text2: string): number {
  const set1 = new Set(text1.toLowerCase().split(''));
  const set2 = new Set(text2.toLowerCase().split(''));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

import { bypassPatterns } from './patterns';
