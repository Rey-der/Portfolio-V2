/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Uses the .dark class applied to html element
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core colors - all reference CSS variables with fallbacks
        primary: 'var(--primary, #58A4B0)', // Light mode teal
        secondary: 'var(--secondary, #6C757D)',
        accent: 'var(--accent, #80BBA6)',
        background: 'var(--background, #F8F9FA)',
        
        // Dark mode specific colors - updated fallbacks to match new dark gray theme
        'dark-background': 'var(--background, #1A1A1A)', // Updated to dark gray
        'dark-surface': 'var(--cardBackground, #252525)', // Updated to dark gray
        'dark-text': 'var(--text, #E0E0E0)', 
        'dark-primary': 'var(--primary, #FFD700)', // Gold for dark mode
        'dark-accent': 'var(--accent, #404040)', // Updated to medium dark gray
        
        // Project section background
        'project-bg': 'var(--project-section-bg, #F8F9FA)',
        'dark-project-bg': 'var(--project-section-bg, #1A1A1A)', // Updated to dark gray
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
        primary: 'var(--primary)', // Explicitly add primary text color
      },
      
      borderColor: {
        DEFAULT: 'var(--border)',
      },
      
      // You could extend with other properties based on CSS variables
      boxShadow: {
        'cloak': 'var(--cloak-shadow)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'card-dark': '0 4px 20px rgba(255, 215, 0, 0.1)', // Gold shadow for dark mode
      },
      
      zIndex: {
        'cloak': 'var(--cloak-z-index, 1)',
      },
      
      // Add specific color for important override in active navigation links
      textColor: {
        DEFAULT: 'var(--text)',
        secondary: 'var(--secondary)',
        '!primary': 'var(--primary) !important', // Support for !important override in nav
      },
    },
  },
  plugins: [],
};