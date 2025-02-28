
import { Button } from "@/components/ui/button";

interface KeyboardThemeSelectorProps {
  keyboardTheme: "default" | "purple" | "blue" | "green";
  setKeyboardTheme: (theme: "default" | "purple" | "blue" | "green") => void;
}

const KeyboardThemeSelector = ({
  keyboardTheme,
  setKeyboardTheme,
}: KeyboardThemeSelectorProps) => {
  return (
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
  );
};

export default KeyboardThemeSelector;
