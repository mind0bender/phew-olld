const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");
const typography = require("@tailwindcss/typography");

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
      typography: {
        DEFAULT: {
          css: {
            color: colors.white,
            margin: 0,
          },
        },
      },
    },
  },
  plugins: [typography, plugin(({addVariant})=>{
    addVariant('mobile', "@media (pointer:coarse)")
  })],
};
