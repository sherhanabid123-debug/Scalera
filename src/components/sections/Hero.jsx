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
                )
                .fromTo('.scroll-indicator',
                    { opacity: 0 },
                    { opacity: 1, duration: 1, ease: 'power2.out' },
                    "-=0.5"
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
        <section ref={containerRef} className="section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 5%', overflow: 'hidden' }}>
            {/* Soft, premium optical glow behind hero text */}
            <div className="glow-orb" style={{ top: '40%', left: '50%' }} />

            <div className="hero-content" style={{ maxWidth: '900px', position: 'relative', zIndex: 2, perspective: '1000px' }}>
                <h1 style={{ fontSize: 'clamp(4.5rem, 9vw, 9rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.05em', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column' }}>
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
                <p className="hero-sub" style={{ fontSize: '1.35rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '3.5rem', lineHeight: 1.6, fontWeight: 400 }}>
                    We craft high-performance websites designed to elevate your brand and accelerate growth.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href="#work" className="hero-btn" style={{
                        background: 'linear-gradient(135deg, var(--accent-orange) 0%, var(--accent-blend) 50%, var(--accent-sky) 100%)', color: '#ffffff',
                        padding: '1.25rem 3rem', borderRadius: '40px', fontWeight: 600, border: 'none',
                        fontSize: '1.05rem', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', display: 'inline-block',
                        boxShadow: '0 8px 32px rgba(244, 63, 94, 0.3)'
                    }} onMouseEnter={(e) => { e.target.style.transform = 'translateY(-4px)'; e.target.style.boxShadow = '0 12px 40px rgba(56, 189, 248, 0.4), 0 12px 40px rgba(249, 115, 22, 0.4)'; }}
                        onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 32px rgba(244, 63, 94, 0.3)'; }}>
                        View Work
                    </a>
                    <a href="https://wa.me/917483537959" target="_blank" rel="noopener noreferrer" className="glass hero-btn" style={{
                        color: 'var(--text-primary)', padding: '1.25rem 3rem',
                        borderRadius: '40px', fontWeight: 500, fontSize: '1.05rem',
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', display: 'inline-block'
                    }} onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.transform = 'translateY(-4px)'; e.target.style.boxShadow = '0 15px 40px rgba(0,0,0,0.8)'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                        onMouseLeave={(e) => { e.target.style.background = 'rgba(30, 41, 59, 0.5)'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 30px rgba(0,0,0,0.3)'; e.target.style.borderColor = 'var(--border-subtle)'; }}>
                        Start a Project
                    </a>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-indicator" style={{
                position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0
            }}>
                <span style={{
                    fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em',
                    marginBottom: '1rem', color: 'var(--text-secondary)'
                }}>Scroll</span>
                <div style={{
                    width: '1px', height: '60px', background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'var(--accent-color)',
                        animation: 'scrollDrop 2s cubic-bezier(0.16, 1, 0.3, 1) infinite'
                    }} />
                </div>
                <style>{`
                    @keyframes scrollDrop {
                        0% { transform: translateY(-100%); }
                        50% { transform: translateY(100%); }
                        100% { transform: translateY(100%); }
                    }
                `}</style>
            </div>
        </section>
    );
};

export default Hero;
