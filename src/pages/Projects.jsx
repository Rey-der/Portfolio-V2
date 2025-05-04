import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProjectCarousel from '../components/ProjectCarousel';
import ProjectCard from '../components/ProjectCard';
import useProgressiveLoading from '../hooks/useProgressiveLoading';
import { projectsData, projectCategories, projectsUIText, getProjectsData, getProjectCategories, getProjectsUIText } from '../data/projectsData';
import { useLanguage } from '../context/LanguageContext';
import { FaThLarge, FaStream } from 'react-icons/fa';
import useSectionRegistration from '../hooks/useSectionRegistration'; // Import the hook
import SectionTriggers from '../components/SectionTriggers'; // Import SectionTriggers

const Projects = ({ registerWithURL }) => {
  // Use the custom registration hook
  const { sectionRef } = useSectionRegistration('projects', registerWithURL);

  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState(projectsData);
  const [isMobileView, setIsMobileView] = useState(false);
  // Initialize viewMode based on screen size - we'll set this in useEffect
  const [viewMode, setViewMode] = useState('grid');

  // Language context with fallback to standard exported data
  const { currentLanguage } = useLanguage();
  const currentProjectsData = getProjectsData(currentLanguage) || projectsData;
  const currentCategories = getProjectCategories(currentLanguage) || projectCategories;
  const currentUIText = getProjectsUIText(currentLanguage) || projectsUIText;
  
  // Check screen size and set view mode accordingly
  useEffect(() => {
    const checkScreenSize = () => {
      const isMobile = window.innerWidth < 768; // Match Tailwind's md breakpoint
      setIsMobileView(isMobile);
      
      // Set initial view mode: carousel for large screens, grid for mobile
      if (isMobile) {
        setViewMode('grid');
      } else if (!isMobile && viewMode === 'grid') {
        // Only auto-switch to carousel on initial load, not on every resize
        // This allows users to manually choose grid on desktop if they prefer
        if (window.initialViewModeSet !== true) {
          setViewMode('carousel');
          window.initialViewModeSet = true;
        }
      }
    };
    
    // Set initial view based on screen size
    checkScreenSize();
    
    // Update on window resize
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [viewMode]);

  // Update filtered projects when active filter or language changes
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProjects(currentProjectsData);
    } else {
      const filtered = currentProjectsData.filter(project =>
        project.categories.includes(activeFilter)
      );
      setFilteredProjects(filtered);
    }
  }, [activeFilter, currentLanguage, currentProjectsData]);

  // Preload the next section
  useProgressiveLoading(['/src/pages/About.jsx']);

  // Handle filter change
  const handleFilterClick = (categoryId) => {
    setActiveFilter(categoryId);
  };

  // Modified toggle view mode - without forced scrolling
  const toggleViewMode = () => {
    // Only allow switching to carousel if not on mobile
    if (isMobileView && viewMode === 'grid') {
      return; // Don't allow switching to carousel on mobile
    }
    
    const newMode = viewMode === 'carousel' ? 'grid' : 'carousel';
    setViewMode(newMode);
    
    // Allow natural recalculation without forcing section visibility
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('layout-change', {
        detail: { section: 'projects', viewMode: newMode }
      }));
    }, 250); // Allow layout to settle
  };

  return (
    // Section now handles overflow and relative positioning for the wide background effect
    <section 
      id="projects" 
      ref={sectionRef} 
      data-section="projects"
      className="relative overflow-x-hidden bg-slate-50 dark:bg-slate-900" // Added overflow-x-hidden
      style={{
        scrollMarginTop: '120px',
      }}
    >
      {/* Inner container for the wide background effect */}
      <div 
        className="py-20 px-4 sm:px-6 lg:px-8 relative" // Keep padding for content alignment
        style={{
          minHeight: 'calc(100vh - 80px)',
          paddingBottom: '100px',
          // Make the background wider using negative margins and padding
          marginLeft: '-5vw', // Pull background left
          marginRight: '-5vw', // Pull background right
          paddingLeft: '5vw', // Push content back in
          paddingRight: '5vw', // Push content back in
        }}
      >
        {/* Add invisible triggers at start and end */}
        <SectionTriggers sectionId="projects" />
        
        {/* Single section marker for visibility */}
        <div id="projects-visibility-center" 
          style={{
            position: 'absolute', 
            top: '50%', 
            left: 0,
            width: '100%',
            height: '100px',
            pointerEvents: 'none',
            zIndex: -1
          }}
        />
        
        {/* Max-width container for the actual content */}
        <div className="max-w-7xl mx-auto relative"> 
          <motion.div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {currentUIText.sectionTitle}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              {currentUIText.sectionSubtitle}
            </p>
          </motion.div>

          {/* Category Filter with View Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 justify-center mx-auto md:mx-0">
              {currentCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleFilterClick(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            
            {/* View mode toggle button - only shown on larger screens */}
            {!isMobileView && (
              <motion.button
                onClick={toggleViewMode}
                className="md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={viewMode === 'carousel' ? "Switch to grid view" : "Switch to carousel view"}
                title={viewMode === 'carousel' ? "Switch to grid view" : "Switch to carousel view"}
              >
                {viewMode === 'carousel' ? (
                  <>
                    <FaThLarge className="text-slate-800 dark:text-white" />
                    <span className="text-sm font-medium text-slate-800 dark:text-white">Grid View</span>
                  </>
                ) : (
                  <>
                    <FaStream className="text-slate-800 dark:text-white" />
                    <span className="text-sm font-medium text-slate-800 dark:text-white">Carousel View</span>
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Projects View - Always grid on mobile, conditional on larger screens */}
          {!isMobileView && viewMode === 'carousel' ? (
            <div className="w-full">
              <ProjectCarousel projects={filteredProjects} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <div key={project.id} className="h-full">
                  <ProjectCard 
                    {...project} 
                    isActive={true} 
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty state when no projects match filter */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">
                {currentUIText.emptyState}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;