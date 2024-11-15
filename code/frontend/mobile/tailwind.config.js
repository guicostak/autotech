/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
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
          sans: ["Poppins", "sans-serif"],
        },
        keyframes: {
          bounce: {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-100%)" },
          },
        },
        animation: {
          bounce: "bounce 1s infinite",
        },
      },
    },
    plugins: [],
  };