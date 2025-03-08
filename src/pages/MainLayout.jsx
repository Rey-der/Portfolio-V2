import React, { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useScroll } from '../context/ScrollContext';

// Import components without lazy loading for the main layout
import Home from './Home';

// Use lazy loading for sections that appear as you scroll
const Projects = React.lazy(() => import('./Projects'));
const About = React.lazy(() => import('./About'));
const Guestbook = React.lazy(() => import('./Guestbook'));

const MainLayout = () => {
  const location = useLocation();
  const { scrollToSection, registerSection } = useScroll();
  const [visibleSections, setVisibleSections] = useState(['home']);
  const currentPathRef = useRef(location.pathname);
  
  // Section refs
  const homeRef = useRef(null);
  
  // Helper to check if actual DOM elements for sections exist
  const checkSectionElements = useCallback(() => {
    const sections = ['home', 'projects', 'about', 'guestbook'];
    const found = sections.filter(id => document.getElementById(id));
    return found;
  }, []);
  
  // Setup initial sections based on URL
  useEffect(() => {
    const path = location.pathname.replace('/', '');
    let initialSections = ['home'];
    
    // Add appropriate sections based on URL
    switch (path) {
      case 'projects':
        initialSections = ['home', 'projects'];
        break;
      case 'about':
        initialSections = ['home', 'projects', 'about'];
        break;
      case 'guestbook':
        initialSections = ['home', 'projects', 'about', 'guestbook'];
        break;
      default:
        // On homepage, load all sections for smooth scrolling
        initialSections = ['home', 'projects', 'about', 'guestbook'];
    }
    
    setVisibleSections(initialSections);
    
    // Scroll to the right section after rendering
    if (path && path !== '') {
      // Add a short delay to ensure components are rendered
      setTimeout(() => scrollToSection(path), 100);
    }
  }, [scrollToSection, location.pathname, checkSectionElements]);
  
  // Register home section
  useEffect(() => {
    if (homeRef.current) {
      return registerSection('home', homeRef);
    }
  }, [registerSection]);
  
  // Track current path
  useEffect(() => {
    currentPathRef.current = location.pathname;
  }, [location.pathname]);

  // Add CSS to fix triangle animation and ensure clickable elements
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'mainLayoutStyles';
    style.textContent = `
      /* Core structure */
      .sections-container {
        position: relative;
        z-index: 1;
      }
      
      /* Section interaction */
      #home, #projects, #about, #guestbook {
        pointer-events: auto;
      }
      
      /* Navigation elements */
      header a, 
      nav a, 
      button,
      .nav-link {
        position: relative;
        z-index: 50;
      }
      
      /* Triangle specific styles - FIXED */
      .triangle-animation {
        pointer-events: none;
        z-index: 2;
        position: absolute;
        will-change: transform;
      }
      
      .triangle-svg {
        pointer-events: none;
      }
      
      /* Make suspense fallbacks non-blocking */
      .suspense-fallback {
        pointer-events: none;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      const existingStyle = document.getElementById('mainLayoutStyles');
      if (existingStyle) existingStyle.remove();
    };
  }, []);

  return (
    <div className="sections-container relative">
      {/* Home is always loaded */}
      <Home />
      
      {/* Other sections load with non-blocking fallbacks */}
      {visibleSections.includes('projects') && (
        <Suspense fallback={
          <div className="suspense-fallback flex items-center justify-center py-16">
            <LoadingSpinner size="lg" color="primary" className="mx-auto my-10" aria-label="Loading Projects section" />
          </div>
        }>
          <Projects />
        </Suspense>
      )}

      {visibleSections.includes('about') && (
        <Suspense fallback={
          <div className="suspense-fallback flex items-center justify-center py-16">
            <LoadingSpinner size="lg" color="primary" className="mx-auto my-10" aria-label="Loading About section" />
          </div>
        }>
          <About />
        </Suspense>
      )}
      
      {visibleSections.includes('guestbook') && (
        <Suspense fallback={
          <div className="suspense-fallback flex items-center justify-center py-16">
            <LoadingSpinner size="lg" color="primary" className="mx-auto my-10" aria-label="Loading Guestbook section" />
          </div>
        }>
          <Guestbook />
        </Suspense>
      )}
    </div>
  );
};

export default MainLayout;