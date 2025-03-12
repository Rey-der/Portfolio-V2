import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useScroll } from '../context/ScrollContext';

// Animation preset for the indicator - slower and smoother
const animations = {
  dot: { stiffness: 120, damping: 30, mass: 0.8 } // More inertia and smoother movement
};

// Define the correct section order
const SECTION_ORDER = ['home', 'projects', 'about', 'guestbook'];

const ScrollBar = () => {
  const { activeSection, registeredSections, scrollToSection } = useScroll();
  const [isHovered, setIsHovered] = useState(false);
  const barRef = useRef(null);
  
  // Track dot position for tick animations
  const dotY = useMotionValue(0);
  const [actualDotPosition, setActualDotPosition] = useState(0);
  const [prevDotPosition, setPrevDotPosition] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  
  // Hide default scrollbar with CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      body::-webkit-scrollbar {
        width: 0px; /* Hide default scrollbar in webkit browsers */
      }
      body {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Track dot's actual position for tick animations
  useEffect(() => {
    const unsubscribe = dotY.onChange(v => {
      // Parse the percentage value to get a normalized position
      if (typeof v === 'string' && v.endsWith('%')) {
        const percentage = parseFloat(v) / 100;
        const normalizedPos = (percentage - 0.1) / 0.8; // Convert from 10%-90% to 0-1
        
        // Track movement - detect when dot is moving
        if (Math.abs(normalizedPos - prevDotPosition) > 0.001) {
          setIsMoving(true);
          // Reset movement detection after a delay
          clearTimeout(window.dotMovementTimeout);
          window.dotMovementTimeout = setTimeout(() => {
            setIsMoving(false);
          }, 300); // Allow animation to settle
        }
        
        setPrevDotPosition(normalizedPos);
        setActualDotPosition(normalizedPos);
      } else {
        // Fallback for pixel values
        const containerHeight = window.innerHeight;
        const normalizedPos = (v - (containerHeight * 0.1)) / (containerHeight * 0.8);
        setActualDotPosition(normalizedPos);
      }
    });
    
    return () => {
      unsubscribe();
      clearTimeout(window.dotMovementTimeout);
    };
  }, [dotY, prevDotPosition]);
  
  // Filter and order sections according to the predefined order
  const orderedSections = registeredSections ? 
    SECTION_ORDER.filter(section => registeredSections.includes(section)) : [];
  
  // Calculate normalized current position (0-1)
  const sectionIndex = Math.max(0, orderedSections.indexOf(activeSection));
  const normalizedPosition = (orderedSections.length > 1) ? 
    sectionIndex / (orderedSections.length - 1) : 0;
    
  // Calculate actual pixel position for dot
  const dotTopPosition = `${10 + normalizedPosition * 80}%`;
  
  // Set initial dotY value if it's not set - MOVED BEFORE CONDITIONAL RETURN
  useEffect(() => {
    if (dotTopPosition) {
      dotY.set(dotTopPosition);
    }
  }, [dotTopPosition, dotY]);
  
  // Early return if no sections or just one section
  if (!registeredSections || registeredSections.length <= 1) return null;
  
  // Number of small ticks between major ticks - increased for more visual detail
  const smallTicksPerSegment = 5;
  
  // Function to calculate tick styles based on proximity to the actual dot position
  const getTickStyles = (tickPosition) => {
    // Use actual dot position for animations
    const distance = Math.abs(actualDotPosition - tickPosition);
    const maxDistanceEffect = 0.25; // Wider range of effect for more visible animations
    
    if (distance < maxDistanceEffect) {
      const growthFactor = 1 - (distance / maxDistanceEffect);
      // Use ease-out sine curve for natural growth
      const easedGrowth = Math.sin(growthFactor * Math.PI/2);
      
      // Calculate position offset for sliding in from right
      const slideInOffset = isMoving ? (1 - easedGrowth) * 30 : 0; 
      
      // For lines, we'll use width as the length of the line
      const width = 2 + (easedGrowth * 22); // 2px to 24px
      
      // Height will now be the line thickness
      const height = 2;
      
      return {
        width,
        height,
        opacity: 0.4 + (easedGrowth * 0.6), // Higher base opacity
        transform: `translateX(${slideInOffset}px)`, // Slide in from right when moving
        transitionDuration: isMoving ? '0.2s' : '0.8s' // Faster transition in, slower transition out
      };
    }
    
    return {
      width: 2, // Default width
      height: 2, // Default height (thickness)
      opacity: 0.2,
      transform: 'translateX(30px)', // Hidden off to the right
      transitionDuration: '0.8s'
    };
  };
  
  // Generate small ticks data
  const generateSmallTicks = () => {
    if (orderedSections.length <= 1) return [];
    
    const ticks = [];
    
    for (let i = 0; i < orderedSections.length - 1; i++) {
      const startPos = i / (orderedSections.length - 1);
      const endPos = (i + 1) / (orderedSections.length - 1);
      const segmentHeight = endPos - startPos;
      
      for (let j = 1; j <= smallTicksPerSegment; j++) {
        const relativePosition = j / (smallTicksPerSegment + 1);
        const tickPosition = startPos + (segmentHeight * relativePosition);
        
        ticks.push({
          position: tickPosition,
          styles: getTickStyles(tickPosition)
        });
      }
    }
    
    return ticks;
  };
  
  const smallTicks = generateSmallTicks();

  return (
    <motion.div 
      className="fixed right-0 top-0 bottom-0 h-screen z-50"
      style={{ 
        width: '30px',
      }}
      initial={{ opacity: 0.3 }}
      animate={{ opacity: isHovered ? 0.9 : 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{ duration: 0.3 }}
    >
      {/* Major ticks (big lines at each position) */}
      {orderedSections.map((sectionId, index) => {
        const position = (orderedSections.length > 1) ? 
          index / (orderedSections.length - 1) : 0.5;
          
        const isActive = sectionId === activeSection;
        
        return (
          <div
            key={`major-${index}`}
            className="absolute right-0 cursor-pointer"
            style={{ 
              top: `${10 + position * 80}%`,
              width: isActive ? '14px' : '12px',
              height: isActive ? '3px' : '2px',
              right: '4px',
              transform: 'translateY(-50%)',
              backgroundColor: isActive ? 
                'rgb(59, 130, 246)' : 'rgb(107, 114, 128)',
              opacity: isActive ? 1 : 0.7,
              transition: 'width 0.3s, height 0.3s'
            }}
            onClick={() => scrollToSection(sectionId)}
            aria-label={`Go to ${sectionId} section`}
          />
        );
      })}
      
      {/* Small ticks between positions - now as animated lines that slide in */}
      {smallTicks.map((tick, index) => (
        <div
          key={`minor-${index}`}
          className="absolute"
          style={{ 
            top: `${10 + tick.position * 80}%`,
            right: '4px',
            height: '2px', // Fixed height for line thickness
            transform: 'translateY(-50%)',
            overflow: 'visible'
          }}
        >
          <div 
            className="bg-gray-400 dark:bg-gray-500"
            style={{
              width: tick.styles.width,
              height: tick.styles.height,
              opacity: tick.styles.opacity,
              transform: tick.styles.transform,
              transition: `all ${tick.styles.transitionDuration} ease-out`,
              position: 'absolute',
              right: '0',
              borderRadius: '1px'
            }}
          />
        </div>
      ))}
      
      {/* Clickable areas */}
      <div className="absolute inset-0">
        {orderedSections.map((sectionId, index) => {
          const isFirst = index === 0;
          const isLast = index === orderedSections.length - 1;
          const segmentHeight = 80 / (orderedSections.length);
          const marginTop = isFirst ? 10 : 10 + segmentHeight/2;
          const height = isFirst || isLast ? 
            segmentHeight/2 : segmentHeight;
          
          return (
            <div
              key={`segment-${index}`}
              className="absolute right-0 w-full cursor-pointer"
              style={{ 
                top: `${marginTop + (index * segmentHeight)}%`,
                height: `${height}%`,
              }}
              onClick={() => scrollToSection(sectionId)}
            />
          );
        })}
      </div>
      
      {/* Moving dot - with position tracking for tick animations */}
      <motion.div
        className="absolute right-4 z-10"
        style={{ 
          transform: 'translate(50%, -50%)',
          width: isHovered ? '8px' : '6px',
          height: isHovered ? '8px' : '6px',
          borderRadius: '50%',
          backgroundColor: activeSection ? 'rgb(59, 130, 246)' : 'rgb(107, 114, 128)',
          opacity: isHovered ? 1 : 0.8,
          transition: 'width 0.2s, height 0.2s, opacity 0.2s',
        }}
        initial={{ top: dotTopPosition }}
        animate={{ 
          top: dotTopPosition
        }}
        transition={{ 
          type: 'spring', 
          ...animations.dot,
          duration: 0.8
        }}
        onUpdate={(latest) => {
          if (latest.top) {
            dotY.set(latest.top);
          }
        }}
      />
    </motion.div>
  );
};

export default ScrollBar;