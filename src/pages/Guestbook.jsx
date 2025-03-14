import React, { useState, useEffect, useRef } from 'react';
import { fetchGuestbookEntries } from '../api/guestbook';
import { motion, useInView } from 'framer-motion';
import { useScroll } from '../context/ScrollContext';
import useProgressiveLoading from '../hooks/useProgressiveLoading';
import useDeviceDetection from '../utils/useDeviceDetection';
import GuestbookForm from '../components/GuestbookForm';
import GuestbookEntryList from '../components/GuestbookEntryList';
import { guestbookText } from '../data/guestbookData';
import { getGuestbookText } from '../data/guestbookData';
import { useLanguage } from '../context/LanguageContext';
import useSectionRegistration from '../hooks/useSectionRegistration'; // Import the hook
import SectionTriggers from '../components/SectionTriggers'; // Import SectionTriggers

const Guestbook = ({ registerWithURL }) => {
  // Use the custom registration hook
  const { sectionRef } = useSectionRegistration('guestbook', registerWithURL);
  
  // ScrollContext integration - we only need scrollToSection now
  const { scrollToSection } = useScroll();
  
  // Device detection for responsive adjustments
  const isMobile = useDeviceDetection();
  const isTablet = useDeviceDetection(1024);

  // Use language context
  const { currentLanguage } = useLanguage();
  const currentGuestbookText = getGuestbookText(currentLanguage) || guestbookText;
  
  // Preload the Home section for circular navigation
  useProgressiveLoading(['/src/pages/Home.jsx']);

  // Enhanced scroll to top
  const handleScrollToTop = () => {
    try {
      scrollToSection('home');
      setTimeout(() => {
        const scrollY = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        
        if (scrollY > windowHeight / 2) {
          window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
          });
        }
      }, 100);
    } catch (error) {
      console.error("Error scrolling to top:", error);
      // Direct fallback if the primary method throws an error
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }
  };

  // State for entries
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Animation configuration
  const { ref: animationRef, inView: animationInView } = useInView({
    threshold: isMobile ? 0.05 : 0.1,
    triggerOnce: true
  });
  
  // Combine refs for both registration and animation
  const setRefs = element => {
    sectionRef.current = element;
    if (typeof animationRef === 'function') {
      animationRef(element);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: isMobile ? 0.07 : 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: isMobile ? 0.3 : 0.4 }
    }
  };

  // Fetch entries on component mount
  useEffect(() => {
    const getEntries = async () => {
      try {
        const data = await fetchGuestbookEntries();
        setEntries(data);
      } catch (err) {
        console.error('Failed to fetch guestbook entries:', err);
        setError(currentGuestbookText.errorMessage || 'Failed to load guestbook entries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getEntries();
  }, [currentLanguage]);

  // Handle new entry submissions
  const handleEntryAdded = (newEntry) => {
    setEntries(prevEntries => [newEntry, ...prevEntries]);
  };

  return (
    <section 
        ref={setRefs} 
        id="guestbook"
        data-section="guestbook"
        className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-900 min-h-screen relative"
        style={{ 
          position: 'relative',
          scrollMarginTop: '120px'  // Add this line
        }}
    >
      {/* Add invisible triggers at start and end */}
      <SectionTriggers sectionId="guestbook" />
      
      {/* Single section marker for visibility */}
      <div id="guestbook-visibility-center" 
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
      
      <div className={`container-narrow mx-auto px-${isMobile ? "3" : "4"}`}>
        {/* Form with heading/intro */}
        <GuestbookForm 
          onEntryAdded={handleEntryAdded}
          isMobile={isMobile}
          guestbookText={currentGuestbookText}
        />

        {/* Entries list component */}
        <GuestbookEntryList
          entries={entries}
          loading={loading}
          error={error}
          animationRef={animationRef}
          animationInView={animationInView}
          containerVariants={containerVariants}
          itemVariants={itemVariants}
          isMobile={isMobile}
          guestbookText={currentGuestbookText}
        />
      </div>
      
      {/* Bottom marker for consistent spacing */}
      <div 
        className="w-full h-8" 
        id="guestbook-end-marker" 
        aria-hidden="true"
      />
    </section>
  );
};

export default Guestbook;