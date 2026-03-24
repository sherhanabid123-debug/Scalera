import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const containerRef = useRef();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo('.about-line',
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0, duration: 1.5, stagger: 0.15, ease: 'expo.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 75%',
                    }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="about" ref={containerRef} className="section" style={{ padding: '8rem 5%' }}>
            <div style={{
                display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: isMobile ? '2rem' : '4rem',
                borderTop: '1px solid var(--border-subtle)', paddingTop: '4rem',
                alignItems: 'start'
            }}>
                <div className="about-line" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--accent-color)', borderRadius: '50%' }} />
                    <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        Brand Positioning
                    </span>
                </div>

                <div className="about-line">
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.04em', margin: '0 0 3rem 0', color: 'var(--text-primary)' }}>
                        <span style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>Built for Brands</span><br />
                        That Value Quality.
                    </h2>
                    <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: '750px', margin: 0, fontWeight: 400 }}>
                        Your website is more than just a page—it's your brand's digital heartbeat. We engineer high-performance, mobile-first experiences built on clarity, trust, and precision.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
