
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatsPanel from "./StatsPanel";
import Keyboard from "./Keyboard";
import ResultsSummary from "./ResultsSummary";
import { generateWords, calculateWPM, calculateErrorRate } from "@/utils/gameUtils";

const WORD_COUNT = 50;
const TIME_LIMIT = 120; // 2 minutes in seconds

const TypingGame = () => {
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

  const gameStarted = useRef(false);

  const currentWord = words[currentWordIndex];
  const nextLetter = currentWord?.[currentLetterIndex];

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (isGameOver) return;

      const key = event.key.toLowerCase();
      setPressedKey(key);

      if (!gameStarted.current) {
        gameStarted.current = true;
        setStartTime(Date.now());
      }

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
      } else {
        setErrors((prev) => prev + 1);
      }
    },
    [currentLetterIndex, currentWord, currentWordIndex, isGameOver, nextLetter]
  );

  useEffect(() => {
    if (pressedKey) {
      const timer = setTimeout(() => setPressedKey(null), 100);
      return () => clearTimeout(timer);
    }
  }, [pressedKey]);

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameStarted.current && !isGameOver) {
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
  }, [isGameOver]);

  useEffect(() => {
    if (startTime && (isGameOver || timeLeft === 0)) {
      const endTime = Date.now();
      const calculatedWpm = calculateWPM(
        currentWordIndex + (currentLetterIndex > 0 ? 1 : 0),
        startTime,
        endTime
      );
      setWpm(calculatedWpm);
    }
  }, [currentLetterIndex, currentWordIndex, isGameOver, startTime, timeLeft]);

  const handleRestart = () => {
    setCurrentWordIndex(0);
    setCurrentLetterIndex(0);
    setErrors(0);
    setTotalKeyPresses(0);
    setTimeLeft(TIME_LIMIT);
    setIsGameOver(false);
    setStartTime(null);
    setWpm(0);
    gameStarted.current = false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TypeUber</h1>
          <p className="text-gray-600">Enhance your typing speed with practice</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isGameOver ? (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <StatsPanel
                wpm={wpm}
                errors={errors}
                errorRate={calculateErrorRate(errors, totalKeyPresses)}
                timeLeft={timeLeft}
              />

              <motion.div
                className="bg-white rounded-xl p-8 shadow-sm mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-2xl font-mono space-x-1">
                  {words.slice(currentWordIndex, currentWordIndex + 3).map((word, wordIdx) => (
                    <span
                      key={wordIdx}
                      className={`inline-block ${
                        wordIdx === 0 ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {word.split("").map((letter, letterIdx) => (
                        <span
                          key={letterIdx}
                          className={`${
                            wordIdx === 0 && letterIdx === currentLetterIndex
                              ? "bg-gray-900 text-white px-1 rounded"
                              : ""
                          } ${
                            wordIdx === 0 && letterIdx < currentLetterIndex
                              ? "text-gray-400"
                              : ""
                          }`}
                        >
                          {letter}
                        </span>
                      ))}
                    </span>
                  ))}
                </div>
              </motion.div>

              <Keyboard highlightedKey={nextLetter} pressedKey={pressedKey} />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultsSummary
                wpm={wpm}
                errors={errors}
                errorRate={calculateErrorRate(errors, totalKeyPresses)}
                timeTaken={TIME_LIMIT - timeLeft}
                onRestart={handleRestart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TypingGame;
