import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, ExternalLink } from 'lucide-react';

const Products = () => {
    const containerRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo('.product-card',
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1.5, stagger: 0.2, ease: 'expo.out',
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
        <section id="products" ref={containerRef} className="section" style={{ padding: '10rem 5%', position: 'relative' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <div className="hero-badge" style={{ marginBottom: '1.5rem' }}>Our Own Tech</div>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em' }}>Products<span className="text-gradient-accent">.</span></h2>
                </div>

                <div className="product-card glow-border" style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '32px',
                    padding: '4rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '4rem',
                    alignItems: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div>
                        <div style={{ 
                            fontSize: '0.8rem', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.2em', 
                            color: 'var(--accent-color)', 
                            fontWeight: 700, 
                            marginBottom: '1rem',
                            opacity: 0.8
                        }}>
                            Flowlance by Scalera
                        </div>
                        <h3 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Flowlance</h3>
                        <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem', opacity: 0.9 }}>
                            Client management for freelancers & teams
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '450px' }}>
                            Track clients, manage follow ups, and never miss opportunities. A powerful tool designed for modern professionals to scale their business.
                        </p>
                        
                        <a 
                            href="https://flowlance-one.vercel.app" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="nav-contact-btn"
                            style={{ padding: '16px 40px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}
                        >
                            Open Flowlance <ExternalLink size={18} />
                        </a>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '120%',
                            height: '120%',
                            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)',
                            zIndex: 0,
                            pointerEvents: 'none'
                        }} />
                        <img 
                            src="/assets/flowlance-mockup.png" 
                            alt="Flowlance Mockup" 
                            style={{ 
                                width: '100%', 
                                height: 'auto', 
                                borderRadius: '16px', 
                                position: 'relative', 
                                zIndex: 1,
                                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }} 
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Products;
