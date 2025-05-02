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

const Home = ({ registerWithURL }) => {
  const { sectionRef } = useSectionRegistration('home', registerWithURL);
  const mousePosition = useMousePosition();
  const isMobile = useDeviceDetection();
  const trianglePos = useTriangleAnimation(true, mousePosition, isMobile);
  const { currentLanguage } = useLanguage();
  const currentHomeText = getHomeText(currentLanguage) || homeText;
  const skylineRef = useRef(null);
  const cloakRef = useRef(null);
  const mouseOffsetXRef = useRef(0); // Store the mouse position persistently
  const [layers, setLayers] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [cloakHeight, setCloakHeight] = useState(0);
  const [cloakTop, setCloakTop] = useState(window.innerHeight);
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Add window size state
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
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
  
  // Define updateLayerPositions as a stable function using useCallback
  const updateLayerPositions = useCallback(() => {
    if (!skylineRef.current || layers.length === 0) return;
    
    const layerElements = skylineRef.current.querySelectorAll('.skyline-layer');
    layerElements.forEach((layer, index) => {
      if (index < layers.length) {
        // X movement from stored mouse position
        const moveX = mouseOffsetXRef.current * layers[index].factor * 100;
        
        // Y movement from scroll position
        const moveY = scrollY * layers[index].scrollFactor;
        
        // Apply both transforms
        layer.style.transform = `translate3d(${moveX}px, ${-moveY}px, 0)`;
        
        // Update background size based on window width
        layer.style.backgroundSize = `${skylineZoom()}% auto`;
        
        // UPDATED: Apply vertical position offset based on screen size
        const verticalOffset = skylineVerticalOffset();
        layer.style.backgroundPosition = `center calc(100% - ${verticalOffset}%)`;
      }
    });
  }, [layers, scrollY, skylineZoom, skylineVerticalOffset]);

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

  useProgressiveLoading(['/src/pages/Projects.jsx']);

  // Check for dark mode
  useEffect(() => {
    const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(document.documentElement.classList.contains('dark') || darkModeMedia.matches);
    
    const handleChange = (e) => {
      setIsDarkMode(document.documentElement.classList.contains('dark') || e.matches);
    };
    
    darkModeMedia.addEventListener('change', handleChange);
    
    // Also check if theme changes via class toggle
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      darkModeMedia.removeEventListener('change', handleChange);
      observer.disconnect();
    };
  }, []);

  // Preload images to ensure they're available
  useEffect(() => {
    const imagePromises = [];
    
    // Updated to 5 images instead of 6
    for (let i = 1; i <= 5; i++) {
      const promise = new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(`Image ${i} loaded`);
        img.onerror = () => reject(`Failed to load image ${i}`);
        img.src = `/Parallax/${i}.png`;
      });
      imagePromises.push(promise);
    }
    
    Promise.all(imagePromises)
      .then(() => {
        console.log('All skyline images loaded');
        setImagesLoaded(true);
      })
      .catch(error => {
        console.error('Error loading skyline images:', error);
      });
  }, []);

  // Set up parallax layers
  useEffect(() => {
    // Updated to 5 layers instead of 6, redistributed factors
    const skylineLayers = [
      { img: '/Parallax/1.png', factor: 0.005, scrollFactor: 0.02 },  // Farthest background (moves least)
      { img: '/Parallax/2.png', factor: 0.015, scrollFactor: 0.05 },
      { img: '/Parallax/3.png', factor: 0.025, scrollFactor: 0.11 }, 
      { img: '/Parallax/4.png', factor: 0.030, scrollFactor: 0.09 },
      { img: '/Parallax/5.png', factor: 0.035, scrollFactor: 0.10 },   // Closest foreground (moves most)
    ];
    setLayers(skylineLayers);
  }, []);

  // Position the cloak element based on the home section - ENHANCED FOR IMMEDIATE RESPONSE
  useEffect(() => {
    // Use requestAnimationFrame for smoother updates
    let ticking = false;
    let lastKnownScrollY = window.scrollY;
    
    const handleScroll = () => {
      lastKnownScrollY = window.scrollY;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateCloakPosition(lastKnownScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    const updateCloakPosition = (newScrollY) => {
      setScrollY(newScrollY);
      
      // Update the cloak position to create a hard border that moves UP when scrolling down
      if (sectionRef.current && cloakRef.current) {
        const homeSection = sectionRef.current;
        const homeSectionTop = homeSection.offsetTop;
        const homeSectionHeight = homeSection.offsetHeight;
        const homeSectionBottom = homeSectionTop + homeSectionHeight;
        
        // Make the cloak start with an offset above the home section bottom
        const cloakOffset = -115; 
        
        // Initial position (fixed at the bottom of home section)
        const initialCloakTop = homeSectionBottom - cloakOffset;
        
        // Calculate how far we've scrolled past the trigger point
        const triggerPoint = homeSectionBottom - window.innerHeight;
        const scrollPastTrigger = Math.max(0, newScrollY - triggerPoint);
        
        // Move cloak UP by SUBTRACTING from the initial position
        const newCloakTop = initialCloakTop - scrollPastTrigger;
        
        // DIRECT DOM MANIPULATION for immediate response
        cloakRef.current.style.top = `${newCloakTop}px`;
        cloakRef.current.style.height = `${document.documentElement.scrollHeight}px`;
        
        // Still update state for React's knowledge, but UI already updated
        setCloakTop(newCloakTop);
        setCloakHeight(document.documentElement.scrollHeight);
      }
      
      // Update layer positions
      if (skylineRef.current) {
        updateLayerPositions();
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Initial setup
    updateCloakPosition(lastKnownScrollY);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [updateLayerPositions]);

  // Apply parallax effect (mouse + scroll)
  useEffect(() => {
    if (!skylineRef.current || isMobile || layers.length === 0) return;

    // Make updateLayerPositions available globally for the scroll handler
    window.updateSkylineLayerPositions = updateLayerPositions;

    // Track mouse position and store it
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const mouseX = e.clientX;
      mouseOffsetXRef.current = (mouseX - centerX) / centerX; // Store in ref
      updateLayerPositions();
    };
    
    // Initial update
    updateLayerPositions();
    
    // Add event listener
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      delete window.updateSkylineLayerPositions;
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
      className="relative flex flex-col min-h-screen"
      style={{
        scrollMarginTop: '120px',
        paddingBottom: '4rem',
        overflow: 'hidden'
      }}
    >
      <SectionTriggers sectionId="home" />

      {/* City Skyline Parallax Container - Fixed position */}
      <div 
        ref={skylineRef}
        className="fixed bottom-0 left-0 right-0 overflow-hidden pointer-events-none"
        style={{ 
          zIndex: -1,
          height: '100vh',
        }}
      >
        {layers.map((layer, index) => (
          <div 
            key={`skyline-${index}`}
            className="skyline-layer absolute bottom-0 left-0 right-0"
            style={{
              height: '100%',
              backgroundImage: `url(${layer.img})`,
              backgroundSize: `${skylineZoom()}% auto`, // Dynamic sizing based on window width
              backgroundPosition: `center calc(100% - ${skylineVerticalOffset()}%)`, // UPDATED: dynamic vertical position
              backgroundRepeat: 'repeat-x',
              transition: 'transform 0.05s ease-out, background-size 0.3s ease-out, background-position 0.3s ease-out', // Added transition for position
              zIndex: index,
              opacity: 0.9
            }}
          />
        ))}

        {/* Gradient overlay for readability - stronger at top */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(var(--color-bg-rgb), 1) 0%, rgba(var(--color-bg-rgb), 0.8) 25%, rgba(var(--color-bg-rgb), 0.6) 50%, rgba(var(--color-bg-rgb), 0.3) 75%, rgba(var(--color-bg-rgb), 0) 100%)',
            zIndex: 5
          }}
        />
      </div>

      {/* The Invisibility Cloak - Now with direct DOM manipulation, no transition delay */}
      <div 
        ref={cloakRef}
        className="invisibility-cloak"
        style={{
          top: `${cloakTop}px`,
          height: `${cloakHeight}px`,
          backgroundColor: isDarkMode ? 'var(--background)' : 'var(--background)',
          boxShadow: isDarkMode 
            ? '0 -20px 30px var(--background)' 
            : '0 -20px 30px var(--background)',
          zIndex: 0,
          // Remove transition property for immediate updates
        }}
      />

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