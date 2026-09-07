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
          orange: "#FA4A14",
          "orange-hover": "#E03E0B",
          "orange-light": "#FFF3ED",
          "orange-border": "#FED7C6",
          dark: "#12151B",
          charcoal: "#1B2028",
          cream: "#F8F6F2",
          "cream-light": "#FAF9F6",
          bg: "#FAF9F6",
          text: "#151A22",
          navy: "#12151B", // Map dark elements to rich dark charcoal
          "secondary-blue": "#FA4A14", // Map to orange accent
          "accent-blue": "#FA4A14", // Map to orange accent
          "light-blue": "#FFF3ED", // Light orange tint
          muted: "#6B7280",
          border: "#E5E7EB",
          amber: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'orange-glow': '0 10px 25px -5px rgba(250, 74, 20, 0.35)',
        'card-elevated': '0 10px 30px rgba(0, 0, 0, 0.06)',
      },
      aspectRatio: {
        '4/3': '4 / 3',
      },
    },
  },
  plugins: [],
};

export default config;
