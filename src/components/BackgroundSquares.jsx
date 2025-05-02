import React, { useRef, useEffect } from 'react';
import { createCombinedParallaxSquares } from '../animations/parallax';

const BackgroundSquares = () => {
  const containerRef = useRef(null);
  const squaresRef = useRef([]);
  
  // Create squares configuration
  const { squares, useCombinedParallax } = createCombinedParallaxSquares({
    count: 8,
    colors: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'],
    minSize: 30,
    maxSize: 120,
    scrollFactor: 0.3,
    mouseFactor: 0.07
  });
  
  // Get parallax function
  const { applyParallax } = useCombinedParallax(containerRef);
  
  // Apply parallax effect
  useEffect(() => {
    if (containerRef.current) {
      const elements = squaresRef.current.filter(el => el !== null);
      const cleanup = applyParallax(elements);
      return cleanup;
    }
  }, [applyParallax]);
  
  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {squares.map((square, index) => (
        <div
          key={square.id}
          ref={el => (squaresRef.current[index] = el)}
          style={square.style}
        />
      ))}
    </div>
  );
};

export default BackgroundSquares;