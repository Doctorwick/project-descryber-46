import { createClient } from '@supabase/supabase-js';
import { pipeline } from '@huggingface/transformers';
import { toast } from '@/components/ui/use-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface FilterResult {
  isHarmful: boolean;
  categories: string[];
  severity: "low" | "medium" | "high";
  confidence: number;
  bypassAttempted?: boolean;
  aiAnalysis?: {
    toxicity: number;
    identity_attack: number;
    insult: number;
    threat: number;
  };
}

const harmfulPatterns = {
  profanity: /\b(fuck|shit|ass|bitch|damn|crap|piss|dick|cock|pussy|asshole|wtf|stfu|fu|af|bs|pos)\b/gi,
  harassment: /\b(kill|die|hate|stupid|idiot|dumb|retard|loser|fat|ugly|kys|kms|gtfo|stfu|foff|fys)\b/gi,
  threats: /\b(threat|kill|murder|hurt|attack|beat|fight|punch|shoot|kys|kms|ys|rip|die)\b/gi,
  discrimination: /\b(nazi|nigger|fag|gay|lesbian|trans|queer|jew|muslim|islam|christian|n1g|f4g)\b/gi,
  personalInfo: /\b(\d{3}[-.]?\d{3}[-.]?\d{4}|\w+@\w+\.\w{2,3}|(?:\d{1,3}\.){3}\d{1,3})\b/gi
};

// Common bypass patterns
const bypassPatterns = {
  letterSpacing: /\b\w+\s+\w+\b/g,  // Detects intentional letter spacing
  specialChars: /[\W_]+/g,  // Detects special characters used to break words
  numbers: /\d+/g,  // Detects numbers used to replace letters
  repeatedChars: /(.)\1{2,}/g,  // Detects repeated characters
};

const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[0-9]/g, (match) => {
      const numberMap: { [key: string]: string } = {
        '0': 'o', '1': 'i', '3': 'e', '4': 'a',
        '5': 's', '7': 't', '8': 'b', '9': 'g'
      };
      return numberMap[match] || match;
    })
    .replace(/[\W_]+/g, '')
    .replace(/(.)\1+/g, '$1');
};

// Initialize the toxicity classifier
let classifier: any = null;
const initializeClassifier = async () => {
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

const analyzeWithAI = async (text: string) => {
  if (!classifier) {
    console.warn('Toxicity classifier not initialized yet');
    return null;
  }

  try {
    const results = await classifier(text, {
      wait_for_model: true
    });

    // Map the results to our expected format
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

const detectBypassAttempt = (originalText: string, normalizedText: string): boolean => {
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

const calculateSeverity = (
  matches: number, 
  categories: string[], 
  text: string, 
  aiAnalysis?: FilterResult['aiAnalysis']
): "low" | "medium" | "high" => {
  // Check for high toxicity in AI analysis
  if (aiAnalysis && (
    aiAnalysis.toxicity > 0.8 ||
    aiAnalysis.identity_attack > 0.7 ||
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
  
  if (matches >= 2 || categories.length > 0) {
    return "medium";
  }
  
  return "low";
};

export const analyzeMessage = async (text: string): Promise<FilterResult> => {
  const originalText = text;
  const normalizedText = normalizeText(text);
  
  const matches: string[] = [];
  let totalMatches = 0;
  let maxConfidence = 0;

  // Pattern-based analysis
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
  
  // Combine pattern matching with AI analysis
  const bypassAttempted = detectBypassAttempt(originalText, normalizedText);
  const severity = calculateSeverity(totalMatches, matches, normalizedText, aiAnalysis);

  // Update confidence based on AI analysis
  if (aiAnalysis) {
    maxConfidence = Math.max(maxConfidence, aiAnalysis.toxicity);
  }

  // Consider message harmful if either pattern matching or AI analysis indicates it
  const isHarmful = matches.length > 0 || 
    (aiAnalysis && (
      aiAnalysis.toxicity > 0.7 ||
      aiAnalysis.identity_attack > 0.7 ||
      aiAnalysis.threat > 0.7
    ));

  if (isHarmful) {
    try {
      const { error: harmfulError } = await supabase
        .from('harmful_messages')
        .insert([
          {
            text: originalText,
            categories: matches,
            severity,
            confidence: maxConfidence,
            timestamp: new Date().toISOString()
          }
        ]);

      if (harmfulError) {
        console.error('Error storing harmful message:', harmfulError);
        toast({
          variant: "destructive",
          title: "Database Error",
          description: "Failed to store message in history.",
        });
      }
    } catch (error) {
      console.error('Failed to store harmful message:', error);
    }
  }

  return {
    isHarmful,
    categories: matches,
    severity,
    confidence: maxConfidence,
    bypassAttempted,
    aiAnalysis
  };
};