import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScroll } from '../context/ScrollContext';
// Keep this for backward compatibility
import { footerText } from '../data/footerData';
// Add these for language support
import { getFooterText } from '../data/footerData';
import { useLanguage } from '../context/LanguageContext'; // Import Language Context

const Footer = () => {
    const { scrollToSection } = useScroll();
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();
    
    // Language context
    const { currentLanguage } = useLanguage(); // Use Language Context
    const currentFooterText = getFooterText(currentLanguage) || footerText;
    
    // Routes where the footer should be visible
    const footerVisibleRoutes = ['/', '/home', '/projects', '/about', '/guestbook', '/contact'];
    
    // Check if the footer should be visible on the current route
    const shouldShowFooter = footerVisibleRoutes.includes(location.pathname);
    
    // Initialize footer with delayed visibility
    useEffect(() => {
      // Skip effect if footer shouldn't be shown
      if (!shouldShowFooter) return;
      
      // Add class to component for CSS selector
      const footerEl = document.querySelector('footer');
      if (footerEl) footerEl.classList.add('opacity-0', 'transition-opacity', 'duration-700');
      
      // Make footer visible after 1.5 seconds
      const visibilityTimer = setTimeout(() => {
        setIsVisible(true);
        if (footerEl) {
          footerEl.classList.remove('opacity-0');
          footerEl.classList.add('opacity-100');
          footerEl.classList.add('icons-loading');
          
          // Initialize icons after footer becomes visible
          const iconsTimer = setTimeout(() => {
            if (footerEl) {
              footerEl.classList.remove('icons-loading');
              footerEl.classList.add('icons-ready');
            }
          }, 300);
          
          return () => clearTimeout(iconsTimer);
        }
      }, 1500);
      
      return () => clearTimeout(visibilityTimer);
    }, [shouldShowFooter]);
    
    // Don't render the footer on non-main routes
    if (!shouldShowFooter) return null;
    
    const handleNavigation = (sectionId, path) => {
        scrollToSection(sectionId);
    };
    
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left section */}
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-bold mb-3">{currentFooterText.yourPortfolio}</h3>
                        <p className="text-gray-300 text-sm">
                            {currentFooterText.footerDescription}
                        </p>
                    </div>
                    
                    {/* Middle section */}
                    <div className="text-center">
                        <h3 className="text-lg font-bold mb-3">{currentFooterText.connect}</h3>
                        <div className="flex justify-center space-x-4">
                            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                <span className="sr-only">{currentFooterText.github}</span>
                                <svg className="icon-svg h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                                </svg>
                            </a>
                            <a href="https://www.linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                <span className="sr-only">{currentFooterText.linkedin}</span>
                                <svg className="icon-svg h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    
                    {/* Right section - Contact Me */}
                    <div className="text-center md:text-right">
                        <h3 className="text-lg font-bold mb-3">{currentFooterText.contactMe}</h3>
                        <div className="inline-block">
                            <Link 
                                to="/contact"
                                onClick={() => handleNavigation('contact', '/contact')}
                                className="flex items-center justify-center md:justify-start hover:text-primary transition-colors group"
                            >
                                <div className="relative w-5 h-5 mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                        className="icon-svg mail-icon h-5 w-5 transform transition-transform group-hover:animate-bounce" 
                                        viewBox="0 0 20 20" 
                                        fill="currentColor"
                                        style={{ willChange: 'transform', position: 'absolute' }}
                                    >
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                {currentFooterText.getInTouch}
                            </Link>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 pt-4 border-t border-gray-700 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Your Name. {currentFooterText.allRightsReserved}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;