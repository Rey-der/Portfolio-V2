import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProjectCard from './ProjectCard';
import ProgressBar from './ProgressBar';
import useSideScroll from '../utils/useSideScroll';

// Animation and layout configuration
const ANIMATION_SETTINGS = {
  cardWidth: 400,
  spacing: 15,
  autoplayInterval: 5000,
  scrollCooldown: 800,
  swipeThreshold: 10000,
  autoPlayResetDelay: 5000,
  snapBackDelay: 300,       
  snapDecisionThreshold: 0.25,  
  cardAnimation: {
    spring: { stiffness: 150, damping: 20, mass: 0.8 }
  },
  // Specific animation for partial scrolling
  partialAnimation: {
    transition: { type: "spring", stiffness: 300, damping: 30, mass: 0.5 }
  },
  // Animation for snapping back
  snapBackAnimation: {
    transition: { type: "spring", stiffness: 400, damping: 35, mass: 0.6 }
  },
  // NEW: Dedicated flick animation settings
  flickAnimation: {
    transition: { type: "spring", stiffness: 200, damping: 22, mass: 0.6 }
  }
};

// Navigation button component
const NavButton = ({ direction, onClick }) => {
  const isNext = direction === 'next';
  const Icon = isNext ? FaChevronRight : FaChevronLeft;
  
  return (
    <motion.button
      onClick={onClick}
      className="bg-white dark:bg-slate-700 rounded-full p-2 shadow-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors flex items-center justify-center"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`${isNext ? 'Next' : 'Previous'} project`}
    >
      <Icon className="text-slate-800 dark:text-white" />
    </motion.button>
  );
};

// Side navigation area component
const CarouselSideNav = ({ side, onClick, onHoverChange }) => {
  const isLeft = side === 'left';
  
  const styles = {
    position: isLeft
      ? { top: '17%', bottom: '4%', left: '-4%', width: '30%', transform: 'translateX(0)' }
      : { top: '17%', bottom: '4%', right: '-4%', width: '30%' },
  };

  return (
    <div 
      className={`absolute ${isLeft ? 'left-0' : 'right-0'} top-0 bottom-0 cursor-pointer z-10 flex items-center ${isLeft ? 'justify-start pl-4' : 'justify-end pr-4'} transition-colors`}
      style={styles.position}
      onClick={onClick}
      onMouseEnter={() => onHoverChange(isLeft ? 'left' : 'right')}
      onMouseLeave={() => onHoverChange(null)}
      aria-label={`${isLeft ? 'Previous' : 'Next'} project`}
    >
      {/* Visible Debug Area */}
      {/* <div className="absolute top-0 left-0 w-full h-full bg-blue-200 opacity-25 pointer-events-none" aria-hidden="true"/> */}
    </div>
  );
};

