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
import useSectionRegistration from '../hooks/useSectionRegistration';
import SectionTriggers from '../components/SectionTriggers';
import { useTheme } from '../utils/useTheme';
import VerticalLines from '../components/lines.jsx';

const Guestbook = ({ registerWithURL }) => {
  const { sectionRef } = useSectionRegistration('guestbook', registerWithURL);
  const { scrollToSection } = useScroll();
  const isMobile = useDeviceDetection();
  const isTablet = useDeviceDetection(1024); // Assuming tablet breakpoint
  const { currentLanguage } = useLanguage();
  const currentGuestbookText = getGuestbookText(currentLanguage) || guestbookText;
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  useProgressiveLoading(['/src/pages/Home.jsx']);

  const handleScrollToTop = () => {
    try {
      requestAnimationFrame(() => {
        scrollToSection('home');
        setTimeout(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          if (scrollY > windowHeight / 2) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      });
    } catch (error) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { ref: animationRef, inView: animationInView } = useInView({
    threshold: isMobile ? 0.05 : 0.1,
    triggerOnce: true,
  });

  const setRefs = (element) => {
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
        when: 'beforeChildren',
        staggerChildren: isMobile ? 0.07 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: isMobile ? 0.3 : 0.4 },
    },
  };

  useEffect(() => {
    const getEntries = async () => {
      try {
        const data = await fetchGuestbookEntries();
        setEntries(data);
      } catch (err) {
        setError(
          currentGuestbookText.errorMessage ||
            'Failed to load guestbook entries. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };
    getEntries();
  }, [currentLanguage, currentGuestbookText.errorMessage]);

  const handleEntryAdded = (newEntry) => {
    setEntries((prevEntries) => [newEntry, ...prevEntries]);
  };

  // Define HORIZONTAL_OFFSET based on your lines.jsx, default to 80px if not available
  const HORIZONTAL_OFFSET_VALUE = '80px'; // Matching your lines.jsx

  return (
    <div className="relative">
      {/* Vertical Lines component - ensure sectionRef is passed */}
      <VerticalLines sectionRef={sectionRef} />

      {/* Skyline cloak wrapper */}
      <div
        className="skyline-cloak fixed bottom-0 left-0 right-0 overflow-hidden pointer-events-none"
        style={{
          zIndex: 5, // Should be between lines (Z_INDEX=1 in lines.jsx) and content (zIndex=10 for section)
          height: '30vh',
          width: '100vw',
        }}
      >
        <div
          className="skyline-layer absolute bottom-0 left-0 right-0"
          style={{
            height: '100%',
            backgroundImage: isDarkMode
              ? 'url(/Parallax/dark/7.png)'
              : 'url(/Parallax/light/7.png)',
            backgroundSize: '100% auto',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'repeat-x',
            opacity: 0.7,
          }}
        />
        <div
          className="skyline-layer absolute bottom-0 left-0 right-0"
          style={{
            height: '100%',
            backgroundImage: isDarkMode
              ? 'url(/Parallax/dark/6.png)'
              : 'url(/Parallax/light/6.png)',
            backgroundSize: '100% auto',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'repeat-x',
            opacity: 0.5,
          }}
        />
      </div>

      <section
        ref={setRefs}
        id="guestbook"
        data-section="guestbook"
        className="py-12 sm:py-16 bg-background dark:bg-dark-background min-h-screen relative"
        style={{
          position: 'relative',
          scrollMarginTop: '120px',
          scrollBehavior: 'smooth',
          // Adjust padding to account for HORIZONTAL_OFFSET from lines.jsx
          paddingLeft: `calc(var(--section-padding-x) + ${HORIZONTAL_OFFSET_VALUE})`,
          paddingRight: `calc(var(--section-padding-x) + ${HORIZONTAL_OFFSET_VALUE})`,
          zIndex: 10, // Ensure content is above the fixed vertical lines (Z_INDEX=1 in lines.jsx)
        }}
      >
        <SectionTriggers sectionId="guestbook" />
        <div
          id="guestbook-visibility-center"
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            height: '100px',
            pointerEvents: 'none',
            zIndex: -1, // Keep behind everything
          }}
        />

        {/* Main Content Container with responsive width */}
        <div
          className={`mx-auto relative w-full px-4 
                      sm:max-w-xl 
                      md:max-w-2xl 
                      lg:max-w-3xl 
                      xl:max-w-4xl 
                      2xl:max-w-5xl`} // Responsive max-width
          style={{ zIndex: 2 }} // Ensure this is above lines if lines have zIndex >= 1
        >
          <GuestbookForm
            onEntryAdded={handleEntryAdded}
            isMobile={isMobile}
            guestbookText={currentGuestbookText}
          />
          <div className="entries-container mt-8"> {/* Added margin-top for spacing */}
            <GuestbookEntryList
              entries={entries}
              loading={loading}
              error={error}
              animationRef={animationRef} // This ref is for the list animation, not the section
              animationInView={animationInView}
              containerVariants={containerVariants}
              itemVariants={itemVariants}
              isMobile={isMobile}
              guestbookText={currentGuestbookText}
            />
          </div>
        </div>

        <div
          className="flex justify-center mt-12 relative"
          style={{ zIndex: 2 }} // Ensure this is above lines
        >
          <button
            onClick={handleScrollToTop}
            className="rounded-full bg-primary hover:bg-primary/90 text-white dark:text-dark-background py-2 px-6 transition-colors duration-300 inline-flex items-center gap-2"
            aria-label="Back to top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
            {currentGuestbookText.backToTop || 'Back to top'}
          </button>
        </div>

        <div
          className="w-full h-8"
          id="guestbook-end-marker"
          aria-hidden="true"
        />
      </section>
    </div>
  );
};

export default Guestbook;