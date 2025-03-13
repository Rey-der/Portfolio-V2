import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../utils/useTheme';
import { useScroll } from '../../context/ScrollContext';
import { getHeaderText } from '../../data/headerData';
import { useLanguage } from '../../context/LanguageContext';
import { getGlassStyles, getGlassContainerClasses } from '../../utils/glassStyles';
import DesktopNavigation from './DesktopNavigation';
import MobileNavigation from './MobileNavigation';
import useHeaderNavigation from './utils/useHeaderNavigation.js';
import Logo from './Logo';
import HamburgerButton from './HamburgerButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const location = useLocation();
  const { activeSection } = useScroll();
  const { currentLanguage } = useLanguage();
  const [iconsVisible, setIconsVisible] = useState(false);
  
  const headerText = getHeaderText(currentLanguage);
  const headerVisibleRoutes = ['/', '/home', '/projects', '/about', '/guestbook', '/contact'];
  const shouldShowHeader = headerVisibleRoutes.includes(location.pathname);
  
  const { handleNavigation, isActive } = useHeaderNavigation();

  // Initialize icon visibility once on mount
  useEffect(() => {
    if (!shouldShowHeader) return;

    const headerEl = document.querySelector('header');
    if (headerEl) headerEl.classList.add('icons-loading');
    
    const timer = setTimeout(() => {
      setIconsVisible(true);
      if (headerEl) {
        headerEl.classList.remove('icons-loading');
        headerEl.classList.add('icons-ready');
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, [shouldShowHeader]);

  // Effect to hide menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Glass styles for header
  const headerGlassStyles = getGlassStyles({
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

  // Don't render the header on non-main routes
  if (!shouldShowHeader) return null;

  return (
    <div className="sticky top-0 z-50 pt-5 px-5">
      <header 
        className={`${getGlassContainerClasses(isDarkMode)} transition-all duration-300`}
        style={headerGlassStyles}
      >
        <div className="container mx-auto flex justify-between items-center p-4">
          <Logo 
            headerText={headerText} 
            handleNavigation={handleNavigation} 
          />
          
          <DesktopNavigation 
            iconsVisible={iconsVisible}
            headerText={headerText}
            isActive={isActive}
            handleNavigation={handleNavigation}
          />
          
          <HamburgerButton 
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            headerText={headerText}
          />
        </div>
        
        <MobileNavigation 
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          headerText={headerText}
          isActive={isActive}
          handleNavigation={handleNavigation}
          isDarkMode={isDarkMode}
        />
      </header>
    </div>
  );
};

export default Header;