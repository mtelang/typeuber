
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import StatsPanel from "./StatsPanel";
import Keyboard from "./Keyboard";
import ResultsSummary from "./ResultsSummary";
import { generateWords, calculateWPM, calculateErrorRate } from "@/utils/gameUtils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [keyboardTheme, setKeyboardTheme] = useState<"default" | "purple" | "blue" | "green">("default");
  const isMobile = useIsMobile();
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const currentWord = words[currentWordIndex];
  const nextLetter = currentWord?.[currentLetterIndex];

  const startGame = () => {
    setIsGameStarted(true);
    setStartTime(Date.now());
    setTimeLeft(TIME_LIMIT);
    
    // Focus the input field for mobile devices
    if (isMobile) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 100);
    }
  };

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
      
      // Refocus on resume for mobile
      if (isMobile) {
        setTimeout(() => {
          mobileInputRef.current?.focus();
        }, 100);
      }
    }
  };

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (isGameOver || !isGameStarted || isPaused) return;

      const key = event.key.toLowerCase();
      handleKeyDown(key);
    },
    [currentLetterIndex, currentWord, currentWordIndex, isGameOver, nextLetter, startTime, isGameStarted, isPaused]
  );

  // Handle mobile input
  const handleMobileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isGameOver || !isGameStarted || isPaused) return;
    
    const lastChar = e.target.value.slice(-1).toLowerCase();
    if (lastChar) {
      handleKeyDown(lastChar);
      e.target.value = ''; // Clear after processing
    }
  };

  // Common key handling logic
  const handleKeyDown = (key: string) => {
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
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">TypeUber</h1>
          <p className="text-gray-400">Enhance your typing speed with practice</p>
        </motion.div>

        {isMobile && (
          <input
            ref={mobileInputRef}
            type="text"
            className="opacity-0 fixed h-px w-px -z-10 p-0 m-0 border-0"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            onChange={handleMobileInput}
            aria-hidden="true"
          />
        )}

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
                className="bg-gray-800 rounded-xl p-8 shadow-lg mb-8 text-center border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-2xl font-mono space-x-1 text-gray-200">
                  {words.slice(currentWordIndex, currentWordIndex + 3).map((word, wordIdx) => (
                    <span
                      key={wordIdx}
                      className={`inline-block ${
                        wordIdx === 0 ? "text-gray-200" : "text-gray-500"
                      }`}
                    >
                      {word.split("").map((letter, letterIdx) => (
                        <span
                          key={letterIdx}
                          className={`${
                            wordIdx === 0 && letterIdx === currentLetterIndex
                              ? "bg-purple-600 text-white px-1 rounded"
                              : ""
                          } ${
                            wordIdx === 0 && letterIdx < currentLetterIndex
                              ? "text-gray-500"
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

              <Keyboard 
                highlightedKey={isGameStarted && !isPaused ? nextLetter : null} 
                pressedKey={pressedKey}
                theme={keyboardTheme}
                autoFocus={isGameStarted && !isPaused}
              />
              
              <div className="flex justify-center gap-4 flex-wrap">
                {!isGameStarted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Button
                      onClick={startGame}
                      className="bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                    >
                      Start Test
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <Button
                      onClick={handleRestart}
                      className="bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                    >
                      Reset Test
                    </Button>
                    <Button
                      onClick={handlePauseResume}
                      className="bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                    >
                      {isPaused ? "Resume Test" : "Pause Test"}
                    </Button>
                  </>
                )}
              </div>

              <div className="flex justify-center gap-2 flex-wrap">
                <Button
                  onClick={() => setKeyboardTheme("default")}
                  className={`${keyboardTheme === "default" ? "ring-2 ring-purple-500" : ""} bg-gray-800`}
                >
                  Default
                </Button>
                <Button
                  onClick={() => setKeyboardTheme("purple")}
                  className={`${keyboardTheme === "purple" ? "ring-2 ring-purple-500" : ""} bg-purple-900`}
                >
                  Purple
                </Button>
                <Button
                  onClick={() => setKeyboardTheme("blue")}
                  className={`${keyboardTheme === "blue" ? "ring-2 ring-blue-500" : ""} bg-blue-900`}
                >
                  Blue
                </Button>
                <Button
                  onClick={() => setKeyboardTheme("green")}
                  className={`${keyboardTheme === "green" ? "ring-2 ring-green-500" : ""} bg-emerald-900`}
                >
                  Green
                </Button>
              </div>
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
