import { pipeline } from '@huggingface/transformers';

let classifier: any = null;

export const initializeClassifier = async () => {
  try {
    classifier = await pipeline(
      'text-classification',
      'martin-ha/toxic-comment-model',
      { 
        device: 'cpu',
        quantized: false
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

    // Also analyze text with common substitutions normalized
    const normalizedText = text
      .toLowerCase()
      .replace(/[0-9]/g, letter => {
        const numberMap: { [key: string]: string } = {
          '0': 'o', '1': 'i', '3': 'e', '4': 'a',
          '5': 's', '7': 't', '8': 'b', '9': 'g'
        };
        return numberMap[letter] || letter;
      })
      .replace(/(\w)\1+/g, '$1') // Replace repeated characters
      .replace(/[^a-z0-9\s]/g, ''); // Remove special characters

    const normalizedResults = await classifier(normalizedText, {
      wait_for_model: true
    });

    // Use the higher score between original and normalized text
    const score = Math.max(results[0].score, normalizedResults[0].score);

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