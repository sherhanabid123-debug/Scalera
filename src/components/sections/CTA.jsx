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
            position: 'relative', 
            zIndex: 2,
            overflow: 'hidden' 
        }}>
            {/* Background Glow */}
            <div style={{ 
                position: 'absolute', top: '50%', left: '50%', 
                width: '600px', height: '600px', 
                background: 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)',
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
                pointerEvents: 'none'
            }} />

            <div className="cta-content" style={{ 
                width: '100%', 
                maxWidth: '1000px', 
                textAlign: 'center',
                position: 'relative',
                zIndex: 2,
                background: 'rgba(15, 23, 42, 0.3)',
                backdropFilter: 'blur(20px)',
                padding: '6rem 4rem',
                borderRadius: '40px',
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}>
                <div className="hero-badge" style={{ marginBottom: '2rem' }}>Ready to Scale?</div>

                <h2 style={{ 
                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', 
                    fontWeight: 800, 
                    letterSpacing: '-0.04em', 
                    margin: '0 0 3.5rem 0', 
                    lineHeight: 1.1, 
                    color: '#fff' 
                }}>
                    Let's Build Your Digital<br />
                    <span className="text-gradient-accent">Competitive Advantage.</span>
                </h2>

                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a
                        href="https://wa.me/917975242650"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-contact-btn"
                        style={{
                            padding: '1.5rem 4rem', 
                            fontSize: '1.1rem',
                            fontWeight: 700
                        }}
                    >
                        Start Your Free Consultation <ArrowRight size={20} style={{ marginLeft: '1rem' }} />
                    </a>
                </div>
                
                <p style={{ marginTop: '2.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    *No commitment required. We'll audit your goals and propose a strategy.
                </p>
            </div>
        </section>
    );
};

export default CTA;
