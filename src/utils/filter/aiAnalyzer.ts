import { pipeline } from '@huggingface/transformers';

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
    // Analyze original text
    const results = await classifier(text, {
      wait_for_model: true
    });

    // Transform the results to match our expected format
    const score = results[0].score;
    
    return {
      toxicity: score,
      identity_attack: score * 0.5,
      insult: /\b(you|ur|your|u)\b.*\b(suck|stink|smell|ugly|stupid|dumb)\b/i.test(text) ? Math.max(score, 0.8) : score * 0.7,
      threat: /\b(kill|die|hurt)\b/i.test(text) ? Math.max(score, 0.9) : score * 0.3
    };
  } catch (error) {
    console.error('Error analyzing text with AI:', error);
    return null;
  }
};