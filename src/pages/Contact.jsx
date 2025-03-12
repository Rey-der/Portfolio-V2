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
import useSectionRegistration from '../hooks/useSectionRegistration';

const Contact = ({ registerWithURL }) => {
    const location = useLocation();
    const initialRenderRef = useRef(true);
    const [showContent, setShowContent] = useState(false);
    
    // Language context
    const { currentLanguage } = useLanguage();
    const currentContactText = getContactText(currentLanguage) || contactText;
    
    // Use the custom registration hook
    const { sectionRef } = useSectionRegistration('contact', registerWithURL);
    
    // Separate animation tracking with useInView
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

    // Hide all scrollbars specifically for this component with aggressive CSS
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            /* Global scrollbar hiding */
            body::-webkit-scrollbar,
            html::-webkit-scrollbar,
            div::-webkit-scrollbar,
            *::-webkit-scrollbar {
                width: 0 !important;
                display: none !important;
            }
            
            body, html, div, *[class*="scroll"], *[class*="overflow"] {
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
            }
            
            /* Contact-specific scrollbar hiding */
            #contact *,
            .contact-container * {
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
                overflow-y: auto !important;
            }
            
            #contact *::-webkit-scrollbar,
            .contact-container *::-webkit-scrollbar {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
                opacity: 0 !important;
            }
            
            /* Form elements */
            input::-webkit-scrollbar,
            textarea::-webkit-scrollbar,
            select::-webkit-scrollbar {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        };
    }, []);
    
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
                staggerChildren: isMobile ? 0.10 : 0.15
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
        return (
            <section 
                ref={setRefs} 
                id="contact" 
                className="min-h-screen"
            >
                {/* URL triggers for scroll system */}
                <div className="section-url-trigger section-url-trigger-entry" data-section="contact" data-trigger="entry"></div>
                <div className="section-url-trigger section-url-trigger-exit" data-section="contact" data-trigger="exit"></div>
            </section>
        );
    }

    // Decorative scrollbar - mimicking the functional one
    const DecorativeScrollbar = () => (
        <div 
            className="fixed right-0 top-0 bottom-0 h-screen z-50 opacity-40 pointer-events-none"
            style={{ 
                width: '30px',
            }}
        >
            {/* Major tick marks */}
            {[0, 0.5, 1].map((position, index) => (
                <div
                    key={`major-${index}`}
                    className="absolute right-0"
                    style={{ 
                        top: `${10 + position * 80}%`,
                        width: index === 0 ? '14px' : '12px',
                        height: index === 0 ? '3px' : '2px',
                        right: '4px',
                        transform: 'translateY(-50%)',
                        backgroundColor: index === 0 ? 
                            'rgb(59, 130, 246)' : 'rgb(107, 114, 128)',
                        opacity: index === 0 ? 1 : 0.7,
                    }}
                />
            ))}
            
            {/* Small tick lines - static decorative versions */}
            {[0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9].map((tickPos, index) => (
                <div
                    key={`minor-${index}`}
                    className="absolute"
                    style={{ 
                        top: `${10 + tickPos * 80}%`,
                        right: '4px',
                        height: '2px',
                        transform: 'translateY(-50%)',
                    }}
                >
                    <div 
                        className="bg-gray-400 dark:bg-gray-500"
                        style={{
                            width: index % 3 === 0 ? '8px' : '4px', // Varied widths for visual interest
                            height: '2px',
                            opacity: 0.4,
                            position: 'absolute',
                            right: '0',
                            borderRadius: '1px'
                        }}
                    />
                </div>
            ))}
            
            {/* Simulated dot */}
            <div
                className="absolute right-4"
                style={{ 
                    top: '10%',
                    transform: 'translate(50%, -50%)',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'rgb(59, 130, 246)',
                    opacity: 0.8,
                }}
            />
        </div>
    );

    return (
        <div className="relative overflow-hidden">
            {/* Background gradient effect */}
            <div 
                className="fixed inset-x-0 top-0 h-screen pointer-events-none bg-gradient-to-b from-white via-gray-50 to-transparent dark:from-dark-background dark:via-gray-900 dark:to-transparent opacity-75 -z-10"
                style={{
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)'
                }}
            />
            
            {/* Add decorative scrollbar */}
            <DecorativeScrollbar />
            
            <section 
                ref={setRefs} 
                id="contact" 
                className="min-h-screen py-16 px-4 relative overflow-hidden"
            >
                {/* URL triggers for scroll system */}
                <div className="section-url-trigger section-url-trigger-entry" data-section="contact" data-trigger="entry"></div>
                <div className="section-url-trigger section-url-trigger-exit" data-section="contact" data-trigger="exit"></div>
                
                <div className="container mx-auto max-w-4xl overflow-hidden">
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
                            <div className={`w-full ${isMobile ? '' : 'md:w-1/3'} space-y-6 overflow-hidden`}>
                                <ContactInfo contactText={currentContactText} />
                            </div>
                            
                            {/* Right column - Contact form */}
                            <div className={`w-full ${isMobile ? '' : 'md:w-2/3'} overflow-hidden`}>
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