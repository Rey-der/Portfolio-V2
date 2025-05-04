/**
 * Utility functions for creating consistent glass morphism styles across the application
 * Uses CSS variables defined in index.css for theme consistency
 */

/**
 * Returns the appropriate glass styles based on theme and options
 * @param {Object} options - Configuration options
 * @param {boolean} options.isDarkMode - Whether the theme is dark mode
 * @param {string} options.direction - Direction of shadow ('up', 'down', or 'none')
 * @param {Object} options.customStyles - Additional styles to merge
 * @param {boolean} options.isHovered - Whether the element is hovered
 * @param {boolean} options.isButton - Whether the element is a button (changes some default values)
 * @param {string} options.accentColor - Optional color tint in rgba/hex format
 * @param {number} options.frostIntensity - Controls blur intensity (0.0 to 1.0, default 0.5)
 * @returns {Object} - The style object to apply to the component
 */
export const getGlassStyles = ({
  isDarkMode = true,
  direction = 'none',
  customStyles = {},
  isHovered = false,
  isButton = false,
  accentColor = null,
  frostIntensity = 0.5
} = {}) => {
  // Normalize frost intensity to 0-1 range
  frostIntensity = Math.max(0, Math.min(1, frostIntensity));
  
  // Calculate blur amount based on intensity (8px to 20px range)
  const blurAmount = 8 + (frostIntensity * 12);
  
  // Base styles for both themes
  const baseStyles = {
    borderRadius: '4px',
    transition: 'all 0.2s ease-in-out',
    backdropFilter: `blur(${blurAmount}px)`,
  };
  
  // Size styles for buttons
  const buttonSize = isButton ? {
    width: '36px',
    height: '36px',
  } : {};
  
  // Get CSS variables from the document
  const getCSSVariable = (name, fallback) => {
    if (typeof window === 'undefined' || !document.documentElement) {
      return fallback;
    }
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  };
  
  // Get theme colors from CSS variables
  const glassBackground = getCSSVariable('--glassBackground', isDarkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.8)');
  const borderColor = getCSSVariable('--border', isDarkMode ? '#3c3c3c' : '#e0e0e0');
  const primaryColor = getCSSVariable('--primary', isDarkMode ? '#0078d7' : '#1a73e8');
  
  // Direction-specific shadow
  let shadowStyle = '';
  if (direction === 'up') {
    shadowStyle = isDarkMode
      ? `0 -8px 32px rgba(0, 0, 0, ${0.03 + (frostIntensity * 0.04)}), inset 0 1px 0 rgba(255, 255, 255, ${0.02 + (frostIntensity * 0.03)})`
      : `0 -8px 24px rgba(203, 213, 225, ${0.3 + (frostIntensity * 0.2)}), 0 -2px 4px rgba(148, 163, 184, ${0.1 + (frostIntensity * 0.1)}), inset 0 1px 0 rgba(255, 255, 255, ${0.4 + (frostIntensity * 0.3)})`;
  } else if (direction === 'down') {
    shadowStyle = isDarkMode
      ? `0 8px 32px rgba(0, 0, 0, ${0.03 + (frostIntensity * 0.04)}), inset 0 -1px 0 rgba(255, 255, 255, ${0.02 + (frostIntensity * 0.03)})`
      : `0 8px 24px rgba(203, 213, 225, ${0.3 + (frostIntensity * 0.2)}), 0 2px 4px rgba(148, 163, 184, ${0.1 + (frostIntensity * 0.1)}), inset 0 -1px 0 rgba(255, 255, 255, ${0.4 + (frostIntensity * 0.3)})`;
  }
  
  // Calculate background colors with potential accent tint
  let bgColor;
  if (isDarkMode) {
    // Dark mode base colors - use CSS variable
    const baseColor = isButton && isHovered 
      ? adjustOpacity(glassBackground, isHovered ? 0.95 : 0.85)  // More opaque on hover
      : glassBackground;
      
    // Apply accent color if provided
    bgColor = accentColor 
      ? `linear-gradient(to bottom, ${baseColor}, ${adjustOpacity(accentColor, 0.1)})`
      : baseColor;
  } else {
    // Light mode base colors - use CSS variable
    const baseColor = isButton && isHovered
      ? adjustOpacity(glassBackground, isHovered ? 0.95 : 0.8)  // More opaque on hover
      : glassBackground;
      
    // Apply accent color if provided
    bgColor = accentColor
      ? `linear-gradient(to bottom, ${baseColor}, ${adjustOpacity(accentColor, 0.07)})`
      : baseColor;
  }
  
  // Theme-specific styles
  let themeStyles = {};
  
  if (isDarkMode) {
    // Convert border color to rgba for opacity adjustment
    const rgbaBorder = hexToRGBA(borderColor, 0.05 + (frostIntensity * 0.04));
    
    themeStyles = {
      background: bgColor,
      border: isButton ? `1px solid ${rgbaBorder}` : 'none',
      borderColor: rgbaBorder,
    };
    
    // Add hover effect for buttons
    if (isButton && isHovered) {
      const hoverAccent = accentColor || primaryColor;
      themeStyles.boxShadow = `0 4px 12px ${adjustOpacity(hoverAccent, 0.25)}, 0 0 0 1px ${adjustOpacity(hoverAccent, 0.2)}`;
    } else if (shadowStyle) {
      themeStyles.boxShadow = shadowStyle;
    }
  } else {
    // Light mode - convert border color to rgba
    const rgbaBorder = hexToRGBA(borderColor, 0.25 + (frostIntensity * 0.15));
    
    themeStyles = {
      background: bgColor,
      border: isButton ? `1px solid ${rgbaBorder}` : 'none',
      borderColor: rgbaBorder,
    };
    
    // Add hover effect for buttons
    if (isButton && isHovered) {
      const hoverAccent = accentColor || primaryColor;
      themeStyles.boxShadow = `0 4px 12px ${adjustOpacity(hoverAccent, 0.3)}, 0 0 0 1px ${adjustOpacity(hoverAccent, 0.25)}`;
    } else if (shadowStyle) {
      themeStyles.boxShadow = shadowStyle;
    }
  }
  
  // Combine all styles, with custom styles taking precedence
  return {
    ...baseStyles,
    ...buttonSize,
    ...themeStyles,
    ...customStyles
  };
};

