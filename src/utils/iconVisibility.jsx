/**
 * Icon visibility manager to prevent flicker during page load
 */

// Track if icons should be visible
let iconsVisible = false;

// Initialize icon visibility manager
export function initIconVisibility() {
  // Add class to body when loading to control icons
  document.body.classList.add('icons-loading');
  
  // Set a timeout to make icons visible after a delay
  setTimeout(() => {
    document.body.classList.remove('icons-loading');
    document.body.classList.add('icons-ready');
    iconsVisible = true;
  }, 300);
  
  // Create and inject CSS to control icon visibility
  const style = document.createElement('style');
  style.id = 'icon-visibility-styles';
  style.textContent = `
    /* Hide SVG icons on page load */
    .icons-loading svg {
      opacity: 0 !important;
      transition: opacity 0.3s ease-out;
    }
    
    /* Show icons when ready */
    .icons-ready svg {
      opacity: 1 !important;
      transition: opacity 0.3s ease-out;
    }
    
    /* Mail icon specific fix */
    .mail-icon {
      opacity: 0;
      transition: opacity 0.3s ease-out;
    }
    
    .icons-ready .mail-icon {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
  
  return {
    // Check if icons are currently visible
    areIconsVisible: () => iconsVisible,
    
    // Force icons to be visible immediately
    showIcons: () => {
      document.body.classList.remove('icons-loading');
      document.body.classList.add('icons-ready');
      iconsVisible = true;
    },
    
    // Clean up (useful for testing/development)
    cleanup: () => {
      const styleElement = document.getElementById('icon-visibility-styles');
      if (styleElement) styleElement.remove();
    }
  };
}

// Create React hook to use icon visibility in components
export function createUseIconVisibility(React) {
  // Track visibility in React context
  const IconVisibilityContext = React.createContext({
    iconsVisible: false,
    showIcons: () => {}
  });
  
  // Provider component
  const IconVisibilityProvider = ({ children }) => {
    const [visible, setVisible] = React.useState(false);
    
    React.useEffect(() => {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }, []);
    
    return (
      <IconVisibilityContext.Provider value={{ 
        iconsVisible: visible,
        showIcons: () => setVisible(true)
      }}>
        {children}
      </IconVisibilityContext.Provider>
    );
  };
  
  // Custom hook
  const useIconVisibility = () => React.useContext(IconVisibilityContext);
  
  return { IconVisibilityProvider, useIconVisibility };
}

export default initIconVisibility;