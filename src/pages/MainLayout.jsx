import React, { Suspense, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useScroll } from '../context/ScrollContext';
import ScrollURLUpdate from '../components/ScrollURLUpdate'; // Import ScrollURLUpdate

// Import components without lazy loading for the main layout
import Home from './Home';

// Use lazy loading for sections that appear as you scroll
const Projects = React.lazy(() => import('./Projects'));
const About = React.lazy(() => import('./About'));
const Guestbook = React.lazy(() => import('./Guestbook'));

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { registerSection, setActiveSection } = useScroll();
  const [visibleSections, setVisibleSections] = useState(['home', 'projects', 'about', 'guestbook']);
  
  // Helper to check if actual DOM elements for sections exist
  const checkSectionElements = useCallback(() => {
    const sections = ['home', 'projects', 'about', 'guestbook'];
    const found = sections.filter(id => document.getElementById(id));
    return found;
  }, []);

  // Simple registration function that delegates to the ScrollContext
  const registerWithURL = useCallback((sectionId, ref) => {
    return registerSection(sectionId, ref);
  }, [registerSection]);

  // Add CSS for layout and triangle animation
  React.useEffect(() => {
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
        scroll-margin-top: 60px; /* Help with intersection observer */
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
      <ScrollURLUpdate /> {/* Add ScrollURLUpdate component here */}
      {/* Home is always loaded - pass the registerWithURL function */}
      <Home registerWithURL={registerWithURL} />
      
      {/* Other sections load with non-blocking fallbacks */}
      {visibleSections.includes('projects') && (
        <Suspense fallback={
          <div className="suspense-fallback flex items-center justify-center py-16">
            <LoadingSpinner size="lg" color="primary" className="mx-auto my-10" aria-label="Loading Projects section" />
          </div>
        }>
          <Projects registerWithURL={registerWithURL} />
        </Suspense>
      )}

      {visibleSections.includes('about') && (
        <Suspense fallback={
          <div className="suspense-fallback flex items-center justify-center py-16">
            <LoadingSpinner size="lg" color="primary" className="mx-auto my-10" aria-label="Loading About section" />
          </div>
        }>
          <About registerWithURL={registerWithURL} />
        </Suspense>
      )}
      
      {visibleSections.includes('guestbook') && (
        <Suspense fallback={
          <div className="suspense-fallback flex items-center justify-center py-16">
            <LoadingSpinner size="lg" color="primary" className="mx-auto my-10" aria-label="Loading Guestbook section" />
          </div>
        }>
          <Guestbook registerWithURL={registerWithURL} />
        </Suspense>
      )}
    </div>
  );
};

export default MainLayout;