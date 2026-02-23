import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const projects = [
    { id: 1, title: 'Thar - Taste of Rajasthan', category: 'Restaurant Website', link: 'https://tharthetasteofrajasthan.com', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200' },
    { id: 2, title: 'Kryptic Shop', category: 'E-commerce', link: 'https://kryptic.shop', img: 'https://images.unsplash.com/photo-1555448248-2571daf6344b?auto=format&fit=crop&q=80&w=1200' },
    { id: 3, title: 'Nova Logistics', category: 'Corporate Site', img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200' },
    { id: 4, title: 'Aura Fintech', category: 'Web Design & Next.js', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200' }
];

const Portfolio = () => {
    const containerRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo('.portfolio-item',
                { y: 100, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 70%'
                    }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleMouseMove = (e, imgRef) => {
        if (!imgRef.current) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        gsap.to(imgRef.current, {
            rotationY: x * 15,
            rotationX: -y * 15,
            scale: 1.05,
            ease: 'power2.out',
            duration: 0.5
        });
    };

    const handleMouseLeave = (imgRef) => {
        if (!imgRef.current) return;
        gsap.to(imgRef.current, {
            rotationY: 0,
            rotationX: 0,
            scale: 1,
            ease: 'power2.out',
            duration: 0.5
        });
    };

    return (
        <section id="work" ref={containerRef} className="section" style={{ padding: '150px 5%', position: 'relative', zIndex: 2 }}>
            <div className="container">
                <h2 style={{ fontSize: '3rem', fontWeight: 600, marginBottom: '4rem', letterSpacing: '-0.02em' }}>Selected Work.</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
                    {projects.map((project) => {
                        const imgRef = useRef();

                        return (
                            <a
                                href={project.link || '#'}
                                target={project.link ? '_blank' : '_self'}
                                rel={project.link ? 'noopener noreferrer' : ''}
                                key={project.id}
                                className="portfolio-item group"
                                style={{ cursor: 'pointer', perspective: '1000px', display: 'block' }}
                                onMouseMove={(e) => handleMouseMove(e, imgRef)}
                                onMouseLeave={() => handleMouseLeave(imgRef)}
                            >
                                <div style={{
                                    aspectRatio: '4/3', borderRadius: '16px', overflow: 'hidden',
                                    position: 'relative', marginBottom: '1.5rem', background: '#111'
                                }}>
                                    <div
                                        ref={imgRef}
                                        style={{
                                            width: '100%', height: '100%',
                                            backgroundImage: `url(${project.img})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            transition: 'filter 0.5s ease',
                                            filter: 'grayscale(0.4) brightness(0.8)'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.filter = 'grayscale(0) brightness(1)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.filter = 'grayscale(0.4) brightness(0.8)'; }}
                                    />
                                    {/* Subtle glass overlay inside image container on hover theoretically could go here */}
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 500, letterSpacing: '-0.01em', marginBottom: '0.25rem' }}>{project.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{project.category}</p>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
