/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "space-blue": "#1A2B4D",
        "space-red": "#E53E3E",
        "space-light-blue": "#60A5FA"
      }
    },
  },
  plugins: [],
}
