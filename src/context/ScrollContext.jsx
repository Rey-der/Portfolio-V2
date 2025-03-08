import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollContext = createContext();

export const useScroll = () => useContext(ScrollContext);

export const ScrollProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState(null); // 'up' or 'down'
  const location = useLocation();
  
  // Use ref for sections to avoid re-renders
  const sectionsRef = useRef({});
  
  // Track registered sections for debugging
  const [registeredSections, setRegisteredSections] = useState([]);
  
  // Debug log function
  const logSections = useCallback(() => {
    console.log("Currently registered sections:", Object.keys(sectionsRef.current));
  }, []);
  
  // Track scroll position and direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  // Enhanced section registration that handles both refs and direct DOM elements
  const registerSection = useCallback((sectionId, ref) => {
    if (!sectionId) {
      console.warn('Attempted to register section without ID');
      return null;
    }
    
    // Store in ref to prevent re-renders
    sectionsRef.current[sectionId] = ref;
    
    // Update registered sections array for debugging
    setRegisteredSections(prev => {
      if (!prev.includes(sectionId)) {
        return [...prev, sectionId];
      }
      return prev;
    });
    
    console.log(`✅ Section registered: ${sectionId}`);
    
    // Return unregister function
    return () => {
      console.log(`❌ Section unregistered: ${sectionId}`);
      if (sectionsRef.current[sectionId]) {
        delete sectionsRef.current[sectionId];
        setRegisteredSections(prev => prev.filter(id => id !== sectionId));
      }
    };
  }, []);
  
  // Enhanced scrollToSection with multiple fallback strategies
  const scrollToSection = useCallback((sectionId) => {
    console.log(`🔍 Attempting to scroll to section: ${sectionId}`);
    
    // First try: Using the registered ref
    if (sectionsRef.current[sectionId] && sectionsRef.current[sectionId].current) {
      console.log(`✅ Found section by ref: ${sectionId}`);
      sectionsRef.current[sectionId].current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      return true;
    }
    
    // Second try: Direct DOM lookup by ID
    const elementById = document.getElementById(sectionId);
    if (elementById) {
      console.log(`✅ Found section by ID: ${sectionId}`);
      elementById.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      return true;
    }
    
    // Special case for home section
    if (sectionId === 'home') {
      console.log('✅ Special case: scrolling to top for home section');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return true;
    }
    
    // Third try: Look by data attribute
    const elementByData = document.querySelector(`[data-section="${sectionId}"]`);
    if (elementByData) {
      console.log(`✅ Found section by data attribute: ${sectionId}`);
      elementByData.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      return true;
    }
    
    // Fourth try: Look by class that often identifies sections
    const elementByClass = document.querySelector(`.section-${sectionId}`);
    if (elementByClass) {
      console.log(`✅ Found section by class: ${sectionId}`);
      elementByClass.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      return true;
    }
    
    // If all else fails, log the failure and list available sections
    console.warn(`❌ Section "${sectionId}" not found or ref not attached`);
    logSections();
    return false;
  }, [logSections]);

  // Scroll to top helper
  const scrollToTop = useCallback((smooth = true) => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }, []);

  // Update active section when location changes
  useEffect(() => {
    // Map paths to section IDs
    const pathToSection = {
      '/': 'home',
      '/projects': 'projects',
      '/about': 'about',
      '/guestbook': 'guestbook',
      '/contact': 'contact'
    };
    
    const path = location.pathname;
    const sectionId = pathToSection[path] || 'home';
    setActiveSection(sectionId);
    
    // Optional: Remove hash from URL to avoid conflicts with our scroll system
    if (location.hash && window.history.replaceState) {
      window.history.replaceState(
        null, 
        document.title, 
        window.location.pathname + window.location.search
      );
    }
    
    // Force DOM-based section registration on route change
    setTimeout(() => {
      // Attempt to find and register any sections that might not be registered yet
      Object.keys(pathToSection).forEach(path => {
        const sectionId = pathToSection[path].replace('/', '');
        if (sectionId && !sectionsRef.current[sectionId]) {
          const element = document.getElementById(sectionId);
          if (element) {
            // Add data-section attribute to help with lookups
            element.setAttribute('data-section', sectionId);
          }
        }
      });
    }, 300);
  }, [location.pathname]);

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
        // Provide a safe getter for sections that won't return references to mutable state
        getSections: () => ({...sectionsRef.current})
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};