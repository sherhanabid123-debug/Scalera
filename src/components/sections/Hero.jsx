import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const Hero = () => {
    const containerRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

            tl.fromTo('.hero-word',
                { yPercent: 120 },
                { yPercent: 0, duration: 1.8, stagger: 0.05, delay: 0.3 }
            )
                .fromTo('.hero-line',
                    { scaleX: 0 },
                    { scaleX: 1, duration: 1.5, transformOrigin: 'left' },
                    "-=1.4"
                )
                .fromTo('.hero-sub',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.5 },
                    "-=1.4"
                )
                .fromTo('.hero-btn',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 },
                    "-=1.2"
                )
                .fromTo('.scroll-indicator',
                    { opacity: 0 },
                    { opacity: 1, duration: 1.5 },
                    "-=1"
                );

            gsap.to('.hero-content', {
                yPercent: 25,
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
        <section ref={containerRef} className="section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
            <div className="glow-orb" style={{ top: '30%', left: '40%' }} />

            <div className="hero-content" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', paddingLeft: '5%', maxWidth: '1400px' }}>
                <p className="hero-sub" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent-color)', marginBottom: '2rem' }}>
                    Digital Creative Studio
                </p>

                <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 10rem)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: '3.5rem', display: 'flex', flexDirection: 'column', textTransform: 'uppercase' }}>
                    <div style={{ overflow: 'hidden', paddingBottom: '0.5rem' }}>
                        <span className="hero-word" style={{ display: 'inline-block' }}>Forging</span>
                    </div>
                    <div style={{ overflow: 'hidden', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '3vw' }}>
                        <span className="hero-word" style={{ display: 'inline-block', fontWeight: 600 }}>Digital</span>
                        <div className="hero-line" style={{ flexGrow: 1, height: '1px', background: 'var(--border-subtle)', marginTop: '2vw' }} />
                    </div>
                    <div style={{ overflow: 'hidden', paddingBottom: '0.5rem' }}>
                        <span className="hero-word" style={{ display: 'inline-block', color: 'var(--text-secondary)' }}>Elegance.</span>
                    </div>
                </h1>

                <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
                    <a href="#work" className="hero-btn" style={{
                        padding: '1.25rem 3rem', border: '1px solid rgba(255,255,255,0.15)',
                        fontWeight: 400, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                        color: '#fff', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)', display: 'inline-block',
                        background: 'transparent'
                    }} onMouseEnter={(e) => { e.target.style.background = '#fff'; e.target.style.color = '#0a0a0a'; }}
                        onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#fff'; }}>
                        Selected Work
                    </a>
                    <a href="https://wa.me/917483537959" target="_blank" rel="noopener noreferrer" className="hero-btn" style={{
                        color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em',
                        transition: 'color 0.4s ease', position: 'relative', display: 'inline-block', paddingBottom: '6px'
                    }} onMouseEnter={(e) => { e.target.style.color = '#fff'; e.currentTarget.querySelector('.underline').style.transform = 'scaleX(1)'; }}
                        onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; e.currentTarget.querySelector('.underline').style.transform = 'scaleX(0)'; }}>
                        Start a Project
                        <div className="underline" style={{
                            position: 'absolute', bottom: 0, left: 0, width: '100%', height: '1px',
                            background: '#fff', transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                        }} />
                    </a>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-indicator" style={{
                position: 'absolute', bottom: '40px', right: '5%',
                display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0
            }}>
                <span style={{
                    fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em',
                    color: 'var(--text-secondary)'
                }}>Explore</span>
                <div style={{
                    width: '60px', height: '1px', background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'var(--text-primary)',
                        animation: 'scrollSlide 2s cubic-bezier(0.16, 1, 0.3, 1) infinite'
                    }} />
                </div>
                <style>{`
                    @keyframes scrollSlide {
                        0% { transform: translateX(-100%); }
                        50% { transform: translateX(100%); }
                        100% { transform: translateX(100%); }
                    }
                `}</style>
            </div>
        </section>
    );
};

export default Hero;
