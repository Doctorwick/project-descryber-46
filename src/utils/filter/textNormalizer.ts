import { bypassPatterns } from './patterns';

export const normalizeText = (text: string): string => {
  let normalized = text.toLowerCase();

  // Replace common letter/number substitutions
  normalized = normalized
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b')
    .replace(/9/g, 'g');

  // Replace common text speak
  Object.entries(bypassPatterns.commonSubstitutions).forEach(([short, full]) => {
    const regex = new RegExp(`\\b${short}\\b`, 'gi');
    normalized = normalized.replace(regex, full);
  });

  // Remove repeated characters
  normalized = normalized.replace(/(.)\1+/g, '$1');

  // Remove special characters and extra spaces
  normalized = normalized
    .replace(/[\W_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return normalized;
};

export const isContextuallyAllowed = (text: string, profanity: string[]): boolean => {
  const { allowedContexts } = require('./patterns');
  
  // Check each context pattern
  for (const context of allowedContexts) {
    if (context.pattern.test(text)) {
      // If the only profanity found is in the allowed list for this context, allow it
      const foundProfanity = profanity.filter(word => 
        !context.allowedWords.includes(word.toLowerCase())
      );
      return foundProfanity.length === 0;
    }
  }
  
  return false;
};