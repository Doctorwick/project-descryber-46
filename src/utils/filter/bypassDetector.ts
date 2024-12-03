import { bypassPatterns } from './patterns';

export const detectBypassAttempt = (originalText: string, normalizedText: string): boolean => {
  // Check for intentional letter spacing
  if (bypassPatterns.letterSpacing.test(originalText)) {
    return true;
  }

  // Check for excessive special characters
  const specialCharCount = (originalText.match(bypassPatterns.specialChars) || []).length;
  if (specialCharCount > originalText.length * 0.3) {
    return true;
  }

  // Check for number substitutions
  const numberCount = (originalText.match(bypassPatterns.numbers) || []).length;
  if (numberCount > 0) {
    return true;
  }

  // Check for repeated characters
  if (bypassPatterns.repeatedChars.test(originalText)) {
    return true;
  }

  return false;
};