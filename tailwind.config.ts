import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0F3557",
          "secondary-blue": "#25658A",
          "accent-blue": "#4EA3D1",
          "light-blue": "#DCEFF8",
          bg: "#F7FAFC",
          text: "#142536",
          muted: "#64748B",
          border: "#DCE4EA",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
