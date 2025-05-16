import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProjectCarousel from '../components/ProjectCarousel';
import ProjectCard from '../components/ProjectCard';
import useProgressiveLoading from '../hooks/useProgressiveLoading';
import { projectsData, projectCategories, projectsUIText, getProjectsData, getProjectCategories, getProjectsUIText } from '../data/projectsData';
import { useLanguage } from '../context/LanguageContext';
import { FaThLarge, FaStream } from 'react-icons/fa';
import useSectionRegistration from '../hooks/useSectionRegistration';
import SectionTriggers from '../components/SectionTriggers';
import { useTheme } from '../utils/useTheme';

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

  // Get theme context
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

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
    <div className="skyline-cloak">
      {/* Corner lines wrapper removed - now in App.jsx */}
      
      <section
        id="projects"
        ref={sectionRef}
        data-section="projects"
        className="relative overflow-x-hidden"
        style={{
          scrollMarginTop: '120px',
          position: 'relative',
          zIndex: 150, // INCREASED: Higher than the lines (100)
        }}
      >
        <div
          className="py-20 relative"
          style={{
            minHeight: 'calc(100vh - 80px)',
            paddingBottom: '100px',
            paddingLeft: 'var(--section-padding-x)',
            paddingRight: 'var(--section-padding-x)',
            position: 'relative',
            zIndex: 160, // INCREASED: Higher than section
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
              zIndex: -1 // Keep this behind everything
            }}
          />

          {/* Content container with explicit high z-index */}
          <div 
            className="max-w-7xl mx-auto relative"
            style={{ 
              position: 'relative',
              zIndex: 165  // INCREASED: Above container background
            }}
          >
            <motion.div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-text dark:text-dark-text mb-4">
                {currentUIText.sectionTitle}
              </h2>
              <p className="text-lg text-secondary dark:text-secondary max-w-3xl mx-auto">
                {currentUIText.sectionSubtitle}
              </p>
            </motion.div>

            {/* Category Filter with View Toggle */}
            <div 
              className="flex flex-wrap items-center justify-between gap-4 mb-8"
              style={{ position: 'relative', zIndex: 170 }} // INCREASED: Higher z-index for interactive elements
            >
              {/* Filter buttons */}
              <div className="flex flex-wrap gap-2 justify-center mx-auto md:mx-0">
                {currentCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleFilterClick(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeFilter === category.id
                        ? 'bg-primary text-white dark:text-dark-background'
                        : 'bg-surface dark:bg-dark-surface text-text dark:text-secondary hover:bg-accent dark:hover:bg-dark-accent'
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
                  className="md:flex items-center gap-2 px-4 py-2 bg-background dark:bg-dark-surface rounded-full shadow-md hover:bg-surface dark:hover:bg-dark-accent transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={viewMode === 'carousel' ? "Switch to grid view" : "Switch to carousel view"}
                  title={viewMode === 'carousel' ? "Switch to grid view" : "Switch to carousel view"}
                >
                  {viewMode === 'carousel' ? (
                    <>
                      <FaThLarge className="text-text dark:text-dark-text" />
                      <span className="text-sm font-medium text-text dark:text-dark-text">Grid View</span>
                    </>
                  ) : (
                    <>
                      <FaStream className="text-text dark:text-dark-text" />
                      <span className="text-sm font-medium text-text dark:text-dark-text">Carousel View</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>

            {/* Projects View - Ensure proper z-index for both view modes */}
            {!isMobileView && viewMode === 'carousel' ? (
              <div 
                className="w-full"
                style={{ position: 'relative', zIndex: 165 }} // INCREASED: Higher than base container
              >
                <ProjectCarousel projects={filteredProjects} />
              </div>
            ) : (
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                style={{ position: 'relative', zIndex: 165 }} // INCREASED: Higher than base container
              >
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
              <div 
                className="text-center py-12"
                style={{ position: 'relative', zIndex: 165 }} // INCREASED: Higher than base container
              >
                <p className="text-secondary dark:text-secondary">
                  {currentUIText.emptyState}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;