import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const services = [
    { title: 'Digital Strategy', desc: 'Comprehensive roadmaps focused on market positioning, audience conversion, and long-term digital growth.' },
    { title: 'Brand Identity', desc: 'Crafting cohesive visual languages and premium brand assets that command authority and trust.' },
    { title: 'Web Experience', desc: 'Bespoke, high-performance websites engineered for both aesthetic impact and seamless user journeys.' },
    { title: 'Creative Direction', desc: 'Guiding the overarching artistic vision and interactive feel across all digital touchpoints.' }
];

const Services = () => {
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
            gsap.fromTo('.service-item',
                { opacity: 0, y: 40 },
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
        <section id="services" ref={containerRef} className="section" style={{ padding: '8rem 5%' }}>
            <div style={{
                display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: isMobile ? '2rem' : '4rem',
                borderTop: '1px solid var(--border-subtle)', paddingTop: '4rem',
                alignItems: 'start'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: isMobile ? 'relative' : 'sticky', top: '120px' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--accent-color)', borderRadius: '50%' }} />
                    <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-secondary)' }}>
                        Capabilities
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {services.map((service, i) => (
                        <div
                            key={i}
                            className="service-item"
                            style={{
                                borderBottom: '1px solid var(--border-subtle)',
                                padding: '3rem 0',
                                display: 'grid',
                                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                                gap: '2rem',
                                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                cursor: 'pointer',
                                alignItems: 'start'
                            }}
                            onMouseEnter={(e) => {
                                if (!isMobile) e.currentTarget.style.paddingLeft = '2rem';
                                e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                if (!isMobile) e.currentTarget.style.paddingLeft = '0';
                                e.currentTarget.style.borderBottomColor = 'var(--border-subtle)';
                            }}
                        >
                            <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 300, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                                {service.title}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1rem', margin: 0, paddingTop: isMobile ? '0' : '0.5rem', maxWidth: '400px' }}>
                                {service.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
