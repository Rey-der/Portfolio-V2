import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import useSectionObserver from '../hooks/useSectionObserver';
import { useScroll } from '../context/ScrollContext';
import useProgressiveLoading from '../hooks/useProgressiveLoading';
import useDeviceDetection from '../utils/useDeviceDetection';
import ContactForm from '../components/ContactForm';
import ContactInfo from '../components/ContactInfo';

const Contact = () => {
    const location = useLocation();
    const initialRenderRef = useRef(true);
    const [showContent, setShowContent] = useState(false);
    
    const [sectionRef, inView] = useSectionObserver('contact', '/contact');
    const { registerSection } = useScroll();
    
    // Add device detection for potentially responsive adjustments
    const isMobile = useDeviceDetection();
    
    // Preload Guestbook section
    useProgressiveLoading(['/src/pages/GuestBook.jsx']);
    
    // Handle icon visibility with the new system
    useEffect(() => {
        // Get contact section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            // First mark as loading to prevent flicker
            contactSection.classList.add('icons-loading');
            
            // After a delay, show icons with a smooth transition
            const timer = setTimeout(() => {
                contactSection.classList.remove('icons-loading');
                contactSection.classList.add('icons-ready');
                
                // Find all SVGs in this section and add icon-svg class
                const icons = contactSection.querySelectorAll('svg');
                icons.forEach(icon => {
                    if (!icon.classList.contains('icon-svg')) {
                        icon.classList.add('icon-svg');
                    }
                });
            }, 250);
            
            return () => clearTimeout(timer);
        }
    }, []);
    
    // Register with scroll context
    useEffect(() => {
        if (sectionRef && sectionRef.current) {
            const unregister = registerSection('contact', sectionRef);
            return () => {
                if (unregister) unregister();
            };
        }
    }, [registerSection, sectionRef]);

    // Control content visibility based on route
    useEffect(() => {
        const isContactPage = location.pathname === '/contact';
        
        if (initialRenderRef.current) {
            initialRenderRef.current = false;
            if (isContactPage) {
                setShowContent(true);
            }
            return;
        }
        
        if (isContactPage) {
            const timer = setTimeout(() => {
                setShowContent(true);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setShowContent(false);
        }
    }, [location.pathname]);

    // Animation variants - adjust stagger timing based on device
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: isMobile ? 0.10 : 0.15 // Slightly faster stagger on mobile
            }
        }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: isMobile ? 0.5 : 0.6, ease: "easeOut" }
        }
    };

    if (!showContent) {
        return <div ref={sectionRef} id="contact" className="min-h-screen"></div>;
    }

    return (
        <div className="relative">
            {/* Background gradient effect */}
            <div 
                className="fixed inset-x-0 top-0 h-screen pointer-events-none bg-gradient-to-b from-white via-gray-50 to-transparent dark:from-dark-background dark:via-gray-900 dark:to-transparent opacity-75 -z-10"
                style={{
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)'
                }}
            />
            
            <section 
                ref={sectionRef} 
                id="contact" 
                className="min-h-screen py-16 px-4 relative"
            >
                <div className="container mx-auto max-w-4xl">
                    <motion.div
                        className="space-y-12"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible" 
                        key="contact-content"
                    >
                        {/* Header */}
                        <motion.div variants={itemVariants} className="text-center">
                            <h1 className="text-4xl md:text-5xl font-bold mb-3 relative inline-block">
                                Let's Connect
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform origin-left animate-expand"></div>
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                                Have a question or want to work together? Drop me a message!
                            </p>
                        </motion.div>
                        
                        {/* Contact sections */}
                        <motion.div 
                            variants={itemVariants} 
                            className={`flex flex-col ${isMobile ? '' : 'md:flex-row'} gap-8`}
                        >
                            {/* Left column - Contact info with properly tagged icons */}
                            <div className={`w-full ${isMobile ? '' : 'md:w-1/3'} space-y-6`}>
                                <ContactInfo />
                            </div>
                            
                            {/* Right column - Contact form */}
                            <div className={`w-full ${isMobile ? '' : 'md:w-2/3'}`}>
                                <ContactForm />
                            </div>
                        </motion.div>

                        {/* Bottom spacing */}
                        <div className={`h-${isMobile ? '12' : '16'} md:h-24`}></div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Contact;