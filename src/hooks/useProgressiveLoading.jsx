import { useEffect, useRef } from 'react';

/**
 * Hook that preloads components based on scroll position
 * @param {Array} componentPaths - Array of paths to components to preload
 */
const useProgressiveLoading = (componentPaths) => {
  const loadedPathsRef = useRef(new Set());
  
  useEffect(() => {
    if (!componentPaths || componentPaths.length === 0) return;
    
    const pathsToLoad = componentPaths.filter(path => !loadedPathsRef.current.has(path));
    if (pathsToLoad.length === 0) return;
    
    // Higher threshold (0.9 = 90%) to load later and reduce interference with scrolling
    const threshold = 0.9;
    let scrollTimeout;
    
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      
      // Set a new timeout to wait until scrolling stops
      scrollTimeout = setTimeout(() => {
        // Calculate how far user has scrolled down the page
        const scrollPosition = window.scrollY + window.innerHeight;
        const pageHeight = document.body.offsetHeight;
        const scrollRatio = scrollPosition / pageHeight;
        
        // scrolled past threshold, preload components
        if (scrollRatio > threshold) {
          console.log('Preloading components:', pathsToLoad);
          
          // Preload components
          pathsToLoad.forEach(path => {
            loadedPathsRef.current.add(path);
            import(/* @vite-ignore */ path).catch(err => {
              console.warn(`Preloading ${path} failed:`, err);
              loadedPathsRef.current.delete(path);
            });
          });
          
          // Remove scroll listener if all paths are loaded
          if (loadedPathsRef.current.size === componentPaths.length) {
            window.removeEventListener('scroll', handleScroll);
          }
        }
      }, 200); //debounce delay
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [componentPaths]);
};

export default useProgressiveLoading;