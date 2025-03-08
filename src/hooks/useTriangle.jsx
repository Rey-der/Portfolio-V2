import { useState, useEffect, useRef } from 'react';

const useTriangle = (mousePosition) => {
  const [animationState, setAnimationState] = useState('initial'); // initial, growing, bouncing, idle, following
  const [scale, setScale] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [wiggleOffset, setWiggleOffset] = useState({ x: 0, y: 0 });
  const wiggleTimer = useRef(null);
  const animationFrame = useRef(null);
  const initialized = useRef(false);
  
  // Debug logging to track state changes
  useEffect(() => {
    console.log("Triangle animation state:", animationState, "scale:", scale);
  }, [animationState, scale]);
  
  // Start animation sequence after 1 second
  useEffect(() => {
    // Prevent double initialization
    if (initialized.current) return;
    initialized.current = true;
    
    console.log("Setting up initial animation timer");
    const timer = setTimeout(() => {
      console.log("Initial timer fired, changing state to growing");
      setAnimationState('growing');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle animation states
  useEffect(() => {
    // Clean up any existing animation frame
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    
    console.log("Animation state changed:", animationState);
    
    if (animationState === 'growing') {
      let progress = 0;
      const growAnimation = () => {
        progress += 0.01;
        // Grow to 120%
        const newScale = progress * 1.2;
        console.log("Growing animation progress:", progress, "scale:", newScale);
        setScale(newScale);
        
        if (progress >= 1) {
          console.log("Growth complete, starting bounce");
          setAnimationState('bouncing');
          return;
        }
        animationFrame.current = requestAnimationFrame(growAnimation);
      };
      console.log("Starting growth animation");
      animationFrame.current = requestAnimationFrame(growAnimation);
    } 
    else if (animationState === 'bouncing') {
      let progress = 0;
      const bounceAnimation = () => {
        progress += 0.008; // Slower bounce
        // Bounce from 120% back to 100% with easing
        const newScale = 1.2 - (0.2 * (1 - Math.pow(1 - progress, 3)));
        console.log("Bounce animation progress:", progress, "scale:", newScale);
        setScale(newScale);
        
        if (progress >= 1) {
          console.log("Bounce complete, moving to idle");
          setScale(1); // Ensure we end at exactly 100%
          setAnimationState('idle');
          startWiggling();
          return;
        }
        animationFrame.current = requestAnimationFrame(bounceAnimation);
      };
      console.log("Starting bounce animation");
      animationFrame.current = requestAnimationFrame(bounceAnimation);
    }
    
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [animationState]);
  
  // Wiggle in circular pattern
  const startWiggling = () => {
    console.log("Starting wiggle animation");
    // Clear any existing wiggle timer
    if (wiggleTimer.current) {
      cancelAnimationFrame(wiggleTimer.current);
      wiggleTimer.current = null;
    }
    
    let angle = 0;
    const wiggle = () => {
      const radius = 10; // Circle radius in pixels
      const newX = Math.cos(angle) * radius;
      const newY = Math.sin(angle) * radius;
      
      setWiggleOffset({ x: newX, y: newY });
      angle += 0.02;
      
      wiggleTimer.current = requestAnimationFrame(wiggle);
    };
    wiggle();
  };
  
  // Mouse interaction
  useEffect(() => {
    if (animationState !== 'idle' && animationState !== 'following') return;
    
    // Only process if mouse is active
    if (!mousePosition?.isInViewport) {
      if (animationState === 'following') {
        setAnimationState('idle');
        startWiggling();
      }
      return;
    }
    
    // Calculate distance to center
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const distX = mousePosition.x - centerX;
    const distY = mousePosition.y - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    
    // Follow mouse if within 200px radius
    if (distance < 200) {
      if (wiggleTimer.current) {
        cancelAnimationFrame(wiggleTimer.current);
        wiggleTimer.current = null;
      }
      
      setAnimationState('following');
      
      // Magnetic effect - partial following that strengthens as mouse gets closer
      const pullStrength = Math.max(0, Math.min(0.5, (200 - distance) / 400));
      setPosition({
        x: distX * pullStrength,
        y: distY * pullStrength
      });
    } 
    else if (animationState === 'following') {
      setAnimationState('idle');
      setPosition({ x: 0, y: 0 });
      startWiggling();
    }
  }, [mousePosition, animationState]);
  
  // Clean up animations
  useEffect(() => {
    return () => {
      console.log("Cleaning up triangle animations");
      if (wiggleTimer.current) cancelAnimationFrame(wiggleTimer.current);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);
  
  return {
    scale,
    position: {
      x: position.x + wiggleOffset.x,
      y: position.y + wiggleOffset.y
    },
    animationState
  };
};

export default useTriangle;