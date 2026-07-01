import React, { useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, ArrowRight, Zap, Timer, Globe } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: Timer, label: "Under 60 seconds", sub: "From prompt to live website" },
  { icon: Globe, label: "21 Niche Templates", sub: "Every industry covered" },
  { icon: Zap, label: "AI-Personalized", sub: "Tailored to your exact brief" },
];

const ScaleraAIShowcase = () => {
  const containerRef = useRef();
  const orbRef = useRef();

  useEffect(() => {
    if (!orbRef.current) return;
    gsap.to(orbRef.current, {
      scale: 1.15,
      opacity: 0.7,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      });

      tl.fromTo(
        ".ai-card-outer",
        { opacity: 0, y: 60, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "expo.out" },
      )
        .fromTo(
          ".ai-tag",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.8",
        )
        .fromTo(
          ".ai-title",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: "expo.out" },
          "-=0.6",
        )
        .fromTo(
          ".ai-desc",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          "-=0.7",
        )
        .fromTo(
          ".ai-feature",
          { opacity: 0, y: 20, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.4)" },
          "-=0.7",
        )
        .fromTo(
          ".ai-btn-wrapper",
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.5)" },
          "-=0.5",
        );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="scalera-ai"
      ref={containerRef}
      className="section"
      style={{ padding: "8rem 5%", position: "relative", overflow: "hidden" }}
    >
      {/* Animated background orb */}
      <div
        ref={orbRef}
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800, height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(220,180,128,0.08) 0%, rgba(140,100,255,0.04) 40%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.5,
        }}
      />

      {/* Ring decorations */}
      <div
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900, height: 900,
          borderRadius: "50%",
          border: "1px solid rgba(220,180,128,0.06)",
          pointerEvents: "none",
          zIndex: 0,
          animation: "orbDrift 20s ease-in-out infinite alternate",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto" }}>
        <div
          className="ai-card-outer glass-card glass-animated-border"
          style={{
            borderRadius: 28,
            padding: "0",
            overflow: "hidden",
            background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(220,180,128,0.03) 100%)",
          }}
        >
          {/* Top gradient bar */}
          <div
            style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(220,180,128,0.4), rgba(180,150,255,0.3), rgba(220,180,128,0.4), transparent)",
            }}
          />

          <div
            style={{
              padding: "5rem 3rem 4rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            {/* Tag */}
            <div
              className="ai-tag section-label"
              style={{ gap: "0.6rem" }}
            >
              <Zap size={12} color="var(--accent-color)" />
              Next-Gen AI Technology
            </div>

            {/* Title */}
            <h2
              className="ai-title"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 5rem)",
                fontWeight: 400,
                margin: 0,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
              }}
            >
              Meet{" "}
              <span className="text-gradient-accent" style={{ fontWeight: 700 }}>
                Scalera AI
              </span>
              <span style={{ fontSize: "0.6em" }}> ✨</span>
            </h2>

            {/* Description */}
            <p
              className="ai-desc"
              style={{
                color: "var(--text-secondary)",
                fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
                maxWidth: 580,
                margin: 0,
                lineHeight: 1.7,
              }}
            >
              Describe your dream website in a single prompt. Our advanced AI
              builds, designs, and personalizes a fully functional website tailored
              to your business in under 60 seconds.
            </p>

            {/* Feature pills */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                justifyContent: "center",
                margin: "0.5rem 0",
              }}
            >
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="ai-feature stat-card"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.85rem 1.25rem",
                      borderRadius: 12,
                      textAlign: "left",
                    }}
                  >
                    <Icon size={16} color="var(--accent-color)" strokeWidth={1.5} />
                    <div>
                      <div
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          lineHeight: 1.2,
                        }}
                      >
                        {f.label}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-secondary)",
                          marginTop: "0.1rem",
                        }}
                      >
                        {f.sub}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="ai-btn-wrapper">
              <button
                onClick={() => { window.location.href = "/builder.html"; }}
                className="btn-glass"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  background: "linear-gradient(135deg, var(--accent-warm) 0%, var(--accent-color) 100%)",
                  color: "#080808",
                  padding: "1.1rem 2.5rem",
                  borderRadius: "100px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  transition: "transform 0.4s ease, box-shadow 0.4s ease",
                  boxShadow: "0 6px 30px rgba(220,180,128,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
                  cursor: "pointer",
                  border: "none",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px) scale(1.04)";
                  e.currentTarget.style.boxShadow = "0 14px 45px rgba(220,180,128,0.55), inset 0 1px 0 rgba(255,255,255,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 6px 30px rgba(220,180,128,0.35), inset 0 1px 0 rgba(255,255,255,0.4)";
                }}
              >
                <Sparkles size={16} />
                Try the Builder Free
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Bottom gradient bar */}
          <div
            style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(140,100,255,0.3), rgba(220,180,128,0.4), transparent)",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default ScaleraAIShowcase;
