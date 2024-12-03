export const normalizeText = (text: string): string => {
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