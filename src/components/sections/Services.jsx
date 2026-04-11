import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

const services = [
    { 
        title: 'Web Development', 
        desc: 'Custom websites designed to convert visitors into customers.', 
        time: '1-2 Weeks'
    },
    { 
        title: 'SEO & Visibility', 
        desc: 'Improving your visibility on search engines to bring consistent traffic and leads.', 
        time: 'Ongoing'
    },
    { 
        title: 'Digital Growth', 
        desc: 'Helping businesses scale their online presence with the right strategy and execution.', 
        time: '4-8 Weeks'
    }
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
        <section id="services" ref={containerRef} className="section" style={{ padding: '10rem 5%', background: 'var(--bg-primary)' }}>
            <div style={{
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr', 
                gap: isMobile ? '4rem' : '8rem',
                borderTop: '1px solid var(--border-subtle)', 
                paddingTop: '6rem',
                alignItems: 'start'
            }}>
                <div style={{ position: isMobile ? 'relative' : 'sticky', top: '120px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ width: '8px', height: '8px', background: 'var(--accent-color)', borderRadius: '50%' }} />
                        <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-secondary)' }}>
                            Expertise That Scales
                        </span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 300, lineHeight: 1.1, color: '#fff' }}>
                        Premium Solutions for <span style={{ fontWeight: 600 }}>Modern Brands.</span>
                    </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                    {services.map((service, index) => (
                        <div key={index} className="service-item" style={{ 
                            paddingBottom: '4rem', 
                            borderBottom: '1px solid var(--border-subtle)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '2rem', fontWeight: 500, color: '#fff' }}>{service.title}</h3>
                                <div style={{ 
                                    fontSize: '0.75rem', 
                                    padding: '6px 16px', 
                                    borderRadius: '50px', 
                                    border: '1px solid var(--border-subtle)',
                                    color: 'var(--text-secondary)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em'
                                }}>
                                    {service.time}
                                </div>
                            </div>
                            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '600px' }}>
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
