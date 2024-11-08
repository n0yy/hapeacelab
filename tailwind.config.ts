import type { Config } from "tailwindcss";

const flowbite = require("flowbite-react/tailwind");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#ECF0F3",
      },
      boxShadow: {
        neo: "13px 13px 25px #D1D6E6, -13px -13px 25px #FFFFFF",
      },
      animation: {
        blink: "blink 1s step-start infinite",
        flutter: "flutter 2s ease-in-out infinite",
        fadeIn: "fadeIn 0.5s ease-out forwards",
        slideUp: "slideUp 0.5s ease-out forwards",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
        flutter: {
          "0%, 100%": { transform: "rotate(-10deg) scale(0.95)" },
          "50%": { transform: "rotate(-5deg) scale(1.05)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), flowbite.plugin()],
};
export default config;
