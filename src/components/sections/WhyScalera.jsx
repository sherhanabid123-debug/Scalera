import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const reasons = [
    'Built for growth',
    'Designed for conversion',
    'Structured for visibility',
    'Fast and mobile-first'
];

const WhyScalera = () => {
    const containerRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Animate lines and text
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 60%',
                }
            });

            tl.fromTo('.why-title',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
            )
                .fromTo('.divider-line',
                    { scaleX: 0 },
                    { scaleX: 1, duration: 0.8, stagger: 0.15, ease: 'power3.inOut', transformOrigin: 'left center' },
                    "-=0.4"
                )
                .fromTo('.why-item-text',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'power3.out' },
                    "-=0.8"
                );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="section" style={{ padding: '150px 5%', position: 'relative', zIndex: 2 }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                <div>
                    <h2 className="why-title" style={{ fontSize: 'clamp(3.5rem, 5vw, 5rem)', fontWeight: 600, marginBottom: '2rem', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                        Why <br />Scalera?
                    </h2>
                    <p className="why-title" style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '400px' }}>
                        We're not just order-takers. We act as your technical growth partners to build platforms that perform.
                    </p>
                </div>
                <div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
                        {reasons.map((reason, i) => (
                            <li key={i} style={{ position: 'relative', padding: '2rem 0', display: 'flex', alignItems: 'center' }}>
                                <div
                                    className="divider-line"
                                    style={{
                                        position: 'absolute', top: 0, left: 0, width: '100%', height: '1px',
                                        background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)'
                                    }}
                                />
                                <span className="why-item-text" style={{ fontSize: '1.875rem', fontWeight: 500, letterSpacing: '-0.02em', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--accent-color)', fontSize: '1rem', fontWeight: 400 }}>0{i + 1}</span>
                                    {reason}
                                </span>
                                {/* Last item needs a bottom divider too */}
                                {i === reasons.length - 1 && (
                                    <div
                                        className="divider-line"
                                        style={{
                                            position: 'absolute', bottom: 0, left: 0, width: '100%', height: '1px',
                                            background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)'
                                        }}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default WhyScalera;
