import { useEffect } from 'react';
import { useThemeStore } from './themeStore';
import themes from '../styles/themes';

export const useTheme = () => {
  const { theme, setTheme, toggleTheme: storeToggleTheme } = useThemeStore();
  
  // Enhanced toggle function with debugging
  const toggleTheme = () => {
    console.log('useTheme: toggleTheme called. Current theme:', theme);
    
    // Get new theme value
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('useTheme: Switching to theme:', newTheme);
    
    // Call the store's toggle function
    storeToggleTheme();
    
    // Debug verification
    setTimeout(() => {
      console.log('useTheme: After toggle, document class contains dark?', 
        document.documentElement.classList.contains('dark'));
    }, 50);
  };
  
  // Apply theme to document and CSS variables
  useEffect(() => {
    console.log('useTheme: Theme changed to', theme);
    
    // Apply Tailwind dark class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    // Apply CSS variables from themes.js
    if (theme && themes[theme]) {
      const currentTheme = themes[theme];
      Object.entries(currentTheme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value);
      });
    }
    
    // Debug verification
    console.log('useTheme: Document classes after update:', 
      document.documentElement.classList.toString());
  }, [theme]);
  
  // Initial theme setup
  useEffect(() => {
    // Check if theme is already set by another component
    if (document.documentElement.classList.contains('dark') && theme !== 'dark') {
      console.log('useTheme: Document has dark class but theme state is not dark. Syncing...');
      setTheme('dark');
    } else if (!document.documentElement.classList.contains('dark') && theme === 'dark') {
      console.log('useTheme: Document does not have dark class but theme state is dark. Syncing...');
      setTheme('light');
    }
  }, []);
  
  return {
    theme,
    setTheme,
    toggleTheme, // Use our enhanced toggle function
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
};

export default useTheme;