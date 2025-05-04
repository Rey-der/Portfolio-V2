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
  // ===== HEADER DIMENSIONS & SPACING CONFIG =====
  const dimensions = {
    // Outer margins
    marginLeft: 16,      // Left margin in pixels
    marginRight: 55,     // Right margin in pixels
    marginTop: 25,       // Top margin in pixels
    
    // Inner margins (inside the header)
    innerPadding: 16,    // Inner padding in pixels
    
    // Header sizing
    headerHeight: 70,    // Height of header in pixels
    stickyOffset: 20,    // Additional padding when sticky
    
    // Content alignment
    contentVerticalOffset: 3,  // Positive moves content down, negative up
    
    // Body spacing when header is sticky
    bodyTopPadding: 84,        // Body padding when header is sticky
    
    // Mobile header adjustments
    mobileHeaderHeight: 60,    // Height for mobile devices
  };
  // =============================================

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Fix: Get both theme and toggleTheme from useTheme hook
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const location = useLocation();
  const { activeSection } = useScroll();
  const { currentLanguage } = useLanguage();
  const [iconsVisible, setIconsVisible] = useState(true);

  // Add console logging for debugging
  useEffect(() => {
    console.log('Header component - Current theme:', theme);
    console.log('Header component - toggleTheme function exists:', !!toggleTheme);
  }, [theme, toggleTheme]);

  const headerText = getHeaderText(currentLanguage);
  const headerVisibleRoutes = ['/', '/home', '/projects', '/about', '/guestbook', '/contact', '/legal'];
  const shouldShowHeader = headerVisibleRoutes.includes(location.pathname);

  const nonStickyRoutes = ['/contact', '/legal'];
  const isSticky = shouldShowHeader && !nonStickyRoutes.includes(location.pathname);

  const { handleNavigation, isActive } = useHeaderNavigation();

  useEffect(() => {
    if (!shouldShowHeader) return;

    const headerEl = document.querySelector('header');
    if (headerEl) {
      headerEl.classList.remove('icons-loading');
      headerEl.classList.add('icons-ready');
    }
  }, [shouldShowHeader]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Container styles with glass effect
  const headerGlassStyles = getGlassStyles({
    isDarkMode,
    direction: 'down',
    frostIntensity: 0.6,
    accentColor: isDarkMode ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.05)',
    customStyles: {
      borderBottom: isDarkMode
        ? '1px solid rgba(148, 163, 184, 0.07)'
        : '1px solid rgba(148, 163, 184, 0.15)',
      position: isSticky ? 'fixed' : 'relative',
      width: isSticky 
        ? `calc(100% - ${dimensions.marginLeft + dimensions.marginRight}px)` 
        : '100%',
      height: `${dimensions.headerHeight}px`,
      zIndex: isSticky ? '50' : 'auto',
      transition: 'none',
    }
  });

  if (!shouldShowHeader) return null;

  const wrapperClasses = `${isSticky ? 'fixed z-50' : 'relative'}`;
  
  // Wrapper styles based on sticky state
  const wrapperStyles = isSticky ? 
    {
      top: `${dimensions.marginTop}px`, 
      left: `${dimensions.marginLeft}px`,
      right: `${dimensions.marginRight}px`,
      padding: '0',
      boxSizing: 'border-box',
      transition: 'none',
    } : 
    {
      marginTop: `${dimensions.marginTop}px`,
      marginLeft: `${dimensions.marginLeft}px`,
      marginRight: `${dimensions.marginRight}px`,
      padding: '0',
      boxSizing: 'border-box',
      transition: 'none',
    };

  // Content container styles
  const contentContainerStyles = {
    padding: `0 ${dimensions.innerPadding}px`,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    transform: `translateY(${dimensions.contentVerticalOffset}px)`,
  };

  // Update body padding to accommodate fixed header
  if (isSticky) {
    document.body.style.paddingTop = `${dimensions.headerHeight + dimensions.marginTop + dimensions.stickyOffset}px`;
  } else {
    document.body.style.paddingTop = '0';
  }

  // Function to handle theme toggle click with debug logging
  const handleThemeToggle = () => {
    console.log('Theme toggle clicked in header');
    if (toggleTheme) {
      toggleTheme();
      console.log('Theme toggled to:', theme === 'dark' ? 'light' : 'dark');
    } else {
      console.error('toggleTheme function is not available in the Header component');
    }
  };

  return (
    <div className={wrapperClasses} style={wrapperStyles}>
      <header
        className={getGlassContainerClasses(isDarkMode)}
        style={headerGlassStyles}
        data-sticky={isSticky ? "true" : "false"}
      >
        <div className="container mx-auto flex justify-between items-center" style={contentContainerStyles}>
          <Logo
            headerText={headerText}
            handleNavigation={handleNavigation}
          />

          <DesktopNavigation
            iconsVisible={true}
            headerText={headerText}
            isActive={isActive}
            handleNavigation={handleNavigation}
            // Pass theme toggle function to the desktop navigation
            toggleTheme={handleThemeToggle}
            isDarkMode={isDarkMode}
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
          // Pass theme toggle function to mobile navigation as well
          toggleTheme={handleThemeToggle}
        />
      </header>
    </div>
  );
};

export default Header;