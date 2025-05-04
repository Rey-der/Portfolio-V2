/**
 * Theme configuration for the application
 * 
 * This file handles the application of CSS variables defined in index.css
 * when the theme changes. It doesn't define colors itself, but applies
 * the pre-defined CSS variables appropriately.
 */

/**
 * Apply theme to document
 * @param {string} mode - 'light' or 'dark'
 */
export const applyTheme = (mode) => {
  // Instead of defining colors here, we just need to add/remove the dark class
  // which will activate the appropriate CSS variables defined in index.css
  const root = document.documentElement;
  
  if (mode === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
  
  // Optional: Dispatch an event that theme has changed
  // This can be useful for components that need to react to theme changes
  document.dispatchEvent(new CustomEvent('themechange', { 
    detail: { theme: mode }
  }));
};

/**
 * Get current applied theme
 * @returns {string} 'light' or 'dark'
 */
export const getCurrentTheme = () => {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

export default {
  getCurrentTheme,
  applyTheme
};