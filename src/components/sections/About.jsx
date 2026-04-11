import React, { useLayoutEffect, useRef } from 'react';
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
        <section id="about" ref={containerRef} className="section" style={{ padding: '12rem 5%', background: 'var(--bg-primary)' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '6rem', alignItems: 'center' }}>
                    
                    <div className="about-content-fade">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                            <div style={{ width: '12px', height: '1px', background: 'var(--accent-color)' }} />
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent-color)' }}>Our Focus</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.04em', margin: '0 0 2.5rem 0', color: '#fff' }}>
                            We Build Websites <br />
                            <span style={{ fontWeight: 600 }}>That Drive Results.</span>
                        </h2>
                    </div>

                    <div className="about-content-fade">
                        <p style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '2.5rem', fontWeight: 400 }}>
                            We specialize in helping <span style={{ color: '#fff', fontWeight: 500 }}>restaurants and small businesses</span> improve their online presence and attract more customers.
                        </p>
                        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2.5rem', opacity: 0.8 }}>
                            Your website shouldn't just be a digital business card. It should be your most effective sales tool, working 24/7 to turn visitors into loyal clients.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default About;
