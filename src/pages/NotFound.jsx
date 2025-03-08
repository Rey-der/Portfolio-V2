import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  
  const handleNavigation = () => {
    // Use navigate instead of Link's default behavior
    navigate('/');
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-6">The page you're looking for doesn't exist.</p>
      <button 
        onClick={handleNavigation}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;