import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const CTA = () => {
    const containerRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo('.cta-content',
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1.5, ease: 'expo.out',
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
        <section ref={containerRef} className="section" style={{ padding: '12rem 5%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
            <div className="cta-content" style={{ width: '100%', maxWidth: '800px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Start a Conversation
                </p>

                <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 300, letterSpacing: '-0.03em', margin: '0 0 4rem 0', lineHeight: 1.1, color: 'var(--text-primary)' }}>
                    Let's Build Something<br />
                    <span style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>Structured</span> & Impactful.
                </h2>

                <a
                    href="https://wa.me/917483537959"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-btn"
                    style={{
                        padding: '1.5rem 4rem', borderRadius: '50px',
                        fontWeight: 400, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)', display: 'inline-flex', alignItems: 'center', gap: '1rem',
                        background: '#ffffff', color: '#050505', border: '1px solid #ffffff', textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.color = '#050505';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    Start Your Project
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </a>
            </div>
        </section>
    );
};

export default CTA;
