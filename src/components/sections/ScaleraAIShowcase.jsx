import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

const ScaleraAIShowcase = () => {
    const containerRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 75%',
                }
            });

            tl.fromTo('.ai-tag',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            )
            .fromTo('.ai-title',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, ease: 'expo.out' },
                "-=0.4"
            )
            .fromTo('.ai-desc',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
                "-=0.6"
            )
            .fromTo('.ai-btn-wrapper',
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' },
                "-=0.6"
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="scalera-ai" ref={containerRef} className="section" style={{ padding: '8rem 5%', position: 'relative', overflow: 'hidden' }}>
            
            {/* Background Glow */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                pointerEvents: 'none', zIndex: 0
            }} />

            <div style={{
                position: 'relative', zIndex: 1,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'linear-gradient(145deg, rgba(20,20,20,0.6) 0%, rgba(10,10,10,0.8) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '5rem 2rem',
                textAlign: 'center',
                maxWidth: '900px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}>
                <div className="ai-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Zap size={14} color="#fff" />
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
                        Next-Gen Technology
                    </span>
                </div>

                <h2 className="ai-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 400, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                    Meet <span className="text-gradient-accent" style={{ fontWeight: 600 }}>Scalera AI ✨</span>
                </h2>

                <p className="ai-desc" style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.25rem)', maxWidth: '600px', margin: 0, lineHeight: 1.6 }}>
                    Describe your dream website in a single prompt. Our advanced AI builds, designs, and personalizes a fully functional website tailored to your business in under 60 seconds.
                </p>

                <div className="ai-btn-wrapper" style={{ marginTop: '1rem' }}>
                    <a href="/scalera-ai.html" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                        background: '#fff', color: '#000',
                        padding: '1rem 2rem', borderRadius: '100px',
                        textDecoration: 'none', fontWeight: 500, fontSize: '1.1rem',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        boxShadow: '0 0 30px rgba(255,255,255,0.2)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 10px 40px rgba(255,255,255,0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.2)';
                    }}>
                        Try the Builder Free <ArrowRight size={18} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default ScaleraAIShowcase;
