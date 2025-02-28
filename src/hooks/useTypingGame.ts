
import { useState, useEffect, useCallback } from "react";
import { generateWords, calculateWPM, calculateErrorRate } from "@/utils/gameUtils";

const WORD_COUNT = 50;
const TIME_LIMIT = 120; // 2 minutes in seconds

export function useTypingGame() {
  const [words] = useState(() => generateWords(WORD_COUNT));
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [totalKeyPresses, setTotalKeyPresses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isGameOver, setIsGameOver] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentWord = words[currentWordIndex];
  const nextLetter = currentWord?.[currentLetterIndex];

  // Start the game
  const startGame = () => {
    setIsGameStarted(true);
    setStartTime(Date.now());
    setTimeLeft(TIME_LIMIT);
  };

  // Handle pause/resume
  const handlePauseResume = () => {
    setIsPaused(prev => !prev);
    if (!isPaused) {
      // Pausing the game
      const currentTime = Date.now();
      const elapsedTime = currentTime - (startTime || currentTime);
      setStartTime(prev => (prev || 0) + elapsedTime);
    } else {
      // Resuming the game
      setStartTime(Date.now());
    }
  };

  // Key handling logic
  const handleKeyDown = useCallback((key: string) => {
    if (isGameOver || !isGameStarted || isPaused) return;
    
    setPressedKey(key);
    setTotalKeyPresses((prev) => prev + 1);

    if (key === nextLetter) {
      if (currentLetterIndex === currentWord.length - 1) {
        if (currentWordIndex === WORD_COUNT - 1) {
          setIsGameOver(true);
          return;
        }
        setCurrentWordIndex((prev) => prev + 1);
        setCurrentLetterIndex(0);
      } else {
        setCurrentLetterIndex((prev) => prev + 1);
      }

      // Calculate WPM after each successful keypress
      if (startTime) {
        const currentTime = Date.now();
        const newWpm = calculateWPM(
          currentWordIndex + (currentLetterIndex > 0 ? 1 : 0),
          startTime,
          currentTime
        );
        setWpm(newWpm);
      }
    } else {
      setErrors((prev) => prev + 1);
    }
  }, [currentLetterIndex, currentWord, currentWordIndex, isGameOver, nextLetter, startTime, isGameStarted, isPaused]);

  // Reset the game
  const handleRestart = () => {
    setCurrentWordIndex(0);
    setCurrentLetterIndex(0);
    setErrors(0);
    setTotalKeyPresses(0);
    setTimeLeft(TIME_LIMIT);
    setIsGameOver(false);
    setStartTime(null);
    setWpm(0);
    setIsGameStarted(false);
    setIsPaused(false);
  };

  // Key press effect
  useEffect(() => {
    if (pressedKey) {
      const timer = setTimeout(() => setPressedKey(null), 100);
      return () => clearTimeout(timer);
    }
  }, [pressedKey]);

  // Timer effect
  useEffect(() => {
    if (isGameStarted && !isGameOver && !isPaused) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isGameStarted, isGameOver, isPaused]);

  return {
    words,
    currentWordIndex,
    currentLetterIndex,
    errors,
    totalKeyPresses,
    timeLeft,
    isGameOver,
    wpm,
    pressedKey,
    isGameStarted,
    isPaused,
    currentWord,
    nextLetter,
    startGame,
    handleKeyDown,
    handlePauseResume,
    handleRestart,
    setIsGameStarted
  };
}
