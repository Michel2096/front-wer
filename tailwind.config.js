/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: { light: "#F5F5F7", dark: "#000000" },
        surface: { light: "#FFFFFF", dark: "#1C1C1E" },
        surfaceAlt: { light: "#F0F0F3", dark: "#2C2C2E" },
        accent: "#FA2A2D",
        accentAlt: "#FF6B35",
        heartrate: "#FF375F",
        spo2: "#64D2FF",
        steps: "#FF9F0A",
        calories: "#FF6B00",
        distance: "#34C759",
        sleep: "#BF5AF2",
        stress: "#00C7BE",
        temperature: "#FFD60A",
        muted: { light: "#6E6E73", dark: "#8E8E93" },
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};
