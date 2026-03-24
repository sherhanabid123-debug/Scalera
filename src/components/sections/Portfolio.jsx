import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const projects = [
    { id: 1, title: 'Thar', category: 'Restaurant Experience', summary: 'An immersive digital experience bringing authentic culinary heritage online.', link: 'https://tharthetasteofrajasthan.com', img: '/assets/thar-preview.jpg' },
    { id: 2, title: 'Kryptic', category: 'E-Commerce Platform', summary: 'A high-performance storefront designed for maximum conversion and speed.', link: 'https://kryptic.shop', img: '/assets/kryptic-preview.jpg' },
    { id: 3, title: 'The Second House', category: 'Heritage Dining & Art', summary: 'A unique culinary journey blending Goan heritage and modern art in a 108-year-old Indo-Portuguese bungalow.', link: 'https://the-second-house.vercel.app', img: '/assets/second-house-real.png' },
    {
        id: 4,
        title: 'Fridah by Bohemians',
        category: 'Immersive Restaurant / UI Design',
        summary: 'An immersive digital journey through bohemian luxury and artisanal multicuisine.',
        img: '/assets/fridah-preview.png',
        link: 'https://fridah-by-bohemians.vercel.app/#'
    }
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

            // Parallax image wrapper
            gsap.utils.toArray('.img-parallax').forEach((img) => {
                gsap.to(img, {
                    yPercent: 15,
                    ease: "none",
                    scrollTrigger: {
                        trigger: img.parentElement,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            });

        }, containerRef);
        return () => ctx.revert();
    }, []);
    return (
        <section id="work" ref={containerRef} style={{ padding: '8rem 0', borderTop: '1px solid var(--border-subtle)' }}>
            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 5%' }}>
                <h2 className="portfolio-heading" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 300, marginBottom: '1.5rem', letterSpacing: '-0.04em', lineHeight: 1 }}>Selected<br />Work</h2>
                <p className="portfolio-heading" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '500px', marginBottom: '6rem', lineHeight: 1.6 }}>
                    A selection of projects focused on clarity, structure, and measurable impact.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '4rem' : '4rem', alignItems: 'flex-start' }}>
                    {projects.map((project, index) => (
                        <a
                            href={project.link || '#'}
                            target={project.link ? '_blank' : '_self'}
                            rel={project.link ? 'noopener noreferrer' : ''}
                            key={project.id}
                            className="portfolio-item group"
                            style={{ display: 'block', cursor: 'pointer', textDecoration: 'none', transition: 'transform 0.6s var(--ease-apple)' }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={{
                                aspectRatio: '16/10',
                                overflow: 'hidden', position: 'relative', marginBottom: '2rem', 
                                background: '#111', borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                            }}>
                                <div
                                    className="img-parallax"
                                    style={{
                                        position: 'absolute', top: '-10%', left: 0,
                                        width: '100%', height: '120%',
                                        backgroundImage: `url(${project.img})`,
                                        backgroundSize: 'cover', backgroundPosition: 'center',
                                        transition: 'transform 0.8s var(--ease-apple), filter 0.8s ease',
                                        filter: 'grayscale(0.2) contrast(1.1) brightness(0.7)',
                                        transformOrigin: 'center'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.filter = 'grayscale(0) contrast(1) brightness(1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.filter = 'grayscale(0.2) contrast(1.1) brightness(0.7)';
                                    }}
                                />
                                {/* Bottom Glass Overlay for Project Info (Subtle) */}
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '1.5rem',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                                    pointerEvents: 'none'
                                }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1, paddingRight: '2rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{project.title}</h3>
                                    <p style={{ color: 'var(--accent-color)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, margin: '0 0 1rem 0' }}>{project.category}</p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: 0, textTransform: 'none', letterSpacing: 'normal', maxWidth: '400px' }}>{project.summary}</p>
                                </div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', opacity: 0.5, padding: '0.3rem 0', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                                    / 0{index + 1}
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
