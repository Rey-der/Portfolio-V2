import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ headerText, handleNavigation }) => {
  return (
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
  );
};

export default Logo;