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
        brandRose: "#A0355A",
        brandWine: "#6B1F3C",
        brandGold: "#C9956B",
        brandBlush: "#F2C4CE",
        brandCream: "#FBF7F4",
        brandDark: "#1C0F14",
        brandMuted: "#7D5A62",
        brandSuccess: "#4CAF7D",
        brandNotice: "#C9956B",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-dmsans)", "sans-serif"],
      },
      boxShadow: {
        premium: "0 10px 30px -5px rgba(160, 53, 90, 0.15)",
        gold: "0 10px 30px -5px rgba(201, 149, 107, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
