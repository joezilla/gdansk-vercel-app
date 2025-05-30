/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',    
    "./node_modules/flowbite/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // overwrite 800 because react flowbite is confused and 
        // doesn't take the classname overwrite..
        'gray': {
          '50': '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#000000',
          900: '#111827',
        },
        // standard text color. could not thing of a better name
        'mytxt': {
          light: '#000000',
          DEFAULT: '#000000',
          dark: '#ffffff',
          // same as neutral
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // standard background background. could not thing of a better name
        'mybg': {
          light: '#ffffff',
          DEFAULT: '#000000',
          dark: '#000000',
          // same as zinc
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
        'accent': {
          light: '#dc2626',
          DEFAULT: '#dc2626',
          dark: '#dc2626',
        },
        'header': {
          light: '#ffffff',
          DEFAULT: '#111827',
          dark: '#111827',
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
  plugins: [
    require('flowbite/plugin'),
  ],
}
