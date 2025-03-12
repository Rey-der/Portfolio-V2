import { useState, useRef, useEffect, useCallback } from 'react';

const useSideScroll = ({
  // Callbacks
  onNext,
  onPrev,
  onContinuousScrollEnd,
  
  // Main configuration parameters (adjust these for different behaviors)
  threshold = 150,          // How far to scroll before triggering next/prev
  dampening = 0.15,         // Base dampening factor
  cooldown = 600,           // Milliseconds to wait before allowing another scroll action
  enablePartialSlide = true, // Enable smooth partial sliding between cards
  
  // Fine-tuning parameters (all adjustable in one place)
  swipeSpeeds = {
    slowIntentional: 0.45,           // Factor for intentional slow movements
    singleContinuous: 0.50,          // Factor for continuous single-direction scrolling
    standardContinuousBase: 0.05,    // Base factor for standard scroll movement
    regularSwipe: 0.12,              // Factor for regular swipe sensitivity
    translationFactorSingle: 0.1,    // Translation factor for single direction
    translationFactorOther: 0.4,     // Secondary translation factor
    slowScrollThreshold: 7           // Threshold to determine slow scrolling for gesture recognition only
  },
  
  // Maximum accumulated momentum to prevent overflow during rapid wiggling
  maxAccumulatedDelta = 300,         // Maximum value for accumulatedDeltaX (positive or negative)
  
  // Wiggle detection configuration
  wiggleConfig = {
    maxDirectionChanges: 5,          // Maximum direction changes before freezing
    timeWindowMs: 1000,              // Time window to count direction changes (in ms)
    freezeDurationMs: 500            // Time to freeze carousel after excessive wiggling
  }
}) => {
  const containerRef = useRef(null);
  const [partialProgress, setPartialProgress] = useState(0);
  const [isFlickTransition, setIsFlickTransition] = useState(false);
  const [flickDirection, setFlickDirection] = useState(0); // -1 for left, 1 for right, 0 for none
  
  // Tracking scroll state
  const scrollState = useRef({
    lastScrollTime: 0,
    accumulatedDeltaX: 0,
    scrollDirection: 0,
    isInCooldown: false,
    scrollTimeout: null,
    lastDeltaX: 0,
    scrollVelocity: 0,
    slowScrollMode: false,
    recentDeltas: [],
    lastProgressUpdate: 0,        // Track last time we updated progress for throttling
    flickTransitionTimeout: null, // Track timeout for flick transitions
    
    // Wiggle detection state
    directionChanges: 0,          // Count direction changes
    directionChangeTimestamps: [], // Array of timestamps for direction changes
    isCarouselFrozen: false,      // Flag to completely freeze carousel during excessive wiggling
    freezeTimeout: null,          // Timeout to unfreeze carousel
    lastWiggleCheckTime: 0,        // Last time we checked for wiggling
    
    isScrolling: false            // NEW: Flag to indicate active scrolling
  });

  // Helper function to cap accumulated delta
  const capAccumulatedDelta = useCallback((value) => {
    return Math.max(-maxAccumulatedDelta, Math.min(maxAccumulatedDelta, value));
  }, [maxAccumulatedDelta]);

  // Helper function to check if wiggling is excessive
  const checkExcessiveWiggling = useCallback(() => {
    const state = scrollState.current;
    const now = Date.now();
    
    // Add current time to direction change timestamps
    state.directionChangeTimestamps.push(now);
    
    // Only keep timestamps within our time window
    state.directionChangeTimestamps = state.directionChangeTimestamps.filter(
      timestamp => now - timestamp < wiggleConfig.timeWindowMs
    );
    
    // If we have too many direction changes in our time window, freeze the carousel
    if (state.directionChangeTimestamps.length >= wiggleConfig.maxDirectionChanges) {
      // Freeze the carousel
      state.isCarouselFrozen = true;
      
      // Reset accumulated delta and partial progress immediately
      state.accumulatedDeltaX = 0;
      setPartialProgress(0);
      
      // Clear any existing freeze timeout
      if (state.freezeTimeout) {
        clearTimeout(state.freezeTimeout);
      }
      
      // Set timeout to unfreeze
      state.freezeTimeout = setTimeout(() => {
        state.isCarouselFrozen = false;
        state.directionChangeTimestamps = [];
      }, wiggleConfig.freezeDurationMs);
      
      return true;
    }
    
    return false;
  }, [wiggleConfig.maxDirectionChanges, wiggleConfig.timeWindowMs, wiggleConfig.freezeDurationMs]);

  // NEW: Function to disable text selection
  const disableTextSelection = useCallback(() => {
    document.body.classList.add('disable-text-selection');
  }, []);

  // NEW: Function to enable text selection
  const enableTextSelection = useCallback(() => {
    document.body.classList.remove('disable-text-selection');
  }, []);

  // Handle trackpad/mouse wheel scrolling
  const handleWheel = useCallback((e) => {
    // Only handle horizontal wheel events, let vertical ones propagate normally
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      return;
    }
    
    // Only prevent default for horizontal scrolling to keep vertical scrolling working
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
    }

    const now = Date.now();
    const state = scrollState.current;
    
    // Don't handle scroll during cooldown period or when carousel is frozen
    if (state.isInCooldown || state.isCarouselFrozen) return;

    // Calculate velocity (deltaX change since last event)
    const instantVelocity = Math.abs(e.deltaX);
    
    // Add to recent deltas list (keep last 5)
    state.recentDeltas.push(instantVelocity);
    if (state.recentDeltas.length > 5) {
      state.recentDeltas.shift();
    }
    
    // Calculate average recent velocity
    const avgRecentVelocity = state.recentDeltas.reduce((sum, val) => sum + val, 0) / 
                             state.recentDeltas.length;
    
    // Determine if this is slow scrolling - INCREASED threshold
    state.slowScrollMode = avgRecentVelocity < swipeSpeeds.slowScrollThreshold;
    
    // Determine scroll direction
    const scrollDirection = e.deltaX > 0 ? 1 : e.deltaX < 0 ? -1 : 0;
    
    // Detect direction changes
    if (scrollDirection !== 0 && state.scrollDirection !== 0 && 
        scrollDirection !== state.scrollDirection) {
      
      // Check if this direction change makes wiggling excessive
      const isWigglingExcessive = checkExcessiveWiggling();
      
      // If wiggling is now excessive, stop processing this event
      if (isWigglingExcessive) {
        return;
      }
    }
    
    // Check if this is a new scroll gesture or direction changed
    const isNewScroll = now - state.lastScrollTime > cooldown;
    if (isNewScroll) {
      state.accumulatedDeltaX = 0;
      state.scrollDirection = scrollDirection;
      state.recentDeltas = [instantVelocity]; // Reset recent deltas
    } else if (state.scrollDirection !== scrollDirection && scrollDirection !== 0) {
      // Direction changed during the same gesture - reset accumulation
      state.accumulatedDeltaX = 0;
      state.scrollDirection = scrollDirection;
    }

    // Update tracking state
    state.lastScrollTime = now;
    state.lastDeltaX = e.deltaX;
    
    // Apply dampening based on slow scroll mode
    let effectiveDampening = state.slowScrollMode ? 
                           dampening * swipeSpeeds.slowIntentional * 120 :
                           dampening;
    
    // Add to accumulated delta with dampening to prevent too fast scrolling
    // Cap the accumulated delta to prevent overflow
    state.accumulatedDeltaX = capAccumulatedDelta(
      state.accumulatedDeltaX + (e.deltaX * effectiveDampening)
    );
    
    // Handle partial progress animation for scrolls - update more frequently for smoother animation
    if (enablePartialSlide && (now - state.lastProgressUpdate > 16)) { // 60fps throttling
      state.lastProgressUpdate = now;
      
      // Different divisors for slow vs fast scrolling
      const divisor = state.slowScrollMode ? threshold * 0.6 : threshold * 2;
      
      // Map accumulated delta to a value between -0.5 and 0.5
      const normalizedProgress = Math.min(
        0.5, 
        Math.max(-0.5, state.accumulatedDeltaX / divisor)
      );
      setPartialProgress(normalizedProgress);
    }
    
    // NEW: Disable text selection during scrolling
    if (!state.isScrolling) {
      disableTextSelection();
      state.isScrolling = true;
    }

    // Determine effective threshold based on scroll mode
    const effectiveThreshold = state.slowScrollMode ? threshold * 0.7 : threshold;
    
    // Check if we've exceeded the threshold for slide change
    if (Math.abs(state.accumulatedDeltaX) > effectiveThreshold) {
      // This is a flick/swipe
      setIsFlickTransition(true);
      setFlickDirection(scrollDirection);
      
      // Clear any existing timeout
      if (state.flickTransitionTimeout) {
        clearTimeout(state.flickTransitionTimeout);
      }
      
      // Set a timeout to reset the flick transition state
      state.flickTransitionTimeout = setTimeout(() => {
        setIsFlickTransition(false);
        setFlickDirection(0);
      }, 500);
      
      // Trigger the appropriate slide change
      if (scrollDirection > 0) {
        onNext();
      } else if (scrollDirection < 0) {
        onPrev();
      }
      
      // Reset state after slide change
      state.accumulatedDeltaX = 0;
      setPartialProgress(0);
      state.directionChangeTimestamps = [];
      
      // Enter cooldown to prevent rapid repeated slides
      state.isInCooldown = true;
      setTimeout(() => {
        state.isInCooldown = false;
        
        // NEW: Re-enable text selection after cooldown
        enableTextSelection();
        state.isScrolling = false;
      }, cooldown);
      
      return;
    }
    
    // Detect when scrolling stops to handle final position
    clearTimeout(state.scrollTimeout);
    state.scrollTimeout = setTimeout(() => {
      // When scrolling stops, decide if we should trigger a slide change
      let finalThreshold = state.slowScrollMode ? threshold / 6 : threshold / 4;
      
      if (Math.abs(state.accumulatedDeltaX) > finalThreshold) {
        // Handle intentional slow scroll that crossed smaller threshold
        setIsFlickTransition(true);
        setFlickDirection(state.accumulatedDeltaX > 0 ? 1 : -1);
        
        // Clear any existing timeout
        if (state.flickTransitionTimeout) {
          clearTimeout(state.flickTransitionTimeout);
        }
        
        // Set a timeout to reset the flick transition state
        state.flickTransitionTimeout = setTimeout(() => {
          setIsFlickTransition(false);
          setFlickDirection(0);
        }, 600);
        
        // This ensures we only move ONE card regardless of accumulated delta
        onContinuousScrollEnd(state.accumulatedDeltaX);
        state.accumulatedDeltaX = 0;
        setPartialProgress(0);
      } else if (state.accumulatedDeltaX !== 0) {
        // Reset partial progress if below threshold
        state.accumulatedDeltaX = 0;
        setPartialProgress(0);
      }
      
      // Reset wiggle detection state
      state.directionChangeTimestamps = [];
      
      // NEW: Re-enable text selection after scrolling stops
      enableTextSelection();
      state.isScrolling = false;
    }, state.slowScrollMode ? cooldown / 2 : cooldown);
  }, [
    onNext, 
    onPrev, 
    onContinuousScrollEnd, 
    threshold, 
    cooldown, 
    dampening, 
    enablePartialSlide, 
    swipeSpeeds.slowIntentional, 
    swipeSpeeds.slowScrollThreshold, 
    capAccumulatedDelta,
    checkExcessiveWiggling,
    disableTextSelection,
    enableTextSelection
  ]);

  // Handle touch events for mobile devices
  const handleTouchStart = useCallback((e) => {
    const state = scrollState.current;
    
    // Don't start new touch interaction if carousel is frozen
    if (state.isCarouselFrozen) return;
    
    state.touchStartX = e.touches[0].clientX;
    state.touchStartY = e.touches[0].clientY;
    state.isTouching = true;
    state.touchStartTime = Date.now();
    state.touchMoves = [];
    state.directionChangeTimestamps = [];
    
    // NEW: Disable text selection on touch start
    disableTextSelection();
    state.isScrolling = true;
  }, [disableTextSelection]);

  const handleTouchMove = useCallback((e) => {
    const state = scrollState.current;
    if (!state.isTouching || state.isCarouselFrozen) return;
    
    const touchX = e.touches[0].clientX;
    const deltaX = state.touchStartX - touchX;
    
    // Track touch movement times and positions for velocity calculation
    state.touchMoves.push({
      time: Date.now(),
      position: touchX
    });
    if (state.touchMoves.length > 5) {
      state.touchMoves.shift();
    }
    
    // Only handle horizontal swipes 
    if (Math.abs(deltaX) > 10) {
      e.preventDefault(); // Prevent page scrolling
      
      const scrollDirection = deltaX > 0 ? 1 : -1;
      
      // Detect direction changes for wiggle detection
      if (state.touchMoves.length >= 3) {
        const prevMove = state.touchMoves[state.touchMoves.length - 2];
        const prevDirection = prevMove.position < touchX ? -1 : 1;
        
        if (prevDirection !== scrollDirection) {
          // Check if this direction change makes wiggling excessive
          const isWigglingExcessive = checkExcessiveWiggling();
          
          // If wiggling is now excessive, stop processing this event
          if (isWigglingExcessive) {
            return;
          }
        }
      }
      
      // Calculate if this is a slow swipe by measuring velocity
      let isSlowSwipe = true;
      if (state.touchMoves.length >= 2) {
        const first = state.touchMoves[0];
        const last = state.touchMoves[state.touchMoves.length - 1];
        const timeDiff = last.time - first.time;
        const posDiff = Math.abs(last.position - first.position);
        
        if (timeDiff > 0) {
          // Calculate swipe velocity in px/ms
          const velocity = posDiff / timeDiff;
          isSlowSwipe = velocity < 0.5; // Adjust threshold as needed
        }
      }
      
      // Use different factor for slow vs fast swipes
      let factor = isSlowSwipe ? 
                  swipeSpeeds.translationFactorSingle * 2.0 :
                  swipeSpeeds.translationFactorSingle;
      
      // Cap the accumulated delta to prevent overflow
      state.accumulatedDeltaX = capAccumulatedDelta(deltaX * factor);
      
      // Handle partial animation for swipes
      if (enablePartialSlide) {
        const divisor = isSlowSwipe ? threshold * 0.6 : threshold * 2;
        const normalizedProgress = Math.min(
          0.5,
          Math.max(-0.5, state.accumulatedDeltaX / divisor)
        );
        setPartialProgress(normalizedProgress);
      }
    }
  }, [threshold, enablePartialSlide, swipeSpeeds.translationFactorSingle, capAccumulatedDelta, checkExcessiveWiggling]);

  const handleTouchEnd = useCallback((e) => {
    const state = scrollState.current;
    if (!state.isTouching || state.isCarouselFrozen) return;
    
    // Calculate final velocity for swipe gesture
    let swipeVelocity = 0;
    if (state.touchMoves.length >= 2) {
      const first = state.touchMoves[0];
      const last = state.touchMoves[state.touchMoves.length - 1];
      const timeDiff = last.time - first.time;
      const posDiff = last.position - first.position;
      
      if (timeDiff > 0) {
        // Calculate velocity and direction
        swipeVelocity = posDiff / timeDiff; 
      }
    }
    
    // Adjust threshold based on swipe velocity
    let effectiveThreshold = threshold;
    if (Math.abs(swipeVelocity) > 1) {
      // Fast swipe - lower threshold
      effectiveThreshold = threshold / 3;
    } else if (Math.abs(swipeVelocity) < 0.3) {
      // Slow intentional swipe - more responsive
      effectiveThreshold = threshold / 3;
    }
    
    // Only trigger if not in cooldown
    if (!state.isInCooldown && Math.abs(state.accumulatedDeltaX) > effectiveThreshold) {
      // For touch events, also mark as a flick transition
      setIsFlickTransition(true);
      setFlickDirection(state.accumulatedDeltaX > 0 ? 1 : -1);
      
      // Clear any existing timeout
      if (state.flickTransitionTimeout) {
        clearTimeout(state.flickTransitionTimeout);
      }
      
      // Set a timeout to reset the flick transition state
      state.flickTransitionTimeout = setTimeout(() => {
        setIsFlickTransition(false);
        setFlickDirection(0);
      }, 500);
      
      // Trigger slide change
      if (state.accumulatedDeltaX > 0) {
        onNext();
      } else {
        onPrev();
      }
      
      // Enter cooldown
      state.isInCooldown = true;
      setTimeout(() => {
        state.isInCooldown = false;
        
        // NEW: Re-enable text selection after cooldown
        enableTextSelection();
        state.isScrolling = false;
      }, cooldown);
    }
    
    // Reset touch state
    state.isTouching = false;
    state.accumulatedDeltaX = 0;
    setPartialProgress(0);
    state.touchMoves = [];
    state.directionChangeTimestamps = [];
    
    // NEW: Re-enable text selection on touch end
    enableTextSelection();
    state.isScrolling = false;
  }, [onNext, onPrev, threshold, cooldown, enableTextSelection]);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      const state = scrollState.current;
      if (state.flickTransitionTimeout) {
        clearTimeout(state.flickTransitionTimeout);
      }
      if (state.freezeTimeout) {
        clearTimeout(state.freezeTimeout);
      }
      if (state.scrollTimeout) {
        clearTimeout(state.scrollTimeout);
      }
      
      // NEW: Ensure text selection is re-enabled on unmount
      enableTextSelection();
    };
  }, [enableTextSelection]);

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use passive: false to allow preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    containerRef,
    partialProgress,
    isFlickTransition,
    flickDirection
  };
};

export default useSideScroll;