import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const ScrollContext = createContext();

export const useScroll = () => useContext(ScrollContext);

export const ScrollProvider = ({ children }) => {
  // State for active section
  const [activeSection, setActiveSection] = useState('home');
  const [registeredSections, setRegisteredSections] = useState([]);
  
  // Add scroll position tracking
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');
  const prevScrollYRef = useRef(0);
  
  // Refs to track sections and scrolling state
  const sectionsRef = useRef({});
  const isProgrammaticScrollRef = useRef(false);
  const isScrollingRef = useRef(false);
  
  // Configurable settings - now using state so they can be updated
  const [settings, setSettings] = useState({
    dampeningFactor: 0.15,
    updateRatioThreshold: 0.25,
    minUpdateInterval: 600,
    observerThresholds: [0.15, 0.25, 0.5],
    rootMarginTop: -10,
    rootMarginBottom: -50,
    homeThreshold: 0.15,
    sectionThreshold: 0.2
  });
  
  // Track sections currently in view with their visibility percentages
  const [sectionsInView, setSectionsInView] = useState([]);
  
  // Track the last time the active section was updated
  const lastUpdateTimestamp = useRef(Date.now());
  
  // Function to update settings dynamically - exposed to DebugPanel
  const updateSettings = useCallback((newSettings) => {
    console.log('ScrollContext - updating settings:', newSettings);
    setSettings(newSettings);
  }, []);
  
  // Add console logging for activeSection changes
  useEffect(() => {
    console.log('ScrollContext - activeSection changed:', activeSection);
    
    // Dispatch a section-change event when activeSection changes
    if (activeSection) {
      console.log('ScrollContext - dispatching section-change event:', activeSection);
      document.dispatchEvent(
        new CustomEvent('section-change', {
          detail: {
            sectionId: activeSection,
            path: activeSection === 'home' ? '/' : `/${activeSection}`,
            settings: settings // Include current settings in the event
          }
        })
      );
    }
  }, [activeSection, settings]);
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Detect scroll direction
      setScrollDirection(currentScrollY > prevScrollYRef.current ? 'down' : 'up');
      prevScrollYRef.current = currentScrollY;
      
      // Set scrolling flag with debounce
      isScrollingRef.current = true;
      clearTimeout(isScrollingRef.current.timeoutId);
      isScrollingRef.current.timeoutId = setTimeout(() => {
        isScrollingRef.current = false;
      }, 100);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Process section registration
  const registerSection = useCallback((sectionId, ref) => {
    if (!sectionId) {
      console.warn('Attempted to register section without ID');
      return () => {};
    }
    
    console.log(`ScrollContext - registering section: ${sectionId}`);
    sectionsRef.current[sectionId] = ref;
    
    // Only update registered sections if this is a new one
    setRegisteredSections(prevSections => {
      if (!prevSections.includes(sectionId)) {
        const newSections = [...prevSections, sectionId];
        console.log('ScrollContext - updated registered sections:', newSections);
        return newSections;
      }
      return prevSections;
    });
    
    // Return cleanup function
    return () => {
      console.log(`ScrollContext - unregistering section: ${sectionId}`);
      delete sectionsRef.current[sectionId];
      setRegisteredSections(prevSections => prevSections.filter(id => id !== sectionId));
    };
  }, []);
  
  // Listen for URL changes from ScrollURLUpdate component
  useEffect(() => {
    const handleSectionChangeFromURL = (event) => {
      // Only update if it's not already the active section
      if (event.detail.sectionId && event.detail.sectionId !== activeSection) {
        console.log(`ScrollContext - received URL section change to: ${event.detail.sectionId}`);
        setActiveSection(event.detail.sectionId);
      }
    };
    
    // Listen for custom events from ScrollURLUpdate
    document.addEventListener('url-section-change', handleSectionChangeFromURL);
    
    return () => {
      document.removeEventListener('url-section-change', handleSectionChangeFromURL);
    };
  }, [activeSection]);
  
  // Update sectionsInView without directly controlling observers
  // This provides visibility info for other components while letting
  // ScrollURLUpdate handle the actual URL updates
  useEffect(() => {
    const updateSectionsVisibility = () => {
      // Skip if doing programmatic scrolling
      if (isProgrammaticScrollRef.current) return;
      
      const viewportHeight = window.innerHeight;
      const sectionsArray = [];
      
      // Get all registered section elements
      registeredSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        const rect = section.getBoundingClientRect();
        
        // Calculate visibility percentage
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibility = visibleHeight / viewportHeight;
        
        // Add to the array if visible
        if (visibility > 0) {
          sectionsArray.push({
            id: sectionId,
            visibility: visibility.toFixed(2)
          });
        }
      });
      
      setSectionsInView(sectionsArray);
      
      // Find best visible section for context state
      // (Note: URL updates are handled by ScrollURLUpdate)
      if (sectionsArray.length > 0 && !isProgrammaticScrollRef.current) {
        let bestSection = null;
        let bestVisibility = 0;
        
        sectionsArray.forEach(section => {
          const visibility = parseFloat(section.visibility);
          const threshold = section.id === 'home' ? 
            (settings.homeThreshold || 0.15) : (settings.sectionThreshold || 0.2);
          
          if (visibility > threshold && visibility > bestVisibility) {
            bestVisibility = visibility;
            bestSection = section.id;
          }
        });
        
        // Only update if we have a good visible section and enough time has passed
        if (bestSection && Date.now() - lastUpdateTimestamp.current > settings.minUpdateInterval) {
          if (bestSection !== activeSection) {
            setActiveSection(bestSection);
            lastUpdateTimestamp.current = Date.now();
          }
        }
      }
    };
    
    // Update on initial render
    updateSectionsVisibility();
    
    // Set up a throttled scroll listener for visibility tracking
    const handleScroll = () => {
      // Throttle updates
      if (!isScrollingRef.current.throttleId) {
        isScrollingRef.current.throttleId = setTimeout(() => {
          updateSectionsVisibility();
          isScrollingRef.current.throttleId = null;
        }, 100);
      }
    };
    
    // Add events for visibility tracking
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateSectionsVisibility);
    
    // Set up mutation observer for DOM changes
    const observer = new MutationObserver(() => {
      // If DOM changes, update section visibility after a short delay
      setTimeout(updateSectionsVisibility, 50);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateSectionsVisibility);
      observer.disconnect();
      clearTimeout(isScrollingRef.current.throttleId);
    };
  }, [registeredSections, activeSection, settings]);
  
  // Scroll to section implementation
  const scrollToSection = useCallback((sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) {
      console.warn(`ScrollContext - couldn't find section with id: ${sectionId}`);
      return false;
    }
    
    console.log(`ScrollContext - scrolling to section: ${sectionId}`);
    
    try {
      // Mark that we are doing a programmatic scroll
      isProgrammaticScrollRef.current = true;
      
      // Calculate offset for fixed header
      const headerHeight = 60; // Should match your header height
      const top = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      // Scroll with smooth behavior
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
      
      // Update active section
      setActiveSection(sectionId);
      
      // Reset programmatic scroll flag after animation completes
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 1000);
      
      return true;
    } catch (err) {
      console.error('ScrollContext - error scrolling to section:', err);
      isProgrammaticScrollRef.current = false;
      return false;
    }
  }, []);
  
  // Helper to scroll to top
  const scrollToTop = useCallback(() => {
    console.log('ScrollContext - scrolling to top');
    
    try {
      // Mark that we are doing a programmatic scroll
      isProgrammaticScrollRef.current = true;
      
      // Scroll with smooth behavior
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Update active section to home
      setActiveSection('home');
      
      // Reset programmatic scroll flag after animation completes
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 1000);
      
      return true;
    } catch (err) {
      console.error('ScrollContext - error scrolling to top:', err);
      isProgrammaticScrollRef.current = false;
      return false;
    }
  }, []);
  
  return (
    <ScrollContext.Provider
      value={{
        activeSection,
        setActiveSection,
        registerSection,
        scrollToSection,
        scrollToTop,
        scrollY,
        scrollDirection,
        registeredSections,
        sectionsInView,
        settings,
        updateSettings,
        isProgrammaticScroll: () => isProgrammaticScrollRef.current,
        getSections: () => ({ ...sectionsRef.current }),
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export default ScrollContext;