import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { useInView } from 'react-intersection-observer';
import useProgressiveLoading from '../hooks/useProgressiveLoading';
import { projectsData, projectCategories, projectsUIText, getProjectsData, getProjectCategories, getProjectsUIText } from '../data/projectsData';
import { useLanguage } from '../context/LanguageContext'; // Import useLanguage hook

const Projects = ({ registerWithURL }) => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [filteredProjects, setFilteredProjects] = useState(projectsData);
    
    // Language context with fallback to standard exported data
    const { currentLanguage } = useLanguage();
    const currentProjectsData = getProjectsData(currentLanguage) || projectsData;
    const currentCategories = getProjectCategories(currentLanguage) || projectCategories;
    const currentUIText = getProjectsUIText(currentLanguage) || projectsUIText;
    
    // Create a section ref for registration
    const sectionRef = useRef(null);
    
    // Keep animation functionality with useInView
    const { ref: animationRef, inView } = useInView({ threshold: 0.1 });
    
    // Combine refs for both registration and animation
    const setRefs = element => {
      sectionRef.current = element;
      animationRef(element);
    };
  
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
    }, [activeFilter, currentLanguage]);
  
    // Register section with new URL-aware registration function
    useEffect(() => {
      if (sectionRef.current && registerWithURL) {
        return registerWithURL('projects', sectionRef);
      }
    }, [registerWithURL]);
    
    // Preload the next section
    useProgressiveLoading(['/src/pages/About.jsx']);

    // Handle filter change
    const handleFilterClick = (categoryId) => {
      setActiveFilter(categoryId);
    };

    return (
      <section id="projects" ref={setRefs} className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {currentUIText.sectionTitle}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              {currentUIText.sectionSubtitle}
            </p>
          </motion.div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
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
          
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </div>
          
          {/* Empty state when no projects match filter */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">
                {currentUIText.emptyState}
              </p>
            </div>
          )}
        </div>
      </section>
    );
};

export default Projects;