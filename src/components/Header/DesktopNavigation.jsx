import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getGlassTextClasses } from '../../utils/glassStyles';
import ThemeToggle from './ThemeToggle';
import NavigationLink from './NavigationLink';
import LanguageToggle from './LanguageToggle';
import { getNavigationLinks } from './utils/navigationConfig.jsx';

const DesktopNavigation = ({ 
  iconsVisible, 
  headerText, 
  isActive, 
  handleNavigation,
  toggleTheme, // Accept the toggle function from parent
  isDarkMode   // Accept the dark mode state from parent
}) => {
  const { currentLanguage, toggleLanguage } = useLanguage();
  const linkClasses = getGlassTextClasses(isDarkMode);
  
  // Add console log to verify props are passed correctly
  React.useEffect(() => {
    console.log('DesktopNavigation received props:', { 
      toggleTheme: !!toggleTheme,
      isDarkMode 
    });
  }, [toggleTheme, isDarkMode]);
  
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
      
      {/* Pass the toggleTheme function from props */}
      <ThemeToggle 
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />
      
      <LanguageToggle 
        currentLanguage={currentLanguage} 
        toggleLanguage={toggleLanguage}
      />
    </nav>
  );
};

export default DesktopNavigation;