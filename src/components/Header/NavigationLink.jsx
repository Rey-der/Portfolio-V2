import React from 'react';
import { Link } from 'react-router-dom';

const NavigationLink = ({ 
  link, 
  linkClasses, 
  isActive, 
  handleNavigation, 
  isMobile = false 
}) => {
  return (
    <Link 
      to={link.path} 
      className={`${linkClasses} flex items-center ${isActive(link.sectionId)} ${
        isMobile ? 'py-2 w-full text-center hover:bg-gray-800 hover:bg-opacity-30 justify-center' : ''
      }`}
      onClick={(e) => {
        e.preventDefault();
        handleNavigation(link.sectionId, link.path);
      }}
      aria-label={link.ariaLabel || link.label}
    >
      {link.icon && (
        isMobile 
          ? React.cloneElement(link.icon, { className: "icon-svg h-5 w-5 mr-2" })
          : link.icon
      )}
      {link.label || (isMobile && link.ariaLabel)}
    </Link>
  );
};

export default NavigationLink;