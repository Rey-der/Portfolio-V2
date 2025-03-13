import React from 'react';
import { useTheme } from '../../utils/useTheme';
import { useLanguage } from '../../context/LanguageContext';
import { getGlassTextClasses } from '../../utils/glassStyles';
import ThemeToggle from './ThemeToggle';
import NavigationLink from './NavigationLink';
import LanguageToggle from './LanguageToggle';
import { getNavigationLinks } from './utils/navigationConfig.jsx';

const DesktopNavigation = ({ iconsVisible, headerText, isActive, handleNavigation }) => {
  const { theme } = useTheme();
  const { currentLanguage, toggleLanguage } = useLanguage();
  const isDarkMode = theme === 'dark';
  const linkClasses = getGlassTextClasses(isDarkMode);
  
  const navigationLinks = getNavigationLinks(headerText);
  
  return (
    <nav className={`hidden md:flex items-center gap-6 transition-opacity duration-300 ${iconsVisible ? 'opacity-100' : 'opacity-0'}`}>
      {navigationLinks.map((link) => (
        <NavigationLink 
          key={link.path}
          link={link} 
          linkClasses={linkClasses} 
          isActive={isActive}
          handleNavigation={handleNavigation}
        />
      ))}
      
      <ThemeToggle />
      <LanguageToggle 
        currentLanguage={currentLanguage} 
        toggleLanguage={toggleLanguage}
      />
    </nav>
  );
};

export default DesktopNavigation;