import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useSectionObserver from '../hooks/useSectionObserver';
import { useScroll } from '../context/ScrollContext';
import useProgressiveLoading from '../hooks/useProgressiveLoading';
import useDeviceDetection from '../utils/useDeviceDetection';

const About = () => {
    const navigate = useNavigate();
    const [sectionRef, inView, approaching] = useSectionObserver('about', '/about', {
      threshold: 0.01,
      responsive: true,
      earlyDetection: true 
    });
    const { registerSection } = useScroll();
    
    // Use device detection for responsive preload settings
    const isMobile = useDeviceDetection();
    const isTablet = useDeviceDetection(1024); // Use 1024px as tablet breakpoint
    
    // Handle icon visibility with the new system
    useEffect(() => {
        // Apply icons-ready class to section (integrated with the new icon visibility system)
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            // First mark as loading to prevent flicker
            aboutSection.classList.add('icons-loading');
            
            // After a delay, show icons with a smooth transition
            const timer = setTimeout(() => {
                aboutSection.classList.remove('icons-loading');
                aboutSection.classList.add('icons-ready');
                
                // Find all SVGs in this section and add icon-svg class
                const icons = aboutSection.querySelectorAll('svg');
                icons.forEach(icon => {
                    icon.classList.add('icon-svg');
                });
            }, 250); // Slightly shorter delay for subsequent page sections
            
            return () => clearTimeout(timer);
        }
    }, []);
    
    // Preload position handling with responsive settings from device detection
    const preloadRef = useRef(null);
    const [preloadOptions, setPreloadOptions] = useState({
      rootMargin: isMobile ? '200px 0px' : (isTablet ? '300px 0px' : '400px 0px')
    });
    
    // Update preload options when device type changes
    useEffect(() => {
      setPreloadOptions({
        rootMargin: isMobile ? '200px 0px' : (isTablet ? '300px 0px' : '400px 0px')
      });
    }, [isMobile, isTablet]);
    
    const { ref: approachingRef, inView: approachingSection } = useInView(preloadOptions);
    
    // Combine refs for preload trigger
    const setPreloadRefs = (element) => {
      preloadRef.current = element;
      if (typeof approachingRef === 'function') {
        approachingRef(element);
      }
    };
    
    // Animation state management
    const [shouldAnimate, setShouldAnimate] = useState(false);
    
    useEffect(() => {
      if (approaching || approachingSection || inView) {
        setShouldAnimate(true);
      }
    }, [approaching, approachingSection, inView]);
    
    const skillsRef = useRef(null);
    const skillsInView = useInView(skillsRef, { 
      once: false, 
      amount: 0.1,
      rootMargin: '100px 0px'
    });
    
    // Removed resize handler since we now use the hook
    
    // Register section with scroll context
    useEffect(() => {
        if (sectionRef && sectionRef.current) {
          const unregister = registerSection('about', sectionRef);
          return () => {
            if (unregister) unregister();
          };
        }
    }, [registerSection, sectionRef]);
    
    // Preload Contact section
    useProgressiveLoading(['/src/pages/Contact.jsx']);

    // Animation variants
    const containerVariants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.08
        }
      }
    };
    
    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.35, ease: "easeOut" }
      }
    };

    const skills = [
      { name: "JavaScript", icon: "💻", frameworks: "React, Vue" },
      { name: "CSS", icon: "🎨", frameworks: "Tailwind, Sass" },
      { name: "Node.js", icon: "⚙️", frameworks: "Express" },
      { name: "API Integration", icon: "🔄", frameworks: "REST, GraphQL" },
      { name: "Version Control", icon: "📝", frameworks: "Git" },
      { name: "UI/UX", icon: "✨", frameworks: "Figma" }
    ];

    // Contact navigation
    const handleContactClick = () => {
        navigate('/contact');
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 100);
    };

    return (
        <>
          {/* Preload trigger */}
          <div 
            ref={setPreloadRefs}
            className="h-1 w-full absolute z-0" 
            style={{ 
              bottom: typeof window !== 'undefined' ? window.innerHeight * 0.6 + 'px' : '60vh', 
              opacity: 0 
            }}
            aria-hidden="true"
          />
          
          <section 
            ref={sectionRef} 
            id="about" 
            className="min-h-screen py-16 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-dark-background dark:to-gray-900"
          >
            <div className="container mx-auto max-w-4xl">
              <motion.div
                className="space-y-12"
                variants={containerVariants}
                initial="hidden"
                animate={shouldAnimate ? "visible" : "hidden"}
              >
                {/* Rest of the component remains unchanged */}
                {/* Header with animated underline */}
                <motion.div variants={itemVariants} className="text-center">
                  <h1 className="text-4xl md:text-5xl font-bold mb-3 relative inline-block">
                    About Me
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform origin-left animate-expand"></div>
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                    Passionate developer focused on creating beautiful, functional, and user-friendly web applications
                  </p>
                </motion.div>
                
                {/* Bio with photo */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                    <img 
                      src="/assets/profile.jpg" 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Cpath d='M100,60 C113,60 124,71 124,84 C124,97 113,108 100,108 C87,108 76,97 76,84 C76,71 87,60 100,60 Z M140,150 L140,154 L60,154 L60,150 C60,129 78,112 100,112 C122,112 140,129 140,150 Z' fill='%23cccccc'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div className="space-y-4 text-center md:text-left">
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                      Welcome to my portfolio! I am a passionate developer with a love for creating beautiful and functional web applications.
                      My journey in web development started with a fascination for technology and design, and it has evolved into a career where I can combine both.
                    </p>
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                      I specialize in front-end development with React and modern JavaScript, creating responsive and accessible interfaces
                      that deliver exceptional user experiences across all devices.
                    </p>
                  </div>
                </motion.div>
                
                {/* Skills section */}
                <motion.div variants={itemVariants} ref={skillsRef}>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Skills & Technologies</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {skills.map((skill, index) => (
                      <motion.div 
                        key={skill.name}
                        className="bg-white dark:bg-dark-surface p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={skillsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <div className="text-3xl mb-2">{skill.icon}</div>
                        <h3 className="text-lg font-semibold mb-1">{skill.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{skill.frameworks}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* CTA button */}
                <motion.div variants={itemVariants} className="text-center pt-4">
                  <button 
                    onClick={handleContactClick}
                    className="btn-primary px-8 py-3 rounded-lg text-lg font-semibold shadow-md hover:shadow-lg transition-all hover:translate-y-[-2px]"
                  >
                    <span className="flex items-center justify-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="icon-svg h-5 w-5 mr-2" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Contact Me
                    </span>
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </>
    );
};

export default About;