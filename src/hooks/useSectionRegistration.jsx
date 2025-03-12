import { useEffect, useRef } from 'react';
import { useScroll } from '../context/ScrollContext';

/**
 * Custom hook to handle section registration with fallbacks
 * @param {string} sectionId - ID for the section
 * @param {function} registerWithURL - URL-aware registration function (optional)
 * @returns {Object} - Object containing the section ref
 */
const useSectionRegistration = (sectionId, registerWithURL) => {
  const sectionRef = useRef(null);
  const { registerSection } = useScroll();
  
  useEffect(() => {
    let cleanup = () => {};
    
    if (sectionRef.current) {
      // Try registerWithURL first if available (passed as prop)
      if (typeof registerWithURL === 'function') {
        cleanup = registerWithURL(sectionId, sectionRef);
      } 
      // Fall back to standard registration if needed
      else if (registerSection) {
        cleanup = registerSection(sectionId, sectionRef);
      }
    }
    
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [sectionId, registerWithURL, registerSection]);
  
  return { sectionRef };
};

export default useSectionRegistration;