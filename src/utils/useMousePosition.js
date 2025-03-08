import { useEffect, useState, useRef } from 'react';

const useMousePosition = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isInViewport, setIsInViewport] = useState(false);
    const inactivityTimer = useRef(null);

    useEffect(() => {
        const handleMouseMove = (event) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
            setIsInViewport(true);
            
            // Reset inactivity timer
            if (inactivityTimer.current) {
                clearTimeout(inactivityTimer.current);
            }
            
            // Set new inactivity timer
            inactivityTimer.current = setTimeout(() => {
                setIsInViewport(false);
            }, 3000); // Consider inactive after 3 seconds of no movement
        };

        const handleMouseLeave = () => {
            setIsInViewport(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            if (inactivityTimer.current) {
                clearTimeout(inactivityTimer.current);
            }
        };
    }, []);

    // Return as a single object so useTriangleAnimation can use the isInViewport property
    return { 
        x: mousePosition.x, 
        y: mousePosition.y, 
        isInViewport 
    };
};

export default useMousePosition;