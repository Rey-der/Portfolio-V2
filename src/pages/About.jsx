import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer'; 
import { useNavigate } from 'react-router-dom';
import useProgressiveLoading from '../hooks/useProgressiveLoading';
import useDeviceDetection from '../utils/useDeviceDetection';

const About = ({ registerWithURL }) => {
    const navigate = useNavigate();
    
    // Create a simple ref for registration
    const sectionRef = useRef(null);
    
    // Animation visibility detection - fix here
    const { ref: animationRef, inView } = useInView({ 
      threshold: 0.1,
      triggerOnce: false
    });
    
    // Combine refs for both registration and animation
    const setRefs = element => {
      sectionRef.current = element;
      // Fix the ref handling here
      animationRef(element); // This was causing the error
    };
    
    // Use device detection for responsive preload settings
    const isMobile = useDeviceDetection();
    const isTablet = useDeviceDetection(1024); // Use 1024px as tablet breakpoint
    
    // Register section with the new URL-aware registration function
    useEffect(() => {
      if (sectionRef.current && registerWithURL) {
        return registerWithURL('about', sectionRef);
      }
    }, [registerWithURL]);
    
    // Handle icon visibility with the new system
    useEffect(() => {
        // Apply icons-ready class to section
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

    // Preload Guestbook section
    useProgressiveLoading(['/src/pages/Guestbook.jsx']);

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

    // Skills data for the skill cards
    const skills = [
      { name: "React", level: 90, icon: "⚛️" },
      { name: "JavaScript", level: 95, icon: "𝐉𝐒" },
      { name: "TypeScript", level: 85, icon: "𝐓𝐒" },
      { name: "Node.js", level: 80, icon: "🟢" },
      { name: "CSS/SCSS", level: 85, icon: "🎨" },
      { name: "Tailwind CSS", level: 90, icon: "🌬️" }
    ];

    // Timeline data for experience section
    const timeline = [
      {
        year: "2023",
        title: "Senior Frontend Developer",
        company: "Tech Innovations Inc.",
        description: "Led the development of a complex SPA using React, TypeScript and Redux. Improved performance by 35%."
      },
      {
        year: "2021",
        title: "Full Stack Developer",
        company: "Digital Solutions Ltd.",
        description: "Built responsive web applications using modern JavaScript frameworks. Implemented CI/CD pipelines."
      },
      {
        year: "2019",
        title: "Junior Web Developer",
        company: "StartupGenius",
        description: "Developed front-end components and helped build the company's main product using React."
      }
    ];

    return (
        <section 
            ref={setRefs} 
            id="about" 
            data-section="about"
            className="min-h-screen py-16 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-dark-background dark:to-gray-900"
        >
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    className="space-y-16"
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                >
                    {/* Header section */}
                    <div className="text-center">
                        <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            About Me
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
                            Passionate developer dedicated to creating beautiful, responsive, and user-friendly web experiences.
                        </motion.p>
                    </div>

                    {/* Bio with image section */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <div className="md:col-span-1 flex justify-center">
                            <div className="relative w-48 h-48 md:w-56 md:h-56 overflow-hidden rounded-full border-4 border-primary shadow-lg">
                                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-5xl">
                                    {/* Replace with your actual image */}
                                    <span>👨‍💻</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="md:col-span-2 space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Who I Am</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                I'm a frontend developer with over 5 years of experience building modern web applications. 
                                I specialize in React, JavaScript, and creating responsive designs that provide excellent user experiences.
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                My passion lies in translating complex problems into elegant, efficient solutions through clean code and 
                                intuitive interfaces. I'm constantly learning new technologies to enhance my skill set.
                            </p>
                            
                            {/* Quick info cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                    <div className="text-primary text-2xl mb-2">🌎</div>
                                    <h3 className="font-medium">Location</h3>
                                    <p className="text-gray-600 dark:text-gray-300">San Francisco, CA</p>
                                </div>
                                
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                    <div className="text-primary text-2xl mb-2">🎓</div>
                                    <h3 className="font-medium">Education</h3>
                                    <p className="text-gray-600 dark:text-gray-300">B.S. Computer Science</p>
                                </div>
                                
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                    <div className="text-primary text-2xl mb-2">🌱</div>
                                    <h3 className="font-medium">Learning</h3>
                                    <p className="text-gray-600 dark:text-gray-300">Web3 & AI Integration</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Skills section */}
                    <motion.div variants={itemVariants} className="pt-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">My Skills</h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {skills.map((skill, index) => (
                                <motion.div 
                                    key={index}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                >
                                    <div className="p-5">
                                        <div className="flex items-center mb-3">
                                            <span className="text-2xl mr-3">{skill.icon}</span>
                                            <h3 className="font-bold text-lg">{skill.name}</h3>
                                        </div>
                                        
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                            <div 
                                                className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full transition-all duration-1000"
                                                style={{ width: `${skill.level}%`, transition: 'width 1.5s ease-in-out' }}
                                            ></div>
                                        </div>
                                        <div className="text-right mt-1 text-sm text-gray-500 dark:text-gray-400">{skill.level}%</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Experience Timeline */}
                    <motion.div variants={itemVariants} className="pt-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">My Journey</h2>
                        
                        <div className="relative">
                            {/* Timeline center line */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary h-full"></div>
                            
                            {/* Timeline items */}
                            {timeline.map((item, index) => (
                                <div key={index} className={`relative z-10 mb-12 flex ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                    <div className="hidden md:block w-1/2"></div>
                                    
                                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-4">
                                        <div className="w-8 h-8 rounded-full bg-primary border-4 border-white dark:border-gray-900 flex items-center justify-center">
                                            <span className="text-xs font-bold text-white">{item.year}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:w-1/2 mx-4 md:mx-0">
                                        <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                        <p className="text-primary mb-3">{item.company}</p>
                                        <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    
                    {/* Fun facts / Personal interests */}
                    <motion.div variants={itemVariants} className="pt-8 pb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">Beyond Coding</h2>
                        <p className="text-center text-lg mb-10 max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
                            When I'm not immersed in code, here's how I spend my time:
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center p-4">
                                <div className="text-4xl mb-4">📚</div>
                                <h3 className="font-medium mb-2">Reading</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Science fiction & tech books</p>
                            </div>
                            
                            <div className="text-center p-4">
                                <div className="text-4xl mb-4">🏃‍♂️</div>
                                <h3 className="font-medium mb-2">Running</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Completed two half marathons</p>
                            </div>
                            
                            <div className="text-center p-4">
                                <div className="text-4xl mb-4">🎸</div>
                                <h3 className="font-medium mb-2">Music</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Amateur guitar player</p>
                            </div>
                            
                            <div className="text-center p-4">
                                <div className="text-4xl mb-4">✈️</div>
                                <h3 className="font-medium mb-2">Travel</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Visited 15 countries</p>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* CTA Button */}
                    <motion.div variants={itemVariants} className="text-center pt-8">
                        <button 
                            onClick={() => navigate('/contact')}
                            className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105"
                        >
                            Let's Work Together
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;