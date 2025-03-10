import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import useProgressiveLoading from '../hooks/useProgressiveLoading';
import useDeviceDetection from '../utils/useDeviceDetection';
import ContactForm from '../components/ContactForm';
import ContactInfo from '../components/ContactInfo';
import { contactText } from '../data/contactData';
import { getContactText } from '../data/contactData';
import { useLanguage } from '../context/LanguageContext';

const Contact = ({ registerWithURL }) => {
    const location = useLocation();
    const initialRenderRef = useRef(true);
    const [showContent, setShowContent] = useState(false);
    
    // Language context
    const { currentLanguage } = useLanguage();
    const currentContactText = getContactText(currentLanguage) || contactText;
    
    // Create a simple ref for section registration
    const sectionRef = useRef(null);
    
    // Separate animation tracking with useInView if needed
    const { ref: animationRef, inView } = useInView({
      threshold: 0.1,
      triggerOnce: false
    });
    
    // Combine refs for both registration and animation
    const setRefs = element => {
      sectionRef.current = element;
      if (typeof animationRef === 'function') {
        animationRef(element);
      }
    };
    
    // Add device detection for potentially responsive adjustments
    const isMobile = useDeviceDetection();
    
    // Preload Guestbook section
    useProgressiveLoading(['/src/pages/GuestBook.jsx']);
    
    useEffect(() => {
      if (sectionRef.current && registerWithURL) {
        return registerWithURL('contact', sectionRef);
      }
    }, [registerWithURL]);
    
    // Handle icon visibility with the new system
    useEffect(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.classList.add('icons-loading');        
            // After a delay, show icons with a smooth transition
            const timer = setTimeout(() => {
                contactSection.classList.remove('icons-loading');
                contactSection.classList.add('icons-ready');
                
                // Find all SVGs/icon-svg class
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
        return <div ref={setRefs} id="contact" className="min-h-screen"></div>;
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
                ref={setRefs} 
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
                                {currentContactText.letsConnect}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform origin-left animate-expand"></div>
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                                {currentContactText.haveAQuestion}
                            </p>
                        </motion.div>
                        
                        {/* Contact sections */}
                        <motion.div 
                            variants={itemVariants} 
                            className={`flex flex-col ${isMobile ? '' : 'md:flex-row'} gap-8`}
                        >
                            {/* Left column - Contact info with properly tagged icons */}
                            <div className={`w-full ${isMobile ? '' : 'md:w-1/3'} space-y-6`}>
                                <ContactInfo contactText={currentContactText} />
                            </div>
                            
                            {/* Right column - Contact form */}
                            <div className={`w-full ${isMobile ? '' : 'md:w-2/3'}`}>
                                <ContactForm contactText={currentContactText} />
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