import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { Layout, Code, Search, Zap, Clock, ArrowUpRight } from 'lucide-react';

const services = [
    { 
        title: 'High Performance Landing Pages', 
        desc: 'Custom built landing pages designed for high conversion and fast load speeds.', 
        time: '1-2 Weeks',
        icon: <Zap size={24} />
    },
    { 
        title: 'Custom Web & SaaS Development', 
        desc: 'End to end fullstack development using React/Next.js for complex digital products.', 
        time: '4-12 Weeks',
        icon: <Code size={24} />
    },
    { 
        title: 'Brand Identity & UI/UX Design', 
        desc: 'Comprehensive visual direction and user experience design that resonates with your users.', 
        time: '2-4 Weeks',
        icon: <Layout size={24} />
    },
    { 
        title: 'SEO & Growth Acceleration', 
        desc: 'Strategies designed to boost organic rankings and accelerate your user acquisition.', 
        time: 'Ongoing',
        icon: <Search size={24} />
    }
];

const Services = () => {
    const containerRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo('.service-card',
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
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
        <section id="services" ref={containerRef} className="section" style={{ padding: '10rem 5%', position: 'relative' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <div className="hero-badge" style={{ marginBottom: '1.5rem' }}>Our Capabilities</div>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#fff' }}>Expertise That Scales.</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
                    {services.map((service, i) => (
                        <div
                            key={i}
                            className="service-card glow-border"
                            style={{
                                background: 'rgba(15, 23, 42, 0.5)',
                                backdropFilter: 'blur(10px)',
                                padding: '3rem',
                                borderRadius: '24px',
                                textAlign: 'left',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                minHeight: '320px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{ position: 'relative', zIndex: 2 }}>
                                <div style={{ 
                                    width: '56px', height: '56px', borderRadius: '16px', 
                                    background: 'rgba(34, 211, 238, 0.1)', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--accent-color)', marginBottom: '2rem'
                                }}>
                                    {service.icon}
                                </div>

                                <div style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: '0.5rem', 
                                    fontSize: '0.7rem', 
                                    fontWeight: 700, 
                                    color: 'var(--text-secondary)',
                                    marginBottom: '1rem',
                                    padding: '6px 14px',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '50px'
                                }}>
                                    <Clock size={12} />
                                    {service.time}
                                </div>

                                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                                    {service.title}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                                    {service.desc}
                                </p>
                            </div>

                            <a href="https://wa.me/917975242650" target="_blank" rel="noopener noreferrer" style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem', 
                                color: '#fff', 
                                fontWeight: 600, 
                                fontSize: '0.85rem',
                                textDecoration: 'none',
                                opacity: 0.8,
                                transition: 'opacity 0.3s'
                            }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.8}>
                                Start Project <ArrowUpRight size={16} />
                            </a>

                            {/* Background Subtle Gradient */}
                            <div style={{ 
                                position: 'absolute', top: '-10%', right: '-10%', 
                                width: '200px', height: '200px', 
                                background: 'radial-gradient(circle, rgba(34, 211, 238, 0.05) 0%, transparent 70%)',
                                zIndex: 1
                            }} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
