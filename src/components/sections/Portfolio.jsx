import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const projects = [
    { id: 1, title: 'Thar', category: 'Restaurant Experience', link: 'https://tharthetasteofrajasthan.com', img: '/assets/thar-preview.jpg' },
    { id: 2, title: 'Kryptic', category: 'E-Commerce Platform', link: 'https://kryptic.shop', img: '/assets/kryptic-preview.jpg' },
    { id: 3, title: 'Nova', category: 'Corporate Identity', img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200' },
    { id: 4, title: 'Aura', category: 'Fintech Interface', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200' }
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
        <section id="work" ref={containerRef} className="section" style={{ padding: '8rem 5%', borderTop: '1px solid var(--border-subtle)' }}>
            <h2 className="portfolio-heading" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 300, marginBottom: '2rem', letterSpacing: '-0.04em', lineHeight: 1 }}>Selected<br />Work</h2>
            <p className="portfolio-heading" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '500px', marginBottom: '6rem', lineHeight: 1.6 }}>
                A selection of projects focused on clarity, structure, and measurable impact.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '4rem' : '4rem 8rem' }}>
                {projects.map((project, index) => {
                    const offsetClass = (!isMobile && index % 2 !== 0) ? 'portfolio-offset' : '';

                    return (
                        <a
                            href={project.link || '#'}
                            target={project.link ? '_blank' : '_self'}
                            rel={project.link ? 'noopener noreferrer' : ''}
                            key={project.id}
                            className={`portfolio-item group ${offsetClass}`}
                            style={{
                                display: 'block', cursor: 'pointer', textDecoration: 'none',
                                marginTop: (!isMobile && index % 2 !== 0) ? '8rem' : '0'
                            }}
                        >
                            <div style={{
                                aspectRatio: index % 2 === 0 ? '4/5' : '3/4', /* varying ratios for editorial look */
                                overflow: 'hidden', position: 'relative', marginBottom: '1.5rem', background: '#111'
                            }}>
                                <div
                                    className="img-parallax"
                                    style={{
                                        position: 'absolute', top: '-10%', left: 0,
                                        width: '100%', height: '120%',
                                        backgroundImage: `url(${project.img})`,
                                        backgroundSize: 'cover', backgroundPosition: 'center',
                                        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease',
                                        filter: 'grayscale(0.8) contrast(1.1) brightness(0.7)',
                                        transformOrigin: 'center'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.filter = 'grayscale(0) contrast(1.1) brightness(0.9)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.filter = 'grayscale(0.8) contrast(1.1) brightness(0.7)';
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.75rem', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '0.2rem', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{project.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{project.category}</p>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '0.2rem 0' }}>
                                    [0{index + 1}]
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>
        </section>
    );
};

export default Portfolio;
