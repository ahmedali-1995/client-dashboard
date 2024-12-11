/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'morbh': {
          'bg': '#001a18',
          'accent': '#009b7a',
          'accent-hover': '#008b6a',
        }
      },
      fontFamily: {
        'arabic': ['Arabic', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
