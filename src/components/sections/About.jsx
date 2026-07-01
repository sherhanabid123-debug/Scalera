import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const values = [
  { label: "Zero Templates. Ever.", desc: "We design every single page from scratch. No pre made layouts. Your site will look unique and stand out from the noise." },
  { label: "Lightning Fast Speeds", desc: "We build lightweight websites that load in the blink of an eye. 98+ Lighthouse scores keep users happy and Google loving your page." },
  { label: "Engineered to Convert", desc: "Beautiful pages are useless if they don't sell. We structure layouts, buttons, and content flows to turn random clicks into paying buyers." },
];

const AboutValueCard = ({ v, i }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        paddingTop: "1.5rem",
        paddingBottom: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        position: "relative",
        borderTop: "1px solid",
        borderTopColor: isHovered ? "var(--accent-color)" : "rgba(255,255,255,0.08)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: "default",
      }}
    >
      <div style={{ fontSize: "0.78rem", fontWeight: 700, fontFamily: "monospace", color: "var(--accent-color)", letterSpacing: "0.1em" }}>
        0{i + 1}.
      </div>
      
      <h3
        style={{
          fontSize: "1.15rem",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: isHovered ? "var(--accent-color)" : "var(--text-primary)",
          margin: 0,
          transition: "color 0.4s ease",
        }}
      >
        {v.label}
      </h3>
      
      <p
        style={{
          fontSize: "0.86rem",
          color: isHovered ? "var(--text-primary)" : "var(--text-secondary)",
          lineHeight: 1.6,
          margin: 0,
          transition: "color 0.4s ease",
        }}
      >
        {v.desc}
      </p>
    </div>
  );
};

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
      style={{ padding: "clamp(4.5rem, 7vw, 6rem) var(--pad-x)", position: "relative", overflow: "hidden", borderTop: "1px solid var(--border-subtle)" }}
    >
      {/* Background glow */}
      <div
        className="glow-orb"
        style={{
          top: "50%", left: "80%",
          width: 700, height: 700,
          background: "radial-gradient(circle, rgba(223,168,87,0.04) 0%, transparent 65%)",
        }}
      />

      <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Unified Editorial Header */}
        <div
          style={{
            marginBottom: "4rem",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr",
            gap: "2rem",
            alignItems: "end",
          }}
        >
          <div>
            <div className="section-label" style={{ marginBottom: "1.5rem" }}>
              <div className="section-label-dot" />
              Brand Positioning
            </div>
            <h2
              style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                fontWeight: 300,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Built for Brands <br />
              <span className="shimmer-text" style={{ fontWeight: 700 }}>
                That Value Quality.
              </span>
            </h2>
          </div>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.05rem",
              lineHeight: 1.6,
              maxWidth: 480,
              margin: 0,
            }}
          >
            Your website is not just a page on the Internet, it’s the first impression of your brand. We create structured, mobile first websites that communicate clearly, build trust and are proven to perform.
          </p>
        </div>

        {/* Value cards - 3 Column Layout for Symmetry */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "1.5rem",
          }}
        >
          {values.map((v, i) => (
            <AboutValueCard
              key={i}
              v={v}
              i={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
