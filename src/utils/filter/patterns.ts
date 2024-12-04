export const harmfulPatterns = {
  profanity: /\b(f+[^\w]*u+[^\w]*c*[^\w]*k+|f+[^\w]*o+[^\w]*f+|f+[^\w]*u+|s+h+[^\w]*i+[^\w]*t+|a+[^\w]*s+[^\w]*s+|b+[^\w]*i+[^\w]*t+[^\w]*c+[^\w]*h+|d+[^\w]*a+[^\w]*m+[^\w]*n+|c+[^\w]*r+[^\w]*a+[^\w]*p+|p+[^\w]*i+[^\w]*s+[^\w]*s+|d+[^\w]*i+[^\w]*c+[^\w]*k+|c+[^\w]*o+[^\w]*c+[^\w]*k+|p+[^\w]*u+[^\w]*s+[^\w]*s+[^\w]*y+|a+[^\w]*s+[^\w]*s+[^\w]*h+[^\w]*o+[^\w]*l+[^\w]*e+|w+[^\w]*t+[^\w]*f+|s+[^\w]*t+[^\w]*f+[^\w]*u+|f+[^\w]*u+|a+[^\w]*f+|b+[^\w]*s+|p+[^\w]*o+[^\w]*s+|d+[^\w]*o+[^\w]*o+[^\w]*k+[^\w]*i+[^\w]*e+|p+[^\w]*o+[^\w]*o+[^\w]*p+|t+[^\w]*u+[^\w]*r+[^\w]*d+)\b/gi,
  harassment: /\b(k+[^\w]*i+[^\w]*l+[^\w]*l+|d+[^\w]*i+[^\w]*e+|h+[^\w]*a+[^\w]*t+[^\w]*e+|s+[^\w]*t+[^\w]*u+[^\w]*p+[^\w]*i+[^\w]*d+|i+[^\w]*d+[^\w]*i+[^\w]*o+[^\w]*t+|d+[^\w]*u+[^\w]*m+[^\w]*b+|r+[^\w]*e+[^\w]*t+[^\w]*a+[^\w]*r+[^\w]*d+|l+[^\w]*o+[^\w]*s+[^\w]*e+[^\w]*r+|f+[^\w]*a+[^\w]*t+|u+[^\w]*g+[^\w]*l+[^\w]*y+|k+[^\w]*y+[^\w]*s+|k+[^\w]*m+[^\w]*s+|g+[^\w]*t+[^\w]*f+[^\w]*o+|s+[^\w]*t+[^\w]*f+[^\w]*u+|f+[^\w]*o+[^\w]*f+[^\w]*f+|f+[^\w]*y+[^\w]*s+|u+[^\w]*r*\s*m+[^\w]*o+[^\w]*m+|y+[^\w]*o+[^\w]*u*[^\w]*r*\s*m+[^\w]*o+[^\w]*m+|y+[^\w]*o*\s*m+[^\w]*o+[^\w]*m+|y+[^\w]*a*\s*m+[^\w]*o+[^\w]*m+)\b/gi,
  threats: /\b(t+[^\w]*h+[^\w]*r+[^\w]*e+[^\w]*a+[^\w]*t+|k+[^\w]*i+[^\w]*l+[^\w]*l+|m+[^\w]*u+[^\w]*r+[^\w]*d+[^\w]*e+[^\w]*r+|h+[^\w]*u+[^\w]*r+[^\w]*t+|a+[^\w]*t+[^\w]*t+[^\w]*a+[^\w]*c+[^\w]*k+|b+[^\w]*e+[^\w]*a+[^\w]*t+|f+[^\w]*i+[^\w]*g+[^\w]*h+[^\w]*t+|p+[^\w]*u+[^\w]*n+[^\w]*c+[^\w]*h+|s+[^\w]*h+[^\w]*o+[^\w]*t+|k+[^\w]*y+[^\w]*s+|k+[^\w]*m+[^\w]*s+|y+[^\w]*s+|r+[^\w]*i+[^\w]*p+|d+[^\w]*i+[^\w]*e+)\b/gi,
  discrimination: /\b(n+[^\w]*a+[^\w]*z+[^\w]*i+|n+[^\w]*i+[^\w]*g+[^\w]*g+[^\w]*e+[^\w]*r+|f+[^\w]*a+[^\w]*g+|g+[^\w]*a+[^\w]*y+|l+[^\w]*e+[^\w]*s+[^\w]*b+[^\w]*i+[^\w]*a+[^\w]*n+|t+[^\w]*r+[^\w]*a+[^\w]*n+[^\w]*s+|q+[^\w]*u+[^\w]*e+[^\w]*e+[^\w]*r+|j+[^\w]*e+[^\w]*w+|m+[^\w]*u+[^\w]*s+[^\w]*l+[^\w]*i+[^\w]*m+|i+[^\w]*s+[^\w]*l+[^\w]*a+[^\w]*m+|c+[^\w]*h+[^\w]*r+[^\w]*i+[^\w]*s+[^\w]*t+[^\w]*i+[^\w]*a+[^\w]*n+|n+[^\w]*1+[^\w]*g+|f+[^\w]*4+[^\w]*g+)\b/gi,
  personalInfo: /\b(\d{3}[-.]?\d{3}[-.]?\d{4}|\w+@\w+\.\w{2,3}|(?:\d{1,3}\.){3}\d{1,3})\b/gi
};

export const bypassPatterns = {
  letterSpacing: /\b\w+[\s_.,-]+\w+\b/g,
  specialChars: /[^\w\s]|_/g,
  numbers: /\d+/g,
  repeatedChars: /(.)\1{2,}/g,
  commonSubstitutions: {
    'u': 'you',
    'r': 'are',
    'ur': 'your',
    'y': 'why',
    'k': 'ok',
    'n': 'and',
    'dat': 'that',
    'dis': 'this',
    'da': 'the',
    'f': 'fuck',
    'fk': 'fuck',
    'fck': 'fuck',
    'fu': 'fuck',
    'stfu': 'shut the fuck up',
    'foff': 'fuck off',
    'fuc': 'fuck',
    'fuq': 'fuck',
    'fuk': 'fuck',
    'phuck': 'fuck',
    'phuk': 'fuck',
    'ph': 'f',
    'ph1': 'f',
    'f1': 'f',
    'l1': 'l',
    '1': 'i',
    '!': 'i',
    '@': 'a',
    '4': 'a',
    '3': 'e',
    '0': 'o',
    '5': 's',
    '7': 't',
    '$': 's',
  }
};

// Contexts where profanity might be acceptable
export const allowedContexts = [
  {
    pattern: /\b(game|match|round|server)\s+(crash(ed)?|end(ed)?|fail(ed)?|disconnect(ed)?)\b/i,
    allowedWords: ['fuck', 'shit', 'damn', 'crap']
  },
  {
    pattern: /\b(lost|missed|failed)\s+(save|progress|data|work|connection)\b/i,
    allowedWords: ['fuck', 'shit', 'damn', 'crap']
  },
  {
    pattern: /\b(internet|wifi|connection)\s+(drop(ped)?|fail(ed)?|disconnect(ed)?)\b/i,
    allowedWords: ['fuck', 'shit', 'damn', 'crap']
  }
];