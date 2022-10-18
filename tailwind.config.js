/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        "blackOpa": "rgba(0, 0, 0, 0.6)",
        "discordGray":"rgba(54,57,63,1)"
      },
      width: {
        '3/10': '30%',
      },
      backgroundImage: {
        "bg-gradient": "linear-gradient(0deg, rgba(251,207,232,1) 0%, rgba(209,213,219,1) 100%)"
      }
    },
  },
  plugins: [],
}
