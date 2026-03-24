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

                <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 300, letterSpacing: '-0.04em', margin: '0 0 4rem 0', lineHeight: 1.1, color: 'var(--text-primary)' }}>
                    Let's Build Something<br />
                    <span style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>Structured</span> & Impactful.
                </h2>

                <a
                    href="https://wa.me/917975242650"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-premium"
                    style={{
                        padding: '1.5rem 4rem',
                        fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                        display: 'inline-flex', alignItems: 'center', gap: '1.25rem',
                        textDecoration: 'none'
                    }}
                >
                    Start Your Project
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </a>
            </div>
        </section>
    );
};

export default CTA;
