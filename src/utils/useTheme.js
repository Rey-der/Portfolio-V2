import { useEffect } from 'react';
import { useThemeStore } from './themeStore';
import themes from '../styles/themes';

export const useTheme = () => {
  const { theme, setTheme, toggleTheme } = useThemeStore();
  
  // Apply CSS variables from themes.js
  useEffect(() => {
    if (theme && themes[theme]) {
      const currentTheme = themes[theme];
      Object.entries(currentTheme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value);
      });
    }
  }, [theme]);
  
  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
};

export default useTheme;