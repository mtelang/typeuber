
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface KeyboardProps {
  highlightedKey: string | null;
  pressedKey: string | null;
  theme?: "default" | "purple" | "blue" | "green";
  autoFocus?: boolean;
}

const Keyboard = ({ 
  highlightedKey, 
  pressedKey, 
  theme = "default", 
  autoFocus = false
}: KeyboardProps) => {
  const isMobile = useIsMobile();

  const themeColors = {
    default: {
      key: "bg-gray-800 text-gray-200 border-gray-700",
      highlighted: "bg-purple-600 text-white",
      special: "bg-gray-900 text-gray-300 border-gray-700",
    },
    purple: {
      key: "bg-purple-900 text-purple-100 border-purple-800",
      highlighted: "bg-purple-500 text-white",
      special: "bg-purple-950 text-purple-200 border-purple-800",
    },
    blue: {
      key: "bg-blue-900 text-blue-100 border-blue-800",
      highlighted: "bg-blue-500 text-white",
      special: "bg-blue-950 text-blue-200 border-blue-800",
    },
    green: {
      key: "bg-emerald-900 text-emerald-100 border-emerald-800",
      highlighted: "bg-emerald-500 text-white",
      special: "bg-emerald-950 text-emerald-200 border-emerald-800",
    },
  };

  const renderKey = (letter: string, width: string = "w-12", isSpecial: boolean = false) => {
    const isHighlighted = highlightedKey === letter.toLowerCase();
    const isPressed = pressedKey === letter.toLowerCase();
    const colors = themeColors[theme];
    
    return (
      <motion.div
        key={letter}
        className={`
          ${width}
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
              ? colors.highlighted
              : isSpecial
              ? colors.special
              : colors.key
          }
          ${isPressed ? "shadow-inner" : "shadow-sm"}
          border
        `}
        animate={isPressed ? { y: 2 } : { y: 0 }}
      >
        {letter}
      </motion.div>
    );
  };

  const renderSpecialKey = (text: string, width: string = "w-12") => {
    return renderKey(text, width, true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      {isMobile && autoFocus && (
        <input 
          type="text"
          autoFocus
          className="opacity-0 absolute h-0 w-0 -z-10"
          aria-hidden="true"
        />
      )}
      <div className="space-y-2">
        <div className="flex justify-center space-x-2">
          {renderSpecialKey("esc", "w-12")}
          <div className="w-2"></div>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((key) =>
            renderKey(key)
          )}
        </div>
        <div className="flex justify-center space-x-2">
          {renderSpecialKey("tab", "w-16")}
          {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((key) =>
            renderKey(key)
          )}
        </div>
        <div className="flex justify-center space-x-2">
          {renderSpecialKey("caps", "w-20")}
          {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((key) =>
            renderKey(key)
          )}
          {renderSpecialKey("return", "w-20")}
        </div>
        <div className="flex justify-center space-x-2">
          {renderSpecialKey("shift", "w-24")}
          {["Z", "X", "C", "V", "B", "N", "M"].map((key) => renderKey(key))}
          {renderSpecialKey("shift", "w-24")}
        </div>
        <div className="flex justify-center space-x-2">
          {renderSpecialKey("fn", "w-12")}
          {renderSpecialKey("ctrl", "w-12")}
          {renderSpecialKey("opt", "w-12")}
          {renderSpecialKey("cmd", "w-16")}
          {renderKey(" ", "w-64")} {/* Spacebar */}
          {renderSpecialKey("cmd", "w-16")}
          {renderSpecialKey("opt", "w-12")}
          {renderSpecialKey("ctrl", "w-12")}
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
