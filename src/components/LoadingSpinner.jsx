import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary', className = '' }) => {
  // Size mappings
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  // Color mappings
  const colorClasses = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    accent: 'border-accent',
    white: 'border-white'
  };

  // Apply the appropriate classes based on props
  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = colorClasses[color] || colorClasses.primary;

  return (
    <div className={`flex items-center justify-center ${className}`} aria-label="Loading content">
      <div 
        className={`${spinnerSize} border-4 border-t-transparent rounded-full animate-spin ${spinnerColor}`}
        role="status"
        aria-hidden="true"
      ></div>
      <span className="sr-only">Loading...</span>
      {/* Remove the JSX style tag and use CSS instead */}
    </div>
  );
};

export default LoadingSpinner;