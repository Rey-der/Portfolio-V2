import React from 'react';

const ScrollToTopButton = ({ handleScrollToTop, isMobile }) => {
  return (
    <div className={`flex justify-center mt-${isMobile ? '12' : '16'} mb-${isMobile ? '6' : '8'}`}>
      <button 
        onClick={handleScrollToTop}
        aria-label="Scroll to top"
        className={`animate-bounce bg-white dark:bg-gray-800 p-2 ${isMobile ? 'w-12 h-12' : 'w-10 h-10'} ring-1 ring-slate-900/5 dark:ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center hover:ring-primary hover:ring-2 transition-all duration-300`}
      >
        <svg 
          className={`${isMobile ? 'w-7 h-7' : 'w-6 h-6'} text-primary`} 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
      </button>
    </div>
  );
};

export default ScrollToTopButton;