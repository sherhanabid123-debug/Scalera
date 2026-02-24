import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Marquee = () => {
    const containerRef = useRef();

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        let ctx = gsap.context(() => {
            gsap.to('.marquee-inner', {
                xPercent: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} style={{
            overflow: 'hidden', padding: '120px 0',
            background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)',
            position: 'relative', zIndex: 2
        }}>
            <div className="marquee-inner" style={{ display: 'flex', width: '200vw' }}>
                <h2 style={{
                    fontSize: 'clamp(6rem, 20vw, 20rem)', fontWeight: 900,
                    whiteSpace: 'nowrap', textTransform: 'uppercase',
                    color: 'transparent', WebkitTextStroke: '2px rgba(248, 250, 252, 0.05)',
                    paddingRight: '5vw', lineHeight: 1, letterSpacing: '-0.02em', margin: 0
                }}>
                    SCALERA DIGITAL AGENCY • SCALERA DIGITAL AGENCY • SCALERA DIGITAL AGENCY • SCALERA DIGITAL AGENCY •
                </h2>
                <h2 style={{
                    fontSize: 'clamp(6rem, 20vw, 20rem)', fontWeight: 900,
                    whiteSpace: 'nowrap', textTransform: 'uppercase',
                    color: 'transparent', WebkitTextStroke: '2px rgba(248, 250, 252, 0.05)',
                    paddingRight: '5vw', lineHeight: 1, letterSpacing: '-0.02em', margin: 0
                }}>
                    SCALERA DIGITAL AGENCY • SCALERA DIGITAL AGENCY • SCALERA DIGITAL AGENCY • SCALERA DIGITAL AGENCY •
                </h2>
            </div>
        </section>
    );
};

export default Marquee;
