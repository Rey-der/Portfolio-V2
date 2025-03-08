import React from 'react';
import PropTypes from 'prop-types';

const ProjectCard = ({ project }) => {
    const { 
        image, 
        title, 
        description, 
        liveDemo, 
        github,
        technologies = [], 
        imageAlt
    } = project || {};
    
    // Create a descriptive alt text if none provided
    const altText = imageAlt || `Screenshot of ${title || 'project'} showing the user interface`;
    
    // Add the return statement with the card UI
    return (
        <div className="project-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg dark:hover:shadow-gray-700 hover:-translate-y-1">
            {image && (
                <div className="project-image-container aspect-video relative overflow-hidden">
                    <img 
                        src={image} 
                        alt={altText}
                        className="project-image w-full h-full object-cover" 
                        loading="lazy"
                    />
                </div>
            )}
            
            <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
                
                {technologies.length > 0 && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                            {technologies.map((tech, index) => (
                                <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="flex space-x-3 mt-3">
                    {github && (
                        <a 
                            href={github} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn-outline-primary text-sm"
                            aria-label={`View ${title} code on GitHub`}
                        >
                            GitHub
                        </a>
                    )}
                    {liveDemo && (
                        <a 
                            href={liveDemo} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn-primary text-sm"
                            aria-label={`View live demo of ${title}`}
                        >
                            Live Demo
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

// Add prop validation with imageAlt
ProjectCard.propTypes = {
    project: PropTypes.shape({
        image: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        liveDemo: PropTypes.string,
        github: PropTypes.string,
        technologies: PropTypes.arrayOf(PropTypes.string),
        imageAlt: PropTypes.string,
    }).isRequired
};

export default ProjectCard;