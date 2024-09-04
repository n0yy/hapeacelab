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
    },
  },
  plugins: [require("@tailwindcss/typography"), flowbite.plugin()],
};
export default config;
