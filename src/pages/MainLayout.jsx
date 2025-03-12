import React, { Suspense, useState, useRef, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useScroll } from '../context/ScrollContext';
import ScrollURLUpdate from '../components/ScrollURLUpdate';
import ScrollBar from '../components/ScrollBar';
import Home from './Home';

// Use lazy loading for sections that appear as you scroll
const Projects = React.lazy(() => import('./Projects'));
const About = React.lazy(() => import('./About'));
const Guestbook = React.lazy(() => import('./Guestbook'));

// Lazy load DebugPanel only when needed
const DebugPanel = React.lazy(() => import('../components/DebugPanel'));

const MainLayout = () => {
  const location = useLocation();
  const { registerSection, setActiveSection, scrollToSection, activeSection, registeredSections } = useScroll();
  const [visibleSections, setVisibleSections] = useState(['home', 'projects', 'about', 'guestbook']);
  const initialPathHandledRef = useRef(false);
  const [showDebug, setShowDebug] = useState(false);
  
  // DEBUG: Log active section updates
  useEffect(() => {
    console.log('MainLayout - activeSection changed:', activeSection);
  }, [activeSection]);
  
  // DEBUG: Log registered sections
  useEffect(() => {
    console.log('MainLayout - registered sections:', registeredSections);
  }, [registeredSections]);
  
  // Register sections with URL-aware system
  const registerWithURL = useCallback((sectionId, ref) => {
    if (!sectionId || !ref) {
      console.warn('Missing sectionId or ref in registerWithURL');
      return () => {};
    }
    
    console.log(`MainLayout - registering section: ${sectionId}`);
    return registerSection(sectionId, ref);
  }, [registerSection]);
  
  // Handle initial navigation based on URL path
  useEffect(() => {
    if (initialPathHandledRef.current) return;
    
    const path = location.pathname.substring(1); // Remove leading slash
    console.log('MainLayout - handling initial path:', path);
    
    if (path && path !== 'home' && visibleSections.includes(path)) {
      // Wait for sections to render before scrolling
      setTimeout(() => {
        console.log(`MainLayout - scrolling to initial section: ${path}`);
        scrollToSection(path);
        setActiveSection(path);
      }, 500);
    }
    
    initialPathHandledRef.current = true;
  }, [location.pathname, scrollToSection, setActiveSection, visibleSections]);
  
  // Listen for section-change events to keep activeSection in sync with URL
  useEffect(() => {
    const handleSectionChange = (e) => {
      if (e.detail && e.detail.sectionId) {
        console.log('MainLayout - section-change event detected:', e.detail.sectionId);
        setActiveSection(e.detail.sectionId);
      }
    };
    
    document.addEventListener('section-change', handleSectionChange);
    
    console.log('MainLayout - section-change event listener added');
    
    return () => {
      document.removeEventListener('section-change', handleSectionChange);
      console.log('MainLayout - section-change event listener removed');
    };
  }, [setActiveSection]);
  
  // Add keyboard shortcut for debug panel (Ctrl+Shift+D) - FIXED for macOS
  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log('Key pressed:', e.key, 'Ctrl:', e.ctrlKey || e.metaKey, 'Shift:', e.shiftKey);
      
      // For macOS, we need to handle both Command+Shift+D and Ctrl+Shift+D
      const modifierKey = e.ctrlKey || e.metaKey; // metaKey is Command on Mac
      
      // Check for both lowercase and uppercase D
      if (modifierKey && e.shiftKey && (e.key === 'd' || e.key === 'D')) {
        console.log('Debug toggle shortcut detected');
        setShowDebug(prev => {
          const newValue = !prev;
          console.log('Toggling debug panel:', newValue);
          return newValue;
        });
        // Prevent default behavior
        e.preventDefault();
      }
    };
    
    // Add event listener to document instead of window
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Toggle debug function kept for programmatic use if needed
  const toggleDebug = () => {
    setShowDebug(prev => !prev);
    console.log("Debug toggled programmatically");
  };

  return (
    <div className="relative">
      {/* Add custom scroll bar */}
      <ScrollBar />
      
      {/* Sections container */}
      <div className="sections-container">
        <ScrollURLUpdate />
        
        {/* Conditionally render DebugPanel */}
        {showDebug && (
          <Suspense fallback={<div className="fixed top-0 left-0 bg-black text-white p-2">Loading debug panel...</div>}>
            <DebugPanel />
          </Suspense>
        )}
        
        {/* Main content sections in order: home, projects, about, guestbook */}
        <Home registerWithURL={registerWithURL} />
        
        {visibleSections.includes('projects') && (
          <Suspense fallback={<LoadingSpinner />}>
            <Projects registerWithURL={registerWithURL} />
          </Suspense>
        )}
        
        {visibleSections.includes('about') && (
          <Suspense fallback={<LoadingSpinner />}>
            <About registerWithURL={registerWithURL} />
          </Suspense>
        )}
        
        {visibleSections.includes('guestbook') && (
          <Suspense fallback={<LoadingSpinner />}>
            <Guestbook registerWithURL={registerWithURL} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default MainLayout;