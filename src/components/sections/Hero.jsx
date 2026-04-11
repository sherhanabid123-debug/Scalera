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
                <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 7rem)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', textTransform: 'uppercase' }}>
                    <div style={{ overflow: 'hidden', paddingBottom: '0.5rem' }}>
                        <span className="hero-word" style={{ display: 'inline-block' }}>We build</span>
                    </div>
                    <div style={{ overflow: 'hidden', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '3vw' }}>
                        <span className="hero-word" style={{ display: 'inline-block', fontWeight: 600 }}>High-Conversion</span>
                        <div className="hero-line" style={{ flexGrow: 1, height: '1px', background: 'var(--border-subtle)', marginTop: '2vw' }} />
                    </div>
                    <div style={{ overflow: 'hidden', paddingBottom: '0.5rem' }}>
                        <span className="hero-word" style={{ display: 'inline-block', color: 'var(--text-secondary)' }}>Websites.</span>
                    </div>
                </h1>

                <p className="hero-sub" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '700px', lineHeight: 1.6, marginBottom: '3.5rem' }}>
                    From design to development, we create websites that do more than just look good. <span style={{ color: '#fff', fontWeight: 600 }}>They bring in real customers.</span>
                </p>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <a href="#work" className="hero-btn" style={{
                        padding: '1.25rem 3rem', border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '50px',
                        fontWeight: 400, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                        color: '#fff', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)', display: 'inline-block',
                        background: 'transparent'
                    }} onMouseEnter={(e) => { e.target.style.background = '#fff'; e.target.style.color = '#0a0a0a'; }}
                        onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#fff'; }}>
                        View Our Work
                    </a>
                    <a href="https://wa.me/917975242650" target="_blank" rel="noopener noreferrer" className="hero-btn" style={{
                        padding: '1.25rem 3rem',
                        background: 'var(--accent-color)',
                        borderRadius: '50px',
                        color: 'var(--bg-primary)',
                        fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                        transition: 'all 0.4s ease', display: 'inline-block'
                    }} onMouseEnter={(e) => { e.target.style.opacity = '0.9'; e.target.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }}>
                        Book a Call
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
