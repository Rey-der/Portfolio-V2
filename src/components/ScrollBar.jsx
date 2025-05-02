import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useScroll } from '../context/ScrollContext';

// Animation preset for the indicator - slower and smoother
const animations = {
  dot: { stiffness: 120, damping: 30, mass: 0.8 } // More inertia and smoother movement
};

// Define the correct section order
const SECTION_ORDER = ['home', 'projects', 'about', 'guestbook'];

// DEBUG: Store the last broadcast timestamp and sequence
let lastBroadcastTime = 0;
let broadcastCounter = 0;

const ScrollBar = () => {
  const { activeSection, registeredSections, scrollToSection } = useScroll();
  const [isHovered, setIsHovered] = useState(false);
  const barRef = useRef(null);
  const lastDetectedSectionRef = useRef(null);
  const lastNativeScrollY = useRef(0);
  
  // Track dot position for tick animations
  const dotY = useMotionValue(0);
  const [actualDotPosition, setActualDotPosition] = useState(0);
  const [prevDotPosition, setPrevDotPosition] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  
  // Get accurate scroll position (with fallbacks)
  const getScrollY = () => {
    return window._scrollY !== undefined ? 
           window._scrollY : 
           (window.scrollY || window.pageYOffset || document.documentElement.scrollTop);
  };
  
  // Detect which section we're currently viewing based on scroll position
  const detectCurrentSection = (scrollY) => {
    // Get all section elements
    const sections = document.querySelectorAll('#home, #projects, #about, #guestbook');
    if (!sections.length) return null;
    
    // Find which section we're currently in (add offset to improve detection)
    const viewportMiddle = scrollY + (window.innerHeight / 2);
    
    let bestSection = null;
    let minDistance = Infinity;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      // If we're within the section, prioritize it
      if (viewportMiddle >= sectionTop && viewportMiddle <= sectionBottom) {
        const distanceFromMiddle = Math.abs(viewportMiddle - (sectionTop + section.offsetHeight/2));
        if (distanceFromMiddle < minDistance) {
          minDistance = distanceFromMiddle;
          bestSection = section.id;
        }
      } else {
        // Otherwise calculate distance to section
        const distanceToSection = Math.min(
          Math.abs(viewportMiddle - sectionTop),
          Math.abs(viewportMiddle - sectionBottom)
        );
        if (distanceToSection < minDistance) {
          minDistance = distanceToSection;
          bestSection = section.id;
        }
      }
    });
    
    return bestSection;
  };
  
  // Enhanced scroll position broadcasting system with debugging
  const broadcastScrollPosition = (data) => {
    // Get timestamp for this broadcast
    const now = Date.now();
    broadcastCounter++;
    
    // CRITICAL FIX: Always get fresh scroll position directly from window
    const nativeScrollY = getScrollY();
    lastNativeScrollY.current = nativeScrollY;
    
    // If no specific section was provided and this is a native scroll, try to detect the section
    let detectedSection = data?.section || null;
    if (!detectedSection && (data?.source === 'native-scroll' || data?.source === 'rapid-scroll')) {
      detectedSection = detectCurrentSection(nativeScrollY);
      
      // Only update on section change to reduce noise
      if (detectedSection && detectedSection !== lastDetectedSectionRef.current) {
        lastDetectedSectionRef.current = detectedSection;
        
        console.log(`%c🧭 DETECTED SECTION CHANGE: ${detectedSection}`, 
          'background: #ff4081; color: white; padding: 2px 5px; border-radius: 3px;',
          {
            scrollY: nativeScrollY,
            previousSection: lastDetectedSectionRef.current
          }
        );
      }
    }
    
    // If we detected a section, get its target position
    let targetPosition = data?.target || null;
    if (detectedSection && !targetPosition) {
      const sectionElement = document.getElementById(detectedSection);
      if (sectionElement) {
        targetPosition = sectionElement.offsetTop;
        
        // ENHANCED: Only set target for native scroll when we're near a section boundary
        // to prevent constant targeting that fights with user scrolling
        if (data?.source === 'native-scroll' || data?.source === 'rapid-scroll') {
          const distanceToSection = Math.abs(nativeScrollY - targetPosition);
          
          // Only set a target position if we're within 200px of the section
          // This allows natural scrolling but helps with transitions near sections
          if (distanceToSection < 200) {
            console.log(`%c🎯 TARGET SET DURING NATIVE SCROLL: ${detectedSection}`, 
              'background: #8bc34a; color: white; padding: 2px 5px; border-radius: 3px;',
              {
                nativeY: Math.round(nativeScrollY),
                targetY: Math.round(targetPosition),
                diff: Math.round(distanceToSection)
              }
            );
          } else {
            // If we're far from section boundary, don't target to allow natural scrolling
            targetPosition = null;
          }
        }
      }
    }
    
    // Calculate timestamp difference for debugging
    const timeSinceLast = now - lastBroadcastTime;
    
    // Create a custom event with scroll position data
    const eventDetail = {
      // IMPORTANT: Always use the fresh native position 
      current: nativeScrollY,
      // Target position if being changed programmatically
      target: targetPosition,
      // The section being scrolled to
      section: detectedSection || activeSection,
      // Whether this is from the custom scrollbar
      source: data?.source || 'scrollbar',
      // Timestamp for animation sequencing
      timestamp: now,
      // DEBUG: Add sequence counter
      sequence: broadcastCounter,
      // DEBUG: Add custom data
      debug: {
        timeSinceLast,
        nativeScrollY,
        customTarget: targetPosition,
        diff: targetPosition !== null ? Math.abs(nativeScrollY - targetPosition) : 0
      }
    };
    
    const event = new CustomEvent('scroll-position-update', { 
      detail: eventDetail
    });
    
    // Broadcast to entire document
    document.dispatchEvent(event);
    
    // Store timestamp for next comparison
    lastBroadcastTime = now;
    
    // Enhanced debug logging with color coding
    console.log(
      `%c📢 SCROLL BROADCAST #${broadcastCounter}:`, 
      'background: #0084ff; color: white; padding: 2px 5px; border-radius: 3px;',
      {
        native: Math.round(nativeScrollY),
        target: targetPosition ? Math.round(targetPosition) : 'none',
        section: detectedSection || activeSection || 'none',
        source: data?.source || 'scrollbar',
        diff: targetPosition ? `${Math.round(Math.abs(nativeScrollY - targetPosition))}px` : 'n/a',
        time: new Date(now).toLocaleTimeString() + '.' + String(now % 1000).padStart(3, '0')
      }
    );
  };
  
  // Handler that broadcasts before scrolling
  const handleScrollToSection = (sectionId) => {
    // Find section element to get its position
    const sectionElement = document.getElementById(sectionId);
    const targetPosition = sectionElement?.offsetTop || 0;
    
    // Broadcast BEFORE modifying scroll position
    broadcastScrollPosition({
      section: sectionId,
      target: targetPosition,
      source: 'custom-click',
      scrollY: getScrollY() // Send current scroll position
    });
    
    console.log(`%c🔍 SCROLLING TO SECTION: ${sectionId}`, 
      'background: #ff9800; color: black; padding: 2px 5px; border-radius: 3px;',
      {
        target: targetPosition,
        current: getScrollY(),
        diff: Math.abs(getScrollY() - targetPosition)
      }
    );
    
    // Then perform the actual scroll
    scrollToSection(sectionId);
  };
  
  // Track active section changes directly from props
  useEffect(() => {
    if (!activeSection) return;
    
    // Find section element to get position
    const sectionElement = document.getElementById(activeSection);
    if (!sectionElement) {
      console.warn(`Section element not found: #${activeSection}`);
      return;
    }
    
    const targetPosition = sectionElement.offsetTop;
    
    console.log(`%c🔁 ACTIVE SECTION CHANGED TO ${activeSection}`, 
      'background: #e91e63; color: white; padding: 2px 5px; border-radius: 3px;', 
      {
        targetY: targetPosition,
        currentY: getScrollY(),
        diff: Math.abs(getScrollY() - targetPosition)
      }
    );
    
    // Broadcast this section change
    broadcastScrollPosition({
      section: activeSection,
      target: targetPosition,
      source: 'active-section-change',
      scrollY: getScrollY() // Send current scroll position
    });
    
  }, [activeSection]);
  
  // Listen for section change events from ScrollContext
  useEffect(() => {
    const handleSectionChange = (event) => {
      const section = event.detail?.section;
      if (!section) return;
      
      // Find section element to get its position
      const sectionElement = document.getElementById(section);
      if (!sectionElement) return;
      
      const targetPosition = sectionElement.offsetTop;
      
      // Log this event
      console.log(`%c🔄 SECTION CHANGE DETECTED: ${section}`, 
        'background: #4caf50; color: white; padding: 2px 5px; border-radius: 3px;',
        {
          targetY: targetPosition,
          currentY: getScrollY()
        }
      );
      
      // Broadcast the target position
      broadcastScrollPosition({
        section: section,
        target: targetPosition,
        source: 'section-change',
        scrollY: getScrollY() // Send current scroll position
      });
    };
    
    // Listen for section-change events
    document.addEventListener('section-change', handleSectionChange);
    
    return () => {
      document.removeEventListener('section-change', handleSectionChange);
    };
  }, []);
  
  // CRITICAL FIX: Track native scroll events with direct scroll position
  useEffect(() => {
    // Initialize scroll tracking
    const initializeScrollTracking = () => {
      // Initialize the global scroll tracker if it doesn't exist
      if (window._scrollY === undefined) {
        window._scrollY = getScrollY();
        window._scrollDirection = 'none';
        window._lastScrollY = getScrollY();
      }
    };
    
    // Set up initial values
    initializeScrollTracking();
    lastNativeScrollY.current = getScrollY();
    
    // More reliable scroll handler that directly reads from window
    const handleNativeScroll = () => {
      // Get the current scroll position directly
      const currentScrollY = getScrollY();
      
      // Update global tracking (used by other components)
      if (window._scrollY !== undefined) {
        window._lastScrollY = window._scrollY;
        window._scrollY = currentScrollY;
        window._scrollDirection = currentScrollY > window._lastScrollY ? 'down' : 'up';
      }
      
      // Only broadcast if it's been at least 16ms since last broadcast
      // to avoid flooding but keep motion smooth
      const now = Date.now();
      if (now - lastBroadcastTime < 16) return;
      
      // Skip if the scroll position hasn't changed
      if (Math.abs(currentScrollY - lastNativeScrollY.current) < 1) return;
      
      // ENHANCED: Check if we're rapidly scrolling
      const isRapidScroll = now - lastBroadcastTime < 100 && 
                          Math.abs(currentScrollY - lastNativeScrollY.current) > 50;
      
      // Update the ref with current position
      lastNativeScrollY.current = currentScrollY;
      
      // Detect current section when scrolling
      const currentSection = detectCurrentSection(currentScrollY);
      
      // Always pass in the current scroll position
      broadcastScrollPosition({
        section: currentSection,
        source: isRapidScroll ? 'rapid-scroll' : 'native-scroll',
        scrollY: currentScrollY // Explicitly pass current scroll position
      });
    };
    
    // Capture phase ensures we get it before other handlers
    window.addEventListener('scroll', handleNativeScroll, { 
      passive: true, 
      capture: true 
    });
    
    // Trigger an immediate update
    setTimeout(handleNativeScroll, 50);
    
    return () => {
      window.removeEventListener('scroll', handleNativeScroll, { capture: true });
    };
  }, []);
  
  // Add a periodic check to ensure we stay in sync with correct sections
  useEffect(() => {
    const syncInterval = setInterval(() => {
      // Get scroll position directly
      const currentScrollY = getScrollY();
      const currentSection = detectCurrentSection(currentScrollY);
      
      if (currentSection && currentSection !== lastDetectedSectionRef.current) {
        console.log(`%c⚠️ SECTION SYNC CORRECTION`, 
          'background: #f44336; color: white; padding: 2px 5px; border-radius: 3px;',
          {
            oldSection: lastDetectedSectionRef.current,
            newSection: currentSection,
            scrollY: currentScrollY
          }
        );
        
        lastDetectedSectionRef.current = currentSection;
        
        // Broadcast the corrected section
        broadcastScrollPosition({
          section: currentSection,
          source: 'sync-correction',
          scrollY: currentScrollY
        });
      }
    }, 2000);
    
    return () => {
      clearInterval(syncInterval);
    };
  }, []);
  
  // Filter and order sections according to the predefined order
  const orderedSections = registeredSections ? 
    SECTION_ORDER.filter(section => registeredSections.includes(section)) : [];
  
  // Calculate normalized current position (0-1)
  const sectionIndex = Math.max(0, orderedSections.indexOf(activeSection));
  const normalizedPosition = (orderedSections.length > 1) ? 
    sectionIndex / (orderedSections.length - 1) : 0;
    
  // Calculate actual pixel position for dot
  const dotTopPosition = `${10 + normalizedPosition * 80}%`;
  
  // Set initial dotY value if it's not set
  useEffect(() => {
    if (dotTopPosition) {
      dotY.set(dotTopPosition);
    }
  }, [dotTopPosition, dotY]);
  
  // Early return if no sections or just one section
  if (!registeredSections || registeredSections.length <= 1) return null;
  
  // Number of small ticks between major ticks
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
      {/* Major ticks */}
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
            onClick={() => handleScrollToSection(sectionId)}
            aria-label={`Go to ${sectionId} section`}
          />
        );
      })}
      
      {/* Small ticks */}
      {smallTicks.map((tick, index) => (
        <div
          key={`minor-${index}`}
          className="absolute"
          style={{ 
            top: `${10 + tick.position * 80}%`,
            right: '4px',
            height: '2px',
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
              onClick={() => handleScrollToSection(sectionId)}
            />
          );
        })}
      </div>
      
      {/* Moving dot */}
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