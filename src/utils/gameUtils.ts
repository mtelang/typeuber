
// Generate random three-letter words
export const generateWord = (): string => {
  const consonants = 'bcdfghjklmnpqrstvwxyz';
  const vowels = 'aeiou';
  
  const getRandomChar = (str: string) => str[Math.floor(Math.random() * str.length)];
  
  return (
    getRandomChar(consonants) +
    getRandomChar(vowels) +
    getRandomChar(consonants)
  ).toLowerCase();
};

// Generate array of words for the game
export const generateWords = (count: number): string[] => {
  return Array.from({ length: count }, () => generateWord());
};

// Calculate WPM
export const calculateWPM = (
  wordCount: number,
  startTime: number,
  endTime: number
): number => {
  const timeInMinutes = (endTime - startTime) / 1000 / 60;
  return Math.round(wordCount / timeInMinutes);
};

// Calculate error rate
export const calculateErrorRate = (
  errors: number,
  totalKeyPresses: number
): number => {
  if (totalKeyPresses === 0) return 0;
  return Math.round((errors / totalKeyPresses) * 100);
};

// Format time from seconds
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
