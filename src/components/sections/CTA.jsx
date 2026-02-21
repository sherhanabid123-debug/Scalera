import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const CTA = () => {
    const containerRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo('.cta-content',
                { scale: 0.9, opacity: 0, y: 50 },
                {
                    scale: 1, opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                    }
                }
            );

            // Subtle background glow movement
            gsap.to('.cta-glow', {
                x: 'random(-50, 50)',
                y: 'random(-50, 50)',
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="section" style={{ padding: '200px 5%', textAlign: 'center', position: 'relative', overflow: 'hidden', zIndex: 2 }}>
            {/* Moving background glow specific to CTA */}
            <div className="cta-glow" style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0,0,0,0) 70%)',
                zIndex: -1, pointerEvents: 'none', borderRadius: '50%'
            }} />

            <div className="container cta-content" style={{ position: 'relative', zIndex: 2 }}>
                <h2 style={{ fontSize: 'clamp(4rem, 8vw, 7rem)', fontWeight: 600, letterSpacing: '-0.04em', marginBottom: '2rem', lineHeight: 1 }}>
                    Ready to Scale?
                </h2>
                <a href="https://wa.me/917483537959" target="_blank" rel="noopener noreferrer" className="glass" style={{
                    color: 'var(--text-primary)', padding: '1.25rem 3rem', borderRadius: '40px',
                    fontWeight: 600, fontSize: '1.125rem', cursor: 'pointer', transition: 'all 0.3s ease',
                    boxShadow: '0 0 20px rgba(255,255,255,0.05)', display: 'inline-block'
                }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f5f5f5';
                        e.currentTarget.style.color = '#0a0a0a';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                    Let's Build Your Presence
                </a>
            </div>
        </section>
    );
};

export default CTA;
