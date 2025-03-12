import React from 'react';
import { motion } from 'framer-motion';

// Animation preset for the indicator
const animations = {
  dot: { stiffness: 250, damping: 25 }
};

const ProgressBar = ({ currentIndex, total, onChange }) => {
  // Calculate the normalized current position (0 to 1)
  const normalizedPosition = total > 1 ? currentIndex / (total - 1) : 0;
  
  // Number of small ticks between each pair of major ticks
  const smallTicksPerSegment = 4;
  
  // Function to calculate small tick height based on proximity to dot
  const getTickHeight = (tickPosition) => {
    // Calculate distance from current position (0-1 scale)
    const distance = Math.abs(normalizedPosition - tickPosition);
    
    // Max distance effect is 0.15 (15% of total width)
    const maxDistanceEffect = 0.15;
    
    // If the tick is within the effect range of the dot
    if (distance < maxDistanceEffect) {
      // Calculate growth factor (1 = full size, 0 = minimum size)
      const growthFactor = 1 - (distance / maxDistanceEffect);
      // Apply easing function to make growth more natural
      const easedGrowth = Math.sin(growthFactor * Math.PI/2);
      // Return height between 4px and 14px based on proximity
      return 4 + (easedGrowth * 10);
    }
    
    // Default small tick height
    return 4;
  };

  // Generate small ticks data - more dynamic approach
  const generateSmallTicks = () => {
    if (total <= 1) return []; // No small ticks needed for 0 or 1 projects
    
    const ticks = [];
    
    // For each segment between major ticks
    for (let i = 0; i < total - 1; i++) {
      const startPos = i / (total - 1);
      const endPos = (i + 1) / (total - 1);
      const segmentWidth = endPos - startPos;
      
      // Create small ticks within this segment
      for (let j = 1; j <= smallTicksPerSegment; j++) {
        const relativePosition = j / (smallTicksPerSegment + 1);
        const tickPosition = startPos + (segmentWidth * relativePosition);
        
        ticks.push({
          position: tickPosition,
          height: getTickHeight(tickPosition)
        });
      }
    }
    
    return ticks;
  };
  
  const smallTicks = generateSmallTicks();

  return (
    <div 
      className="w-3/4 max-w-lg relative"
      style={{ 
        height: '20px',
        marginTop: '10px',
        marginBottom: '10px',
      }}
    >
      {/* Base line */}
      <div 
        className="absolute left-0 right-0 bg-gray-300 dark:bg-gray-700"
        style={{
          height: '2px',
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0.5
        }}
      />
      
      {/* Major ticks (big lines at each position) */}
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={`major-${index}`}
          className="absolute bg-gray-500 dark:bg-gray-400 cursor-pointer"
          style={{ 
            left: total > 1 ? `${(index / (total - 1)) * 100}%` : '50%',
            height: '14px',
            width: '2px',
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: 0.8
          }}
          onClick={() => onChange(index)}
          aria-label={`Go to item ${index + 1}`}
        />
      ))}
      
      {/* Small ticks between positions that grow based on dot proximity */}
      {smallTicks.map((tick, index) => (
        <motion.div
          key={`minor-${index}`}
          className="absolute bg-gray-400 dark:bg-gray-500"
          initial={{ height: 4 }}
          animate={{ 
            height: tick.height,
            opacity: 0.3 + (tick.height - 4) / 20
          }}
          style={{ 
            left: `${tick.position * 100}%`,
            width: '1px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          transition={{ duration: 0.2 }}
        />
      ))}
      
      {/* Clickable areas */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={`segment-${index}`}
            className="h-full cursor-pointer"
            style={{ 
              width: index === 0 || index === total - 1 
                ? `${100 / (total * 2)}%` 
                : `${100 / total}%`,
              marginLeft: index === 0 ? 0 : `${100 / (total * 2)}%`,
              marginRight: index === total - 1 ? 0 : `${100 / (total * 2)}%`
            }}
            onClick={() => onChange(index)}
          />
        ))}
      </div>
      
      {/* Moving dot */}
      <motion.div
        className="absolute top-1/2 w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-400 z-10"
        style={{ 
          transform: 'translate(-50%, -50%)',
          boxShadow: "0 0 4px rgba(59, 130, 246, 0.5)"
        }}
        initial={false}
        animate={{ 
          left: total > 1 ? `${normalizedPosition * 100}%` : '50%'
        }}
        transition={{ type: 'spring', ...animations.dot }}
      />
    </div>
  );
};

export default ProgressBar;