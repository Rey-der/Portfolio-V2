import { useEffect, useRef } from 'react';

/**
 * Hook that preloads components based on scroll position
 * @param {Array} componentPaths - Array of paths to components to preload
 */
const useProgressiveLoading = (componentPaths) => {
  // Track which paths have been loaded to prevent multiple loading attempts
  const loadedPathsRef = useRef(new Set());
  
  useEffect(() => {
    // If no paths to load, exit early
    if (!componentPaths || componentPaths.length === 0) return;
    
    // Filter out already loaded paths
    const pathsToLoad = componentPaths.filter(path => !loadedPathsRef.current.has(path));
    if (pathsToLoad.length === 0) return;
    
    // Higher threshold (0.9 = 90%) to load later and reduce interference with scrolling
    const threshold = 0.9;
    
    // Debounce the scroll handler to improve performance
    let scrollTimeout;
    
    const handleScroll = () => {
      // Clear any pending timeout
      clearTimeout(scrollTimeout);
      
      // Set a new timeout to wait until scrolling stops
      scrollTimeout = setTimeout(() => {
        // Calculate how far user has scrolled down the page
        const scrollPosition = window.scrollY + window.innerHeight;
        const pageHeight = document.body.offsetHeight;
        const scrollRatio = scrollPosition / pageHeight;
        
        // If user has scrolled past threshold, preload components
        if (scrollRatio > threshold) {
          console.log('Preloading components:', pathsToLoad);
          
          // Preload components
          pathsToLoad.forEach(path => {
            // Mark as loaded before attempting import
            loadedPathsRef.current.add(path);
            
            // Using dynamic import to preload
            import(/* @vite-ignore */ path).catch(err => {
              console.warn(`Preloading ${path} failed:`, err);
              // Remove from loaded set if failed
              loadedPathsRef.current.delete(path);
            });
          });
          
          // Remove scroll listener if all paths are loaded
          if (loadedPathsRef.current.size === componentPaths.length) {
            window.removeEventListener('scroll', handleScroll);
          }
        }
      }, 200); // 200ms debounce delay
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [componentPaths]);
};

export default useProgressiveLoading;