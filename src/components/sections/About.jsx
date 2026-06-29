import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const values = [
  { label: "Design-First", desc: "Every pixel serves a purpose." },
  { label: "Mobile-Native", desc: "Built for every screen from day one." },
  { label: "Performance", desc: "Sub-2s loads, 95+ Lighthouse scores." },
];

const About = () => {
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
      gsap.fromTo(
        ".about-label",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1,
          scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
        },
      );
      gsap.fromTo(
        ".about-headline span",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0, opacity: 1, duration: 1.6, stagger: 0.1, ease: "expo.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 75%" },
        },
      );
      gsap.fromTo(
        ".about-desc",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1.4, ease: "expo.out",
          scrollTrigger: { trigger: ".about-desc", start: "top 82%" },
        },
      );
      gsap.fromTo(
        ".about-value-card",
        { opacity: 0, y: 40, scale: 0.94 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.12, ease: "back.out(1.4)",
          scrollTrigger: { trigger: ".about-value-card", start: "top 85%" },
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="section"
      style={{ padding: "10rem 5%", position: "relative", overflow: "hidden" }}
    >
      {/* Background glow */}
      <div
        className="glow-orb"
        style={{
          top: "50%", left: "80%",
          width: 700, height: 700,
          background: "radial-gradient(circle, rgba(140,100,255,0.04) 0%, transparent 65%)",
        }}
      />

      <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Section label */}
        <div className="about-label section-label" style={{ marginBottom: "4rem" }}>
          <div className="section-label-dot" />
          Brand Positioning
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "3rem" : "6rem",
            alignItems: "start",
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "4rem",
          }}
        >
          {/* Left: headline */}
          <div className="about-headline">
            <h2
              style={{
                fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
                fontWeight: 300,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              <div style={{ overflow: "hidden", paddingBottom: "0.1em" }}>
                <span style={{ display: "block", fontStyle: "italic", color: "var(--text-secondary)" }}>
                  Built for Brands
                </span>
              </div>
              <div style={{ overflow: "hidden", paddingBottom: "0.1em" }}>
                <span style={{ display: "block" }}>That Value Quality.</span>
              </div>
            </h2>

            {/* Decorative accent line */}
            <div
              style={{
                marginTop: "2rem",
                width: 60,
                height: 2,
                background: "linear-gradient(90deg, var(--accent-color), transparent)",
                borderRadius: 2,
              }}
            />
          </div>

          {/* Right: body + value cards */}
          <div>
            <p
              className="about-desc"
              style={{
                fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
                marginBottom: "3rem",
                maxWidth: 520,
              }}
            >
              Your website isn't just a page online — it's your brand's first impression.
              We create structured, mobile-first websites designed for clarity, trust,
              and measurable performance.
            </p>

            {/* Value cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {values.map((v, i) => (
                <div
                  key={i}
                  className="about-value-card glass-card"
                  style={{ padding: "1.25rem 1.5rem", borderRadius: 14 }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        color: "var(--text-primary)",
                      }}
                    >
                      {v.label}
                    </span>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {v.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
