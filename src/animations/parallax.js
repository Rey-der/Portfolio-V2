/**
 * Creates a parallax effect that responds to both scroll and mouse movement
 * @param {Object} options Configuration options
 * @param {number} options.count Number of elements to create
 * @param {string[]} options.colors Array of colors to use
 * @param {number} options.minSize Minimum size of elements (px)
 * @param {number} options.maxSize Maximum size of elements (px)
 * @param {number} options.scrollFactor How much scroll affects y-movement (higher = more movement)
 * @param {number} options.mouseFactor How much mouse affects x-movement (higher = more movement)
 * @param {string} options.type The type of parallax effect ('default' or 'skyline')
 * @return {Object} Object with elements config and parallax application method
 */
export function createDirectParallaxEffect({
  count = 5,
  colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'],
  minSize = 20,
  maxSize = 100,
  scrollFactor = 0.2,
  mouseFactor = 0.05,
  type = 'default' // 'default' or 'skyline'
}) {
  // Generate elements with random properties
  const elements = Array.from({ length: count }, (_, i) => {
    const size = Math.floor(Math.random() * (maxSize - minSize) + minSize);
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Position differently based on type
    let left, top;
    if (type === 'skyline') {
      // Evenly distribute buildings along the bottom
      left = (i / count * 100) - 5 + (Math.random() * 10); // More structured horizontal distribution
      top = 100 - (size / window.innerHeight * 100); // Position at the bottom
    } else {
      // Regular random positioning
      left = Math.random() * 90 + 5; // 5-95% (avoid edges)
      top = Math.random() * 90 + 5;  // 5-95% (avoid edges)
    }
    
    const speedY = Math.random() * 1.5 + 0.5; // Different speeds for Y movement
    const speedX = Math.random() * 1.5 + 0.5; // Different speeds for X movement
    const rotation = type === 'skyline' ? 0 : Math.random() * 45 - 22.5; // No rotation for buildings
    
    // Shape adjustments for skyline
    const borderRadius = type === 'skyline' 
      ? `${3 + Math.random() * 10}px ${3 + Math.random() * 10}px 0 0` // Rounded top for buildings
      : '8px'; // Square with rounded corners for default
    
    // Width/height adjustments for skyline
    const width = type === 'skyline' 
      ? 30 + Math.random() * 60 // Buildings have varying widths
      : size;
    
    const height = type === 'skyline'
      ? 80 + Math.random() * 200 // Buildings are taller
      : size;
      
    // Opacity adjustments
    const opacity = type === 'skyline' ? 0.8 : 0.3;
    
    return {
      id: `parallax-element-${i}`,
      style: {
        position: 'absolute',
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: color,
        left: `${left}%`,
        top: type === 'skyline' ? 'auto' : `${top}%`,
        bottom: type === 'skyline' ? '0' : 'auto',
        opacity: opacity,
        borderRadius: borderRadius,
        transform: `rotate(${rotation}deg)`,
        zIndex: '-1',
        pointerEvents: 'none',
        transition: 'transform 0.05s ease-out', // Smoother transitions
      },
      speedY,
      speedX,
      rotation,
      type
    };
  });

  // Hook to apply parallax effect
  const useDirectParallax = () => {
    const applyParallax = (domElements) => {
      if (!domElements || domElements.length === 0) return () => {};
      
      // Track mouse position
      let mouseX = window.innerWidth / 2;
      
      const handleMouseMove = (e) => {
        mouseX = e.clientX;
        updateElementPositions();
      };
      
      // Handle scroll and apply transforms
      const updateElementPositions = () => {
        // Get scroll position
        const scrollY = window.scrollY;
        
        // Calculate mouse offset from center (as percentage of window width)
        const centerX = window.innerWidth / 2;
        const mouseOffsetX = (mouseX - centerX) / centerX; // -1 to 1 range
        
        // Apply to each element with its own speed factor
        domElements.forEach((element, index) => {
          if (!element) return;
          
          const parallaxElement = elements[index % elements.length];
          
          // Apply transform based on type
          if (parallaxElement.type === 'skyline') {
            // Skyline only moves horizontally with mouse
            const moveX = mouseOffsetX * mouseFactor * 100 * parallaxElement.speedX;
            element.style.transform = `translate3d(${moveX}px, 0, 0)`;
          } else {
            // Default moves in both directions
            const moveY = scrollY * scrollFactor * parallaxElement.speedY;
            const moveX = mouseOffsetX * mouseFactor * 100 * parallaxElement.speedX;
            element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotate(${parallaxElement.rotation + (parallaxElement.speedY * 10)}deg)`;
          }
        });
      };
      
      // Initial application
      updateElementPositions();
      
      // Add event listeners
      window.addEventListener('scroll', updateElementPositions, { passive: true });
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      
      // Cleanup function
      return () => {
        window.removeEventListener('scroll', updateElementPositions);
        window.removeEventListener('mousemove', handleMouseMove);
        domElements.forEach(element => {
          if (element) element.style.transform = '';
        });
      };
    };
    
    /**
     * Generates window elements for skyline buildings
     * @param {HTMLElement} buildingElement The DOM element representing a building
     * @param {string} lightColor The color for lit windows
     */
    const addWindowsToBuildingElement = (buildingElement, lightColor = '#facc15') => {
      if (!buildingElement) return;
      
      const windowCount = Math.floor(5 + Math.random() * 15);
      
      for (let i = 0; i < windowCount; i++) {
        const windowEl = document.createElement('div');
        const isLit = Math.random() > 0.4; // Some windows are lit
        
        Object.assign(windowEl.style, {
          position: 'absolute',
          width: '4px',
          height: '6px',
          backgroundColor: isLit ? lightColor : 'rgba(255,255,255,0.3)',
          left: `${10 + Math.random() * 80}%`,
          top: `${10 + Math.random() * 80}%`,
          boxShadow: isLit ? `0 0 5px ${lightColor}` : 'none'
        });
        
        buildingElement.appendChild(windowEl);
      }
    };
    
    return { 
      applyParallax,
      addWindowsToBuildingElement
    };
  };

  return {
    elements,
    useDirectParallax
  };
}

/**
 * Creates a city skyline parallax effect
 * @param {Object} options Configuration options
 * @return {Object} Object with elements config and parallax application methods
 */
export function createSkylineParallaxEffect({
  count = 15,
  // UPDATED: Changed from blue/purple colors to dark gray shades that match index.css
  darkColors = ['#1A1A1A', '#252525', '#333333', '#404040', '#505050'], 
  lightColors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#2563eb'],
  theme = 'light',
  mouseFactor = 0.02
}) {
  const colors = theme === 'dark' ? darkColors : lightColors;
  // Updated: Use gold from CSS variables for window lights in dark mode
  const windowLightColor = theme === 'dark' ? '#FFD700' : '#fef3c7'; 
  
  return createDirectParallaxEffect({
    count,
    colors,
    minSize: 60,
    maxSize: 200,
    scrollFactor: 0,  // No vertical scrolling for skyline
    mouseFactor,
    type: 'skyline'
  });
}