import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScroll } from '../context/ScrollContext';
import { getFooterText } from '../data/footerData';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../utils/useTheme';
import ScrollToTopButton from '../utils/ScrollToTopButton';
import useDeviceDetection from '../utils/useDeviceDetection';
import { getGlassStyles, getGlassTextClasses, getGlassContainerClasses } from '../utils/glassStyles';

const Footer = () => {
    // ===== FOOTER DIMENSIONS & SPACING CONFIG =====
    const dimensions = {
        // Outer margins
        marginLeft: 16,      // Left margin in pixels
        marginRight: 55,     // Right margin in pixels
        marginTop: 10,        // Top margin from previous content
        marginBottom: 40,    // Bottom margin after footer
        
        // Inner margins (inside the footer)
        innerMarginLeft: 24,  // Inner left margin
        innerMarginRight: 24, // Inner right margin
        
        // Vertical positioning
        footerHeight: 100,    // Total footer height
        contentPaddingY: 80,  // Vertical padding inside footer
        
        // Copyright section
        copyrightMarginTop: 4,
        
        // Adjust vertical alignment of main row content
        contentVerticalOffset: 0, // Positive moves content down, negative up
    };
    // =============================================

    const { scrollToSection } = useScroll();
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();
    const { currentLanguage } = useLanguage();
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const footerRef = useRef(null);
    const currentFooterText = getFooterText(currentLanguage);
    const footerVisibleRoutes = ['/', '/home', '/projects', '/about', '/guestbook', '/contact', '/legal'];
    const shouldShowFooter = footerVisibleRoutes.includes(location.pathname);
    const isMobile = useDeviceDetection();

    // Initialize footer with delayed visibility and handle theme changes
    useEffect(() => {
      if (!shouldShowFooter) return;

      const footerEl = footerRef.current;
      if (!footerEl) return;

      footerEl.classList.add('transition-opacity', 'duration-300');
      footerEl.classList.add('opacity-0');

      const visibilityTimer = setTimeout(() => {
        if (footerEl) {
          footerEl.classList.remove('opacity-0');
          footerEl.classList.add('opacity-100');
        }
        setIsVisible(true);
      }, 150);

      return () => clearTimeout(visibilityTimer);
    }, [shouldShowFooter, theme]);

    if (!shouldShowFooter) return null;

    const handleNavigation = (sectionId) => {
        if (sectionId === 'legal') {
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        } else {
          scrollToSection(sectionId);
        }
    };

    const handleScrollToTop = () => {
      try {
        scrollToSection('home');
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } catch (error) {
        console.error("Error scrolling to top:", error);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    // Custom footer styles using configurable values
    const footerStyles = getGlassStyles({
      isDarkMode,
      direction: 'up',
      frostIntensity: 0.6,
      accentColor: isDarkMode ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.05)',
      customStyles: {
        marginTop: `${dimensions.marginTop}px`,
        height: `${dimensions.footerHeight}px`,
        borderTop: isDarkMode
          ? '1px solid rgba(148, 163, 184, 0.07)'
          : '1px solid rgba(148, 163, 184, 0.15)',
        transition: 'none',
        position: 'relative', // For absolute positioning of content
      }
    });

    // Get text color classes for links
    const linkClasses = getGlassTextClasses(isDarkMode);

    // Wrapper styles with bottom margin
    const wrapperStyles = {
      marginLeft: `${dimensions.marginLeft}px`,
      marginRight: `${dimensions.marginRight}px`,
      marginBottom: `${dimensions.marginBottom}px`, // Added bottom margin
      boxSizing: 'border-box',
      transition: 'none'
    };

    // Style for the container with inner margins
    const containerStyles = {
      paddingLeft: `${dimensions.innerMarginLeft}px`,
      paddingRight: `${dimensions.innerMarginRight}px`,
      height: '100%',
    };

    // Style for the main content row
    const contentRowStyle = {
      position: 'absolute',
      top: '50%', 
      left: dimensions.innerMarginLeft, // Apply inner left margin
      right: dimensions.innerMarginRight, // Apply inner right margin
      transform: `translateY(calc(-50% + ${dimensions.contentVerticalOffset}px))`,
    };

    return (
        <div style={wrapperStyles}>
            <footer
                ref={footerRef}
                className={getGlassContainerClasses(isDarkMode)}
                style={footerStyles}
            >
                <div className="container mx-auto h-full" style={containerStyles}>
                    {/* Main row - absolutely positioned for precise vertical centering */}
                    <div className="flex items-center" style={contentRowStyle}>
                        <div className="flex-1 flex items-center">
                            <span className="text-xl font-medium bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                                {currentFooterText.yourPortfolio}
                            </span>
                        </div>

                        <div className="flex items-center space-x-6 justify-center">
                            {/* GitHub Link */}
                            <a
                                href="https://github.com/yourusername"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={linkClasses}
                                aria-label={currentFooterText.github}
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                                </svg>
                            </a>

                            {/* Contact Link */}
                            <Link
                                to="/contact"
                                onClick={() => handleNavigation('contact')}
                                className={linkClasses}
                                aria-label={currentFooterText.getInTouch}
                            >
                                {currentFooterText.getInTouch}
                            </Link>

                            {/* Legal & Privacy Link */}
                            <Link
                                to="/legal"
                                onClick={() => handleNavigation('legal')}
                                className={linkClasses}
                                aria-label={currentFooterText.legal}
                            >
                                {currentFooterText.legal}
                            </Link>

                            {/* LinkedIn Link */}
                            <a
                                href="https://www.linkedin.com/in/yourusername"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={linkClasses}
                                aria-label={currentFooterText.linkedin}
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                        </div>

                        <div className="flex-1 flex justify-end items-center">
                            <ScrollToTopButton
                                isMobile={isMobile}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>
                    
                    {/* Copyright text positioned absolutely at the bottom */}
                    <div 
                      className="text-center text-xs w-full absolute bottom-2"
                      style={{ 
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                        left: dimensions.innerMarginLeft,
                        right: dimensions.innerMarginRight,
                        width: `calc(100% - ${dimensions.innerMarginLeft + dimensions.innerMarginRight}px)`,
                      }}
                    >
                        © {new Date().getFullYear()} {currentFooterText.yourPortfolio}. {currentFooterText.allRightsReserved}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;