import React, { useState, useRef, useEffect } from 'react';
import useMousePosition from './useMousePosition';

const ScrollToTopButton = ({ handleScrollToTop, isMobile }) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const buttonRef = useRef(null);
  const { x, y } = useMousePosition();
  const [isNear, setIsNear] = useState(false);
  const [bounceClass, setBounceClass] = useState('');

  useEffect(() => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const proximityThreshold = 100;

    const checkProximity = () => {
      const distance = Math.sqrt(
        Math.pow(x - (buttonRect.left + buttonRect.width / 2), 2) +
          Math.pow(y - (buttonRect.top + buttonRect.height / 2), 2)
      );
      setIsNear(distance < proximityThreshold);
    };

    checkProximity();
  }, [x, y]);

  useEffect(() => {
    if (isNear && !hasAnimated) {
      setHasAnimated(true);
      setBounceClass('animate-smooth-bounce');

      setTimeout(() => {
        setBounceClass('');
        setHasAnimated(false);
      }, 300);
    }
  }, [isNear, hasAnimated]);

  return (
    <div className={`flex justify-center mt-${isMobile ? '12' : '16'} mb-${isMobile ? '6' : '8'}`}>
      <button
        ref={buttonRef}
        onClick={handleScrollToTop}
        aria-label="Scroll to top"
        className={`bg-white dark:bg-gray-800 p-2 ${isMobile ? 'w-12 h-12' : 'w-10 h-10'} ring-1 ring-slate-900/5 dark:ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center hover:ring-primary hover:ring-2 transition-all duration-300 ${bounceClass}`}
      >
        <svg
          className={`${isMobile ? 'w-7 h-7' : 'w-6 h-6'} text-primary`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
      </button>
    </div>
  );
};

export default ScrollToTopButton;