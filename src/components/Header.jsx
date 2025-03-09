import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/useTheme';
import ThemeToggle from './ThemeToggle';
import { trapFocus } from '../utils/accessibility';
import { useScroll } from '../context/ScrollContext';

const Header = () => {
  // State and hooks
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const { activeSection, scrollToSection, setActiveSection } = useScroll();
  
  // Get icon visibility state with CSS approach instead of React state
  const [iconsVisible, setIconsVisible] = useState(false);
  
  // Initialize icon visibility once on mount
  useEffect(() => {
    // Add class to component for CSS selector
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
  }, []);

  // Navigation links configuration
  const navigationLinks = [
    { sectionId: "home", path: "/", label: "Home" },
    { sectionId: "projects", path: "/projects", label: "Projects" },
    { sectionId: "about", path: "/about", label: "About" },
    { sectionId: "guestbook", path: "/guestbook", label: "Guestbook" },
    { 
      sectionId: "contact", 
      path: "/contact", 
      label: "", // Empty label for desktop
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon-svg h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-label="Contact">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
      ariaLabel: "Contact"
    }
  ];

  // Effect to hide menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Focus trap and keyboard handling for menu
  useEffect(() => {
    if (!isMenuOpen || !menuRef.current) return;
    
    // Setup focus trap
    trapFocus(menuRef.current);
    
    // Event handlers
    const handleEscape = (e) => e.key === 'Escape' && setIsMenuOpen(false);
    const handleClickOutside = (e) => {
      if (!menuRef.current.contains(e.target) && !e.target.classList.contains('menu-button')) {
        setIsMenuOpen(false);
      }
    };
    
    // Add event listeners
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Simplified and reliable navigation handler
  const handleNavigation = (sectionId, path) => {
    setIsMenuOpen(false);
    console.log(`Navigation triggered: ${sectionId}, path: ${path}`);
    
    // Remove focus from the clicked element
    setTimeout(() => {
      document.activeElement.blur();
    }, 150);
    
    // Contact always goes to separate page
    if (sectionId === 'contact') {
      console.log('Contact navigation: navigating to separate page');
      
      // Navigate to contact page
      navigate('/contact');
      
      // After navigation completes, apply smooth scrolling
      setTimeout(() => {
        // First immediate scroll to top for responsiveness
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
    
    // Step 1: If not on main site, navigate there first
    if (location.pathname === '/contact') {
      console.log(`Navigating from contact to section: ${sectionId}`);
      navigate('/');
      
      // Delay scroll until navigation completes
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
      }, 300); // Longer timeout for navigation from separate page
      return;
    }
    
    // Step 2: If already on main site, just scroll to section
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
    // Special case for contact page
    if (sectionId === 'contact' && location.pathname === '/contact') {
      return 'text-primary font-medium';
    }
    
    // For main site sections on the home page
    if (location.pathname === '/' && sectionId !== 'contact') {
      // If we're at root path, use activeSection for the sections on the page
      // This allows scrolled sections to be highlighted
      if (activeSection === sectionId) {
        return 'text-primary font-medium';
      }
    }
    
    // For other direct routes (if pathname includes the sectionId)
    if (location.pathname.includes(sectionId) && sectionId !== 'home') {
      return 'text-primary font-medium';
    }
    
    // No highlight by default
    return '';
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white bg-opacity-90 dark:bg-dark-background dark:bg-opacity-90 shadow-sm transition-colors duration-300">
      <div className="container-wide mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="logo">
          <Link 
            to="/" 
            className="text-xl font-bold text-gradient"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('home', '/');
            }}
          >
            Your Portfolio
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className={`hidden md:flex items-center gap-6 transition-opacity duration-300 ${iconsVisible ? 'opacity-100' : 'opacity-0'}`}>
          {navigationLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`hover:text-primary transition-colors flex items-center ${isActive(link.sectionId)}`}
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
        </nav>
        
        {/* Hamburger Button */}
        <button 
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className={`block w-6 h-0.5 bg-secondary dark:bg-white transition-transform duration-300 ${isMenuOpen ? 'transform rotate-45 translate-y-1.5' : 'mb-1.5'}`}></span>
          <span className={`block w-6 h-0.5 bg-secondary dark:bg-white transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'mb-1.5'}`}></span>
          <span className={`block w-6 h-0.5 bg-secondary dark:bg-white transition-transform duration-300 ${isMenuOpen ? 'transform -rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div 
          id="mobile-menu"
          ref={menuRef}
          className="md:hidden absolute top-16 right-0 left-0 bg-white dark:bg-dark-background shadow-lg z-50 transition-all duration-300 transform origin-top"
        >
          <nav className="flex flex-col items-center py-4">
            {navigationLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`py-2 w-full text-center hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center ${isActive(link.sectionId)}`} 
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
            <div className="mt-4 mb-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;