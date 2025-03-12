import React, { useState, useRef, useEffect } from 'react';
import useMousePosition from './useMousePosition';
import { getGlassStyles } from './glassStyles';
import { useScroll } from '../context/ScrollContext';
import { useLocation, useNavigate } from 'react-router-dom';

const ScrollToTopButton = ({ isMobile, isDarkMode = true }) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const buttonRef = useRef(null);
  const { x, y } = useMousePosition();
  const [isNear, setIsNear] = useState(false);
  const [bounceClass, setBounceClass] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const { scrollToSection, setActiveSection } = useScroll();
  const location = useLocation();
  const navigate = useNavigate();

  // Function to handle scrolling to top with the same behavior as Header navigation
  const handleScrollToTop = () => {
    console.log('Scrolling to top using home navigation logic');
    
    // Blur the active element after a small delay
    setTimeout(() => {
      document.activeElement.blur();
    }, 150);
    
    // Handle navigation from contact page specifically
    if (location.pathname === '/contact') {
      console.log('Navigating from contact to home');
      navigate('/');
      
      setTimeout(() => {
        console.log('Looking for element #home');
        const element = document.getElementById('home');
        if (element) {
          console.log('Found element #home, scrolling');
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveSection('home');
        } else {
          console.log('Element #home not found, using scrollToSection');
          scrollToSection('home');
        }
      }, 300);
      return;
    }

    // For other pages
    console.log('Looking for element #home');
    const element = document.getElementById('home');
    if (element) {
      console.log('Found element #home, scrolling');
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection('home');
    } else {
      console.log('Element #home not found, using scrollToSection');
      scrollToSection('home');
    }
  };

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

  // Get button styles using our utility
  const buttonStyles = getGlassStyles({
    isDarkMode,
    isHovered,
    isButton: true,
    direction: 'down',
    frostIntensity: 0.6, // Medium-high frost intensity
    accentColor: isHovered ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)' // Blue accent that intensifies on hover
  });

  return (
    <button
      ref={buttonRef}
      onClick={handleScrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Scroll to top"
      className={`backdrop-blur-sm flex items-center justify-center transition-all duration-200 ${bounceClass}`}
      style={buttonStyles}
    >
      <svg
        className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
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
  );
};

export default ScrollToTopButton;