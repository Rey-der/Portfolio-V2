import { getGlassStyles, getGlassTextClasses, getGlassContainerClasses } from '../../../utils/glassStyles';

export const getHeaderGlassStyles = (isDarkMode) => getGlassStyles({
  isDarkMode,
  direction: 'down',
  frostIntensity: 0.6,
  accentColor: isDarkMode ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.05)',
  customStyles: {
    borderBottom: isDarkMode 
      ? '1px solid rgba(148, 163, 184, 0.07)' 
      : '1px solid rgba(148, 163, 184, 0.15)'
  }
});

export const getMenuGlassStyles = (isDarkMode) => getGlassStyles({
  isDarkMode,
  direction: 'none',
  frostIntensity: 180,
  accentColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.06)',
  customStyles: {
    backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.75)' : 'rgba(241, 245, 249, 0.9)',
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px'
  }
});