import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { useInView } from 'react-intersection-observer';
import useProgressiveLoading from '../hooks/useProgressiveLoading';

// Project data - you can move this to a separate file later
const projectsData = [
  {
    id: 1,
    title: "3D Game Engine",
    description: "A custom-built 3D game engine with physics simulation, material rendering, and support for multiplayer functionality.",
    image: "/images/projects/game-engine.jpg", // Replace with actual image path
    categories: ["game"],
    githubUrl: "https://github.com/yourusername/game-engine",
    demoUrl: "https://your-game-demo.com",
    technologies: ["C++", "OpenGL", "WebGL", "JavaScript"]
  },
  {
    id: 2,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce application with user authentication, product catalog, shopping cart, and payment processing functionality.",
    image: "/images/projects/ecommerce.jpg", // Replace with actual image path
    categories: ["web", "fullstack"],
    githubUrl: "https://github.com/yourusername/ecommerce",
    liveUrl: "https://your-ecommerce.com",
    technologies: ["React", "Node.js", "MongoDB", "Stripe API"]
  },
  {
    id: 3,
    title: "Virtual Reality Puzzle Game",
    description: "An immersive VR puzzle-solving experience featuring interactive environments and physics-based challenges.",
    image: "/images/projects/vr-game.jpg",
    categories: ["game"],
    githubUrl: "https://github.com/yourusername/vr-puzzle",
    demoUrl: "https://vr-puzzle-showcase.com",
    technologies: ["Unity", "C#", "Oculus SDK", "3D Modeling"]
  },
  {
    id: 4,
    title: "Company Website",
    description: "A responsive corporate website with CMS integration, analytics dashboard, and optimized for search engines.",
    image: "/images/projects/company-website.jpg",
    categories: ["web"],
    githubUrl: "https://github.com/yourusername/company-site",
    liveUrl: "https://example-company.com",
    technologies: ["React", "Tailwind CSS", "GraphQL", "Netlify CMS"]
  },
  {
    id: 5,
    title: "Banking Management System",
    description: "Comprehensive banking platform with secure transaction processing, account management, and reporting features.",
    image: "/images/projects/banking-system.jpg",
    categories: ["fullstack"],
    githubUrl: "https://github.com/yourusername/banking-system",
    liveUrl: "https://banking-demo.com",
    technologies: ["Java", "Spring Boot", "PostgreSQL", "Docker", "Kubernetes"]
  }
];

// Available category filters - removed frontend and mobile
const categories = [
  { id: 'all', label: 'All' },
  { id: 'web', label: 'Web' },
  { id: 'fullstack', label: 'Fullstack' },
  { id: 'game', label: 'Game Dev' }
];

const Projects = ({ registerWithURL }) => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [filteredProjects, setFilteredProjects] = useState([]);
    
    // Create a section ref for registration
    const sectionRef = useRef(null);
    
    // Keep animation functionality with useInView
    const { ref: animationRef, inView } = useInView({ threshold: 0.1 });
    
    // Combine refs for both registration and animation
    const setRefs = element => {
      sectionRef.current = element;
      animationRef(element);
    };
  
    // Update filtered projects when active filter changes
    useEffect(() => {
      if (activeFilter === 'all') {
        setFilteredProjects(projectsData);
      } else {
        const filtered = projectsData.filter(project => 
          project.categories.includes(activeFilter)
        );
        setFilteredProjects(filtered);
      }
    }, [activeFilter]);
  
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
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">My Projects</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Explore my recent work across different development areas and technologies.
            </p>
          </motion.div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
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
                key={project.id}
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
                No projects found in this category. Try selecting a different filter.
              </p>
            </div>
          )}
        </div>
      </section>
    );
};

export default Projects;