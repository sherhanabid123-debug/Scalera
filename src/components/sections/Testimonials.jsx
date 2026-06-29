import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const containerRef = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".test-label",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1,
          scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
        },
      );
      gsap.fromTo(
        ".test-card",
        { opacity: 0, y: 70, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1.8, ease: "expo.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 75%" },
        },
      );
      gsap.fromTo(
        ".test-author",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: "expo.out",
          scrollTrigger: { trigger: ".test-author", start: "top 90%" },
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="section"
      style={{
        padding: "10rem 5%",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      {/* Glow */}
      <div
        className="glow-orb"
        style={{
          top: "50%", left: "50%",
          width: 1000, height: 1000,
          background: "radial-gradient(circle, rgba(220,180,128,0.05) 0%, rgba(140,100,255,0.02) 45%, transparent 65%)",
        }}
      />

      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        {/* Label */}
        <div
          className="test-label section-label"
          style={{ marginBottom: "4rem", justifyContent: "center" }}
        >
          <div className="section-label-dot" />
          Client Feedback
        </div>

        {/* Quote card */}
        <div
          className="test-card glass-card glass-animated-border"
          style={{
            padding: "5rem 4rem",
            borderRadius: 28,
            background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(220,180,128,0.02) 100%)",
            textAlign: "center",
          }}
        >
          {/* Top gradient bar */}
          <div
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(220,180,128,0.35), transparent)",
              borderRadius: "28px 28px 0 0",
            }}
          />

          {/* Quote icon */}
          <div
            style={{
              width: 56, height: 56,
              borderRadius: "50%",
              background: "rgba(220,180,128,0.1)",
              border: "1px solid rgba(220,180,128,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 3rem",
              boxShadow: "0 0 30px rgba(220,180,128,0.15)",
            }}
          >
            <Quote size={24} color="var(--accent-color)" strokeWidth={1.5} />
          </div>

          {/* Quote text */}
          <blockquote
            style={{
              fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
              fontWeight: 300,
              lineHeight: 1.35,
              letterSpacing: "-0.025em",
              marginBottom: "3.5rem",
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
              fontStyle: "normal",
            }}
          >
            "They didn't just build a website, they{" "}
            <em
              style={{
                fontStyle: "italic",
                color: "var(--text-secondary)",
              }}
            >
              built a digital presence
            </em>{" "}
            that instantly elevated our brand authority."
          </blockquote>

          {/* Divider */}
          <div
            style={{
              width: 40,
              height: 1,
              background: "rgba(220,180,128,0.3)",
              margin: "0 auto 2.5rem",
              borderRadius: 1,
            }}
          />

          {/* Author */}
          <div className="test-author">
            <p
              style={{
                fontSize: "0.9rem",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontWeight: 700,
                margin: "0 0 0.3rem",
                color: "var(--text-primary)",
              }}
            >
              Ratan Singh
            </p>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.8rem",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              Founder · Thar Restaurant
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
