
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface GameControlsProps {
  isGameStarted: boolean;
  isPaused: boolean;
  startGame: () => void;
  handleRestart: () => void;
  handlePauseResume: () => void;
}

const GameControls = ({
  isGameStarted,
  isPaused,
  startGame,
  handleRestart,
  handlePauseResume,
}: GameControlsProps) => {
  return (
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
  );
};

export default GameControls;
