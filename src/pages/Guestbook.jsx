import React, { useState, useEffect } from 'react';
import { fetchGuestbookEntries, addGuestbookEntry } from '../api/guestbook';
import { motion, useInView } from 'framer-motion';
import useSectionObserver from '../hooks/useSectionObserver';
import { useScroll } from '../context/ScrollContext';
import useProgressiveLoading from '../hooks/useProgressiveLoading';
import useDeviceDetection from '../utils/useDeviceDetection';

const Guestbook = () => {
  // ScrollContext integration - add scrollToSection
  const [sectionRef, inView] = useSectionObserver('guestbook', '/guestbook');
  const { registerSection, scrollToSection } = useScroll();
  
  // Device detection for responsive adjustments
  const isMobile = useDeviceDetection();
  const isTablet = useDeviceDetection(1024);
  
  // Register this section with the scroll context
  useEffect(() => {
    const unregister = registerSection('guestbook', sectionRef);
    return () => {
      if (unregister) unregister();
    };
  }, [registerSection, sectionRef]);
  
  // Preload the Home section for circular navigation
  useProgressiveLoading(['/src/pages/Home.jsx']);

  // Enhanced scroll to top function with fallback
  const handleScrollToTop = () => {
    try {
      // First try using the context's scrollToSection
      scrollToSection('home');
      
      // Add a fallback in case the section isn't found
      setTimeout(() => {
        // If we're still at the bottom after a short delay, use window.scrollTo
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

  // Existing state management
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // Keep existing animation ref for content animations
  const { ref: animationRef, inView: animationInView } = useInView({
    threshold: isMobile ? 0.05 : 0.1, // Lower threshold for mobile
    triggerOnce: true
  });

  // Animation variants with device specific adjustments
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: isMobile ? 0.07 : 0.1 // Faster stagger on mobile
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: isMobile ? 0.3 : 0.4 // Slightly faster animations on mobile
      }
    }
  };

  useEffect(() => {
    const getEntries = async () => {
      try {
        const data = await fetchGuestbookEntries();
        setEntries(data);
      } catch (err) {
        console.error('Failed to fetch guestbook entries:', err);
        setError('Failed to load guestbook entries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getEntries();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');

    try {
      const newEntry = await addGuestbookEntry(formData);
      setEntries(prevEntries => [newEntry, ...prevEntries]);
      setFormData({ name: '', message: '' });
      setSubmitStatus('success');

      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (err) {
      console.error('Failed to submit entry:', err);
      setSubmitStatus('error');
    }
  };

  return (
    <section 
      ref={sectionRef} 
      id="guestbook"
      className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900 min-h-screen"
    >
      <div className={`container-narrow mx-auto px-${isMobile ? "3" : "4"}`}>
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0.4 : 0.5 }}
        >
          Guestbook
        </motion.h1>
        
        <motion.p 
          className="text-lg text-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: isMobile ? 0.4 : 0.5 }}
        >
          Leave a message, feedback, or just say hello!
        </motion.p>

        <motion.div 
          className="card mb-12" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: isMobile ? 0.5 : 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Sign the Guestbook</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1 font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                required
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block mb-1 font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="form-input h-32"
                required
                placeholder="Your message..."
              />
            </div>
            
            <button
              type="submit"
              className={`btn-primary ${isMobile ? "w-full" : "w-full sm:w-auto"}`}
              disabled={submitStatus === 'submitting'}
            >
              {submitStatus === 'submitting' ? 'Submitting...' : 'Sign Guestbook'}
            </button>
            
            {submitStatus === 'success' && (
              <p className="text-green-600 dark:text-green-400 mt-2">
                Thank you for signing the guestbook!
              </p>
            )}
            
            {submitStatus === 'error' && (
              <p className="text-red-600 dark:text-red-400 mt-2">
                Failed to submit your message. Please try again.
              </p>
            )}
          </form>
        </motion.div>

        <h2 className="text-2xl font-semibold mb-6">Recent Messages</h2>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : (
          <motion.div 
            className="space-y-4"
            ref={animationRef}
            variants={containerVariants}
            initial="hidden"
            animate={animationInView ? "visible" : "hidden"}
          >
            {entries.length > 0 ? (
              entries.map((entry, index) => (
                <motion.div 
                  key={entry.id || index}
                  className="card bg-white dark:bg-gray-800"
                  variants={itemVariants}
                >
                  <h3 className="font-medium text-xl">{entry.name}</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{entry.message}</p>
                  <p className="mt-2 text-sm text-gray-400">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                </motion.div>
              ))
            ) : (
              <p className="text-center py-8 text-gray-500">
                No messages yet. Be the first to sign the guestbook!
              </p>
            )}
          </motion.div>
        )}
      
        {/* Fixed Scroll to top button - now conditionally styled based on device */}
        <div className={`flex justify-center mt-${isMobile ? '12' : '16'} mb-${isMobile ? '6' : '8'}`}>
          <button 
            onClick={handleScrollToTop}
            aria-label="Scroll to top"
            className={`animate-bounce bg-white dark:bg-gray-800 p-2 ${isMobile ? 'w-12 h-12' : 'w-10 h-10'} ring-1 ring-slate-900/5 dark:ring-slate-200/20 shadow-lg rounded-full flex items-center justify-center hover:ring-primary hover:ring-2 transition-all duration-300`}
          >
            <svg className={`${isMobile ? 'w-7 h-7' : 'w-6 h-6'} text-primary`} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Guestbook;