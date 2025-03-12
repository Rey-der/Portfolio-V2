/**
 * Utility functions for creating consistent glass morphism styles across the application
 */

/**
 * Returns the appropriate glass styles based on theme and options
 * @param {Object} options - Configuration options
 * @param {boolean} options.isDarkMode - Whether the theme is dark mode
 * @param {string} options.direction - Direction of shadow ('up', 'down', or 'none')
 * @param {Object} options.customStyles - Additional styles to merge
 * @param {boolean} options.isHovered - Whether the element is hovered
 * @param {boolean} options.isButton - Whether the element is a button (changes some default values)
 * @param {string} options.accentColor - Optional color tint in rgba/hex format (example: 'rgba(59, 130, 246, 0.1)' for blue tint)
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
      // Dark mode base colors
      const baseColor = isButton && isHovered 
        ? 'rgba(30, 41, 59, 0.55)'
        : 'rgba(15, 23, 42, 0.35)';
        
      // Apply accent color if provided
      bgColor = accentColor 
        ? `linear-gradient(to bottom, ${baseColor}, ${adjustOpacity(accentColor, 0.1)})`
        : baseColor;
    } else {
      // Light mode base colors
      const baseColor = isButton && isHovered
        ? 'rgba(241, 245, 249, 0.9)'
        : 'rgba(241, 245, 249, 0.8)';
        
      // Apply accent color if provided
      bgColor = accentColor
        ? `linear-gradient(to bottom, ${baseColor}, ${adjustOpacity(accentColor, 0.07)})`
        : baseColor;
    }
    
    // Theme-specific styles
    let themeStyles = {};
    
    if (isDarkMode) {
      themeStyles = {
        background: bgColor,
        border: isButton
          ? `1px solid rgba(148, 163, 184, ${0.05 + (frostIntensity * 0.04)})`
          : 'none',
        borderColor: `rgba(148, 163, 184, ${0.05 + (frostIntensity * 0.04)})`,
      };
      
      // Add hover effect for buttons
      if (isButton && isHovered) {
        themeStyles.boxShadow = accentColor
          ? `0 4px 12px ${adjustOpacity(accentColor, 0.25)}, 0 0 0 1px ${adjustOpacity(accentColor, 0.2)}`
          : '0 4px 12px rgba(59, 130, 246, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.15)';
      } else if (shadowStyle) {
        themeStyles.boxShadow = shadowStyle;
      }
    } else {
      // Light mode styles
      themeStyles = {
        background: bgColor,
        border: isButton
          ? `1px solid rgba(148, 163, 184, ${0.25 + (frostIntensity * 0.15)})`
          : 'none',
        borderColor: `rgba(148, 163, 184, ${0.25 + (frostIntensity * 0.15)})`,
      };
      
      // Add hover effect for buttons
      if (isButton && isHovered) {
        themeStyles.boxShadow = accentColor
          ? `0 4px 12px ${adjustOpacity(accentColor, 0.3)}, 0 0 0 1px ${adjustOpacity(accentColor, 0.25)}`
          : '0 4px 12px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.25)';
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
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
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
   * Returns appropriate text color classes based on theme
   * @param {boolean} isDarkMode - Whether the theme is dark mode
   * @param {string} accentColor - Optional accent color class name
   * @returns {string} - Tailwind CSS classes for text color
   */
  export const getGlassTextClasses = (isDarkMode = true, accentColor = null) => {
    // Default classes based on theme
    const defaultClasses = isDarkMode
      ? "text-gray-300 hover:text-white transition-colors duration-200"
      : "text-gray-600 hover:text-gray-900 transition-colors duration-200";
      
    // Return with accent color if provided
    return accentColor ? `${defaultClasses} ${accentColor}` : defaultClasses;
  };
  
  /**
   * Returns the class names for a glass container
   * @param {boolean} isDarkMode - Whether the theme is dark mode
   * @returns {string} - Tailwind CSS classes for the container
   */
  export const getGlassContainerClasses = (isDarkMode = true) => {
    return `backdrop-blur-xl transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`;
  };