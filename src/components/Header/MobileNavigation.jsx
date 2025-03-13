import React, { useRef, useEffect } from 'react';
import { trapFocus } from '../../utils/accessibility';
import { getGlassStyles, getGlassTextClasses } from '../../utils/glassStyles';
import ThemeToggle from './ThemeToggle';
import NavigationLink from './NavigationLink';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../../context/LanguageContext';
import { getNavigationLinks } from './utils/navigationConfig.jsx';

const MobileNavigation = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  headerText, 
  isActive, 
  handleNavigation,
  isDarkMode 
}) => {
  const menuRef = useRef(null);
  const { currentLanguage, toggleLanguage } = useLanguage();
  const linkClasses = getGlassTextClasses(isDarkMode);
  const navigationLinks = getNavigationLinks(headerText);
  
  // Menu trap focus and escape key handling
  useEffect(() => {
    if (!isMenuOpen || !menuRef.current) return;
    
    trapFocus(menuRef.current);
    
    const handleEscape = (e) => e.key === 'Escape' && setIsMenuOpen(false);
    const handleClickOutside = (e) => {
      if (!menuRef.current.contains(e.target) && !e.target.classList.contains('menu-button')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, setIsMenuOpen]);
  
  // Glass styles for menu
  const menuGlassStyles = getGlassStyles({
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
  
  if (!isMenuOpen) return null;
  
  return (
    <div 
      id="mobile-menu"
      ref={menuRef}
      className="md:hidden absolute right-0 left-0 backdrop-blur-xl shadow-lg z-50 transition-all duration-300 transform origin-top"
      style={menuGlassStyles}
    >
      <nav className="flex flex-col items-center py-4">
        {navigationLinks.map((link) => (
          <NavigationLink 
            key={link.path}
            link={link} 
            linkClasses={linkClasses} 
            isActive={isActive}
            handleNavigation={handleNavigation}
            isMobile={true}
          />
        ))}
        <div className="mt-4 mb-2 flex items-center gap-4">
          <ThemeToggle />
          <LanguageToggle 
            currentLanguage={currentLanguage} 
            toggleLanguage={toggleLanguage}
          />
        </div>
      </nav>
    </div>
  );
};

export default MobileNavigation;