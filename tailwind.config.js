/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary, #1a73e8)',
        secondary: 'var(--secondary, #333333)',
        accent: 'var(--accent, #ff4081)',
        // Add the dark mode colors
        'dark-background': '#121212',
        'dark-surface': '#1e1e1e',
        'dark-text': '#e0e0e0',
      },
      backgroundColor: {
        DEFAULT: 'var(--background)',
        card: 'var(--cardBackground, #f9f9f9)',
      },
      textColor: {
        DEFAULT: 'var(--text)',
      },
      borderColor: {
        DEFAULT: 'var(--border, #e5e7eb)',
      },
    },
  },
  plugins: [],
};