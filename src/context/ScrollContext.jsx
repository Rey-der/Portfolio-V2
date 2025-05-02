import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const ScrollContext = createContext();

export const useScroll = () => useContext(ScrollContext);

// Debug flag - enable this for detailed logging
const DEBUG_SCROLL = false;

// Minimum scroll change needed to log (px)
const MIN_SCROLL_CHANGE_TO_LOG = 20;

// Helper function for logging with timestamp and rate limiting
const logWithTime = (() => {
  let lastLoggedPosition = 0;
  let lastLogTime = 0;
  let throttledMessages = {};
  
  return (message, data, forceLog = false, scrollY = null) => {
    if (!DEBUG_SCROLL) return;
    
    const now = Date.now();
    
    // If this is a scroll position update, check if it's significant enough to log
    if (scrollY !== null && !forceLog) {
      // Only log if position changed significantly or it's been a while
      const positionChange = Math.abs(scrollY - lastLoggedPosition);
      const timeChange = now - lastLogTime;
      
      if (positionChange < MIN_SCROLL_CHANGE_TO_LOG && timeChange < 1000) {
        return; // Skip logging for minor scroll changes
      }
      
      lastLoggedPosition = scrollY;
      lastLogTime = now;
    }
    
    // For other repetitive messages, throttle them
    if (!forceLog && (message.startsWith('Section #') || 
        message === 'CALCULATING SECTION VISIBILITY:' || 
        message === 'SECTIONS IN VIEW:')) {
      // Throttle these frequent messages
      if (throttledMessages[message] && now - throttledMessages[message] < 1000) {
        return;
      }
      throttledMessages[message] = now;
    }
    
    const timestamp = new Date().toLocaleTimeString() + '.' + String(Date.now() % 1000).padStart(3, '0');
    console.log(
      `%c🔍 [${timestamp}] ${message}`, 
      'background: #4a148c; color: white; padding: 2px 5px; border-radius: 3px;',
      data || ''
    );
  };
})();

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
  
  // Separate timeout ref for scroll debouncing
  const scrollTimeoutRef = useRef(null);
  
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
  
  // Track position of native scroll
  const nativeScrollYRef = useRef(0);
  const lastNativeScrollEventTime = useRef(Date.now());
  const scrollEventCount = useRef(0);
  
  // IMPROVED: Add ref for last broadcast to avoid stale closures
  const lastBroadcastRef = useRef({
    scrollY: 0,
    timestamp: 0,
    count: 0
  });
  
  // Function to update settings dynamically - exposed to DebugPanel
  const updateSettings = useCallback((newSettings) => {
    logWithTime('ScrollContext - updating settings:', newSettings, true);
    setSettings(newSettings);
  }, []);
  
  // Add console logging for activeSection changes
  useEffect(() => {
    logWithTime('ScrollContext - activeSection changed:', activeSection, true);
    
    // Dispatch a section-change event when activeSection changes
    if (activeSection) {
      logWithTime('ScrollContext - dispatching section-change event:', activeSection, true);
      document.dispatchEvent(
        new CustomEvent('section-change', {
          detail: {
            section: activeSection,
            sectionId: activeSection,
            path: activeSection === 'home' ? '/' : `/${activeSection}`,
            settings: settings // Include current settings in the event
          }
        })
      );
    }
  }, [activeSection, settings]);
  
  // IMPROVED: Access window scroll value directly to ensure latest values
  const getScrollY = useCallback(() => {
    return window._scrollY !== undefined ? window._scrollY : window.scrollY;
  }, []);
  
  // Track scroll position with enhanced logging
  useEffect(() => {
    // IMPROVED: Get the initial scroll position directly
    const initialScrollY = getScrollY();
    let lastSignificantScrollY = initialScrollY;
    nativeScrollYRef.current = initialScrollY;
    prevScrollYRef.current = initialScrollY;
    
    const handleScroll = () => {
      // FIXED: Always get fresh scroll position directly from window
      const currentScrollY = getScrollY();
      const now = Date.now();
      scrollEventCount.current++;
      
      // Store native scroll position for comparison
      nativeScrollYRef.current = currentScrollY;
      
      // Only log significant scroll changes
      const scrollChange = Math.abs(currentScrollY - lastSignificantScrollY);
      const timeSinceLastLog = now - lastNativeScrollEventTime.current;
      
      if (scrollChange >= MIN_SCROLL_CHANGE_TO_LOG || timeSinceLastLog > 1000) {
        logWithTime('NATIVE SCROLL EVENT:', {
          position: Math.round(currentScrollY),
          delta: Math.round(currentScrollY - prevScrollYRef.current),
          direction: currentScrollY > prevScrollYRef.current ? '↓' : '↑',
          scrollEventCount: scrollEventCount.current,
          timeSinceLast: timeSinceLastLog + 'ms'
        }, false, currentScrollY);
        
        lastNativeScrollEventTime.current = now;
        lastSignificantScrollY = currentScrollY;
      }
      
      // IMPORTANT: Always update state with fresh value
      setScrollY(currentScrollY);
      
      // Detect scroll direction using direct window values
      const newDirection = currentScrollY > prevScrollYRef.current ? 'down' : 'up';
      if (newDirection !== scrollDirection) {
        logWithTime('SCROLL DIRECTION CHANGED:', {
          from: scrollDirection,
          to: newDirection,
          position: Math.round(currentScrollY),
          delta: Math.round(currentScrollY - prevScrollYRef.current)
        }, true, currentScrollY);
        
        setScrollDirection(newDirection);
      }
      
      prevScrollYRef.current = currentScrollY;
      
      // Set scrolling flag with debounce
      isScrollingRef.current = true;
      
      // Clear previous timeout if it exists
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Set new timeout
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        // IMPROVED: Always get fresh scroll position for final position
        const finalY = getScrollY();
        logWithTime('SCROLL ENDED:', {
          finalPosition: Math.round(finalY),
          isProgrammatic: isProgrammaticScrollRef.current
        }, true, finalY);
      }, 100);
    };
    
    // IMPORTANT: Use capture and passive for best performance
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    
    logWithTime('SCROLL TRACKING INITIALIZED', {
      initialScrollY: initialScrollY,
      registeredSections
    }, true);
    
    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [scrollDirection, getScrollY]);
  
  // Process section registration
  const registerSection = useCallback((sectionId, ref) => {
    if (!sectionId) {
      console.warn('Attempted to register section without ID');
      return () => {};
    }
    
    logWithTime(`ScrollContext - registering section: ${sectionId}`, null, true);
    sectionsRef.current[sectionId] = ref;
    
    // Only update registered sections if this is a new one
    setRegisteredSections(prevSections => {
      if (!prevSections.includes(sectionId)) {
        const newSections = [...prevSections, sectionId];
        logWithTime('ScrollContext - updated registered sections:', newSections, true);
        return newSections;
      }
      return prevSections;
    });
    
    // Return cleanup function
    return () => {
      logWithTime(`ScrollContext - unregistering section: ${sectionId}`, null, true);
      delete sectionsRef.current[sectionId];
      setRegisteredSections(prevSections => prevSections.filter(id => id !== sectionId));
    };
  }, []);
  
  // Listen for URL changes from ScrollURLUpdate component
  useEffect(() => {
    const handleSectionChangeFromURL = (event) => {
      // Only update if it's not already the active section
      if (event.detail.sectionId && event.detail.sectionId !== activeSection) {
        logWithTime(`ScrollContext - received URL section change to: ${event.detail.sectionId}`, {
          fromSection: activeSection,
          fromURL: window.location.pathname
        }, true);
        
        setActiveSection(event.detail.sectionId);
      }
    };
    
    // Listen for custom events from ScrollURLUpdate
    document.addEventListener('url-section-change', handleSectionChangeFromURL);
    
    return () => {
      document.removeEventListener('url-section-change', handleSectionChangeFromURL);
    };
  }, [activeSection]);
  
  // Update sectionsInView with enhanced visibility logging
  useEffect(() => {
    let lastUpdateTime = 0;
    const minUpdateInterval = 250; // Limit updates to once every 250ms
    
    const updateSectionsVisibility = () => {
      const now = Date.now();
      
      // Skip if doing programmatic scrolling
      if (isProgrammaticScrollRef.current) {
        logWithTime('SKIPPING VISIBILITY UPDATE - programmatic scroll in progress', null, true);
        return;
      }
      
      // Skip if it's too soon for another update
      if (now - lastUpdateTime < minUpdateInterval) {
        return;
      }
      
      lastUpdateTime = now;
      const viewportHeight = window.innerHeight;
      const sectionsArray = [];
      // FIXED: Get scroll position directly
      const nativeScrollY = getScrollY();
      
      logWithTime('CALCULATING SECTION VISIBILITY:', {
        scrollY: Math.round(nativeScrollY),
        viewportHeight,
        registeredSections
      }, false, nativeScrollY);
      
      // Get all registered section elements
      registeredSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (!section) {
          logWithTime(`⚠️ Section element not found: #${sectionId}`, null, true);
          return;
        }
        
        const rect = section.getBoundingClientRect();
        
        // Calculate visibility percentage
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibility = visibleHeight / viewportHeight;
        
        // Only log significant visibility values
        if (visibility > 0.05) {
          logWithTime(`Section #${sectionId} visibility:`, {
            visibility: visibility.toFixed(2),
            top: Math.round(rect.top),
            bottom: Math.round(rect.bottom),
            height: Math.round(rect.height),
            visibleHeight: Math.round(visibleHeight),
            scrollY: Math.round(nativeScrollY),
            offsetTop: Math.round(section.offsetTop)
          }, false, nativeScrollY);
        }
        
        // Add to the array if visible
        if (visibility > 0) {
          sectionsArray.push({
            id: sectionId,
            visibility: visibility.toFixed(2)
          });
        }
      });
      
      logWithTime('SECTIONS IN VIEW:', sectionsArray, false, nativeScrollY);
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
        
        // Only log if there's a best section candidate
        if (bestSection) {
          logWithTime('BEST VISIBLE SECTION CANDIDATE:', {
            bestSection,
            bestVisibility,
            currentActive: activeSection,
            timeSinceLastUpdate: now - lastUpdateTimestamp.current,
            updateThreshold: settings.minUpdateInterval
          }, false, nativeScrollY);
        }
        
        // Only update if we have a good visible section and enough time has passed
        if (bestSection && now - lastUpdateTimestamp.current > settings.minUpdateInterval) {
          if (bestSection !== activeSection) {
            logWithTime(`🔄 SECTION CHANGE: ${activeSection} -> ${bestSection}`, {
              visibility: bestVisibility,
              scrollY: Math.round(nativeScrollY)
            }, true, nativeScrollY);
            
            setActiveSection(bestSection);
            lastUpdateTimestamp.current = now;
          }
        }
      }
    };
    
    // Update on initial render
    updateSectionsVisibility();
    
    // Set up a throttled scroll listener for visibility tracking
    let scrollThrottleTimeout = null;
    const handleScroll = () => {
      // Throttle updates more aggressively
      if (scrollThrottleTimeout) return;
      
      scrollThrottleTimeout = setTimeout(() => {
        updateSectionsVisibility();
        scrollThrottleTimeout = null;
      }, 200); // Increased to 200ms for better performance
    };
    
    // Add events for visibility tracking - use capture to get early
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    window.addEventListener('resize', updateSectionsVisibility);
    
    // Set up mutation observer for DOM changes - with less frequent updates
    let mutationThrottleTimeout = null;
    const observer = new MutationObserver(() => {
      // If DOM changes, throttle updates
      if (mutationThrottleTimeout) return;
      
      mutationThrottleTimeout = setTimeout(() => {
        logWithTime('DOM CHANGED - updating section visibility', null, true);
        updateSectionsVisibility();
        mutationThrottleTimeout = null;
      }, 300);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      window.removeEventListener('resize', updateSectionsVisibility);
      observer.disconnect();
      clearTimeout(scrollThrottleTimeout);
      clearTimeout(mutationThrottleTimeout);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [registeredSections, activeSection, settings, getScrollY]);
  
  // Scroll to section implementation with enhanced logging
  const scrollToSection = useCallback((sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) {
      console.warn(`ScrollContext - couldn't find section with id: ${sectionId}`);
      return false;
    }
    
    // FIXED: Get scroll position directly
    const currentScrollY = getScrollY();
    
    logWithTime(`ScrollContext - SCROLLING TO SECTION: ${sectionId}`, {
      fromSection: activeSection,
      currentScrollY: Math.round(currentScrollY),
      targetScrollY: Math.round(section.offsetTop)
    }, true);
    
    try {
      // Mark that we are doing a programmatic scroll
      isProgrammaticScrollRef.current = true;
      
      // Calculate offset for fixed header
      const headerHeight = 60; // Should match your header height
      const sectionOffsetTop = section.offsetTop;
      const top = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      logWithTime(`SCROLL DETAILS:`, {
        sectionId,
        offsetTop: Math.round(sectionOffsetTop),
        calculatedPosition: Math.round(top),
        headerOffset: headerHeight,
        boundingClientRectTop: Math.round(section.getBoundingClientRect().top)
      }, true);
      
      // Scroll with smooth behavior
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
      
      // Update active section
      setActiveSection(sectionId);
      
      // Broadcast this as a section change event
      document.dispatchEvent(
        new CustomEvent('section-change', {
          detail: {
            section: sectionId,
            sectionId: sectionId,
            path: sectionId === 'home' ? '/' : `/${sectionId}`,
            programmatic: true
          }
        })
      );
      
      // Reset programmatic scroll flag after animation completes
      setTimeout(() => {
        // FIXED: Get position directly
        const finalScrollY = getScrollY();
        
        logWithTime(`PROGRAMMATIC SCROLL COMPLETED:`, {
          sectionId,
          finalScrollY: Math.round(finalScrollY),
          targetScrollY: Math.round(sectionOffsetTop)
        }, true);
        
        isProgrammaticScrollRef.current = false;
      }, 1000);
      
      return true;
    } catch (err) {
      console.error('ScrollContext - error scrolling to section:', err);
      isProgrammaticScrollRef.current = false;
      return false;
    }
  }, [activeSection, getScrollY]);
  
  // Helper to scroll to top
  const scrollToTop = useCallback(() => {
    // FIXED: Get position directly
    const currentScrollY = getScrollY();
    
    logWithTime('ScrollContext - scrolling to top', {
      fromSection: activeSection,
      currentScrollY: Math.round(currentScrollY)
    }, true);
    
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
      
      // Broadcast this as a section change event
      document.dispatchEvent(
        new CustomEvent('section-change', {
          detail: {
            section: 'home',
            sectionId: 'home',
            path: '/',
            programmatic: true
          }
        })
      );
      
      // Reset programmatic scroll flag after animation completes
      setTimeout(() => {
        // FIXED: Get position directly
        const finalScrollY = getScrollY();
        
        logWithTime(`SCROLL TO TOP COMPLETED:`, {
          finalScrollY: Math.round(finalScrollY)
        }, true);
        
        isProgrammaticScrollRef.current = false;
      }, 1000);
      
      return true;
    } catch (err) {
      console.error('ScrollContext - error scrolling to top:', err);
      isProgrammaticScrollRef.current = false;
      return false;
    }
  }, [activeSection, getScrollY]);
  
  // IMPROVED: Broadcast scroll position with better reliability
  const broadcastScrollPosition = useCallback(() => {
    // FIXED: Always get fresh scroll position
    const currentScrollY = getScrollY();
    const now = Date.now();
    
    // Get refs to avoid closure problems
    const lastBroadcast = lastBroadcastRef.current;
    
    // Only broadcast if scroll position changed significantly 
    if (Math.abs(currentScrollY - lastBroadcast.scrollY) >= MIN_SCROLL_CHANGE_TO_LOG * 1.5) {
      // Update the ref with latest values
      lastBroadcast.scrollY = currentScrollY;
      lastBroadcast.timestamp = now;
      lastBroadcast.count++;
      
      // Get current visible section from state or activeSection as fallback
      const currentSection = activeSection;
      
      // Create and dispatch the event
      const scrollEvent = new CustomEvent('scroll-position-update', {
        detail: {
          current: currentScrollY,
          section: currentSection,
          source: 'scroll-context',
          sequence: lastBroadcast.count,
          timestamp: now
        }
      });
      
      document.dispatchEvent(scrollEvent);
      
      logWithTime(`📢 SCROLL BROADCAST #${lastBroadcast.count}:`, {
        position: Math.round(currentScrollY),
        section: currentSection
      }, false, currentScrollY);
    }
  }, [activeSection, getScrollY]);
  
  // Add a scroll position broadcast for parallax effects with reduced frequency
  useEffect(() => {
    // Initialize the last broadcast ref
    lastBroadcastRef.current = {
      scrollY: getScrollY(),
      timestamp: Date.now(),
      count: 0
    };
    
    // Add throttled scroll listener for broadcasting with larger delay
    let broadcastThrottleTimeout = null;
    const handleScrollForBroadcast = () => {
      if (broadcastThrottleTimeout) return;
      
      broadcastThrottleTimeout = setTimeout(() => {
        broadcastScrollPosition();
        broadcastThrottleTimeout = null;
      }, 150); // Increased delay for better performance
    };
    
    window.addEventListener('scroll', handleScrollForBroadcast, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScrollForBroadcast);
      clearTimeout(broadcastThrottleTimeout);
    };
  }, [broadcastScrollPosition, getScrollY]);
  
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
        // Add debugging helper
        getScrollDebugInfo: () => ({
          nativeScrollY: getScrollY(),  // FIXED: Get direct value
          activeSection,
          programmatic: isProgrammaticScrollRef.current,
          direction: scrollDirection,
          sectionsInView
        })
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export default ScrollContext;