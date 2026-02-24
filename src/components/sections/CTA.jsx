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
        <section ref={containerRef} className="section" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden', zIndex: 2 }}>
            {/* Moving background glow specific to CTA */}
            <div className="cta-glow" style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                zIndex: -1, pointerEvents: 'none', borderRadius: '50%'
            }} />

            <div className="container cta-content" style={{ position: 'relative', zIndex: 2 }}>
                <h2 style={{ fontSize: 'clamp(4.5rem, 9vw, 8rem)', fontWeight: 800, letterSpacing: '-0.05em', marginBottom: '2.5rem', lineHeight: 1 }}>
                    Ready to Scale?
                </h2>
                <a
                    href="https://wa.me/917483537959"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass"
                    style={{
                        color: 'var(--text-primary)', padding: '1.25rem 3.5rem', borderRadius: '40px',
                        fontWeight: 600, fontSize: '1.125rem', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        display: 'inline-block', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)'
                    }}
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left - rect.width / 2;
                        const y = e.clientY - rect.top - rect.height / 2;
                        e.currentTarget.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                        e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.3)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translate(0px, 0px) scale(1)';
                        e.currentTarget.style.background = 'var(--bg-secondary)';
                        e.currentTarget.style.border = '1px solid var(--border-subtle)';
                        e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0,0,0,0.5)';
                    }}
                >
                    Let's Build Your Presence
                </a>
            </div>
        </section>
    );
};

export default CTA;
