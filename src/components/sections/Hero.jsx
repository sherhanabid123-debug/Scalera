import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ExternalLink } from "lucide-react";

const Hero = ({ loading }) => {
  const containerRef = useRef();

  useLayoutEffect(() => {
    if (loading) return;
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.fromTo(
        ".hero-word",
        { yPercent: 120 },
        { yPercent: 0, duration: 1.8, stagger: 0.05, delay: 0.1 },
      )
        .fromTo(
          ".hero-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.5, transformOrigin: "left" },
          "-=1.4",
        )
        .fromTo(
          ".hero-sub",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.5 },
          "-=1.4",
        )
        .fromTo(
          ".hero-btn",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, stagger: 0.1 },
          "-=1.2",
        )
        .fromTo(
          ".scroll-indicator",
          { opacity: 0 },
          { opacity: 1, duration: 1.5 },
          "-=1",
        );

      gsap.to(".hero-content", {
        yPercent: 25,
        opacity: 0,
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
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div className="glow-orb" style={{ top: "30%", left: "40%" }} />

      <div
        className="hero-content"
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "1400px",
          margin: "0 auto",
          marginTop: "6rem",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 7rem)",
            fontWeight: 300,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            marginBottom: "2.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textTransform: "uppercase",
          }}
        >
          <div style={{ overflow: "hidden", paddingBottom: "0.5rem" }}>
            <span
              className="hero-word"
              style={{
                display: "inline-block",
                transform: loading ? "translateY(120%)" : undefined,
              }}
            >
              Defining The Next Standard
            </span>
          </div>
          <div
            style={{
              overflow: "hidden",
              paddingBottom: "0.5rem",
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
                background: "var(--border-subtle)",
                marginTop: "2vw",
                transform: loading ? "scaleX(0)" : undefined,
                transformOrigin: "right",
              }}
            />
            <span
              className="hero-word"
              style={{
                display: "inline-block",
                fontWeight: 600,
                color: "var(--text-secondary)",
                transform: loading ? "translateY(120%)" : undefined,
              }}
            >
              In Digital Scale.
            </span>
            <div
              className="hero-line"
              style={{
                width: "clamp(40px, 8vw, 120px)",
                height: "1px",
                background: "var(--border-subtle)",
                marginTop: "2vw",
                transform: loading ? "scaleX(0)" : undefined,
                transformOrigin: "left",
              }}
            />
          </div>
        </h1>

        <p
          className="hero-sub"
          style={{
            fontSize: "1.05rem",
            color: "var(--text-secondary)",
            maxWidth: "900px",
            lineHeight: 1.6,
            marginBottom: "3.5rem",
            opacity: loading ? 0 : undefined,
          }}
        >
          Engineering bespoke, high-performance digital ecosystems for global brands demanding absolute technical excellence.
        </p>

        <div
          style={{
            display: "flex",
            gap: "2rem",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            opacity: loading ? 0 : undefined,
          }}
        >
          <button
            onClick={() => { window.location.href = "/builder.html"; }}
            className="hero-btn primary-cta"
            style={{
              padding: "1.25rem 3rem",
              background:
                "linear-gradient(135deg, #f2e3c6 0%, var(--accent-color) 100%)",
              border: "none",
              borderRadius: "50px",
              fontWeight: 600,
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#0a0a0a",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 20px rgba(220, 180, 128, 0.25)",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
              e.currentTarget.style.boxShadow =
                "0 8px 30px rgba(220, 180, 128, 0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(220, 180, 128, 0.25)";
            }}
          >
            Scalera AI <ExternalLink size={16} />
          </button>
          <a
            href="#work"
            className="hero-btn"
            style={{
              padding: "1.25rem 3rem",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "50px",
              fontWeight: 400,
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#fff",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              display: "inline-block",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#fff";
              e.target.style.color = "#0a0a0a";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#fff";
            }}
          >
            View Our Work
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="scroll-indicator"
        style={{
          position: "absolute",
          bottom: "40px",
          right: "5%",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          opacity: 0,
        }}
      >
        <span
          style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "var(--text-secondary)",
          }}
        >
          Explore
        </span>
        <div
          style={{
            width: "60px",
            height: "1px",
            background: "rgba(255,255,255,0.1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "var(--text-primary)",
              animation:
                "scrollSlide 2s cubic-bezier(0.16, 1, 0.3, 1) infinite",
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
