const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // standard text color. could not thing of a better name
        'mytxt': {
          light: colors.black,
          DEFAULT: colors.black,
          dark: colors.white,
          // same as neutral
          100: colors.neutral[100],
          200: colors.neutral[200],
          300: colors.neutral[300],
          400: colors.neutral[400],
          500: colors.neutral[500],
          600: colors.neutral[600],
          700: colors.neutral[700],
          800: colors.neutral[800],
          900: colors.neutral[900],
        },
        // standard background background. could not thing of a better name
        'mybg': {
          light: colors.white,
          DEFAULT:  colors.black,
          dark: colors.black,
          // same as zinc
          100: colors.zinc[100],
          200: colors.zinc[200],
          300: colors.zinc[300],
          400: colors.zinc[400],
          500: colors.zinc[500],
          600: colors.zinc[600],
          700: colors.zinc[700],
          800: colors.zinc[800],
          900: colors.zinc[900],
        },
        'accent': {
          light: colors.teal[500],
          DEFAULT: colors.teal[500],
          dark: colors.teal[500],
        },
        'header': {
          light: colors.white,
          DEFAULT:  colors.gray[900],
          dark: colors.gray[900],
        }
      },
      spacing: {
        28: '7rem',
      },
      letterSpacing: {
        tighter: '-.04em',
      },
      lineHeight: {
        tight: 1.2,
      },
      fontSize: {
        '5xl': '2.5rem',
        '6xl': '2.75rem',
        '7xl': '4.5rem',
        '8xl': '6.25rem',
      },
      boxShadow: {
        small: '0 5px 10px rgba(0, 0, 0, 0.12)',
        medium: '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
