/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {},
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
}

module.exports = config
