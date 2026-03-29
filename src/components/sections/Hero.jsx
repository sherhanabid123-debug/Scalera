import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const Hero = () => {
    const containerRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

            tl.fromTo('.hero-badge',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, delay: 0.5 }
            )
            .fromTo('.hero-title-line',
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.5, stagger: 0.1 },
                "-=0.8"
            )
            .fromTo('.hero-sub',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2 },
                "-=1"
            )
            .fromTo('.hero-btn-group',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2 },
                "-=1"
            )
            .fromTo('.hero-trust-item',
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1, stagger: 0.1 },
                "-=0.8"
            );

            gsap.to('.hero-content', {
                yPercent: 15,
                opacity: 0.8,
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
        <section ref={containerRef} className="section" style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            textAlign: 'center',
            position: 'relative',
            background: 'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.05) 0%, transparent 100%)',
            paddingTop: '10vh'
        }}>
            <div className="glow-orb" style={{ top: '20%', left: '50%', width: '1000px', height: '1000px', background: 'radial-gradient(circle, rgba(34, 211, 238, 0.05) 0%, transparent 70%)' }} />

            <div className="hero-content" style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', width: '90%' }}>
                <div className="hero-badge" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '8px 16px',
                    borderRadius: '100px',
                    background: 'rgba(34, 211, 238, 0.1)',
                    border: '1px solid rgba(34, 211, 238, 0.2)',
                    color: 'var(--accent-color)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '2rem'
                }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-color)', boxShadow: '0 0 10px var(--accent-color)' }} />
                    Leading Tech-Creative Agency
                </div>

                <h1 style={{ 
                    fontSize: 'clamp(3.5rem, 8vw, 7.5rem)', 
                    fontWeight: 800, 
                    lineHeight: 1, 
                    letterSpacing: '-0.04em', 
                    marginBottom: '2rem',
                    color: '#fff'
                }}>
                    <div className="hero-title-line" style={{ display: 'block' }}>We Build Digital</div>
                    <div className="hero-title-line text-gradient-accent" style={{ display: 'block' }}>Masterpieces<span style={{ color: '#fff' }}>.</span></div>
                </h1>

                <p className="hero-sub" style={{ 
                    fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', 
                    color: 'var(--text-secondary)', 
                    maxWidth: '800px', 
                    margin: '0 auto 3.5rem',
                    lineHeight: 1.6
                }}>
                    Engineered for high performance. Designed for pure impact. We transform ambitious brands into market leaders through cutting-edge design and AI-integrated software solutions.
                </p>

                <div className="hero-btn-group" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '5rem' }}>
                    <a href="https://wa.me/917975242650" target="_blank" rel="noopener noreferrer" className="nav-contact-btn" style={{ padding: '18px 48px', fontSize: '1rem' }}>
                        Transform My Brand
                    </a>
                    <a href="#work" style={{
                        padding: '18px 48px', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '50px',
                        fontWeight: 600, 
                        fontSize: '1rem',
                        color: '#fff', 
                        transition: 'all 0.3s ease',
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(10px)'
                    }} onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                        onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.03)'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                        View Our Projects
                    </a>
                </div>

                {/* Trust Badges */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '4rem', 
                    flexWrap: 'wrap',
                    padding: '2rem',
                    borderTop: '1px solid rgba(34, 211, 238, 0.1)',
                    maxWidth: '900px',
                    margin: '0 auto'
                }}>
                    <div className="hero-trust-item" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>50+</div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>Projects Delivered</div>
                    </div>
                    <div className="hero-trust-item" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>5+</div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>Years of Excellence</div>
                    </div>
                    <div className="hero-trust-item" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>100%</div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>Success Rate</div>
                    </div>
                </div>
            </div>

            {/* Floating Icons Background (Optional/Subtle) */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.1 }}>
                {/* SVG patterns or geometric shapes can go here */}
            </div>
        </section>
    );
};

export default Hero;
