import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const reasons = [
    'Clean, Modern Design',
    'Mobile-First Approach',
    'Structured SEO Foundation',
    'Performance-Focused Builds',
    'Direct & Clear Communication'
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
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out' }
            )
                .fromTo('.divider-line',
                    { scaleX: 0 },
                    { scaleX: 1, duration: 1.2, stagger: 0.15, ease: 'expo.inOut', transformOrigin: 'left center' },
                    "-=0.6"
                )
                .fromTo('.why-item-text',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'expo.out' },
                    "-=1"
                );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="section" style={{ position: 'relative', zIndex: 2 }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                <div>
                    <h2 className="why-title" style={{ fontSize: 'clamp(4rem, 7vw, 6.5rem)', fontWeight: 800, marginBottom: '2.5rem', lineHeight: 1.05, letterSpacing: '-0.04em' }}>
                        Why Work <br />With Us
                    </h2>
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
                                <span className="why-item-text" style={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.03em', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--accent-color)', fontSize: '1.25rem', fontWeight: 400, opacity: 0.6 }}>0{i + 1}</span>
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
