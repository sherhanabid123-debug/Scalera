import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

const projects = [
    {
        id: 1,
        title: 'Fridah by Bohemians',
        category: 'Restaurant Experience',
        summary: 'A premium restaurant website designed to showcase experience, ambience, and drive bookings.',
        img: '/assets/fridah-preview.png',
        link: 'https://fridah-by-bohemians.vercel.app/#'
    },
    { id: 2, title: 'Thar', category: 'Heritage Dining', summary: 'A digital journey that brings authentic culinary heritage online and drives local traffic.', link: 'https://tharthetasteofrajasthan.com', img: '/assets/thar-preview.jpg' },
    { id: 3, title: 'Kryptic', category: 'E-Commerce', summary: 'A fast and optimized storefront designed to maximize sales.', link: 'https://kryptic.shop', img: '/assets/kryptic-preview.jpg' },
    { id: 4, title: 'The Second House', category: 'Fine Dining & Art', summary: 'A unique dining website blending heritage and modern art to attract high-end clientele.', link: 'https://the-second-house.vercel.app', img: '/assets/second-house-real.png' }
];

const Portfolio = () => {
    const containerRef = useRef();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo('.portfolio-heading',
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: '.portfolio-heading', start: 'top 80%' } }
            );

            gsap.utils.toArray('.portfolio-item').forEach((item) => {
                gsap.fromTo(item,
                    { opacity: 0, y: 100 },
                    {
                        opacity: 1, y: 0, duration: 1.5, ease: 'expo.out',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 85%'
                        }
                    }
                );
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="work" ref={containerRef} style={{ padding: '10rem 0', background: 'var(--bg-primary)' }}>
            <div className="container">
                <div className="portfolio-heading" style={{ marginBottom: '8rem', maxWidth: '800px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ width: '12px', height: '1px', background: 'var(--accent-color)' }} />
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent-color)' }}>Portfolio</span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 300, lineHeight: 1.1, marginBottom: '2.5rem' }}>
                        Websites built to <span style={{ fontWeight: 600 }}>Convert.</span>
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        A collection of high-impact digital solutions specifically built to turn visitors into customers.
                    </p>
                </div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
                    gap: isMobile ? '4rem' : '10rem',
                    paddingBottom: '5rem'
                }}>
                    {projects.map((project, index) => (
                        <div 
                            key={project.id} 
                            className="portfolio-item"
                            style={{ 
                                marginTop: (!isMobile && index % 2 !== 0) ? '12rem' : '0',
                                position: 'relative'
                            }}
                        >
                            <a 
                                href={project.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ display: 'block', textDecoration: 'none' }}
                                onMouseEnter={(e) => {
                                    const img = e.currentTarget.querySelector('.project-img');
                                    if (img) img.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    const img = e.currentTarget.querySelector('.project-img');
                                    if (img) img.style.transform = 'scale(1)';
                                }}
                            >
                                <div style={{ 
                                    aspectRatio: '4/5', 
                                    overflow: 'hidden', 
                                    background: '#1a1a1a',
                                    marginBottom: '2.5rem',
                                    position: 'relative'
                                }}>
                                    <img 
                                        src={project.img} 
                                        alt={project.title} 
                                        className="project-img"
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover',
                                            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                            filter: 'grayscale(0.2)'
                                        }} 
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4))',
                                        pointerEvents: 'none'
                                    }} />
                                </div>
                                <div style={{ padding: '0 0.5rem' }}>
                                    <span style={{ 
                                        fontSize: '0.7rem', 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '0.15em', 
                                        color: 'var(--accent-color)',
                                        display: 'block',
                                        marginBottom: '0.75rem'
                                    }}>
                                        {project.category}
                                    </span>
                                    <h3 style={{ fontSize: '1.75rem', fontWeight: 500, marginBottom: '1rem', color: '#fff' }}>
                                        {project.title}
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '90%' }}>
                                        {project.summary}
                                    </p>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
