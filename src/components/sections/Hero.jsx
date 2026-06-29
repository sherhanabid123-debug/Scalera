import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "100%", label: "Client Retention" },
  { value: "<60s", label: "AI Build Time" },
];

const Hero = ({ loading }) => {
  const containerRef = useRef();
  const cursorGlowRef = useRef();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
        ".hero-label",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 1.0 },
      )
        .fromTo(
          ".hero-word",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.8, stagger: 0.06 },
          "-=0.6",
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
          "-=0.8",
        )
        .fromTo(
          ".scroll-indicator",
          { opacity: 0 },
          { opacity: 1, duration: 1.5 },
          "-=0.8",
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

      /* floating animation on stat cards */
      gsap.utils.toArray(".hero-stat-card").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? -10 : 10,
          duration: 3 + i * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.3,
        });
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
        justifyContent: "center",
        overflow: "hidden",
        padding: "0 5%",
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
          marginTop: "6rem",
          width: "100%",
        }}
      >
        {/* Label */}
        <div
          className="hero-label section-label glass-animated-border"
          style={{ marginBottom: "2.5rem", opacity: loading ? 0 : undefined }}
        >
          <div className="section-label-dot" />
          Premium Digital Studio · Est. 2024
        </div>

        {/* Main headline */}
        <h1
          style={{
            fontSize: "clamp(2.8rem, 6.5vw, 7.5rem)",
            fontWeight: 300,
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            marginBottom: "2.5rem",
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
              Defining The Next Standard
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
                background: "linear-gradient(90deg, transparent, rgba(220,180,128,0.4), transparent)",
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
              In Digital Scale.
            </span>
            <div
              className="hero-line"
              style={{
                width: "clamp(40px, 8vw, 120px)",
                height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(220,180,128,0.4), transparent)",
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
          Engineering bespoke, high-performance digital ecosystems for global brands
          demanding absolute technical excellence.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1.25rem",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "5rem",
            opacity: loading ? 0 : undefined,
          }}
        >
          <button
            onClick={() => { window.location.href = "/builder.html"; }}
            className="hero-btn btn-glass glass-prism-border"
            style={{
              padding: "1.1rem 2.5rem",
              background: "linear-gradient(135deg, var(--accent-warm) 0%, var(--accent-color) 100%)",
              border: "none",
              borderRadius: "50px",
              fontWeight: 700,
              fontSize: "0.82rem",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#080808",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 6px 30px rgba(220,180,128,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.04)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(220,180,128,0.55), inset 0 1px 0 rgba(255,255,255,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 6px 30px rgba(220,180,128,0.35), inset 0 1px 0 rgba(255,255,255,0.4)";
            }}
          >
            <Sparkles size={15} />
            Try Scalera AI
          </button>

          <a
            href="#work"
            className="hero-btn glass-card"
            style={{
              padding: "1.1rem 2.5rem",
              borderRadius: "50px",
              fontWeight: 500,
              fontSize: "0.82rem",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--text-primary)",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "var(--border-glass)";
            }}
          >
            View Our Work
            <ArrowUpRight size={15} />
          </a>
        </div>

        {/* Stat Cards */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
            width: "100%",
            maxWidth: 700,
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="hero-stat-card stat-card"
              style={{
                flex: "1 1 180px",
                textAlign: "center",
                opacity: loading ? 0 : undefined,
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

      {/* Scroll Indicator */}
      <div
        className="scroll-indicator"
        style={{
          position: "absolute",
          bottom: 40,
          right: "5%",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          opacity: 0,
        }}
      >
        <span
          style={{
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "var(--text-secondary)",
          }}
        >
          Explore
        </span>
        <div
          style={{
            width: 60,
            height: 1,
            background: "rgba(255,255,255,0.08)",
            position: "relative",
            overflow: "hidden",
            borderRadius: 1,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0, left: 0,
              width: "100%", height: "100%",
              background: "linear-gradient(90deg, transparent, var(--accent-color), transparent)",
              animation: "scrollSlide 2.4s cubic-bezier(0.16,1,0.3,1) infinite",
            }}
          />
        </div>
        <style>{`
          @keyframes scrollSlide {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    </section>
  );
};

export default Hero;
