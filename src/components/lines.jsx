import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../utils/useTheme';

// --- Configuration ---
const LINE_WIDTH = '1px';
const LINE_COLOR_DARK = 'rgba(255, 255, 255, 1)';
const LINE_COLOR_LIGHT = 'rgba(0, 0, 0, 1)';
const HORIZONTAL_OFFSET = '80px'; // Distance from left/right viewport edge
const Z_INDEX = 1; 
const OPACITY_DEFAULT = 1;
// ---------------------

const VerticalLines = ({ sectionRef }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [lineStyles, setLineStyles] = useState({ top: 0, height: 0, opacity: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const calculateLineStyles = () => {
      if (!sectionRef || !sectionRef.current) {
        setLineStyles({ top: 0, height: 0, opacity: 0 });
        return;
      }

      const sectionRect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate the intersection of the section with the viewport
      const visibleTop = Math.max(0, sectionRect.top);
      const visibleBottom = Math.min(viewportHeight, sectionRect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      // Update styles only if height is positive (section is visible)
      if (visibleHeight > 0) {
        setLineStyles({
          top: visibleTop,
          height: visibleHeight,
          opacity: OPACITY_DEFAULT, // Use constant
        });
      } else {
        setLineStyles(prevStyles => ({ ...prevStyles, opacity: 0, height: 0 }));
      }
    };

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(calculateLineStyles);
    };

    // Initial calculation
    calculateLineStyles();

    // Add scroll and resize listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [sectionRef]);

  // Skip rendering completely if not visible - no DOM impact
  if (lineStyles.height <= 0 || lineStyles.opacity <= 0) {
    return null;
  }

  // Use a minimalist implementation with SVG for better rendering
  return (
    // Pure cosmetic container with no layout impact
    <div aria-hidden="true" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: Z_INDEX,
      contain: 'strict', // Strongest containment - no layout impact
      width: 0,
      height: 0,
      overflow: 'visible',
      margin: 0,
      padding: 0,
      border: 'none',
      background: 'transparent'
    }}>
      {/* Left line - pure SVG for better rendering */}
      <svg 
        width="1"
        height={lineStyles.height}
        style={{
          position: 'fixed',
          top: `${lineStyles.top}px`,
          left: HORIZONTAL_OFFSET,
          opacity: lineStyles.opacity,
          pointerEvents: 'none',
          zIndex: Z_INDEX,
          overflow: 'visible',
        }}
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2={lineStyles.height}
          stroke={isDarkMode ? LINE_COLOR_DARK : LINE_COLOR_LIGHT}
          strokeWidth={LINE_WIDTH}
        />
      </svg>

      {/* Right line - pure SVG for better rendering */}
      <svg
        width="1"
        height={lineStyles.height}
        style={{
          position: 'fixed',
          top: `${lineStyles.top}px`,
          right: HORIZONTAL_OFFSET,
          opacity: lineStyles.opacity,
          pointerEvents: 'none',
          zIndex: Z_INDEX,
          overflow: 'visible',
        }}
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2={lineStyles.height}
          stroke={isDarkMode ? LINE_COLOR_DARK : LINE_COLOR_LIGHT}
          strokeWidth={LINE_WIDTH}
        />
      </svg>
    </div>
  );
};

export default VerticalLines;