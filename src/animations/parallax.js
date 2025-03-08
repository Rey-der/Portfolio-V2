import { useEffect } from 'react';

const useParallax = () => {
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const parallaxElements = document.querySelectorAll('.parallax');

            parallaxElements.forEach((element) => {
                const speed = element.getAttribute('data-speed');
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
};

export default useParallax;