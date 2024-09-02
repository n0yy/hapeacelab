import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#ECF0F3",
      },
      boxShadow: {
        neo: "13px 13px 25px #D1D6E6, -13px -13px 25px #FFFFFF",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
