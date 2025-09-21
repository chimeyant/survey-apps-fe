/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        'custom': 'var(--width-custom)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },

      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out', // Adjust duration as needed
        fadeInLeft: 'fadeInLeft 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}

