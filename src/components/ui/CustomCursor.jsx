import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const dotRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const dot = dotRef.current;

        // Use highly optimized quickTo for cursor tracking (no continuous tween garbage)
        const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.8, ease: "power3.out" });
        const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.8, ease: "power3.out" });
        const xToDot = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
        const yToDot = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });

        const onMouseMove = (e) => {
            xToCursor(e.clientX);
            yToCursor(e.clientY);
            xToDot(e.clientX);
            yToDot(e.clientY);
        };

        // Delegate hover events instead of state to prevent React re-renders on every interaction
        const onMouseOver = (e) => {
            if (e.target.closest('a, button, input, textarea, .custom-hover')) {
                gsap.to(cursor, { scale: 1.5, opacity: 0.5, duration: 0.3, ease: 'expo.out', overwrite: 'auto' });
                gsap.to(dot, { scale: 0, opacity: 0, duration: 0.3, ease: 'expo.out', overwrite: 'auto' });
            }
        };

        const onMouseOut = (e) => {
            if (e.target.closest('a, button, input, textarea, .custom-hover')) {
                gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3, ease: 'expo.out', overwrite: 'auto' });
                gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3, ease: 'expo.out', overwrite: 'auto' });
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseover', onMouseOver);
        window.addEventListener('mouseout', onMouseOut);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', onMouseOver);
            window.removeEventListener('mouseout', onMouseOut);
        };
    }, []);

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
