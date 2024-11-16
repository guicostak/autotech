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
        background: "var(--background)",
        foreground: "var(--foreground)",
        mainColor: "#2A2C2F",
        secondaryColor: "#DE3450",
        mainBackground: "#F3F3F3",
        errorColor: "#D9534F",
      },
       fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-100%)' },
        },
      },
      animation: {
        bounce: 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
