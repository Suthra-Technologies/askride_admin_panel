/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffdf2',
          100: '#fef7d6',
          200: '#fdecad',
          300: '#fce184',
          400: '#fbd65b',
          500: '#f9bb06',
          600: '#c79605',
          700: '#967004',
          800: '#644b02',
          900: '#322501',
          950: '#191200',
        },
        secondary: {
          50: '#fffdf2',
          100: '#fef7d6',
          200: '#fdecad',
          300: '#fce184',
          400: '#fbd65b',
          500: '#f9bb06',
          600: '#c79605',
          700: '#967004',
          800: '#644b02',
          900: '#322501',
          950: '#191200',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
