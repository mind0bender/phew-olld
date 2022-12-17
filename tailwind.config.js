const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: colors.emerald,
        primary: "#000000",
        secondary: colors.zinc,
        error: colors.red,
      },
      animation: { blink: "blink 1s step-end infinite" },
    },
  },
  plugins: [],
};
