import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScroll } from '../context/ScrollContext';

const Footer = () => {
    const { scrollToSection } = useScroll();
    const [isVisible, setIsVisible] = useState(false);
    
    // Initialize footer with delayed visibility
    useEffect(() => {
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
    }, []);
    
    const handleNavigation = (sectionId, path) => {
        scrollToSection(sectionId);
    };
    
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left section */}
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-bold mb-3">Your Portfolio</h3>
                        <p className="text-gray-300 text-sm">
                            Creating beautiful, responsive websites with modern technologies.
                        </p>
                    </div>
                    
                    {/* Middle section */}
                    <div className="text-center">
                        <h3 className="text-lg font-bold mb-3">Connect</h3>
                        <div className="flex justify-center space-x-4">
                            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                <span className="sr-only">GitHub</span>
                                <svg className="icon-svg h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="https://www.linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="icon-svg h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    
                    {/* Right section - Contact Me */}
                    <div className="text-center md:text-right">
                        <h3 className="text-lg font-bold mb-3">Contact Me</h3>
                        <div className="inline-block">
                            <Link 
                                to="/contact"
                                onClick={() => handleNavigation('contact', '/contact')}
                                className="flex items-center justify-center md:justify-start hover:text-primary transition-colors group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon-svg mail-icon h-5 w-5 mr-2 group-hover:animate-bounce" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                Get in touch with me
                            </Link>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 pt-4 border-t border-gray-700 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;