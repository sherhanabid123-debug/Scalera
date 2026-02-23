import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const Hero = () => {
    const containerRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Intro animation
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.fromTo('.hero-word',
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.4, stagger: 0.1, ease: 'expo.out', delay: 0.2 }
            )
                .fromTo('.hero-sub',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
                    "-=1"
                )
                .fromTo('.hero-btn',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power4.out' },
                    "-=0.8"
                );

            // Scroll parallax
            gsap.to('.hero-content', {
                yPercent: 30,
                opacity: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 5%' }}>
            <div className="hero-content" style={{ maxWidth: '800px', position: 'relative', zIndex: 2, perspective: '1000px' }}>
                <h1 style={{ fontSize: 'clamp(3.5rem, 7vw, 7rem)', fontWeight: 600, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <span className="hero-word" style={{ display: 'inline-block' }}>Scaling</span>
                        <span className="hero-word" style={{ display: 'inline-block' }}>Brands</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <span className="hero-word text-gradient-accent" style={{ display: 'inline-block' }}>Through</span>
                        <span className="hero-word text-gradient-accent" style={{ display: 'inline-block' }}>Digital</span>
                        <span className="hero-word text-gradient-accent" style={{ display: 'inline-block' }}>Precision.</span>
                    </div>
                </h1>
                <p className="hero-sub" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6 }}>
                    We craft high-performance websites designed to elevate your brand and accelerate growth.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href="#work" className="hero-btn" style={{
                        background: 'var(--text-primary)', color: 'var(--bg-primary)',
                        padding: '1.25rem 2.5rem', borderRadius: '40px', fontWeight: 600,
                        fontSize: '1.1rem', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', display: 'inline-block'
                    }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-4px)'; e.target.style.boxShadow = '0 10px 20px rgba(255,255,255,0.2)'; }}
                        onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}>
                        View Work
                    </a>
                    <a href="https://wa.me/917483537959" target="_blank" rel="noopener noreferrer" className="glass hero-btn" style={{
                        color: 'var(--text-primary)', padding: '1.25rem 2.5rem',
                        borderRadius: '40px', fontWeight: 500, fontSize: '1.1rem',
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', display: 'inline-block'
                    }} onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.transform = 'translateY(-4px)'; e.target.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)'; }}
                        onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.02)'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 32px 0 rgba(0,0,0,0.3)'; }}>
                        Start a Project
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
