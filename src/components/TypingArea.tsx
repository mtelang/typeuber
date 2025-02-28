
import { motion } from "framer-motion";

interface TypingAreaProps {
  words: string[];
  currentWordIndex: number;
  currentLetterIndex: number;
}

const TypingArea = ({ words, currentWordIndex, currentLetterIndex }: TypingAreaProps) => {
  return (
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
  );
};

export default TypingArea;
