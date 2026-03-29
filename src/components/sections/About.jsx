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
                        <div className="hero-badge" style={{ marginBottom: '2rem' }}>Brand Strategy</div>
                        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', margin: '0 0 2.5rem 0', color: '#fff' }}>
                            Engineered for <br />
                            <span className="text-gradient-accent">Quality & Speed.</span>
                        </h2>
                    </div>

                    <div className="about-content-fade">
                        <p style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.35rem)', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                            We don't just build websites; we engineer digital storefronts that command attention. Our approach merges high-fidelity design with robust technical foundations.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {[
                                { label: 'Performance-First Architecture', value: '100/100 Lighthouse Score' },
                                { label: 'Conversion-Led Design', value: 'Strategy Driven' },
                                { label: 'Scalable Infrastructure', value: 'Future Proof' }
                            ].map((item, i) => (
                                <div key={i} style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(34, 211, 238, 0.1)', background: 'rgba(34, 211, 238, 0.03)' }}>
                                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-color)', fontWeight: 700, marginBottom: '0.5rem' }}>{item.label}</div>
                                    <div style={{ fontSize: '1rem', color: '#fff', fontWeight: 600 }}>{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default About;
