/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Uses the .dark class applied to html element
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core colors - all reference CSS variables with fallbacks
        primary: 'var(--primary, #1a73e8)',
        secondary: 'var(--secondary, #333333)',
        accent: 'var(--accent, #d7ba7d)',
        background: 'var(--background, #ffffff)',
        
        // Dark mode specific colors - reusing the CSS variables
        'dark-background': 'var(--background, #1e1e1e)',
        'dark-surface': 'var(--cardBackground, #252526)',
        'dark-text': 'var(--text, #d4d4d4)',
        
        // Project section background
        'project-bg': 'var(--project-section-bg, #f8fafc)',
      },
      
      backgroundColor: {
        // Background variants
        DEFAULT: 'var(--background)',
        card: 'var(--cardBackground)',
        surface: 'var(--surfaceBackground)',
        glass: 'var(--glassBackground)',
      },
      
      textColor: {
        DEFAULT: 'var(--text)',
        secondary: 'var(--secondary)',
      },
      
      borderColor: {
        DEFAULT: 'var(--border)',
      },
      
      // You could extend with other properties based on CSS variables
      boxShadow: {
        'cloak': 'var(--cloak-shadow)',
      },
      
      zIndex: {
        'cloak': 'var(--cloak-z-index, 1)',
      },
    },
  },
  plugins: [],
};