import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

const About = () => {
    const containerRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo('.about-content-fade',
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1.5, stagger: 0.2, ease: 'expo.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                    }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="about" ref={containerRef} className="section" style={{ padding: '10rem 5%', backgroundColor: 'rgba(15, 23, 42, 0.2)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '6rem', alignItems: 'center' }}>
                    
                    <div className="about-content-fade">
                        <div className="hero-badge" style={{ marginBottom: '2rem' }}>Our Focus</div>
                        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', margin: '0 0 2.5rem 0', color: '#fff' }}>
                            We Build Websites <br />
                            <span className="text-gradient-accent">That Drive Results.</span>
                        </h2>
                    </div>

                    <div className="about-content-fade">
                        <p style={{ fontSize: 'clamp(1.2rem, 1.8vw, 1.5rem)', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '2.5rem', fontWeight: 500 }}>
                            We specialize in helping <span style={{ color: '#fff' }}>restaurants and small businesses</span> improve their online presence and attract more customers.
                        </p>
                        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                            Your website shouldn't just be a digital business card. It should be your most effective sales tool, working 24/7 to turn visitors into loyal clients.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default About;
