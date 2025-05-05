import React, { useEffect, useRef, useState, useCallback } from 'react';
import AnimatedSection from '../components/AnimatedSection';
import useProgressiveLoading from '../hooks/useProgressiveLoading';
import useMousePosition from '../utils/useMousePosition';
import useTriangleAnimation from '../animations/AnimatedTriangle';
import useDeviceDetection from '../utils/useDeviceDetection';
import { homeText } from '../data/homeData';
import { getHomeText } from '../data/homeData';
import { useLanguage } from '../context/LanguageContext';
import useSectionRegistration from '../hooks/useSectionRegistration';
import SectionTriggers from '../components/SectionTriggers';
import { useTheme } from '../utils/useTheme'; // Import useTheme hook

const Home = ({ registerWithURL }) => {
  const { sectionRef } = useSectionRegistration('home', registerWithURL);
  const mousePosition = useMousePosition();
  const isMobile = useDeviceDetection();
  const trianglePos = useTriangleAnimation(true, mousePosition, isMobile);
  const { currentLanguage } = useLanguage();
  const currentHomeText = getHomeText(currentLanguage) || homeText;
  const skylineRef = useRef(null);
  // Removed cloakRef
  const mouseOffsetXRef = useRef(0); // Store the mouse position persistently
  const [layers, setLayers] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0); // Keep scrollY state for parallax
  // Removed cloakTop and cloakHeight state
  
  // Get theme from the global theme hook instead of maintaining local state
  const { theme, toggleTheme: globalToggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Store previous theme to detect changes
  const prevThemeRef = useRef(theme);
  
  // Add window size state
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useProgressiveLoading(['/src/pages/Projects.jsx']);
  
  // Calculate zoom factor based on window size - ENHANCED for very small screens
  const skylineZoom = useCallback(() => {
    // Add tier for very small screens (mobile phones)
    const verySmallWidth = 480; // Mobile breakpoint
    const smallWidth = 768;    // Tablet breakpoint
    const largeWidth = 1600;   // Desktop breakpoint
    
    const verySmallZoom = 300;  // Super zoomed in (mobile phones)
    const smallZoom = 150;      // More zoomed in (tablets)
    const largeZoom = 100;      // More zoomed out (desktops)
    
    // Very small screens (phones)
    if (windowSize.width <= verySmallWidth) return verySmallZoom;
    
    // Small screens (tablets)
    if (windowSize.width <= smallWidth) {
      // Smooth transition between very small and small
      const ratio = (windowSize.width - verySmallWidth) / (smallWidth - verySmallWidth);
      return verySmallZoom - ratio * (verySmallZoom - smallZoom);
    }
    
    // Medium screens (small desktops)
    if (windowSize.width <= largeWidth) {
      // Smooth transition between small and large
      const ratio = (windowSize.width - smallWidth) / (largeWidth - smallWidth);
      return smallZoom - ratio * (smallZoom - largeZoom);
    }
    
    // Large screens (large desktops)
    return largeZoom;
  }, [windowSize.width]);
  
  // Calculate vertical position offset based on window size - ENHANCED for very small screens
  const skylineVerticalOffset = useCallback(() => {
    const verySmallWidth = 480; // Mobile breakpoint
    const smallWidth = 768;     // Tablet breakpoint
    const largeWidth = 1600;    // Desktop breakpoint
    
    const verySmallOffset = -5;  // Slightly below bottom on very small screens to show more building
    const smallOffset = 0;       // At bottom for small screens
    const largeOffset = 50;      // Move up significantly for large screens
    
    // Very small screens - position slightly below bottom to show more building height
    if (windowSize.width <= verySmallWidth) return verySmallOffset;
    
    // Small screens (tablets)
    if (windowSize.width <= smallWidth) {
      // Smooth transition
      const ratio = (windowSize.width - verySmallWidth) / (smallWidth - verySmallWidth);
      return verySmallOffset + ratio * (smallOffset - verySmallOffset);
    }
    
    // Medium to large screens
    if (windowSize.width <= largeWidth) {
      const ratio = (windowSize.width - smallWidth) / (largeWidth - smallWidth);
      return smallOffset + ratio * (largeOffset - smallOffset);
    }
    
    // Very large screens
    return largeOffset;
  }, [windowSize.width]);
  
  // Define updateLayerPositions - Includes vertical parallax
  const updateLayerPositions = useCallback(() => {
    if (!skylineRef.current || layers.length === 0) return;
    
    const lightLayers = skylineRef.current.querySelectorAll('.skyline-layer-light');
    const darkLayers = skylineRef.current.querySelectorAll('.skyline-layer-dark');
    
    if (lightLayers.length === 0 || darkLayers.length === 0) return;
    
    // Process both sets of layers
    for (let index = 0; index < layers.length; index++) {
      const layer = layers[index];
      // X movement from stored mouse position
      const moveX = mouseOffsetXRef.current * layer.factor * 100;
      
      // Y movement from scroll position - negative value to move up when scrolling down
      const moveY = -scrollY * layer.scrollFactor * 100; // Vertical movement
      
      // Apply transforms to both light and dark layers
      if (lightLayers[index]) {
        lightLayers[index].style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`; 
        lightLayers[index].style.backgroundSize = `${skylineZoom()}% auto`;
        lightLayers[index].style.backgroundPosition = `center calc(100% - ${skylineVerticalOffset()}%)`;
      }
      
      if (darkLayers[index]) {
        darkLayers[index].style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`; 
        darkLayers[index].style.backgroundSize = `${skylineZoom()}% auto`;
        darkLayers[index].style.backgroundPosition = `center calc(100% - ${skylineVerticalOffset()}%)`;
      }
    }
  }, [layers, scrollY, skylineZoom, skylineVerticalOffset]); 

  // Removed updateCloakPosition function

  // Window resize handler - Only updates window size state now
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      // Removed cloak update call
    };
    
    window.addEventListener('resize', handleResize);
    // Removed initial cloak position call
    
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Removed updateCloakPosition dependency
  
  // Update layers when window size changes (for zoom/offset)
  useEffect(() => {
    if (layers.length > 0) {
      updateLayerPositions();
    }
  }, [windowSize, layers, updateLayerPositions]);

  // Important! Watch for changes in the global theme
  useEffect(() => {
    console.log('Global theme changed to:', theme);
    
    // Only act if the theme actually changed
    if (prevThemeRef.current !== theme) {
      console.log(`Theme changed from ${prevThemeRef.current} to ${theme}`);
      prevThemeRef.current = theme;
      
      // Start transition
      setIsTransitioning(true);
      
      // Force update opacity without relying on React state
      const lightLayers = skylineRef.current?.querySelectorAll('.skyline-layer-light');
      const darkLayers = skylineRef.current?.querySelectorAll('.skyline-layer-dark');
      
      if (lightLayers && darkLayers) {
        console.log('Directly modifying layer opacities for theme change');
        lightLayers.forEach(layer => {
          layer.style.transition = 'opacity 0.8s ease-in-out'; 
          layer.style.opacity = isDarkMode ? '0' : '1';
        });
        
        darkLayers.forEach(layer => {
          layer.style.transition = 'opacity 0.8s ease-in-out';
          layer.style.opacity = isDarkMode ? '1' : '0';
        });
      }
      
      // Reset transition flag after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
        console.log('Transition completed after theme change');
      }, 1000);
    }
  }, [theme, isDarkMode]);

  // Preload all images on mount (both dark and light)
  useEffect(() => {
    const loadAllImages = () => {
      const imagePromises = [];
      
      // Preload both dark and light mode images
      ['light', 'dark'].forEach(mode => {
        for (let i = 1; i <= 7; i++) {
          const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              console.log(`Image loaded: /Parallax/${mode}/${i}.png`);
              resolve(`Image ${i} (${mode}) loaded`);
            };
            img.onerror = (e) => {
              console.error(`Failed to load image: /Parallax/${mode}/${i}.png`, e);
              reject(`Failed to load image ${i} (${mode})`);
            };
            img.src = `/Parallax/${mode}/${i}.png`;
          });
          imagePromises.push(promise);
        }
      });
      
      Promise.all(imagePromises)
        .then(() => {
          console.log('All skyline images preloaded');
          setImagesLoaded(true);
        })
        .catch(error => {
          console.error('Error loading skyline images:', error);
        });
    };
    
    loadAllImages();
  }, []); // Only on mount - preload all images at once

  // Set up parallax layers with correct factors for proper depth perception
  useEffect(() => {
    // Keep scrollFactor for vertical parallax
    const skylineLayers = [
      { factor: 0.035, scrollFactor: 0.25 },  // Layer 1 - Closest/Front (moves most)
      { factor: 0.030, scrollFactor: 0.20 },  
      { factor: 0.024, scrollFactor: 0.15 },
      { factor: 0.018, scrollFactor: 0.10 },
      { factor: 0.012, scrollFactor: 0.07 },
      { factor: 0.006, scrollFactor: 0.05 },
      { factor: 0.003, scrollFactor: 0.03 },  // Layer 7 - Farthest/Back (moves least)
    ];
    
    setLayers(skylineLayers);
  }, []); // Only create once, not dependent on isDarkMode

  // Scroll handler for vertical parallax ONLY
  useEffect(() => {
    let ticking = false;
    let lastKnownScrollY = window.scrollY;

    const handleScroll = () => {
      lastKnownScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Calculate normalized scroll position for parallax effect
          const normalizedScrollY = lastKnownScrollY / 500; 
          setScrollY(normalizedScrollY); // Update state for parallax calculation

          // Removed cloak position update

          // Update layer positions based on the new scrollY
          updateLayerPositions(); 

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial setup call for parallax
    handleScroll(); 

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  // Removed updateCloakPosition dependency
  }, [updateLayerPositions]); 

  // Apply parallax effect (mouse movement ONLY) - Scroll is handled above
  useEffect(() => {
    if (isMobile || layers.length === 0) return; 

    const handleMouseMove = (e) => {
      if (!skylineRef.current) return; 
      const centerX = window.innerWidth / 2;
      const mouseX = e.clientX;
      mouseOffsetXRef.current = (mouseX - centerX) / centerX; 
      updateLayerPositions(); // Update layers on mouse move (includes X and Y now)
    };
    
    // Initial update for mouse position
    updateLayerPositions();
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [layers, isMobile, updateLayerPositions]); 

  useEffect(() => {
    if (window.location.pathname === '/' || window.location.pathname === '/home') {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      data-section="home"
      // Keep relative positioning on the section
      className="relative flex flex-col min-h-screen" 
      style={{
        scrollMarginTop: '120px',
        paddingBottom: '4rem',
        overflow: 'hidden' // Keep overflow hidden
      }}
    >
      {/* Fix: Changed jsx attribute from boolean to string */}
      <style jsx="true">{`
        .skyline-layer-light, .skyline-layer-dark {
          transition: opacity 0.8s ease-in-out, transform 0.05s ease-out, background-size 0.3s ease-out, background-position 0.3s ease-out;
        }
      `}</style>
      
      <SectionTriggers sectionId="home" />

      {/* City Skyline Container - Fixed positioning */}
      <div 
        ref={skylineRef}
        // Fixed positioning
        className="fixed bottom-0 left-0 right-0 overflow-hidden pointer-events-none" 
        style={{ 
          zIndex: -1, // Behind content
          height: '100vh', // Fixed height relative to viewport
        }}
      >
        {layers.map((layer, index) => (
          <div key={`skyline-group-${index}`} className="absolute inset-0">
            {/* Light mode layer */}
            <div 
              className="skyline-layer skyline-layer-light absolute bottom-0 left-0 right-0"
              style={{
                height: '100%',
                backgroundImage: `url(/Parallax/light/${index + 1}.png)`,
                backgroundSize: `${skylineZoom()}% auto`,
                backgroundPosition: `center calc(100% - ${skylineVerticalOffset()}%)`,
                backgroundRepeat: 'repeat-x',
                opacity: isDarkMode ? 0 : 1,
                zIndex: layers.length - index  // Correct z-index
              }}
            />
            
            {/* Dark mode layer */}
            <div 
              className="skyline-layer skyline-layer-dark absolute bottom-0 left-0 right-0"
              style={{
                height: '100%',
                backgroundImage: `url(/Parallax/dark/${index + 1}.png)`,
                backgroundSize: `${skylineZoom()}% auto`,
                backgroundPosition: `center calc(100% - ${skylineVerticalOffset()}%)`,
                backgroundRepeat: 'repeat-x',
                opacity: isDarkMode ? 1 : 0,
                zIndex: layers.length - index  // Correct z-index
              }}
            />
          </div>
        ))}
      </div>

      {/* REMOVED The Invisibility Cloak element */}
      {/* <div 
        ref={cloakRef}
        style={{ ... }}
      /> */}

      {/* Flexbox for vertical centering - Ensure it's above the fixed skyline */}
      <div className="flex-1 flex flex-col items-center justify-center" style={{ marginTop: '-80px', position: 'relative', zIndex: 2 }}>
        {/* Decorative Triangle */}
        <div
          className="absolute pointer-events-none"
          style={{
            transform: `translate(-50%, -85%) translate(${trianglePos.x / 7}px, ${trianglePos.y / 7}px) rotate(${trianglePos.x * 0.08}deg)`,
            left: '50%',
            top: '45%',
            width: '300px',
            height: '300px',
            transition: isMobile ? 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
            zIndex: 3 // Above main content
          }}
        >
          <svg width="100%" height="150%" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M150 20L280 260H20L150 20Z"
              className="fill-primary/40 dark:fill-primary/50 stroke-primary stroke-[3]"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(var(--color-primary-rgb), 0.3))'
              }}
            />
          </svg>
        </div>

        {/* Content section */}
        <AnimatedSection className="text-center relative z-10"> {/* Ensure content has z-index */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{currentHomeText.welcomeTitle}</h1>
          <p className="text-xl md:text-2xl mt-4 max-w-2xl mx-auto">
            {currentHomeText.welcomeSubtitle}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Home;