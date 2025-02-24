/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors:{
        primary :'rgba(40, 200, 26, 0.55)',
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}

