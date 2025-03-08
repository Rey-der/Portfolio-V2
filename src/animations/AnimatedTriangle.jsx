import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to handle triangle animation with section awareness
 * @param {boolean} inView - Whether the section is in viewport
 * @param {Object} mousePosition - The current mouse position {x, y}
 * @param {boolean} isMobile - Whether the current device is mobile
 * @returns {Object} - Triangle position data for animation
 */
const useTriangleAnimation = (inView, mousePosition, isMobile) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const noiseOffsetRef = useRef({ x: Math.random() * 1000, y: Math.random() * 1000 });
  const frameRef = useRef(null);
  const lastTimeRef = useRef(0);

  // Animation settings - enhanced for more movement
  const settings = {
    mouseFollowSpeed: 0.02,        // Speed of mouse reaction
    noiseSpeed: 0.8,               // Faster noise movement
    noiseAmount: 25,               // Increased amplitude of noise
    returnSpeed: 0.04,             // Slower return for smoother bounce
    mobileScrollFactor: 0.5,
    maxDistance: 3,                // Maximum distance from center
    bounceStrength: 0.15,          // Strength of the bounce effect
    noiseInfluence: 0.2            // How much noise affects position when mouse is active
  };

  // Generate enhanced noise with more movement
  const generateNoise = (x, y, time) => {
    const t = time * 0.001;
    // Complex noise pattern with multiple frequencies
    const nx = Math.sin(x * 0.01 + t) * 0.7 + Math.sin(x * 0.02 + t * 1.3) * 0.3;
    const ny = Math.cos(y * 0.01 + t * 0.63) * 0.7 + Math.cos(y * 0.02 + t * 0.9) * 0.3;
    
    return {
      x: nx * settings.noiseAmount,
      y: ny * settings.noiseAmount
    };
  };

  // Check distance and apply soft boundary
  const applyBoundary = (pos) => {
    // Calculate distance from center
    const distance = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
    
    // If within bounds, return as is
    if (distance <= settings.maxDistance) {
      return pos;
    }
    
    // Calculate bounce force (stronger the further it exceeds)
    const exceededBy = distance - settings.maxDistance;
    const bounceForce = exceededBy * settings.bounceStrength;
    
    // Calculate unit vector toward center
    const unitX = pos.x / distance;
    const unitY = pos.y / distance;
    
    // Apply bounce force toward center
    return {
      x: pos.x - unitX * bounceForce,
      y: pos.y - unitY * bounceForce
    };
  };

  useEffect(() => {
    // Handle mobile scroll behavior
    if (isMobile) {
      const handleScroll = () => {
        if (!inView) {
          // Return to center when not in view
          setPosition(prev => ({
            x: prev.x * 0.9,
            y: prev.y * 0.9
          }));
          return;
        }
        
        // Move based on scroll position
        const scrollY = window.scrollY;
        const newPos = {
          x: Math.min(scrollY * settings.mobileScrollFactor, 50),
          y: Math.min(scrollY * settings.mobileScrollFactor * 0.6, 30)
        };
        
        setPosition(applyBoundary(newPos));
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } 
    
    // Desktop animation loop
    else {
      const animate = (timestamp) => {
        const deltaTime = timestamp - lastTimeRef.current;
        lastTimeRef.current = timestamp;
        
        // Always generate noise for consistent movement
        const noise = generateNoise(
          noiseOffsetRef.current.x, 
          noiseOffsetRef.current.y, 
          timestamp
        );
        
        // Update noise offsets
        noiseOffsetRef.current.x += settings.noiseSpeed;
        noiseOffsetRef.current.y += settings.noiseSpeed;

        // Different behavior based on section visibility and mouse activity
        let newPosition;
        
        if (inView && mousePosition.isInViewport) {
          // INVERTED: Move away from mouse + noise
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          
          // Calculate vector from mouse to center
          const vectorX = centerX - mousePosition.x;
          const vectorY = centerY - mousePosition.y;
          
          // Apply inverted mouse effect
          newPosition = {
            x: position.x - (mousePosition.x - centerX) * settings.mouseFollowSpeed + noise.x * settings.noiseInfluence,
            y: position.y - (mousePosition.y - centerY) * settings.mouseFollowSpeed + noise.y * settings.noiseInfluence
          };
        } 
        else if (inView && !mousePosition.isInViewport) {
          // More pronounced noise movement when mouse inactive
          newPosition = {
            x: position.x * 0.95 + noise.x * 0.2,
            y: position.y * 0.95 + noise.y * 0.2
          };
        } 
        else {
          // Return to center when section not visible
          newPosition = {
            x: position.x * (1 - settings.returnSpeed),
            y: position.y * (1 - settings.returnSpeed)
          };
        }
        
        // Apply boundary and soft bounce
        setPosition(applyBoundary(newPosition));

        frameRef.current = requestAnimationFrame(animate);
      };

      frameRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frameRef.current);
    }
  }, [inView, mousePosition, isMobile]);

  return position;
};

export default useTriangleAnimation;