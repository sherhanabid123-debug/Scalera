import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';

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
                        start: 'top 85%',
                    }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="section" style={{ 
            padding: '12rem 5%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center',
            background: 'var(--bg-primary)'
        }}>
            <div className="cta-content" style={{ maxWidth: '1000px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                    <div style={{ width: '40px', height: '1px', background: 'var(--accent-color)' }} />
                    <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent-color)' }}>Ready to Scale?</span>
                    <div style={{ width: '40px', height: '1px', background: 'var(--accent-color)' }} />
                </div>

                <h2 style={{ 
                    fontSize: 'clamp(2.5rem, 5vw, 6rem)', 
                    fontWeight: 300, 
                    letterSpacing: '-0.04em', 
                    marginBottom: '4rem', 
                    lineHeight: 1.1, 
                    color: '#fff' 
                }}>
                    Let's Build Your Digital<br />
                    <span style={{ fontWeight: 600 }}>Competitive Advantage.</span>
                </h2>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <a
                        href="https://wa.me/917975242650"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-contact-btn"
                        style={{
                            padding: '1.5rem 4rem', 
                            fontSize: '1.1rem',
                            letterSpacing: '0.1em'
                        }}
                    >
                        Start Your Consultation <ArrowRight size={20} style={{ marginLeft: '1rem' }} />
                    </a>
                </div>
                
                <p style={{ marginTop: '3rem', color: 'var(--text-secondary)', fontSize: '0.9rem', opacity: 0.6 }}>
                    *No commitment required. We'll audit your goals and propose a strategy.
                </p>
            </div>
        </section>
    );
};

export default CTA;
