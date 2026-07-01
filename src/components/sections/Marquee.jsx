import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Marquee = () => {
  const containerRef = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(".marquee-inner", {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        overflow: "hidden",
        padding: "100px 0",
        background: "linear-gradient(180deg, transparent 0%, rgba(220,180,128,0.015) 50%, transparent 100%)",
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div
        className="marquee-inner"
        style={{ display: "flex", width: "200vw", userSelect: "none" }}
      >
        {[0, 1].map((k) => (
          <h2
            key={k}
            style={{
              fontSize: "clamp(5rem, 18vw, 18rem)",
              fontWeight: 900,
              whiteSpace: "nowrap",
              textTransform: "uppercase",
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(220, 180, 128, 0.07)",
              paddingRight: "5vw",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              margin: 0,
              fontFamily: "var(--font-display)",
            }}
          >
            SCALERA DIGITAL STUDIO &nbsp;•&nbsp; SCALERA DIGITAL STUDIO &nbsp;•&nbsp; SCALERA DIGITAL STUDIO &nbsp;•&nbsp;
          </h2>
        ))}
      </div>
    </section>
  );
};

export default Marquee;
