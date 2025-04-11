/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brown-200': '#D2B48C',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        }
      },
      animation: {
        'float': 'float 0.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
} 