/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard", "-apple-system", "Arial", "sans-serif"],
      },
      colors: {
        panda: {
          primary: "#3692ff",
          hover: "#1967d6",
          active: "#1251aa",
          hero: "#cfe5ff",
        },
      },
    },
  },
  plugins: [],
};
