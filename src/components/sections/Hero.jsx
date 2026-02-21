import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const Hero = () => {
    const containerRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Intro animation
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.fromTo('.hero-title',
                { y: 50, opacity: 0, rotationX: -20 },
                { y: 0, opacity: 1, rotationX: 0, duration: 1.2, stagger: 0.1, delay: 0.5 }
            )
                .fromTo('.hero-sub',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1 },
                    "-=0.8"
                )
                .fromTo('.hero-btn',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
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
                <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
                    <div className="hero-title" style={{ transformOrigin: 'left center' }}>Scaling Brands</div>
                    <div className="hero-title" style={{ transformOrigin: 'left center', color: 'var(--accent-color)' }}>Through Digital Precision.</div>
                </h1>
                <p className="hero-sub" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6 }}>
                    We craft high-performance websites designed to elevate your brand and accelerate growth.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href="#work" className="hero-btn" style={{
                        background: 'var(--text-primary)', color: 'var(--bg-primary)',
                        padding: '1rem 2rem', borderRadius: '40px', fontWeight: 600,
                        fontSize: '1rem', transition: 'all 0.3s ease', display: 'inline-block'
                    }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                        View Work
                    </a>
                    <a href="https://wa.me/917483537959" target="_blank" rel="noopener noreferrer" className="glass hero-btn" style={{
                        color: 'var(--text-primary)', padding: '1rem 2rem',
                        borderRadius: '40px', fontWeight: 500, fontSize: '1rem',
                        transition: 'all 0.3s ease', display: 'inline-block'
                    }} onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.03)'; e.target.style.transform = 'translateY(0)'; }}>
                        Start a Project
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
