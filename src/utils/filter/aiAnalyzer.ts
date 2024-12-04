import { pipeline } from '@huggingface/transformers';
import { normalizeText, isContextuallyAllowed } from './textNormalizer';
import { harmfulPatterns } from './patterns';

let classifier: any = null;

export const initializeClassifier = async () => {
  try {
    classifier = await pipeline(
      'text-classification',
      'martin-ha/toxic-comment-model',
      { 
        device: 'cpu'
      }
    );
    console.log('Toxicity classifier initialized successfully');
  } catch (error) {
    console.error('Error initializing toxicity classifier:', error);
  }
};

// Initialize the classifier when the module loads
initializeClassifier();

export const analyzeWithAI = async (text: string) => {
  if (!classifier) {
    console.warn('Toxicity classifier not initialized yet');
    return null;
  }

  try {
    // Find any profanity in the text
    const profanityFound: string[] = [];
    Object.entries(harmfulPatterns).forEach(([category, pattern]) => {
      const matches = text.match(pattern);
      if (matches) {
        profanityFound.push(...matches);
      }
    });

    // Check if the context allows the profanity
    const isAllowed = isContextuallyAllowed(text, profanityFound);
    if (isAllowed) {
      return {
        toxicity: 0.3, // Low toxicity score for allowed contexts
        identity_attack: 0,
        insult: 0,
        threat: 0
      };
    }

    // Analyze original text
    const results = await classifier(text, {
      wait_for_model: true
    });

    // Also analyze normalized text to catch bypasses
    const normalizedText = normalizeText(text);
    const normalizedResults = await classifier(normalizedText, {
      wait_for_model: true
    });

    // Use the higher score between original and normalized text
    const score = Math.max(results[0].score, normalizedResults[0].score);

    // Adjust scores based on context and content
    const hasDirectInsult = /\b(you|ur|your|u)\b.*\b(suck|stink|smell|ugly|stupid|dumb)\b/i.test(text);
    const hasBypassAttempt = text !== normalizedText;

    return {
      toxicity: hasBypassAttempt ? Math.max(score, 0.7) : score,
      identity_attack: /\b(ur|your|u|yo)\s*mom\b/i.test(text) ? 0.8 : score * 0.5,
      insult: hasDirectInsult ? Math.max(score, 0.8) : score * 0.7,
      threat: /\b(kill|die|hurt)\b/i.test(text) ? Math.max(score, 0.9) : score * 0.3
    };
  } catch (error) {
    console.error('Error analyzing text with AI:', error);
    return null;
  }
};