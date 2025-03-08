import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useIntersectionObserver from './useIntersectionObserver';

/**
 * Enhanced section observer hook with responsive window size detection
 * 
 * @param {string} sectionId - The ID of the section being observed
 * @param {string} path - The route path associated with this section
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Visibility threshold (0-1), lower values trigger earlier
 * @param {string} options.rootMargin - Margin around the root (viewport)
 * @param {boolean} options.earlyDetection - Whether to detect approaching the section
 * @param {boolean} options.debug - Enable console logging for debugging
 * @param {boolean} options.responsive - Adjust margins based on screen size
 * @returns {[React.RefObject, boolean, boolean]} - [ref, inView, approaching]
 */
const useSectionObserver = (sectionId, path, options = {}) => {
  const location = useLocation();
  const hasUpdatedRef = useRef(false);
  const isManualNavigationRef = useRef(false);
  const isScrollingRef = useRef(false);
  const lastUpdateTimeRef = useRef(0);
  
  // Get responsive margins based on screen size - always return properly formatted string
  const getResponsiveMargin = (baseValue) => {
    if (!options.responsive) {
      // Always return a string with proper format when not responsive
      return `${baseValue}% 0px`;
    }
    
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 768;
    
    // For smaller screens, use more conservative margins
    if (viewportWidth < 640) { // Mobile
      return `${Math.min(5, baseValue)}% 0px`;
    } else if (viewportWidth < 1024) { // Tablet
      return `${Math.min(8, baseValue)}% 0px`;
    } else if (viewportHeight < 800) { // Short screens
      return `${Math.min(10, baseValue)}% 0px`;
    }
    
    // Default for large screens
    return `${baseValue}% 0px`;
  };
  
  // Lower default threshold to 0.2 (20% visibility) to trigger earlier
  const threshold = options.threshold || 0.2;
  
  // Ensure rootMargin is always a valid string in "px" or "%" format
  const rootMargin = options.rootMargin || getResponsiveMargin(10);
  
  // Create an additional observer with even more generous margin for "approaching" state
  const [approaching, setApproaching] = useState(false);
  
  // Main observer for the section - ensure rootMargin is a properly formatted string
  const [sectionRef, inView, entry] = useIntersectionObserver({
    threshold: threshold,
    rootMargin: typeof rootMargin === 'string' ? rootMargin : '10% 0px',
    triggerOnce: false,
  });
  
  // Early detection observer (if enabled) - responsive to screen size
  useEffect(() => {
    if (!options.earlyDetection || !sectionRef.current) return;
    
    // Get early margin based on screen size
    const earlyMargin = getResponsiveMargin(options.responsive ? 20 : 30);
    const earlyThreshold = 0;
    
    try {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setApproaching(entry.isIntersecting);
        },
        { 
          rootMargin: earlyMargin,
          threshold: earlyThreshold
        }
      );
      
      observer.observe(sectionRef.current);
      
      return () => {
        if (sectionRef.current) {
          observer.unobserve(sectionRef.current);
        }
        observer.disconnect();
      };
    } catch (error) {
      console.error("Error creating IntersectionObserver:", error);
      // Fallback - just set approaching to true after a delay
      const timer = setTimeout(() => setApproaching(true), 500);
      return () => clearTimeout(timer);
    }
  }, [sectionRef, options.earlyDetection, options.responsive]);
  
  // Handle window resize
  useEffect(() => {
    if (!options.responsive || typeof window === 'undefined') return;
    
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      // Add a small delay to avoid excessive recalculations during resize
      resizeTimer = setTimeout(() => {
        // Force refresh of observers
        if (sectionRef.current) {
          setApproaching(false);
        }
      }, 250);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [options.responsive]);

  // Detect if we're in a manual navigation from UI elements
  useEffect(() => {
    if (location.pathname === path && path !== '/') {
      isManualNavigationRef.current = true;
      
      // Reset after a delay
      setTimeout(() => {
        isManualNavigationRef.current = false;
      }, 1000);
    }
  }, [location.pathname, path]);
  
  // Optimized scroll detection with debounce
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let scrollTimeout;
    let lastScrollY = window.scrollY;
    let scrollDirection = null;
    
    const handleScroll = () => {
      isScrollingRef.current = true;
      
      // Determine scroll direction
      const currentScrollY = window.scrollY;
      scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      lastScrollY = currentScrollY;
      
      // Clear previous timeout
      clearTimeout(scrollTimeout);
      
      // Set new timeout - consider user "done" scrolling after 100ms of no scroll
      scrollTimeout = setTimeout(() => {
        isScrollingRef.current = false;
      }, 100);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Update URL when section is in view
  useEffect(() => {
    // Don't update during manual navigation or active scrolling
    if (isManualNavigationRef.current || isScrollingRef.current || !entry) return;
    
    if (inView && entry) {
      // Dynamic threshold based on section height relative to viewport
      const sectionHeight = entry.target.getBoundingClientRect().height;
      const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 768;
      const heightRatio = Math.min(sectionHeight / viewportHeight, 3);
      
      // Responsive: Larger threshold on small screens to avoid premature triggers
      const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
      let deviceFactor = 1;
      if (viewportWidth < 640) deviceFactor = 1.5; // Need more visibility on mobile
      
      // Adaptive threshold - larger sections trigger earlier
      const adaptiveBuffer = Math.max(0.1, (0.3 / heightRatio) * deviceFactor);
      const updateThreshold = Math.min(threshold + adaptiveBuffer, 0.6);
      
      if (entry.intersectionRatio > updateThreshold) {
        // Prevent recursive updates
        if (hasUpdatedRef.current) return;
        
        // Rate limit updates based on screen size (faster on desktop)
        const updateDelay = viewportWidth < 768 ? 1000 : 800;
        const now = Date.now();
        if (now - lastUpdateTimeRef.current < updateDelay) return;
        lastUpdateTimeRef.current = now;
        
        if (location.pathname !== path) {
          if (options.debug) {
            console.log(`Updating URL to ${path} for section ${sectionId} at ratio ${entry.intersectionRatio.toFixed(2)}`);
          }
          
          hasUpdatedRef.current = true;
          
          try {
            // Use replaceState to update URL without adding to history
            window.history.replaceState(null, '', path);
            
            // Dispatch custom event for context
            document.dispatchEvent(new CustomEvent('section-change', { 
              detail: { path, sectionId }
            }));
          } catch (e) {
            console.error("Failed to update URL:", e);
          }
          
          // Reset the flag after a short delay
          setTimeout(() => {
            hasUpdatedRef.current = false;
          }, 500);
        }
      }
    }
  }, [inView, entry, path, location.pathname, sectionId, threshold, options.debug]);

  // Return both inView and approaching state for more flexible animations
  return [sectionRef, inView, approaching];
};

export default useSectionObserver;