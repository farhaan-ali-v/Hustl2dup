/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#002B7F', // UF Blue
          dark: '#001F5C',
          light: '#0038FF',
        },
        secondary: {
          DEFAULT: '#FF4D23', // UF Orange
          light: '#FF5A1F',
          dark: '#E63A0B',
        },
        accent: {
          DEFAULT: '#FFFFFF', // White
          dark: '#F5F5F5',
          light: '#FFFFFF',
        }
      }
    },
  },
  plugins: [],
};