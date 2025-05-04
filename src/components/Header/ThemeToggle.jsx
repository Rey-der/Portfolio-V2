import React, { useEffect } from 'react';

const ThemeToggle = ({ toggleTheme, isDarkMode }) => {
  // Add debug logging to see if props are received correctly
  useEffect(() => {
    console.log('ThemeToggle component received props:', {
      hasToggleFunction: !!toggleTheme,
      isDarkMode
    });
  }, [toggleTheme, isDarkMode]);

  // Create safe handler with additional debugging
  const handleToggle = (e) => {
    e.preventDefault();
    console.log('ThemeToggle: Toggle button clicked');
    
    if (typeof toggleTheme === 'function') {
      console.log('ThemeToggle: Calling toggleTheme function');
      toggleTheme();
      
      // Verify the change after a short delay
      setTimeout(() => {
        const hasClassNow = document.documentElement.classList.contains('dark');
        console.log('ThemeToggle: After toggle, dark mode class is present:', hasClassNow);
      }, 100);
    } else {
      console.error('ThemeToggle: toggleTheme is not a function!', toggleTheme);
    }
  };
  
  return (
    <button
      onClick={handleToggle}
      aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="p-2 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      data-testid="theme-toggle"
      onMouseDown={(e) => e.preventDefault()}
    >
      {isDarkMode ? (
        // Sun icon for dark mode
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        // Moon icon for light mode
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};

// Add prop types fallback for safety
ThemeToggle.defaultProps = {
  toggleTheme: () => {
    console.error('ThemeToggle: No toggleTheme function was provided as a prop');
    
    // As a fallback, try to toggle the class directly
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  },
  isDarkMode: false
};

export default ThemeToggle;