const ProjectCarousel = ({ projects }) => {
  // Return early for empty or single project cases
  if (projects.length === 0) return null;
  if (projects.length === 1) {
    return (
      <div className="w-full flex justify-center py-10">
        <div className="w-full max-w-xl">
          <ProjectCard {...projects[0]} isActive={true} />
        </div>
      </div>
    );
  }

  // State management
  const [carouselState, setCarouselState] = useState({
    currentIndex: 0,
    prevIndex: 0,
    direction: 0,
    hoveredSide: null,
  });
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [isPartialScrolling, setIsPartialScrolling] = useState(false); 
  const [isSnappingBack, setIsSnappingBack] = useState(false);
  // NEW: Track the last flick animation time to prevent overlapping animations
  const lastFlickAnimationRef = useRef(Date.now() - 1000);
  
  const autoPlayRef = useRef(null);
  const snapBackTimeoutRef = useRef(null);
  const lastProgressChangeRef = useRef(Date.now());
  
  const { currentIndex, direction, hoveredSide } = carouselState;
  const visibleCards = Math.min(5, projects.length);
  const wrappingThreshold = visibleCards / 2;
  
  // User interaction handlers
  const handleUserInteraction = useCallback(() => {
    setLastInteraction(Date.now());
    setIsAutoPlaying(false);
    
    // NEW: Clear any pending snap back when user interacts
    if (snapBackTimeoutRef.current) {
      clearTimeout(snapBackTimeoutRef.current);
      snapBackTimeoutRef.current = null;
    }
  }, []);
  
  const goToSlide = useCallback((index) => {
    handleUserInteraction();
    setCarouselState(prev => ({
      ...prev,
      prevIndex: prev.currentIndex,
      currentIndex: index,
      direction: index > prev.currentIndex ? 1 : -1,
    }));
  }, [handleUserInteraction]);

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % projects.length);
  }, [currentIndex, goToSlide, projects.length]);

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + projects.length) % projects.length);
  }, [currentIndex, goToSlide, projects.length]);
  
  const handleSideHover = useCallback((side) => {
    handleUserInteraction();
    setCarouselState(prev => ({ ...prev, hoveredSide: side }));
  }, [handleUserInteraction]);

  // Auto-play management
  useEffect(() => {
    const checkAutoResume = () => {
      const now = Date.now();
      if (!isAutoPlaying && (now - lastInteraction > ANIMATION_SETTINGS.autoPlayResetDelay)) {
        setIsAutoPlaying(true);
      }
    };
    const resumeInterval = setInterval(checkAutoResume, 1000);
    return () => clearInterval(resumeInterval);
  }, [isAutoPlaying, lastInteraction]);
  
  // Auto-play effect
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(nextSlide, ANIMATION_SETTINGS.autoplayInterval);
    } else if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, nextSlide]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handleUserInteraction();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        handleUserInteraction();
        nextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, handleUserInteraction]);

  // Use the custom hook for swipe/scroll behavior
  const { containerRef, partialProgress, isFlickTransition, flickDirection } = useSideScroll({
    onNext: () => {
      handleUserInteraction();
      nextSlide();
      // NEW: Track the last flick animation time
      lastFlickAnimationRef.current = Date.now();
    },
    onPrev: () => {
      handleUserInteraction();
      prevSlide();
      // NEW: Track the last flick animation time
      lastFlickAnimationRef.current = Date.now();
    },
    onContinuousScrollEnd: (delta) => {
      if (delta > 0) {
        handleUserInteraction();
        nextSlide();
        // NEW: Track the last flick animation time
        lastFlickAnimationRef.current = Date.now();
      } else if (delta < 0) {
        handleUserInteraction();
        prevSlide();
        // NEW: Track the last flick animation time
        lastFlickAnimationRef.current = Date.now();
      }
    },
    threshold: 150,
    dampening: 0.15,
    cooldown: ANIMATION_SETTINGS.scrollCooldown,
    enablePartialSlide: true,
    swipeSpeeds: {
      slowIntentional: 0.45,
      singleContinuous: 0.10,
      standardContinuousBase: 0.05,
      regularSwipe: 0.12,
      translationFactorSingle: 0.35,
      translationFactorOther: 0.4,
      slowScrollThreshold: 10
    }
  });

  // IMPROVED: Enhanced partial progress monitoring with better coordination for flick transitions
  useEffect(() => {
    const now = Date.now();
    
    // If partial progress changed, update the last change time
    if (partialProgress !== 0) {
      lastProgressChangeRef.current = now;
      setIsPartialScrolling(true);
      
      // Clear any existing snap back timeout when progress changes
      if (snapBackTimeoutRef.current) {
        clearTimeout(snapBackTimeoutRef.current);
        snapBackTimeoutRef.current = null;
      }
      
      // Only set snap back timeout if we're not in a flick transition
      // This prevents competing animations during fast flicks
      if (!isFlickTransition) {
        // Set a new timeout to check if scrolling has stopped
        snapBackTimeoutRef.current = setTimeout(() => {
          // Don't snap back if a flick animation recently happened
          const timeSinceLastFlick = Date.now() - lastFlickAnimationRef.current;
          if (timeSinceLastFlick < 300) {
            return;
          }
          
          // Only proceed if we're still in a partial state
          if (Math.abs(partialProgress) > 0.05) {
            setIsSnappingBack(true);
            
            // Decide whether to snap to next/prev or back to current
            if (Math.abs(partialProgress) > ANIMATION_SETTINGS.snapDecisionThreshold) {
              // Snap to next/prev
              if (partialProgress > 0) {
                nextSlide();
              } else {
                prevSlide();
              }
            } else {
              // Force a re-render to snap back to current position with animation
              setIsPartialScrolling(false);
            }
            
            // Reset snapping state after animation completes
            setTimeout(() => {
              setIsSnappingBack(false);
            }, 300);
          }
        }, ANIMATION_SETTINGS.snapBackDelay);
      }
    } else {
      // Small delay before turning off partial scrolling to prevent jumps
      // Use a longer delay if we're in a flick transition to prevent competing animations
      const timer = setTimeout(() => {
        setIsPartialScrolling(false);
      }, isFlickTransition ? 100 : 50);
      return () => clearTimeout(timer);
    }
    
    // Clean up timeout on unmount
    return () => {
      if (snapBackTimeoutRef.current) {
        clearTimeout(snapBackTimeoutRef.current);
      }
    };
  }, [partialProgress, nextSlide, prevSlide, isFlickTransition]); // Added isFlickTransition as dependency
  
  // Card positioning calculation with enhanced partial scroll support
  const calculateCardProps = (index) => {
    let position = index - currentIndex;
    // Handle wrapping for circular carousel
    if (position > projects.length / 2) {
      position -= projects.length;
    } else if (position < -projects.length / 2) {
      position += projects.length;
    }
    
    const distanceFromCenter = Math.abs(position);
    
    // Calculate the partial slide effect
    // This determines how much each card needs to move based on partial progress
    const partialEffect = partialProgress * (position === 0 ? -1 : position > 0 ? -0.7 : 0.7);
    
    // Base card properties with improved partial scroll handling
    let cardProps = {
      // Enhanced translateX formula that adjusts all visible cards during partial scrolling
      translateX: (position + partialEffect) * (ANIMATION_SETTINGS.cardWidth + ANIMATION_SETTINGS.spacing),
      // Rotate cards smoothly during partial scrolling
      rotateY: position * 15 + (partialEffect * 5),
      // Scale adjusts slightly during partial scrolling for a more fluid feel
      scale: 1 - distanceFromCenter * 0.1 - (Math.abs(partialEffect) * 0.03),
      z: -distanceFromCenter * 50,
      opacity: 1,
      yOffset: 0,
      isActiveCard: position === 0 && Math.abs(partialProgress) < 0.3,
      isAdjacent: position === -1 || position === 1 || 
                 (position === 0 && Math.abs(partialProgress) > 0.3),
      isSideHovered: (hoveredSide === 'left' && position === -1) || 
                     (hoveredSide === 'right' && position === 1)
    };
    
    // Adjust properties based on distance from center
    if (distanceFromCenter <= 1) {
      // Smoother transition for Y-offset during partial scrolling
      cardProps.yOffset = distanceFromCenter === 0 ? 
                        Math.abs(partialProgress) * 15 : // Center card rises/falls with partial progress
                        30 - Math.abs(partialEffect) * 15; // Adjacent cards do the opposite
    } else {
      cardProps.opacity = Math.max(0, 0.7 - (distanceFromCenter - 1) * 0.7);
      
      // Special case for cards moving into view - enhanced with partial scrolling
      const isMovingInward = (direction > 0 && position === -2) || (direction < 0 && position === 2);
      if (isMovingInward || Math.abs(partialProgress) > 0.3) {
        // Boost opacity for cards that are becoming visible during partial scrolls
        cardProps.opacity = Math.max(cardProps.opacity, Math.abs(partialProgress) * 0.7);
      }
      
      cardProps.yOffset = distanceFromCenter === 2 ? 20 : 10;
    }
    
    // Handle cards beyond visible threshold with fan-out effect
    if (distanceFromCenter > wrappingThreshold - 1) {
      const fanOutFactor = distanceFromCenter - (wrappingThreshold - 1);
      cardProps.rotateY = position < 0 ? -40 - fanOutFactor * 30 : 40 + fanOutFactor * 30;
      cardProps.z -= 150 + fanOutFactor * 120;
      cardProps.scale *= (0.8 - fanOutFactor * 0.15);
      cardProps.opacity = Math.min(cardProps.opacity, 0.3);
    }
    
    return cardProps;
  };

  return (
    <div
      className="relative w-full mb-16 py-8"
      ref={containerRef}
      style={{ 
        perspective: '1200px',
        // Add these properties to prevent scroll interference:
        touchAction: 'pan-y', // Allow vertical scrolling to pass through
        overscrollBehavior: 'none' // Prevent overscroll effects
      }}
      onMouseEnter={handleUserInteraction}
      onMouseLeave={() => setIsAutoPlaying(true)}
      // Add this data attribute to help debugging
      data-scroll-container="projects-carousel"
    >
      <div className="relative h-[450px] w-full mx-auto flex items-center justify-center" 
           style={{ transformStyle: 'preserve-3d' }}>
        {/* Side navigation areas */}
        <CarouselSideNav 
          side="left" 
          onClick={prevSlide} 
          onHoverChange={(side) => {
            if (side) handleUserInteraction();
            handleSideHover(side);
          }} 
        />
        <CarouselSideNav 
          side="right" 
          onClick={nextSlide} 
          onHoverChange={(side) => {
            if (side) handleUserInteraction();
            handleSideHover(side);
          }} 
        />
        
        {/* Project cards with enhanced partial scroll behavior */}
        {projects.map((project, index) => {
          const cardProps = calculateCardProps(index);
          return (
            <motion.div
              key={project.id || index}
              className="absolute"
              style={{
                width: `${ANIMATION_SETTINGS.cardWidth}px`,
                height: '400px',
                transformStyle: 'preserve-3d',
                transformOrigin: 'center',
                cursor: cardProps.isActiveCard ? 'default' : 'pointer',
                pointerEvents: cardProps.opacity < 0.5 ? 'none' : 'auto',
                zIndex: cardProps.isActiveCard ? 20 : 5,
              }}
              initial={false}
              animate={{
                x: cardProps.translateX,
                y: cardProps.yOffset,
                z: cardProps.z,
                rotateY: cardProps.rotateY,
                scale: cardProps.scale,
                opacity: cardProps.opacity,
              }}
              // IMPROVED: Better animation settings for flick transitions
              transition={
                isFlickTransition
                  ? {
                      // Use dedicated flick animation settings
                      ...ANIMATION_SETTINGS.flickAnimation.transition,
                      // Use absolute velocity value and scale by direction
                      // This creates more consistent momentum
                      velocity: flickDirection * Math.min(Math.abs(partialProgress * 8), 4)
                    }
                  : isSnappingBack
                    ? ANIMATION_SETTINGS.snapBackAnimation.transition
                    : isPartialScrolling
                      ? ANIMATION_SETTINGS.partialAnimation.transition
                      : ANIMATION_SETTINGS.cardAnimation.spring
              }
              onClick={() => {
                if (!cardProps.isActiveCard) {
                  handleUserInteraction();
                  goToSlide(index);
                }
              }}
            >
              <div className="h-full">
                <ProjectCard 
                  {...project} 
                  isActive={cardProps.isActiveCard} 
                  isAdjacent={cardProps.isAdjacent}
                  isSideHovered={cardProps.isSideHovered}
                  buttonsDisabled={!cardProps.isActiveCard}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom navigation */}
      <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-4">
        <NavButton direction="prev" onClick={prevSlide} />
        
        <ProgressBar 
          currentIndex={currentIndex} 
          total={projects.length} 
          onChange={goToSlide} 
        />
        
        <NavButton direction="next" onClick={nextSlide} />
      </div>
      
      <div 
        className="w-full h-8" 
        id="projects-end-marker" 
        aria-hidden="true"
        style={{ marginBottom: '40px' }}
      />
    </div>
  );
};

export default ProjectCarousel;