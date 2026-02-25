import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
    const containerRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo('.test-quote',
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: containerRef.current, start: 'top 75%' } }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="section" style={{ padding: '12rem 5%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', borderTop: '1px solid var(--border-subtle)' }}>
            <div className="test-quote" style={{ maxWidth: '1200px', textAlign: 'center' }}>
                <div style={{ marginBottom: '3rem', color: 'var(--accent-color)', opacity: 0.5, display: 'flex', justifyContent: 'center' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                </div>
                <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', fontWeight: 300, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: '3rem' }}>
                    "They didn't just build a website, they <span style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>engineered a digital presence</span> that instantly elevated our brand authority."
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <p style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600, margin: 0 }}>James Chen</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Founder, Nova Logistics</p>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
