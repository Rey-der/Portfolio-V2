import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollContext = createContext();

export const useScroll = () => useContext(ScrollContext);

export const ScrollProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState(null); // 'up' or 'down'
  const location = useLocation();
  const isProgrammaticScrollRef = useRef(false);
  
  // Use ref for sections to avoid re-renders
  const sectionsRef = useRef({});
  
  // Track registered sections for debugging
  const [registeredSections, setRegisteredSections] = useState([]);
  
  // Debug log function
  const logSections = useCallback(() => {
    console.log("Currently registered sections:", Object.keys(sectionsRef.current));
  }, []);
  

  // Intersection Observer for section visibility
useEffect(() => {
  // Don't setup observers during programmatic scrolling
  if (isProgrammaticScrollRef.current) return;
  
  const observerOptions = { 
    threshold: [0.1, 0.2, 0.3, 0.4, 0.5],
    rootMargin: '-5% 0px -40% 0px'
  };
  
  const sectionObservers = {};
  const sections = registeredSections;
  
  const handleIntersection = (entries) => {
    if (isProgrammaticScrollRef.current) return;
    
    // Find the most visible section
    let bestSection = null;
    let bestVisibility = 0;
    
    entries.forEach(entry => {
      const sectionId = entry.target.id;
      const intersectionRatio = entry.intersectionRatio;
      
      if (entry.isIntersecting && intersectionRatio > bestVisibility) {
        bestVisibility = intersectionRatio;
        bestSection = sectionId;
      }
    });
    
    // Update active section if we found a good candidate
    if (bestSection) {
      setActiveSection(bestSection);
    }
  };
  
  // Create observer
  const observer = new IntersectionObserver(handleIntersection, observerOptions);
  
  // Observe all registered sections
  sections.forEach(sectionId => {
    const element = document.getElementById(sectionId);
    if (element) {
      observer.observe(element);
      sectionObservers[sectionId] = true;
    }
  });
  
  // Cleanup observers
  return () => {
    observer.disconnect();
  };
}, [registeredSections, isProgrammaticScrollRef.current]);

  // Track scroll position and direction
  useEffect(() => {
    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;
      
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Determine scroll direction
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      setLastScrollY(currentScrollY);
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, isProgrammaticScrollRef.current]);
  
  // Enhanced section registration that handles both refs and direct DOM elements
  const registerSection = useCallback((sectionId, ref) => {
    sectionsRef.current[sectionId] = ref;
    
    setRegisteredSections(prevSections => {
      if (!prevSections.includes(sectionId)) {
        return [...prevSections, sectionId];
      }
      return prevSections;
    });
    
    // Return a cleanup function
    return () => {
      delete sectionsRef.current[sectionId];
      setRegisteredSections(prevSections => prevSections.filter(id => id !== sectionId));
    };
  }, []);
  
  let scrollSuccess = false;
  
  const scrollToSection = useCallback((sectionId) => {
    scrollSuccess = false;
    
    // First try: Look by ID
    const element = document.getElementById(sectionId);
    if (element) {
      console.log(`✅ Found section by ID: ${sectionId}`);
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      scrollSuccess = true;
    }
    
    // Second try: Look by ref
    if (!scrollSuccess && sectionsRef.current[sectionId]) {
      console.log(`✅ Found section by ref: ${sectionId}`);
      const ref = sectionsRef.current[sectionId];
      if (ref && ref.current) {
        ref.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        scrollSuccess = true;
      }
    }
    
    if (!scrollSuccess && sectionId === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      scrollSuccess = true;
    }
    
    // Third try: Look by data attribute
    if (!scrollSuccess) {
      const elementByData = document.querySelector(`[data-section="${sectionId}"]`);
      if (elementByData) {
        console.log(`✅ Found section by data attribute: ${sectionId}`);
        elementByData.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        scrollSuccess = true;
      }
    }
    
    // Fourth try: Look by class that often identifies sections
    if (!scrollSuccess) {
      const elementByClass = document.querySelector(`.section-${sectionId}`);
      if (elementByClass) {
        console.log(`✅ Found section by class: ${sectionId}`);
        elementByClass.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        scrollSuccess = true;
      }
    }
  }, [logSections]);

  // Scroll to top helper
  const scrollToTop = useCallback((smooth = true) => {
    isProgrammaticScrollRef.current = true;
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'instant'
    });
    isProgrammaticScrollRef.current = false;
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
        isProgrammaticScroll: () => isProgrammaticScrollRef.current,
        getSections: () => ({...sectionsRef.current})
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export default ScrollContext;