import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  { text: "Clean, Modern Design", sub: "Precision over decoration" },
  { text: "Mobile-First Approach", sub: "Every screen, flawlessly" },
  { text: "Structured SEO Foundation", sub: "Rank from day one" },
  { text: "Performance-Focused Builds", sub: "95+ Lighthouse scores" },
  { text: "Direct & Clear Communication", sub: "No agency jargon" },
];

const WhyScalera = () => {
  const containerRef = useRef();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 65%",
        },
      });

      tl.fromTo(
        ".why-label",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" },
      )
        .fromTo(
          ".why-title",
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.4, ease: "expo.out" },
          "-=0.4",
        )
        .fromTo(
          ".why-item",
          { opacity: 0, x: 30, scale: 0.96 },
          {
            opacity: 1, x: 0, scale: 1,
            duration: 0.9, stagger: 0.1, ease: "back.out(1.4)",
          },
          "-=0.8",
        );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="section"
      style={{
        padding: "clamp(5rem, 9vw, 8rem) 5%",
        position: "relative",
        zIndex: 2,
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        className="glow-orb"
        style={{
          top: "40%", left: "10%",
          width: 700, height: 700,
          background: "radial-gradient(circle, rgba(220,180,128,0.05) 0%, transparent 65%)",
        }}
      />

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "4rem" : "8rem",
          alignItems: "center",
          borderTop: "1px solid var(--border-subtle)",
          paddingTop: "4rem",
        }}
      >
        {/* Left */}
        <div>
          <div className="why-label section-label" style={{ marginBottom: "2.5rem" }}>
            <div className="section-label-dot" />
            Why Choose Us
          </div>
          <h2
            className="why-title"
            style={{
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: "-0.04em",
            }}
          >
            Why Work
            <br />
            <span className="text-gradient-accent">With Us</span>
          </h2>
        </div>

        {/* Right: reason list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {reasons.map((reason, i) => (
            <div
              key={i}
              className="why-item glass-card"
              style={{
                padding: "1.4rem 1.75rem",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(220,180,128,0.05)";
                e.currentTarget.style.borderColor = "rgba(220,180,128,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--glass-bg)";
                e.currentTarget.style.borderColor = "var(--border-glass)";
              }}
            >
              {/* Check icon */}
              <div
                style={{
                  width: 32, height: 32,
                  borderRadius: "50%",
                  background: "rgba(220,180,128,0.1)",
                  border: "1px solid rgba(220,180,128,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Check size={14} color="var(--accent-color)" strokeWidth={2.5} />
              </div>

              {/* Text */}
              <div>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: "var(--text-primary)",
                    lineHeight: 1.2,
                  }}
                >
                  {reason.text}
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.2rem",
                    letterSpacing: "0.03em",
                  }}
                >
                  {reason.sub}
                </div>
              </div>

              {/* Index */}
              <div
                style={{
                  marginLeft: "auto",
                  fontSize: "0.7rem",
                  fontFamily: "monospace",
                  color: "var(--text-secondary)",
                  opacity: 0.5,
                }}
              >
                0{i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyScalera;
