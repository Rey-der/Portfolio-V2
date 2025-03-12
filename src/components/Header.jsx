import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/useTheme';
import ThemeToggle from './ThemeToggle';
import { trapFocus } from '../utils/accessibility';
import { useScroll } from '../context/ScrollContext';
import { getHeaderText } from '../data/headerData';
import { useLanguage } from '../context/LanguageContext'; 
import { getGlassStyles, getGlassTextClasses, getGlassContainerClasses } from '../utils/glassStyles';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const { activeSection, scrollToSection, setActiveSection } = useScroll();

  // Language context
  const { currentLanguage, toggleLanguage } = useLanguage(); // Use Language Context
  const headerText = getHeaderText(currentLanguage);
  const [iconsVisible, setIconsVisible] = useState(false);
  const headerVisibleRoutes = ['/', '/home', '/projects', '/about', '/guestbook', '/contact'];
  const shouldShowHeader = headerVisibleRoutes.includes(location.pathname);
  
  // Initialize icon visibility once on mount
  useEffect(() => {
    if (!shouldShowHeader) return;

    const headerEl = document.querySelector('header');

    if (headerEl) headerEl.classList.add('icons-loading');
    
    // Delay icon visibility to prevent flicker
    const timer = setTimeout(() => {
      setIconsVisible(true);
      if (headerEl) {
        headerEl.classList.remove('icons-loading');
        headerEl.classList.add('icons-ready');
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, [shouldShowHeader]);

  // Navigation links configuration
  const navigationLinks = [
    { sectionId: "home", path: "/", label: headerText.home },
    { sectionId: "projects", path: "/projects", label: headerText.projects },
    { sectionId: "about", path: "/about", label: headerText.about },
    { sectionId: "guestbook", path: "/guestbook", label: headerText.guestbook },
    { 
      sectionId: "contact", 
      path: "/contact", 
      label: "",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon-svg h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-label={headerText.contact}>
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
      ariaLabel: headerText.contact
    }
  ];

  // Effect to hide menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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
  }, [isMenuOpen]);

  // Simplified and reliable navigation handler
  const handleNavigation = (sectionId, path) => {
    setIsMenuOpen(false);
    console.log(`Navigation triggered: ${sectionId}, path: ${path}`);
    
    setTimeout(() => {
      document.activeElement.blur();
    }, 150);
    
    if (sectionId === 'contact') {
      console.log('Contact navigation: navigating to separate page');
      navigate('/contact');
      
      setTimeout(() => {
        window.scrollTo(0, 0);
        console.log('Contact page: initial scroll reset');
        
        // Then find the main content element for smooth scrolling
        const contactElement = document.getElementById('main-content') || document.getElementById('contact');
        if (contactElement) {
          console.log('Found contact page element, smooth scrolling into view');
          contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // Fallback to smooth window scroll
          console.log('Contact page: using fallback smooth scroll');
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }, 200);
      
      return;
    }
    
    // For other sections (projects, about, guestbook)
    
    if (location.pathname === '/contact') {
      console.log(`Navigating from contact to section: ${sectionId}`);
      navigate('/');
      
      setTimeout(() => {
        console.log(`Looking for element #${sectionId}`);
        const element = document.getElementById(sectionId);
        if (element) {
          console.log(`Found element #${sectionId}, scrolling`);
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveSection(sectionId);
        } else {
          console.log(`Element #${sectionId} not found, using scrollToSection`);
          scrollToSection(sectionId);
        }
      }, 300);
      return;
    }

    console.log(`Already on main site, looking for element #${sectionId}`);
    const element = document.getElementById(sectionId);
    if (element) {
      console.log(`Found element #${sectionId}, scrolling`);
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    } else {
      console.log(`Element #${sectionId} not found, using scrollToSection`);
      scrollToSection(sectionId);
    }
  };
   
  // Active section helper based on URL rather than state
  const isActive = (sectionId) => {
    if (sectionId === 'contact' && location.pathname === '/contact') {
      return 'text-primary font-medium';
    }
    
    // For main site sections on the home page
    if (location.pathname === '/' && sectionId !== 'contact') {
      if (activeSection === sectionId) {
        return 'text-primary font-medium';
      }
    }
    
    // For other direct routes (if pathname includes the sectionId)
    if (location.pathname.includes(sectionId) && sectionId !== 'home') {
      return 'text-primary font-medium';
    }
    return '';
  };

  // Glass styles for header and menu
  const headerGlassStyles = getGlassStyles({
    isDarkMode,
    direction: 'down',
    frostIntensity: 0.6, // Slightly more intense frost
    accentColor: isDarkMode ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.05)', // Subtle blue tint
    customStyles: {
      borderBottom: isDarkMode 
        ? '1px solid rgba(148, 163, 184, 0.07)' 
        : '1px solid rgba(148, 163, 184, 0.15)'
    }
  });

  const menuGlassStyles = getGlassStyles({
    isDarkMode,
    direction: 'none',
    frostIntensity: 180 , // Higher frost for drop-down menu
    accentColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.06)', // Slightly stronger blue tint
    customStyles: {
      backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.75)' : 'rgba(241, 245, 249, 0.9)',
      borderBottomLeftRadius: '4px',
      borderBottomRightRadius: '4px'
    }
  });

  const linkClasses = getGlassTextClasses(isDarkMode);

  // Don't render the header on non-main routes
  if (!shouldShowHeader) return null;

  return (
    <div className="sticky top-0 z-50 pt-5 px-5">
      <header 
        className={`${getGlassContainerClasses(isDarkMode)} transition-all duration-300`}
        style={headerGlassStyles}
      >
        <div className="container mx-auto flex justify-between items-center p-4">
          {/* Logo */}
          <div className="logo">
            <Link 
              to="/" 
              className="text-xl font-medium bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('home', '/');
              }}
            >
              {headerText.yourPortfolio}
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className={`hidden md:flex items-center gap-6 transition-opacity duration-300 ${iconsVisible ? 'opacity-100' : 'opacity-0'}`}>
            {navigationLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`${linkClasses} flex items-center ${isActive(link.sectionId)}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(link.sectionId, link.path);
                }}
                aria-label={link.ariaLabel || link.label}
              >
                {link.icon && link.icon}
                {link.label}
              </Link>
            ))}
            
            <ThemeToggle />
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="bg-gray-800 bg-opacity-40 hover:bg-opacity-60 text-gray-300 font-bold py-2 px-4 rounded"
              aria-label="Toggle Language"
            >
              {currentLanguage === 'en' ? 'DE' : 'EN'}
            </button>
          </nav>
          
          {/* Hamburger Button */}
          <button 
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={headerText.toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? 'transform rotate-45 translate-y-1.5' : 'mb-1.5'}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'mb-1.5'}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? 'transform -rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            ref={menuRef}
            className="md:hidden absolute right-0 left-0 backdrop-blur-xl shadow-lg z-50 transition-all duration-300 transform origin-top"
            style={menuGlassStyles}
          >
            <nav className="flex flex-col items-center py-4">
              {navigationLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`py-2 w-full text-center ${linkClasses} hover:bg-gray-800 hover:bg-opacity-30 flex items-center justify-center ${isActive(link.sectionId)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(link.sectionId, link.path);
                  }}
                  aria-label={link.ariaLabel || link.label}
                >
                  {link.icon && React.cloneElement(link.icon, { className: "icon-svg h-5 w-5 mr-2" })}
                  {link.label || link.ariaLabel}
                </Link>
              ))}
              <div className="mt-4 mb-2 flex items-center gap-4">
                <ThemeToggle />
                {/* Language Toggle Button in Mobile Menu */}
                <button
                  onClick={toggleLanguage}
                  className="bg-gray-800 bg-opacity-40 hover:bg-opacity-60 text-gray-300 font-bold py-2 px-4 rounded"
                  aria-label="Toggle Language"
                >
                  {currentLanguage === 'en' ? 'DE' : 'EN'}
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;