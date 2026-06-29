import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, Palette, Cpu, Rocket } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "01",
    icon: Compass,
    title: "Discovery",
    desc: "We map your brand DNA — goals, audience, positioning — to build a precise strategic foundation.",
    color: "rgba(220,180,128,0.12)",
    iconColor: "var(--accent-color)",
  },
  {
    num: "02",
    icon: Palette,
    title: "Design",
    desc: "Creating a structured, modern visual concept that reflects your identity with clarity and impact.",
    color: "rgba(140,100,255,0.08)",
    iconColor: "#a878ff",
  },
  {
    num: "03",
    icon: Cpu,
    title: "Development",
    desc: "Building a fast, responsive, and technically optimized website — pixel perfect, every time.",
    color: "rgba(80,200,160,0.08)",
    iconColor: "#50c8a0",
  },
  {
    num: "04",
    icon: Rocket,
    title: "Launch",
    desc: "Deployment, testing, and final refinements. We ship when it's perfect — not before.",
    color: "rgba(220,180,128,0.10)",
    iconColor: "var(--accent-warm)",
  },
];

const Process = () => {
  const containerRef = useRef();
  const lineRef = useRef();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".process-label",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1,
          scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
        },
      );
      gsap.fromTo(
        ".process-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1.4, ease: "expo.out",
          scrollTrigger: { trigger: ".process-title", start: "top 82%" },
        },
      );
      gsap.fromTo(
        ".process-step",
        { opacity: 0, y: 60, scale: 0.93 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 1.2, stagger: 0.14, ease: "back.out(1.3)",
          scrollTrigger: { trigger: ".process-step", start: "top 85%" },
        },
      );
      /* Animated connector line */
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1, duration: 2, ease: "expo.inOut",
            scrollTrigger: { trigger: containerRef.current, start: "top 70%" },
          },
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={containerRef}
      className="section"
      style={{ padding: "10rem 5%", position: "relative", overflow: "hidden" }}
    >
      {/* Background glow */}
      <div
        className="glow-orb"
        style={{
          top: "50%", left: "50%",
          width: 900, height: 900,
          background: "radial-gradient(circle, rgba(140,100,255,0.03) 0%, rgba(220,180,128,0.02) 40%, transparent 65%)",
        }}
      />

      <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
            gap: "2rem",
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "4rem",
            marginBottom: "5rem",
          }}
        >
          <div className="process-label section-label">
            <div className="section-label-dot" />
            Our Approach
          </div>
          <h2
            className="process-title"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: 0,
              textAlign: isMobile ? "left" : "right",
            }}
          >
            Four Stages
            <br />
            <span style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>
              Zero Compromise
            </span>
          </h2>
        </div>

        {/* Connector line (desktop only) */}
        {!isMobile && (
          <div
            style={{
              position: "relative",
              height: 1,
              marginBottom: "3rem",
              overflow: "hidden",
            }}
          >
            <div
              ref={lineRef}
              style={{
                position: "absolute",
                top: 0, left: 0,
                width: "100%", height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(220,180,128,0.3), rgba(140,100,255,0.2), rgba(220,180,128,0.3), transparent)",
                transformOrigin: "left",
              }}
            />
          </div>
        )}

        {/* Steps grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="process-step glass-card glass-prism-border"
                style={{
                  padding: "2.5rem 2rem",
                  borderRadius: 20,
                  background: step.color,
                  minHeight: 280,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "1.5rem",
                }}
              >
                <div>
                  {/* Icon */}
                  <div
                    style={{
                      width: 48, height: 48,
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.5rem",
                      boxShadow: `0 0 20px ${step.color}`,
                    }}
                  >
                    <Icon size={22} color={step.iconColor} strokeWidth={1.5} />
                  </div>

                  <h3
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                      color: "var(--text-primary)",
                      marginBottom: "0.75rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.88rem",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>

                <div
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 200,
                    fontFamily: "var(--font-display)",
                    color: step.iconColor,
                    opacity: 0.4,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;
