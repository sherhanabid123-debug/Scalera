import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "50+", label: "Custom Builds" },
  { value: "98%+", label: "Lighthouse Speed" },
  { value: "100%", label: "Custom Codebase" },
];

const nicheDescriptions = {
  "Business Website": "Tailoring custom corporate architecture, integrated SEO strategies, and responsive lead-generation forms.",
  "Online Store": "Configuring secure payment checkouts, dynamic inventory grids, and conversion rate optimizations.",
  "High-End Portfolio": "Structuring bespoke layouts, smooth GSAP transitions, and interactive digital art displays.",
  "Custom Landing Page": "Designing high-impact single-page scroll layouts, interactive micro-animations, and direct user funnels.",
  "Other": "Scoping custom backend systems, advanced web application features, and unique branding assets."
};

const Hero = ({ loading }) => {
  const containerRef = useRef();
  const cursorGlowRef = useRef();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedNiche, setSelectedNiche] = useState("Business Website");

  useEffect(() => {
    const move = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (cursorGlowRef.current) {
        gsap.to(cursorGlowRef.current, {
          x: e.clientX - 200,
          y: e.clientY - 200,
          duration: 1.2,
          ease: "power2.out",
        });
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useLayoutEffect(() => {
    if (loading) return;
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.fromTo(
        ".hero-word",
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.8, stagger: 0.06 },
      )
        .fromTo(
          ".hero-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.4, transformOrigin: "left", ease: "expo.inOut" },
          "-=1.4",
        )
        .fromTo(
          ".hero-sub",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.4 },
          "-=1.2",
        )
        .fromTo(
          ".hero-btn",
          { y: 24, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.12, ease: "back.out(1.4)" },
          "-=1.0",
        )
        .fromTo(
          ".hero-stat-card",
          { opacity: 0, y: 30, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.1, ease: "back.out(1.5)" },
          "-=0.8"
        );

      gsap.to(".hero-content", {
        yPercent: 20,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, [loading]);

  return (
    <section
      ref={containerRef}
      className="section"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "clamp(8rem, 12vh, 10rem) var(--pad-x) 4rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Cursor glow */}
      <div
        ref={cursorGlowRef}
        style={{
          position: "fixed",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(220,180,128,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
          top: 0,
          left: 0,
          willChange: "transform",
        }}
      />

      {/* Background orbs */}
      <div className="glow-orb" style={{ top: "35%", left: "50%", width: 1000, height: 1000 }} />
      <div
        className="glow-orb"
        style={{
          top: "60%", left: "20%",
          width: 600, height: 600,
          background: "radial-gradient(circle, rgba(140,100,255,0.04) 0%, transparent 65%)",
          animationDelay: "-8s",
        }}
      />
      <div
        className="glow-orb"
        style={{
          top: "20%", left: "80%",
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(220,180,128,0.05) 0%, transparent 60%)",
          animationDelay: "-14s",
        }}
      />

      <div
        className="hero-content"
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: 1400,
          margin: "0 auto",
          marginTop: "0rem",
          width: "100%",
        }}
      >
        {/* Main headline */}
        <h1
          style={{
            fontSize: "clamp(2.4rem, 5vw, 5.4rem)",
            fontWeight: 300,
            lineHeight: 0.98,
            letterSpacing: "-0.04em",
            marginBottom: "2.25rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textTransform: "uppercase",
          }}
        >
          <div style={{ overflow: "hidden", paddingBottom: "0.15em" }}>
            <span
              className="hero-word"
              style={{ display: "inline-block", transform: loading ? "translateY(110%)" : undefined }}
            >
              We Design & Build
            </span>
          </div>
          <div
            style={{
              overflow: "hidden",
              paddingBottom: "0.15em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "3vw",
            }}
          >
            <div
              className="hero-line"
              style={{
                width: "clamp(40px, 8vw, 120px)",
                height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(223,168,87,0.4), transparent)",
                transform: loading ? "scaleX(0)" : undefined,
                transformOrigin: "right",
              }}
            />
            <span
              className="hero-word shimmer-text"
              style={{
                display: "inline-block",
                fontWeight: 600,
                transform: loading ? "translateY(110%)" : undefined,
              }}
            >
              High-End Websites.
            </span>
            <div
              className="hero-line"
              style={{
                width: "clamp(40px, 8vw, 120px)",
                height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(223,168,87,0.4), transparent)",
                transform: loading ? "scaleX(0)" : undefined,
                transformOrigin: "left",
              }}
            />
          </div>
        </h1>

        {/* Subheading */}
        <p
          className="hero-sub"
          style={{
            fontSize: "clamp(0.95rem, 1.6vw, 1.15rem)",
            color: "var(--text-secondary)",
            maxWidth: 700,
            lineHeight: 1.7,
            marginBottom: "3.5rem",
            opacity: loading ? 0 : undefined,
          }}
        >
          No templates. No corporate jargon. Just custom, premium websites built to convert clicks into buyers.
        </p>

        {/* CTA Configurator Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "2.5rem",
            width: "100%",
            opacity: loading ? 0 : undefined,
          }}
        >
          {/* Liquid-glass agency project brief starter */}
          <div
            className="hero-btn glass-card hero-console"
            style={{
              width: "100%",
              maxWidth: 640,
              borderRadius: 24,
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "stretch",
              cursor: "default",
              boxShadow: "var(--glass-shadow)",
            }}
          >

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem", color: "var(--accent-color)", fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>
              <Sparkles size={14} color="var(--accent-color)" />
              <span>Interactive Project Brief Planner</span>
            </div>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
              gap: "0.6rem",
              width: "100%",
              padding: "0.2rem 0"
            }}>
              {["Business Website", "Online Store", "High-End Portfolio", "Custom Landing Page", "Other"].map((niche) => {
                const active = selectedNiche === niche;
                return (
                  <button
                    key={niche}
                    onClick={() => setSelectedNiche(niche)}
                    style={{
                      padding: "0.75rem 0.4rem",
                      borderRadius: "10px",
                      background: active 
                        ? "rgba(223, 168, 87, 0.12)" 
                        : "rgba(255, 255, 255, 0.02)",
                      border: "1px solid",
                      borderColor: active 
                        ? "rgba(223, 168, 87, 0.45)" 
                        : "rgba(255, 255, 255, 0.06)",
                      color: active ? "var(--accent-color)" : "var(--text-secondary)",
                      fontSize: "0.8rem",
                      fontWeight: active ? 700 : 500,
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: active ? "0 4px 12px rgba(223,168,87,0.12)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                        e.currentTarget.style.color = "var(--text-primary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }
                    }}
                  >
                    {niche}
                  </button>
                );
              })}
            </div>

            <div style={{ height: "1px", background: "var(--border-subtle)", margin: "0.25rem 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", textAlign: "left", maxWidth: "340px", lineHeight: 1.4, display: "inline-block" }}>
                {nicheDescriptions[selectedNiche] || "Tailoring custom design specifications, performance optimizations, and backend integrations."}
              </span>
              <button
                onClick={() => {
                  const planner = document.querySelector("#estimator");
                  if (planner) {
                    planner.scrollIntoView({ behavior: "smooth" });
                    const event = new CustomEvent("setPlannerNiche", { detail: selectedNiche });
                    window.dispatchEvent(event);
                  }
                }}
                className="btn-glass"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(223, 168, 87, 0.12)",
                  border: "1px solid rgba(223, 168, 87, 0.35)",
                  color: "#ffffff",
                  padding: "0.85rem 1.6rem",
                  borderRadius: 14,
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  letterSpacing: "0.02em",
                  boxShadow: "0 4px 16px rgba(223, 168, 87, 0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
                  transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.03)";
                  e.currentTarget.style.background = "rgba(223, 168, 87, 0.22)";
                  e.currentTarget.style.borderColor = "rgba(223, 168, 87, 0.6)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(223, 168, 87, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.background = "rgba(223, 168, 87, 0.12)";
                  e.currentTarget.style.borderColor = "rgba(223, 168, 87, 0.35)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(223, 168, 87, 0.1), inset 0 1px 0 rgba(255,255,255,0.15)";
                }}
              >
                Estimate Cost <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          {/* Secondary link */}
          <a
            href="#work"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--text-secondary)",
              fontSize: "0.82rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "color 0.3s ease",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            Or view our work <ArrowUpRight size={13} />
          </a>
        </div>

        {/* Stat Cards */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.25rem",
            justifyContent: "center",
            width: "100%",
            maxWidth: 700,
            marginTop: "1.5rem",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="hero-stat-card ios-border-shine"
              style={{
                flex: "1 1 180px",
                textAlign: "center",
                opacity: loading ? 0 : undefined,
                padding: "1.5rem 1rem",
                borderRadius: 16,
                height: "110px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                "--shine-duration": i === 0 ? "4.5s" : i === 1 ? "6.0s" : "5.0s",
                "--shine-delay": i === 0 ? "0s" : i === 1 ? "-1.5s" : "-3.0s",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "var(--accent-color)",
                  fontFamily: "var(--font-display)",
                  lineHeight: 1,
                  marginBottom: "0.4rem",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--text-secondary)",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>


    </section>
  );
};

export default Hero;
