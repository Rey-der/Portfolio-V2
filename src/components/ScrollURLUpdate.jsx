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
  
  // Scroll context
  const { scrollDirection, settings, sectionsInView } = useScroll();
  
  // Configuration constants
  const CONFIG = {
    VISIBILITY_THRESHOLD: 0.6, // Initial visibility threshold (60%)
    URL_UPDATE_DEBOUNCE: 200, // Debounce URL updates to prevent rapid changes
  };
  
  // Refs
  const urlTriggerObserverRef = useRef(null);
  const updateTimeoutRef = useRef(null);
  
  // Debug state
  const [showScanLine, setShowScanLine] = useState(false);
  
  /**
   * Update the URL to reflect a section
   */
  const updateURL = useCallback((sectionId, triggerType, visibility = 1.0) => {
    const newPath = sectionId === 'home' ? '/' : `/${sectionId}`;
    
    if (currentPath !== newPath) {
      console.log(`ScrollURLUpdate - URL UPDATE: ${sectionId} (${triggerType}) → ${newPath} (visibility: ${visibility.toFixed(2)})`);
      
      // Update state and URL
      setCurrentPath(newPath);
      navigate(newPath, { replace: true });
      
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
  
  // Process sections in view to determine which should be in URL
  useEffect(() => {
    if (!sectionsInView || sectionsInView.length === 0) return;
    
    // Clear any pending updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    // Debounce the update to avoid rapid URL changes
    updateTimeoutRef.current = setTimeout(() => {
      // Find section with highest visibility
      let highestVisibility = 0;
      let sectionWithHighestVisibility = null;
      
      sectionsInView.forEach(section => {
        if (section.visibility > highestVisibility) {
          highestVisibility = section.visibility;
          sectionWithHighestVisibility = section.id;
        }
      });
      
      // Only update if highest visibility exceeds threshold and is different from current
      if (sectionWithHighestVisibility && highestVisibility >= CONFIG.VISIBILITY_THRESHOLD) {
        const currentSectionId = currentPath === '/' ? 'home' : currentPath.substring(1);
        
        // Check if the section with highest visibility is different from current section
        if (sectionWithHighestVisibility !== currentSectionId) {
          updateURL(sectionWithHighestVisibility, 'visibility-comparison', highestVisibility);
        }
      }
    }, CONFIG.URL_UPDATE_DEBOUNCE);
    
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [sectionsInView, updateURL, currentPath]);
  
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
          
          // If we're using the visibility comparison approach, we'll rely less on triggers
          // Only use triggers when there's no competing section with higher visibility
          if (sectionsInView && sectionsInView.length > 1) {
            // Multiple sections in view, let the visibility comparison handle it
            return;
          }
          
          // Update the URL
          updateURL(sectionId, triggerType);
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
  }, [updateURL, sectionsInView]);
  
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