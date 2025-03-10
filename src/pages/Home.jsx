import React, { useEffect, useRef } from 'react';
import AnimatedSection from '../components/AnimatedSection';
import { useInView } from 'react-intersection-observer';
import useProgressiveLoading from '../hooks/useProgressiveLoading';
import useMousePosition from '../utils/useMousePosition';
import useTriangleAnimation from '../animations/AnimatedTriangle';
import useDeviceDetection from '../utils/useDeviceDetection';
import { homeText } from '../data/homeData';
import { getHomeText } from '../data/homeData';
import { useLanguage } from '../context/LanguageContext';

const Home = ({ registerWithURL }) => {
    const sectionRef = useRef(null);
    const { ref: inViewRef, inView } = useInView({ 
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    });
    
    // Combine refs
    const setRefs = element => {
      sectionRef.current = element;
      inViewRef(element);
    };
    
    const mousePosition = useMousePosition();
    const isMobile = useDeviceDetection();
    
    // Get triangle position from our animation hook
    const trianglePos = useTriangleAnimation(inView, mousePosition, isMobile);

    // Use language context
    const { currentLanguage } = useLanguage();
    const currentHomeText = getHomeText(currentLanguage) || homeText;
       
    // Register this section with the new URL registration function
    useEffect(() => {
      // ADDED: Debug logging
      console.log("Home component attempting registration");
      
      if (sectionRef.current && registerWithURL) {
        // ADDED: More Debug logging
        console.log("Home section ref exists, registering with URL");
        const cleanup = registerWithURL('home', sectionRef);
        
        return () => {
          if (typeof cleanup === 'function') {
            console.log("Cleaning up Home section URL observer");
            cleanup();
          }
        };
      } else {
        console.warn("Home section ref doesn't exist yet or registerWithURL not provided");
      }
    }, [registerWithURL]);
    
    // Preload the next section
    useProgressiveLoading(['/src/pages/Projects.jsx']);

    return (
        <section 
            ref={setRefs} 
            id="home" 
            className="min-h-screen pb-16 relative overflow-hidden"
            style={{ 
                scrollMarginTop: '60px',  // Adjust based on your header height
                position: 'relative',     // Ensure position context
            }}
        >
            <div className="flex flex-col items-center justify-center h-full min-h-[80vh]">
                {/* Decorative Triangle - fixed positioning for better centering */}
                <div 
                    className="absolute pointer-events-none"
                    style={{
                        transform: `translate(-50%, -75%) translate(${trianglePos.x / 7}px, ${trianglePos.y / 7}px) rotate(${trianglePos.x * 0.08}deg)`,
                        left: '50%',
                        top: '50%',
                        width: '300px',
                        height: '300px',
                        transition: isMobile ? 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                        zIndex: 0
                    }}
                >
                    <svg width="100%" height="100%" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path 
                            d="M150 20L280 260H20L150 20Z" 
                            className="fill-primary/40 dark:fill-primary/50 stroke-primary stroke-[3]"
                            style={{
                                filter: 'drop-shadow(0 0 20px rgba(var(--color-primary-rgb), 0.3))'
                            }}
                        />
                    </svg>
                </div>
                
                <AnimatedSection className="text-center relative z-10 mt-16">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">{currentHomeText.welcomeTitle}</h1>
                    <p className="text-xl md:text-2xl mt-4 max-w-2xl mx-auto">
                        {currentHomeText.welcomeSubtitle}
                    </p>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default Home;