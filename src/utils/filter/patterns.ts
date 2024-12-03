export const harmfulPatterns = {
  profanity: /\b(fuck|shit|ass|bitch|damn|crap|piss|dick|cock|pussy|asshole|wtf|stfu|fu|af|bs|pos)\b/gi,
  harassment: /\b(kill|die|hate|stupid|idiot|dumb|retard|loser|fat|ugly|kys|kms|gtfo|stfu|foff|fys)\b/gi,
  threats: /\b(threat|kill|murder|hurt|attack|beat|fight|punch|shoot|kys|kms|ys|rip|die)\b/gi,
  discrimination: /\b(nazi|nigger|fag|gay|lesbian|trans|queer|jew|muslim|islam|christian|n1g|f4g)\b/gi,
  personalInfo: /\b(\d{3}[-.]?\d{3}[-.]?\d{4}|\w+@\w+\.\w{2,3}|(?:\d{1,3}\.){3}\d{1,3})\b/gi
};

export const bypassPatterns = {
  letterSpacing: /\b\w+\s+\w+\b/g,
  specialChars: /[\W_]+/g,
  numbers: /\d+/g,
  repeatedChars: /(.)\1{2,}/g,
};