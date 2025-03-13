import React from 'react';

const HamburgerButton = ({ isMenuOpen, setIsMenuOpen, headerText }) => {
  return (
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
  );
};

export default HamburgerButton;