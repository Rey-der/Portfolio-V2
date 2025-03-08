import React, { useEffect, useMemo } from 'react';
import ProjectCard from '../components/ProjectCard';
import useSectionObserver from '../hooks/useSectionObserver';
import { useScroll } from '../context/ScrollContext';
import useProgressiveLoading from '../hooks/useProgressiveLoading';
import useDeviceDetection from '../utils/useDeviceDetection';

const Projects = () => {
    const [sectionRef, inView] = useSectionObserver('projects', '/projects');
    const { registerSection } = useScroll();
    
    // Add device detection for responsive adjustments
    const isMobile = useDeviceDetection();
    
    // Register this section with the scroll context
    useEffect(() => {
        // Ensure ref exists and has current value before registering
        if (sectionRef && sectionRef.current) {
            const unregister = registerSection('projects', sectionRef);
            return () => {
                if (unregister) unregister();
            };
        }
    }, [registerSection, sectionRef]);
    
    // Preload the About section
    useProgressiveLoading(['/src/pages/About.jsx']);

    // Memoize project data with actual content
    const projects = useMemo(() => [
        {
            title: "Portfolio Website",
            description: "A modern portfolio website built with React and Tailwind CSS, featuring smooth scrolling and dark mode.",
            image: "/images/projects/portfolio.jpg", 
            technologies: ["React", "Tailwind CSS", "Vite"],
            github: "https://github.com/yourusername/portfolio",
            liveDemo: "https://your-portfolio-url.com"
        },
        {
            title: "Task Manager App",
            description: "A full-stack task management application with user authentication and real-time updates.",
            image: "/images/projects/taskapp.jpg",
            technologies: ["React", "Node.js", "MongoDB", "Express"],
            github: "https://github.com/yourusername/task-manager",
            liveDemo: "https://your-task-app.com"
        },
        {
            title: "E-commerce Platform",
            description: "A responsive e-commerce website with product filtering, cart functionality, and secure checkout.",
            image: "/images/projects/ecommerce.jpg",
            technologies: ["React", "Redux", "Node.js", "Stripe"],
            github: "https://github.com/yourusername/ecommerce",
            liveDemo: "https://your-shop.com"
        }
    ], []);

    return (
        <section ref={sectionRef} id="projects" className="projects-container min-h-screen pb-16">
            <h1 className="text-4xl font-bold mb-8">My Projects</h1>
            <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                {projects.map((project, index) => (
                    <ProjectCard 
                      key={index} 
                      project={project}
                      isMobile={isMobile} // Pass the mobile state to cards if needed
                    />
                ))}
            </div>
        </section>
    );
};

export default Projects;