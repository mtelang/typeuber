
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatsPanel from "./StatsPanel";
import Keyboard from "./Keyboard";
import ResultsSummary from "./ResultsSummary";
import { calculateErrorRate } from "@/utils/gameUtils";
import GameControls from "./GameControls";
import TypingArea from "./TypingArea";
import KeyboardThemeSelector from "./KeyboardThemeSelector";
import { useTypingGame } from "@/hooks/useTypingGame";
import { useKeyboardInput } from "@/hooks/useKeyboardInput";

const TypingGame = () => {
  const {
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
    nextLetter,
    startGame: initStartGame,
    handleKeyDown,
    handlePauseResume,
    handleRestart
  } = useTypingGame();

  const [keyboardTheme, setKeyboardTheme] = useState<"default" | "purple" | "blue" | "green">("default");
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const { isMobile, handleMobileInput } = useKeyboardInput(
    isGameStarted,
    isGameOver,
    isPaused,
    handleKeyDown
  );

  // Wrapper for startGame that handles mobile focus
  const startGame = () => {
    initStartGame();
    
    // Focus the input field for mobile devices
    if (isMobile) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 100);
    }
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

              <TypingArea 
                words={words}
                currentWordIndex={currentWordIndex}
                currentLetterIndex={currentLetterIndex}
              />

              <Keyboard 
                highlightedKey={isGameStarted && !isPaused ? nextLetter : null} 
                pressedKey={pressedKey}
                theme={keyboardTheme}
                autoFocus={isGameStarted && !isPaused}
              />
              
              <GameControls
                isGameStarted={isGameStarted}
                isPaused={isPaused}
                startGame={startGame}
                handleRestart={handleRestart}
                handlePauseResume={handlePauseResume}
              />

              <KeyboardThemeSelector 
                keyboardTheme={keyboardTheme}
                setKeyboardTheme={setKeyboardTheme}
              />
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
                timeTaken={120 - timeLeft}
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
