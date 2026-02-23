import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const dotRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        const dot = dotRef.current;

        // Move cursor using GSAP for buttery smooth interpolation
        const onMouseMove = (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.8,
                ease: 'power3.out'
            });
            gsap.to(dot, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power3.out'
            });
        };

        const onMouseEnter = () => setIsHovering(true);
        const onMouseLeave = () => setIsHovering(false);

        window.addEventListener('mousemove', onMouseMove);

        // Track hover state for links and buttons to expand cursor
        const interactables = document.querySelectorAll('a, button, input, textarea, .custom-hover');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', onMouseEnter);
            el.addEventListener('mouseleave', onMouseLeave);
        });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            interactables.forEach(el => {
                el.removeEventListener('mouseenter', onMouseEnter);
                el.removeEventListener('mouseleave', onMouseLeave);
            });
        };
    }, []);

    // Animate scale/opacity based on hover state
    useEffect(() => {
        if (isHovering) {
            gsap.to(cursorRef.current, { scale: 1.5, opacity: 0.5, duration: 0.3, ease: 'expo.out' });
            gsap.to(dotRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: 'expo.out' });
        } else {
            gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3, ease: 'expo.out' });
            gsap.to(dotRef.current, { scale: 1, opacity: 1, duration: 0.3, ease: 'expo.out' });
        }
    }, [isHovering]);

    return (
        <>
            <div
                ref={cursorRef}
                style={{
                    position: 'fixed',
                    top: '-15px',
                    left: '-15px',
                    width: '30px',
                    height: '30px',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    mixBlendMode: 'difference',
                    transform: 'translate(-50%, -50%)',
                }}
            />
            <div
                ref={dotRef}
                style={{
                    position: 'fixed',
                    top: '-4px',
                    left: '-4px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 10000,
                    mixBlendMode: 'difference',
                    transform: 'translate(-50%, -50%)',
                }}
            />
        </>
    );
};

export default CustomCursor;
