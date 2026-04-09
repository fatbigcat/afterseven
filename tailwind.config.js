/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cometus: ['"TT Cometus Variable"', "sans-serif"],
        geekette: ['"TT Geekette Variable"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
