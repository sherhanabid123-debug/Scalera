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
    { id: 2, title: 'Thar', category: 'Heritage Dining', summary: 'An immersive digital journey bringing authentic culinary heritage online and driving local traffic.', link: 'https://tharthetasteofrajasthan.com', img: '/assets/thar-preview.jpg' },
    { id: 3, title: 'Kryptic', category: 'E-Commerce', summary: 'A high-performance storefront designed for maximum conversion and speed.', link: 'https://kryptic.shop', img: '/assets/kryptic-preview.jpg' },
    { id: 4, title: 'The Second House', category: 'Fine Dining & Art', summary: 'A unique culinary journey blending heritage and modern art to attract high-end clientele.', link: 'https://the-second-house.vercel.app', img: '/assets/second-house-real.png' }
];

const Portfolio = () => {
    const containerRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo('.portfolio-heading-anim',
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: containerRef.current, start: 'top 80%' } }
            );

            gsap.utils.toArray('.portfolio-item').forEach((item) => {
                gsap.fromTo(item,
                    { opacity: 0, y: 80 },
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
        <section id="work" ref={containerRef} style={{ padding: '10rem 0', position: 'relative' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5%' }}>
                <div style={{ marginBottom: '6rem' }}>
                    <div className="hero-badge" style={{ marginBottom: '1.5rem' }}>Portfolio</div>
                    <h2 className="portfolio-heading-anim" style={{ 
                        fontSize: 'clamp(3rem, 7vw, 6.5rem)', 
                        fontWeight: 800, 
                        marginBottom: '1.5rem', 
                        letterSpacing: '-0.04em', 
                        lineHeight: 1,
                        color: '#fff'
                    }}>
                        Recent <span className="text-gradient-accent">Work.</span>
                    </h2>
                    <p className="portfolio-heading-anim" style={{ 
                        color: 'var(--text-secondary)', 
                        fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)', 
                        maxWidth: '700px', 
                        lineHeight: 1.6 
                    }}>
                        A collection of high-impact digital solutions specifically built to <span style={{ color: '#fff' }}>convert visitors into customers.</span>
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
                    {projects.map((project, index) => (
                        <a
                            href={project.link || '#'}
                            target={project.link ? '_blank' : '_self'}
                            rel={project.link ? 'noopener noreferrer' : ''}
                            key={project.id}
                            className="portfolio-item group"
                            style={{ display: 'block', textDecoration: 'none', position: 'relative' }}
                        >
                            <div className="glow-border" style={{
                                aspectRatio: '16/10',
                                overflow: 'hidden', 
                                position: 'relative', 
                                marginBottom: '2rem', 
                                background: '#0f172a',
                                borderRadius: '24px'
                            }}>
                                <div
                                    style={{
                                        position: 'absolute', top: 0, left: 0,
                                        width: '100%', height: '100%',
                                        backgroundImage: `url(${project.img})`,
                                        backgroundSize: 'cover', backgroundPosition: 'center',
                                        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                                        filter: 'brightness(0.9)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.filter = 'brightness(1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.filter = 'brightness(0.9)';
                                    }}
                                />
                                {/* Overlay Gradient */}
                                <div style={{ 
                                    position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%',
                                    background: 'linear-gradient(to top, rgba(2,6,23,0.8), transparent)',
                                    pointerEvents: 'none'
                                }} />
                            </div>

                            <div style={{ padding: '0 0.5rem' }}>
                                <div style={{ 
                                    fontSize: '0.75rem', 
                                    fontWeight: 700, 
                                    color: 'var(--accent-color)', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.15em',
                                    marginBottom: '0.75rem'
                                }}>
                                    {project.category}
                                </div>
                                <h3 style={{ 
                                    fontSize: '1.75rem', 
                                    fontWeight: 700, 
                                    color: '#fff', 
                                    marginBottom: '1rem',
                                    letterSpacing: '-0.02em'
                                }}>
                                    {project.title}
                                </h3>
                                <p style={{ 
                                    color: 'var(--text-secondary)', 
                                    fontSize: '1rem', 
                                    lineHeight: 1.6,
                                    maxWidth: '90%'
                                }}>
                                    {project.summary}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
