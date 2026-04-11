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
        <section id="products" ref={containerRef} className="section" style={{ padding: '10rem 5%', background: 'var(--bg-primary)', position: 'relative' }}>
            <div className="container">
                <div className="product-heading" style={{ marginBottom: '6rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ width: '12px', height: '1px', background: 'var(--accent-color)' }} />
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent-color)' }}>Our Own Tech</span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, color: '#fff', letterSpacing: '-0.04em' }}>Products<span style={{ fontWeight: 600 }}>.</span></h2>
                </div>

                <div className="product-card" style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '24px',
                    padding: '4rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '6rem',
                    alignItems: 'center',
                    border: '1px solid var(--border-subtle)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div>
                        <div style={{ 
                            fontSize: '0.75rem', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.2em', 
                            color: 'var(--text-secondary)', 
                            fontWeight: 500, 
                            marginBottom: '1.5rem'
                        }}>
                            Flowlance by Scalera
                        </div>
                        <h3 style={{ fontSize: '3rem', fontWeight: 600, color: '#fff', marginBottom: '1rem', letterSpacing: '-0.03em' }}>Flowlance</h3>
                        <p style={{ fontSize: '1.25rem', fontWeight: 300, color: 'var(--text-primary)', marginBottom: '2rem', lineHeight: 1.4 }}>
                            Client management for freelancers & teams
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '3rem', maxWidth: '450px' }}>
                            Track clients, manage follow ups, and never miss opportunities. A powerful tool designed for modern professionals to scale their business with precision.
                        </p>
                        
                        <a 
                            href="https://flowlance-one.vercel.app" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.75rem',
                                color: 'var(--accent-color)',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                textDecoration: 'none',
                                paddingBottom: '4px',
                                borderBottom: '1px solid var(--accent-color)'
                            }}
                        >
                            Open Flowlance <ExternalLink size={16} />
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
                            background: 'radial-gradient(circle, rgba(220, 180, 128, 0.05) 0%, transparent 70%)',
                            zIndex: 0,
                            pointerEvents: 'none'
                        }} />
                        <img 
                            src="/assets/flowlance-mockup.png" 
                            alt="Flowlance Mockup" 
                            style={{ 
                                width: '100%', 
                                height: 'auto', 
                                borderRadius: '12px', 
                                position: 'relative', 
                                zIndex: 1,
                                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }} 
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Products;
