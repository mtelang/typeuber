
import { useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function useKeyboardInput(
  isGameStarted: boolean,
  isGameOver: boolean,
  isPaused: boolean,
  handleKeyDown: (key: string) => void
) {
  const isMobile = useIsMobile();

  // Handle keyboard input
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (isGameOver || !isGameStarted || isPaused) return;
      const key = event.key.toLowerCase();
      handleKeyDown(key);
    },
    [handleKeyDown, isGameOver, isGameStarted, isPaused]
  );

  // Set up keyboard event listener
  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [handleKeyPress]);

  return {
    isMobile,
    handleMobileInput: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isGameOver || !isGameStarted || isPaused) return;
      
      const lastChar = e.target.value.slice(-1).toLowerCase();
      if (lastChar) {
        handleKeyDown(lastChar);
        e.target.value = ''; // Clear after processing
      }
    }
  };
}
