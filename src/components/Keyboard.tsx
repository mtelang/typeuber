
import { motion } from "framer-motion";

interface KeyboardProps {
  highlightedKey: string | null;
  pressedKey: string | null;
}

const Keyboard = ({ highlightedKey, pressedKey }: KeyboardProps) => {
  const renderKey = (letter: string, isWide: boolean = false) => {
    const isHighlighted = highlightedKey === letter.toLowerCase();
    const isPressed = pressedKey === letter.toLowerCase();
    
    return (
      <motion.div
        key={letter}
        className={`
          ${isWide ? "w-20" : "w-12"}
          h-12
          rounded-lg
          flex
          items-center
          justify-center
          text-sm
          font-medium
          transition-all
          duration-100
          ${
            isHighlighted
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-900 border border-gray-200"
          }
          ${isPressed ? "shadow-inner" : "shadow-sm"}
        `}
        animate={isPressed ? { y: 2 } : { y: 0 }}
      >
        {letter}
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-50/50 backdrop-blur-sm rounded-xl p-6 shadow-sm">
      <div className="space-y-2">
        <div className="flex justify-center space-x-2">
          {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((key) =>
            renderKey(key)
          )}
        </div>
        <div className="flex justify-center space-x-2">
          {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((key) =>
            renderKey(key)
          )}
        </div>
        <div className="flex justify-center space-x-2">
          {["Z", "X", "C", "V", "B", "N", "M"].map((key) => renderKey(key))}
        </div>
        <div className="flex justify-center">
          {renderKey(" ", true)}
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
