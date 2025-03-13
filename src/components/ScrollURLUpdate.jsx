import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useScroll } from '../context/ScrollContext';

/**
 * Component that handles URL updates based on section visibility
 * using a scan line approach with dedicated URL triggers
 */
const ScrollURLUpdate = () => {
  // URL and navigation
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const urlCooldownRef = useRef(false);
  
  // Scroll context
  const { scrollDirection, settings, sectionsInView } = useScroll();
  
  // Configuration constants
  const CONFIG = {
    VISIBILITY_THRESHOLD: 0.51, 
    URL_COOLDOWN_MS: 300, // Cooldown period after URL updates
  };
  
  // Refs
  const urlTriggerObserverRef = useRef(null);
  
  // Debug state
  const [showScanLine, setShowScanLine] = useState(false);
  
  /**
   * Update the URL to reflect a section
   */
  const updateURL = useCallback((sectionId, triggerType, visibility = 1.0) => {
    const newPath = sectionId === 'home' ? '/' : `/${sectionId}`;
    
    if (currentPath !== newPath && !urlCooldownRef.current) {
      console.log(`ScrollURLUpdate - URL UPDATE: ${sectionId} (${triggerType}) → ${newPath} (visibility: ${visibility.toFixed(2)})`);
      
      // Update state and URL
      setCurrentPath(newPath);
      navigate(newPath, { replace: true });
      
      // Set cooldown to prevent rapid URL changes
      urlCooldownRef.current = true;
      setTimeout(() => {
        urlCooldownRef.current = false;
      }, CONFIG.URL_COOLDOWN_MS);
      
      // Notify other components
      document.dispatchEvent(new CustomEvent('url-update', { 
        detail: { 
          sectionId,
          triggerType,
          fromPath: currentPath,
          toPath: newPath,
          visibility,
          scrollDirection,
        } 
      }));
      
      document.dispatchEvent(new CustomEvent('url-section-change', { 
        detail: { sectionId } 
      }));
      
      return true;
    }
    
    return false;
  }, [currentPath, navigate, scrollDirection]);
  
  // Set up IntersectionObserver for URL triggers
  useEffect(() => {
    // Clean up existing observer
    if (urlTriggerObserverRef.current) {
      urlTriggerObserverRef.current.disconnect();
    }
    
    // Configure the observer for the center scan line
    const observerOptions = {
      threshold: [0.5],
    };
    
    // Create handler for intersections
    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        // Only handle elements entering the scan area with sufficient visibility
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const sectionId = entry.target.getAttribute('data-section');
          const triggerType = entry.target.getAttribute('data-trigger');
          
          if (!sectionId) return;
          
          // Direction-based activation to prevent URL oscillation
          // Only trigger entry points when scrolling down, and exit points when scrolling up
          if ((scrollDirection === 'down' && triggerType === 'entry') || 
              (scrollDirection === 'up' && triggerType === 'exit')) {
            // Update the URL
            updateURL(sectionId, triggerType);
          }
        }
      });
    };
    
    // Create and setup observer
    urlTriggerObserverRef.current = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Short delay to ensure all triggers are rendered
    setTimeout(() => {
      const urlTriggers = document.querySelectorAll('.section-url-trigger');
      
      urlTriggers.forEach(trigger => {
        urlTriggerObserverRef.current.observe(trigger);
      });
      
      console.log(`ScrollURLUpdate - Observing ${urlTriggers.length} URL triggers`);
    }, 500);
    
    // Cleanup
    return () => {
      if (urlTriggerObserverRef.current) {
        urlTriggerObserverRef.current.disconnect();
      }
    };
  }, [updateURL, scrollDirection]); // Add scrollDirection to dependencies
  
  // Register styles for URL triggers
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* URL update triggers - invisible by default */
      .section-url-trigger {
        height: 15px !important;
        position: absolute;
        left: 0;
        right: 0;
        opacity: 0;
        pointer-events: none;
        z-index: -1;
      }
      
      .section-url-trigger-entry {
        top: 25%; /* 1/4 down from section top */
      }
      
      .section-url-trigger-exit {
        bottom: 25%; /* 1/4 up from section bottom */
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);
  
  return null;
};

export default ScrollURLUpdate;