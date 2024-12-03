import { pipeline } from '@huggingface/transformers';

let classifier: any = null;

export const initializeClassifier = async () => {
  try {
    classifier = await pipeline(
      'text-classification',
      'martin-ha/toxic-comment-model',
      { device: 'cpu' }
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
    const results = await classifier(text, {
      wait_for_model: true
    });

    const score = results[0].score;
    return {
      toxicity: score,
      identity_attack: score > 0.7 ? score : 0,
      insult: score > 0.6 ? score : 0,
      threat: score > 0.8 ? score : 0
    };
  } catch (error) {
    console.error('Error analyzing text with AI:', error);
    return null;
  }
};