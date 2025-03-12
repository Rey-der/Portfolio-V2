import React, { forwardRef, useRef, useImperativeHandle, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaGlobe } from 'react-icons/fa';

const ProjectCard = forwardRef(({ 
  title, 
  description, 
  image, 
  categories, 
  githubUrl, 
  demoUrl, 
  liveUrl, 
  technologies,
  isActive,
  isAdjacent = false,
  buttonsDisabled = false,
  isSideHovered = false,
  partialProgress = 0,
  style = {}
}, ref) => {
  const cardRef = useRef(null);
  // Track hover state manually instead of relying on whileHover
  const [isHovered, setIsHovered] = useState(false);
  
  useImperativeHandle(ref, () => ({
    getNode: () => cardRef.current,
    applyPartialAnimation: (progress) => {
      if (!cardRef.current) return;
    }
  }));
  
  // Calculate hover style - more responsive when adjacent or active
  const hoverY = isHovered ? (isActive ? -5 : isAdjacent ? -3 : 0) : 0;
  
  // Calculate scale effect based on side hover or manual hover
  const scaleEffect = isHovered || isSideHovered ? 1.03 : 1;
  
  // Combine styles from parent with local styles
  const combinedStyle = {
    ...style,
    transform: partialProgress ? `translateX(${partialProgress * 20}px)` : undefined
  };
  
  return (
    <motion.div 
      ref={cardRef}
      className={`bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg h-full flex flex-col
        ${isActive ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
      animate={{ 
        y: hoverY, 
        scale: scaleEffect 
      }}
      transition={{ duration: 0.3 }}
      style={combinedStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {/* Category badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {categories.map((category) => (
            <span 
              key={category} 
              className="px-2 py-1 text-xs font-medium rounded-full text-white"
              style={{ 
                backgroundColor: 
                  category === 'web' ? '#3b82f6' : 
                  category === 'fullstack' ? '#8b5cf6' : 
                  category === 'game' ? '#ef4444' : 
                  category === 'mobile' ? '#10b981' : 
                  '#6b7280' 
              }}
            >
              {category}
            </span>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 flex-grow">{description}</p>
        
        {/* Technologies */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {technologies.map((tech) => (
              <span 
                key={tech} 
                className="px-2 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        {/* Links - now keep hover state active */}
        <div 
          className="flex flex-wrap gap-2 mt-auto relative"
          // These handlers keep the card hovered state active when over buttons
          onMouseEnter={() => setIsHovered(true)}
          onMouseOver={() => setIsHovered(true)}
        >
          {githubUrl && !buttonsDisabled && (
            <a 
              href={githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white rounded-md text-sm hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
            >
              <FaGithub /> GitHub
            </a>
          )}
          
          {demoUrl && !buttonsDisabled && (
            <a 
              href={demoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
            >
              <FaExternalLinkAlt /> Live Demo
            </a>
          )}
          
          {liveUrl && !buttonsDisabled && (
            <a 
              href={liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
            >
              <FaGlobe /> In Use
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;