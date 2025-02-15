
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "rgb(229, 231, 235)",
        input: "rgb(229, 231, 235)",
        ring: "rgb(229, 231, 235)",
        background: "rgb(255, 255, 255)",
        foreground: "rgb(17, 24, 39)",
        primary: {
          DEFAULT: "rgb(17, 24, 39)",
          foreground: "rgb(255, 255, 255)",
        },
        secondary: {
          DEFAULT: "rgb(243, 244, 246)",
          foreground: "rgb(17, 24, 39)",
        },
        destructive: {
          DEFAULT: "rgb(239, 68, 68)",
          foreground: "rgb(255, 255, 255)",
        },
        muted: {
          DEFAULT: "rgb(243, 244, 246)",
          foreground: "rgb(107, 114, 128)",
        },
        accent: {
          DEFAULT: "rgb(243, 244, 246)",
          foreground: "rgb(17, 24, 39)",
        },
        card: {
          DEFAULT: "rgb(255, 255, 255)",
          foreground: "rgb(17, 24, 39)",
        },
      },
      keyframes: {
        "key-press": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(2px)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "key-press": "key-press 0.1s ease-in-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
