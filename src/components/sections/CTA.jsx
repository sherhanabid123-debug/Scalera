import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, MessageCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CTA = () => {
  const containerRef = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      tl.fromTo(
        ".cta-card",
        { opacity: 0, y: 80, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1.6, ease: "expo.out" },
      )
        .fromTo(
          ".cta-label",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.8",
        )
        .fromTo(
          ".cta-title",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" },
          "-=0.6",
        )
        .fromTo(
          ".cta-btn",
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.12, ease: "back.out(1.4)" },
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
        padding: "8rem 5% 10rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        zIndex: 2,
        overflow: "hidden",
      }}
    >
      {/* Background atmosphere */}
      <div
        className="glow-orb"
        style={{
          top: "50%", left: "50%",
          width: 1100, height: 1100,
          background: "radial-gradient(circle, rgba(220,180,128,0.07) 0%, rgba(140,100,255,0.03) 40%, transparent 65%)",
        }}
      />

      <div
        className="cta-card glass-card glass-animated-border"
        style={{
          width: "100%",
          maxWidth: 880,
          borderRadius: 32,
          overflow: "hidden",
          padding: "0",
          background: "linear-gradient(145deg, rgba(255,255,255,0.045) 0%, rgba(220,180,128,0.025) 100%)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Prismatic top bar */}
        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(220,180,128,0.5), rgba(180,150,255,0.4), rgba(220,180,128,0.5), transparent)",
          }}
        />

        {/* Corner accent */}
        <div
          style={{
            position: "absolute",
            top: -100, right: -100,
            width: 300, height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(220,180,128,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            padding: "5rem 4rem 5rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2.5rem",
          }}
        >
          {/* Label */}
          <div className="cta-label section-label">
            <div className="section-label-dot" />
            Start a Conversation
          </div>

          {/* Title */}
          <h2
            className="cta-title"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 300,
              letterSpacing: "-0.04em",
              margin: 0,
              lineHeight: 1.05,
              color: "var(--text-primary)",
            }}
          >
            Let's Build Something
            <br />
            <span className="shimmer-text" style={{ fontWeight: 600 }}>
              Extraordinary.
            </span>
          </h2>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "0.5rem",
            }}
          >
            <a
              href="https://wa.me/917975242650"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn btn-glass"
              style={{
                padding: "1.1rem 2.75rem",
                borderRadius: "50px",
                fontWeight: 700,
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                background: "linear-gradient(135deg, var(--accent-warm) 0%, var(--accent-color) 100%)",
                color: "#080808",
                textDecoration: "none",
                boxShadow: "0 6px 30px rgba(220,180,128,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
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
              <MessageCircle size={16} />
              Start Your Project
            </a>

            <a
              href="#work"
              className="cta-btn glass-card"
              style={{
                padding: "1.1rem 2.75rem",
                borderRadius: "50px",
                fontWeight: 500,
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                color: "var(--text-primary)",
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
              <ArrowUpRight size={16} />
            </a>
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
    </section>
  );
};

export default CTA;
