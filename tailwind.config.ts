import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        sky: "#85deff",
        skyLight: "#C3EBFA",
        purple: "#a8a7fe",
        purpleLight: "#CFCEFF",
        yellow: "#fdee58",
        yellowLight: "#fff583",
      },
    },
  },
  plugins: [],
};
export default config;
