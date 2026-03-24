import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const steps = [
    { num: '01', title: 'Discovery', desc: 'Understanding your brand, goals, and positioning.' },
    { num: '02', title: 'Design', desc: 'Creating a structured, modern visual concept.' },
    { num: '03', title: 'Development', desc: 'Building a fast, responsive, and optimized website.' },
    { num: '04', title: 'Launch', desc: 'Deployment, testing, and final refinements.' }
];

const Process = () => {
    const containerRef = useRef();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo('.process-step',
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'expo.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 75%',
                    }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="process" ref={containerRef} className="section" style={{ padding: '8rem 5%' }}>
            <div style={{
                display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: isMobile ? '2rem' : '4rem',
                borderTop: '1px solid var(--border-subtle)', paddingTop: '4rem',
                alignItems: 'start'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: isMobile ? 'relative' : 'sticky', top: '120px' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--accent-color)', borderRadius: '50%' }} />
                    <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-secondary)' }}>
                        Our Approach
                    </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '4rem 2rem' }}>
                    {steps.map((step, i) => (
                        <div 
                            key={i} 
                            className="process-step" 
                            style={{ 
                                borderTop: '1px solid rgba(255,255,255,0.1)', 
                                paddingTop: '2.5rem',
                                transition: 'all 0.6s var(--ease-apple)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.paddingTop = '3rem';
                                e.currentTarget.style.borderTopColor = 'rgba(255,255,255,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.paddingTop = '2.5rem';
                                e.currentTarget.style.borderTopColor = 'rgba(255,255,255,0.1)';
                            }}
                        >
                            <div style={{ fontSize: '0.8rem', color: 'var(--accent-color)', marginBottom: '1.5rem', fontWeight: 600, letterSpacing: '0.1em' }}>
                                STEP {step.num}
                            </div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 500, margin: '0 0 1rem 0', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                                {step.title}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1rem', margin: 0, maxWidth: '350px' }}>
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;
