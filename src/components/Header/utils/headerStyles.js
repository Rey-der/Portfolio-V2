import { getGlassStyles, getGlassTextClasses, getGlassContainerClasses } from '../../../utils/glassStyles';

export const getHeaderGlassStyles = (isDarkMode) => getGlassStyles({
  isDarkMode,
  direction: 'down',
  frostIntensity: 0.6,
  // Updated: Changed blue accent to gold/gray accent colors
  accentColor: isDarkMode ? 'rgba(255, 215, 0, 0.08)' : 'rgba(59, 130, 246, 0.05)',
  customStyles: {
    borderBottom: isDarkMode 
      ? '1px solid rgba(64, 64, 64, 0.15)' // Updated: Changed to match --border: #404040
      : '1px solid rgba(148, 163, 184, 0.15)'
  }
});

export const getMenuGlassStyles = (isDarkMode) => getGlassStyles({
  isDarkMode,
  direction: 'none',
  frostIntensity: 180,
  // Updated: Changed blue accent to gold/gray accent colors
  accentColor: isDarkMode ? 'rgba(255, 215, 0, 0.1)' : 'rgba(59, 130, 246, 0.06)',
  customStyles: {
    // Updated: Changed from dark blue to dark gray background
    backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.85)' : 'rgba(241, 245, 249, 0.9)',
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px'
  }
});