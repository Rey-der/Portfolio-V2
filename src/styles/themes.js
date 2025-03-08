/**
 * Theme configuration for the application
 * 
 * IMPORTANT: These values must stay in sync with CSS variables in index.css
 * Any changes here should also be reflected in the root variables in CSS
 */
const themes = {
  light: {
    // Core colors
    background: '#ffffff',
    text: '#000000',
    primary: '#1a73e8',
    secondary: '#333333',
    accent: '#ff4081',
    
    // UI elements
    cardBackground: '#f9f9f9',
    border: '#e0e0e0',
    surfaceBackground: '#f9f9f9',
    glassBackground: 'rgba(255, 255, 255, 0.8)',
    
    // Additional values from tailwind.config.js
    darkBackground: null,  // Not used in light mode
    darkSurface: null,     // Not used in light mode
    darkText: null         // Not used in light mode
  },
  dark: {
    // Core colors
    background: '#121212',
    text: '#ffffff',
    primary: '#bb86fc',
    secondary: '#e0e0e0',
    accent: '#ff4081',
    
    // UI elements
    cardBackground: '#1e1e1e',
    border: '#333333',
    surfaceBackground: '#1e1e1e', 
    glassBackground: 'rgba(30, 30, 30, 0.8)',
    
    // For Tailwind dark mode config
    darkBackground: '#121212',
    darkSurface: '#1e1e1e',
    darkText: '#ffffff'
  },
};

export default themes;

/**
 * Apply theme to document CSS variables
 * @param {string} mode - 'light' or 'dark'
 */
export const applyTheme = (mode) => {
  const theme = themes[mode] || themes.light;
  const root = document.documentElement;
  
  // Set CSS variables from theme object
  Object.entries(theme).forEach(([property, value]) => {
    if (value) {
      root.style.setProperty(`--${property}`, value);
    }
  });
};