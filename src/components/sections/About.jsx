import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const containerRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo('.about-text',
                { y: 80, opacity: 0, rotationX: -15 },
                {
                    y: 0, opacity: 1, rotationX: 0, duration: 1.5, stagger: 0.2, ease: 'expo.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="about" ref={containerRef} className="section">
            <div className="glow-orb" style={{ top: '50%', left: '50%' }} />
            <div className="container" style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                <div style={{ maxWidth: '900px', textAlign: 'center' }}>
                    <h2 className="about-text" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 700, marginBottom: '2.5rem', lineHeight: 1.2, letterSpacing: '-0.04em' }}>
                        We design modern business websites focusing on <span style={{ color: 'var(--accent-color)' }}>conversion</span>, presence, and positioning.
                    </h2>
                    <p className="about-text" style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>
                        Design + Growth Strategy for ambitious brands.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
