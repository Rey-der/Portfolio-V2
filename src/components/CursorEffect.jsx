import React, { useEffect, useState } from 'react';

const CursorEffect = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const handleMouseMove = (event) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };

        const handleMouseEnter = () => {
            setIsActive(true);
        };

        const handleMouseLeave = () => {
            setIsActive(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseenter', handleMouseEnter);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseenter', handleMouseEnter);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div
            className={`cursor-effect ${isActive ? 'active' : ''}`}
            style={{
                left: mousePosition.x,
                top: mousePosition.y,
                position: 'fixed',
                pointerEvents: 'none',
                transition: 'transform 0.1s ease',
                transform: isActive ? 'scale(1.5)' : 'scale(1)',
            }}
        >
            {/* You can add particle effects or other elements here */}
        </div>
    );
};

export default CursorEffect;