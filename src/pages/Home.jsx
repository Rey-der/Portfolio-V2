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

// --- Scroll Fade Configuration ---
// Adjust these values to control when the skyline starts and finishes fading out.
// Values are based on normalized scroll (0 = top, 1 = scrolled down by 500px, 2 = scrolled down by 1000px, etc.)
const FADE_OUT_START_SCROLL = 1; // Start fading when scrolled 60% of 500px (300px)
const FADE_OUT_END_SCROLL = 2.2;   // Fully faded out when scrolled 120% of 500px (600px)
// ---------------------------------

const Home = ({ registerWithURL }) => {
  const { sectionRef } = useSectionRegistration('home', registerWithURL);
  const mousePosition = useMousePosition();
  const isMobile = useDeviceDetection();
  const trianglePos = useTriangleAnimation(true, mousePosition, isMobile);
  const { currentLanguage } = useLanguage();
  const currentHomeText = getHomeText(currentLanguage) || homeText;
  const skylineRef = useRef(null);
  const mouseOffsetXRef = useRef(0); 
  const [layers, setLayers] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0); // Keep scrollY state for parallax and fade
  
  const { theme, toggleTheme: globalToggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevThemeRef = useRef(theme);
  
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useProgressiveLoading(['/src/pages/Projects.jsx']);
  
  // Calculate zoom factor based on window size
  const skylineZoom = useCallback(() => {
    const verySmallWidth = 480; 
    const smallWidth = 768;    
    const largeWidth = 1600;   
    
    const verySmallZoom = 300;  
    const smallZoom = 150;      
    const largeZoom = 100;      
    
    if (windowSize.width <= verySmallWidth) return verySmallZoom;
    
    if (windowSize.width <= smallWidth) {
      const ratio = (windowSize.width - verySmallWidth) / (smallWidth - verySmallWidth);
      return verySmallZoom - ratio * (verySmallZoom - smallZoom);
    }
    
    if (windowSize.width <= largeWidth) {
      const ratio = (windowSize.width - smallWidth) / (largeWidth - smallWidth);
      return smallZoom - ratio * (smallZoom - largeZoom);
    }
    
    return largeZoom;
  }, [windowSize.width]);
  
  // Calculate vertical position offset based on window size
  const skylineVerticalOffset = useCallback(() => {
    const verySmallWidth = 480; 
    const smallWidth = 768;     
    const largeWidth = 1600;    
    
    const verySmallOffset = -5;  
    const smallOffset = 0;       
    const largeOffset = 50;      
    
    if (windowSize.width <= verySmallWidth) return verySmallOffset;
    
    if (windowSize.width <= smallWidth) {
      const ratio = (windowSize.width - verySmallWidth) / (smallWidth - verySmallWidth);
      return verySmallOffset + ratio * (smallOffset - verySmallOffset);
    }
    
    if (windowSize.width <= largeWidth) {
      const ratio = (windowSize.width - smallWidth) / (largeWidth - smallWidth);
      return smallOffset + ratio * (largeOffset - smallOffset);
    }
    
    return largeOffset;
  }, [windowSize.width]);
  
  // Define updateLayerPositions - Includes vertical parallax
  const updateLayerPositions = useCallback(() => {
    if (!skylineRef.current || layers.length === 0) return;
    
    const lightLayers = skylineRef.current.querySelectorAll('.skyline-layer-light');
    const darkLayers = skylineRef.current.querySelectorAll('.skyline-layer-dark');
    
    if (lightLayers.length === 0 || darkLayers.length === 0) return;

    // Calculate scroll-based opacity
    let scrollOpacity = 1;
    if (scrollY >= FADE_OUT_START_SCROLL) {
      if (scrollY >= FADE_OUT_END_SCROLL) {
        scrollOpacity = 0;
      } else {
        scrollOpacity = 1 - (scrollY - FADE_OUT_START_SCROLL) / (FADE_OUT_END_SCROLL - FADE_OUT_START_SCROLL);
      }
    }
    // Ensure opacity is between 0 and 1
    scrollOpacity = Math.max(0, Math.min(1, scrollOpacity));
    
    for (let index = 0; index < layers.length; index++) {
      const layer = layers[index];
      const moveX = mouseOffsetXRef.current * layer.factor * 100;
      const moveY = -scrollY * layer.scrollFactor * 100; 

      // Calculate final opacity based on theme and scroll position
      const lightOpacity = isDarkMode ? 0 : scrollOpacity;
      const darkOpacity = isDarkMode ? scrollOpacity : 0;
      
      if (lightLayers[index]) {
        lightLayers[index].style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`; 
        lightLayers[index].style.backgroundSize = `${skylineZoom()}% auto`;
        lightLayers[index].style.backgroundPosition = `center calc(100% - ${skylineVerticalOffset()}%)`;
        lightLayers[index].style.opacity = lightOpacity; // Apply combined opacity
      }
      
      if (darkLayers[index]) {
        darkLayers[index].style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`; 
        darkLayers[index].style.backgroundSize = `${skylineZoom()}% auto`;
        darkLayers[index].style.backgroundPosition = `center calc(100% - ${skylineVerticalOffset()}%)`;
        darkLayers[index].style.opacity = darkOpacity; // Apply combined opacity
      }
    }
  }, [layers, scrollY, skylineZoom, skylineVerticalOffset, isDarkMode]); 

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []); 
  
  // Update layers when window size changes
  useEffect(() => {
    if (layers.length > 0) {
      updateLayerPositions();
    }
  }, [windowSize, layers, updateLayerPositions]);

  // Watch for changes in the global theme
  useEffect(() => {
    if (prevThemeRef.current !== theme) {
      prevThemeRef.current = theme;
      setIsTransitioning(true);
      
      // Update positions/opacity immediately based on new theme and current scroll
      updateLayerPositions(); 
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1000); // Match CSS transition duration
    }
  // Add updateLayerPositions to dependency array as it now depends on isDarkMode
  }, [theme, isDarkMode, updateLayerPositions]); 

  // Preload all images on mount
  useEffect(() => {
    const loadAllImages = () => {
      const imagePromises = [];
      
      ['light', 'dark'].forEach(mode => {
        for (let i = 1; i <= 7; i++) {
          const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(`Image ${i} (${mode}) loaded`);
            img.onerror = (e) => reject(`Failed to load image ${i} (${mode})`);
            img.src = `/Parallax/${mode}/${i}.png`;
          });
          imagePromises.push(promise);
        }
      });
      
      Promise.all(imagePromises)
        .then(() => setImagesLoaded(true))
        .catch(error => console.error('Error loading skyline images:', error));
    };
    
    loadAllImages();
  }, []); 

  // Set up parallax layers
  useEffect(() => {
    const skylineLayers = [
      { factor: 0.035, scrollFactor: 0.25 },  
      { factor: 0.030, scrollFactor: 0.20 },  
      { factor: 0.024, scrollFactor: 0.15 },
      { factor: 0.018, scrollFactor: 0.10 },
      { factor: 0.012, scrollFactor: 0.07 },
      { factor: 0.006, scrollFactor: 0.05 },
      { factor: 0.003, scrollFactor: 0.03 },  
    ];
    
    setLayers(skylineLayers);
  }, []); 

  // Scroll handler for vertical parallax and fade
  useEffect(() => {
    let ticking = false;
    let lastKnownScrollY = window.scrollY;

    const handleScroll = () => {
      lastKnownScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Normalize scroll position based on a 500px scroll range for effect calculation
          const normalizedScrollY = lastKnownScrollY / 500; 
          setScrollY(normalizedScrollY); // Update state for parallax and fade calculation

          // Update layer positions and opacity based on the new scrollY
          updateLayerPositions(); 

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial setup call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [updateLayerPositions]); // updateLayerPositions is now stable

  // Apply parallax effect (mouse movement ONLY)
  useEffect(() => {
    if (isMobile || layers.length === 0) return; 

    const handleMouseMove = (e) => {
      if (!skylineRef.current) return; 
      const centerX = window.innerWidth / 2;
      const mouseX = e.clientX;
      mouseOffsetXRef.current = (mouseX - centerX) / centerX; 
      updateLayerPositions(); // Update layers on mouse move
    };
    
    updateLayerPositions(); // Initial update
    
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

  // Calculate scroll-based opacity outside the loop for efficiency
  let scrollOpacity = 1;
  if (scrollY >= FADE_OUT_START_SCROLL) {
    if (scrollY >= FADE_OUT_END_SCROLL) {
      scrollOpacity = 0;
    } else {
      scrollOpacity = 1 - (scrollY - FADE_OUT_START_SCROLL) / (FADE_OUT_END_SCROLL - FADE_OUT_START_SCROLL);
    }
  }
  scrollOpacity = Math.max(0, Math.min(1, scrollOpacity)); // Clamp between 0 and 1

  return (
    <section
      ref={sectionRef}
      id="home"
      data-section="home"
      className="relative flex flex-col min-h-screen" 
      style={{
        scrollMarginTop: '120px',
        paddingBottom: '4rem',
        overflow: 'hidden' 
      }}
    >
      <style jsx="true">{`
        .skyline-layer-light, .skyline-layer-dark {
          /* Opacity transition is now handled directly via style prop for scroll fade */
          /* Keep other transitions */
          transition: transform 0.05s ease-out, background-size 0.3s ease-out, background-position 0.3s ease-out; 
        }
      `}</style>
      
      <SectionTriggers sectionId="home" />

      {/* City Skyline Container - Fixed positioning */}
      <div 
        ref={skylineRef}
        className="fixed bottom-0 left-0 right-0 overflow-hidden pointer-events-none" 
        style={{ 
          zIndex: -1, 
          height: '100vh', 
        }}
      >
        {layers.map((layer, index) => {
          // Calculate final opacity based on theme and scroll position
          const lightOpacity = isDarkMode ? 0 : scrollOpacity;
          const darkOpacity = isDarkMode ? scrollOpacity : 0;

          return (
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
                  opacity: lightOpacity, // Apply combined opacity
                  zIndex: layers.length - index,
                  // Add transition specifically for theme changes if needed, otherwise handled by direct style update
                  transition: isTransitioning ? 'opacity 0.8s ease-in-out' : 'none', 
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
                  opacity: darkOpacity, // Apply combined opacity
                  zIndex: layers.length - index,
                  // Add transition specifically for theme changes if needed
                  transition: isTransitioning ? 'opacity 0.8s ease-in-out' : 'none',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Flexbox for vertical centering */}
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
            zIndex: 3 
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
        <AnimatedSection className="text-center relative z-10"> 
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