/**
 * Adjusts opacity of a color string
 * @param {string} color - Color in rgba or hex format
 * @param {number} opacity - New opacity value (0-1)
 * @returns {string} - Color with adjusted opacity
 */
function adjustOpacity(color, opacity) {
  // Handle hex colors
  if (color.startsWith('#')) {
    return hexToRGBA(color, opacity);
  }
  
  // Handle rgba colors
  if (color.startsWith('rgba')) {
    return color.replace(/rgba\((.+),\s*[\d.]+\)/, `rgba($1, ${opacity})`);
  }
  
  // Handle rgb colors
  if (color.startsWith('rgb')) {
    return color.replace(/rgb\((.+)\)/, `rgba($1, ${opacity})`);
  }
  
  return color;
}

/**
 * Converts hex color to rgba
 * @param {string} hex - Hex color code
 * @param {number} opacity - Opacity value (0-1)
 * @returns {string} - RGBA color string
 */
function hexToRGBA(hex, opacity) {
  let c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    c = hex.substring(1).split('');
    if(c.length === 3){
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x'+c.join('');
    return `rgba(${[(c>>16)&255, (c>>8)&255, c&255].join(',')}, ${opacity})`;
  }
  // Return original if not hex
  return hex;
}

/**
 * Returns appropriate text color classes based on theme
 * Uses CSS variables for text colors
 * @param {boolean} isDarkMode - Whether the theme is dark mode
 * @param {string} accentColor - Optional accent color class name
 * @returns {string} - Tailwind CSS classes for text color
 */
export const getGlassTextClasses = (isDarkMode = true, accentColor = null) => {
  // Default classes based on theme - using Tailwind classes that reference CSS variables
  const defaultClasses = isDarkMode
    ? "text-dark-text hover:text-white transition-colors duration-200"
    : "text-secondary hover:text-gray-900 transition-colors duration-200";
    
  // Return with accent color if provided
  return accentColor ? `${defaultClasses} ${accentColor}` : defaultClasses;
};

/**
 * Returns the class names for a glass container
 * @param {boolean} isDarkMode - Whether the theme is dark mode
 * @returns {string} - Tailwind CSS classes for the container
 */
export const getGlassContainerClasses = (isDarkMode = true) => {
  // Using Tailwind classes that reference CSS variables via Tailwind config
  return `backdrop-blur-xl transition-all duration-300 ${isDarkMode ? 'text-dark-text' : 'text-secondary'}`;
};