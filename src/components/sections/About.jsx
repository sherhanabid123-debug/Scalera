import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const containerRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo('.about-text',
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="about" ref={containerRef} className="section" style={{ padding: '150px 5%' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ maxWidth: '800px', textAlign: 'center' }}>
                    <h2 className="about-text" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 500, marginBottom: '2rem', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
                        We design modern business websites focusing on <span style={{ color: 'var(--accent-color)' }}>conversion</span>, presence, and positioning.
                    </h2>
                    <p className="about-text" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
                        Design + Growth Strategy for ambitious brands.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
