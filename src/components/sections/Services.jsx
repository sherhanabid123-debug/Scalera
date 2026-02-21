import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const services = [
    { title: 'Premium Website Design', desc: 'Custom, high-conversion aesthetics that command authority.' },
    { title: 'Business Landing Pages', desc: 'Focused, fast-loading pages engineered for lead generation.' },
    { title: 'Restaurant & other businesses', desc: 'Immersive digital storefronts with integrated booking.' },
    { title: 'WhatsApp Integration', desc: 'Seamless direct-to-chat workflows for modern consumers.' },
    { title: 'Performance Optimization', desc: 'Awwwards-level smooth scrolling and instant load times.' }
];

const Services = () => {
    const containerRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo('.service-card',
                { y: 60, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
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
        <section id="services" ref={containerRef} className="section" style={{ padding: '150px 5%', position: 'relative', zIndex: 2 }}>
            <div className="container">
                <h2 style={{ fontSize: '3rem', fontWeight: 600, marginBottom: '4rem', letterSpacing: '-0.02em' }}>Our Expertise.</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                    {services.map((service, i) => (
                        <div
                            key={i}
                            className="glass service-card"
                            style={{
                                padding: '3rem 2.5rem',
                                borderRadius: '24px',
                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4), 0 0 40px var(--accent-glow)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-glow)',
                                marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <div style={{ width: '8px', height: '8px', background: 'var(--accent-color)', borderRadius: '50%' }} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '1rem', letterSpacing: '-0.01em' }}>{service.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{service.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
