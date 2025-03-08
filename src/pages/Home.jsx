import React, { useState, useEffect } from 'react';
import AnimatedSection from '../components/AnimatedSection';
import useSectionObserver from '../hooks/useSectionObserver';
import { useScroll } from '../context/ScrollContext';
import useProgressiveLoading from '../hooks/useProgressiveLoading';
import useMousePosition from '../utils/useMousePosition';
import useTriangleAnimation from '../animations/AnimatedTriangle';
import useDeviceDetection from '../utils/useDeviceDetection';

const Home = () => {
    const [sectionRef, inView] = useSectionObserver('home', '/');
    const { registerSection } = useScroll();
    const mousePosition = useMousePosition();
    const isMobile = useDeviceDetection();
    
    // Get triangle position from our new animation hook
    const trianglePos = useTriangleAnimation(inView, mousePosition, isMobile);
       
    // Register this section with the scroll context
    useEffect(() => {
      const unregister = registerSection('home', sectionRef);
      return () => {
        if (unregister) unregister();
      };
    }, [registerSection, sectionRef]);
    
    // Preload the next section
    useProgressiveLoading(['/src/pages/Projects.jsx']);

    return (
        <section ref={sectionRef} id="home" className="min-h-screen pb-16 relative overflow-hidden">
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
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to My Portfolio</h1>
                    <p className="text-xl md:text-2xl mt-4 max-w-2xl mx-auto">
                        I create beautiful, responsive websites with modern technologies.
                        Explore my work and let's build something amazing together.
                    </p>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default Home;