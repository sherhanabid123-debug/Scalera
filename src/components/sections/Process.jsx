import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, Cpu, Rocket, Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "01",
    icon: Compass,
    title: "The Blueprint",
    desc: "We audit your competitors, map the user journey, and plan your content structure. No guesswork, just strategic layout planning.",
    deliverables: ["Competitor Audit", "Sitemap Layout", "Content Outline"],
  },
  {
    num: "02",
    icon: Cpu,
    title: "The Build",
    desc: "We translate the blueprint into lightweight React code, adding smooth micro-animations. It's clean, responsive, and blazing fast.",
    deliverables: ["Clean React Code", "GSAP Motion", "98+ Speed Score Audit"],
  },
  {
    num: "03",
    icon: Rocket,
    title: "The Launch",
    desc: "We hook up your domain, configure analytics, setup Google indexing, and hit publish. A flawless launch with zero stress.",
    deliverables: ["DNS Setup", "Analytics Integration", "30-Day Support Check"],
  },
];

const Process = () => {
  const containerRef = useRef();
  const [isMobile, setIsMobile] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

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
      if (!isMobile) {
        gsap.fromTo(
          ".process-left-col",
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: ".process-left-col", start: "top 80%" },
          },
        );
        gsap.fromTo(
          ".process-right-col",
          { opacity: 0, x: 40 },
          {
            opacity: 1, x: 0, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: ".process-right-col", start: "top 80%" },
          },
        );
      } else {
        gsap.fromTo(
          ".process-mobile-item",
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: ".process-mobile-item", start: "top 85%" },
          },
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, [isMobile]);

  const activeStep = steps[activeIdx];
  const ActiveIcon = activeStep.icon;

  return (
    <section
      id="process"
      ref={containerRef}
      className="section"
      style={{ padding: "clamp(4.5rem, 7vw, 6rem) var(--pad-x)", position: "relative", overflow: "hidden", borderTop: "1px solid var(--border-subtle)" }}
    >
      {/* Background glow */}
      <div
        className="glow-orb"
        style={{
          top: "50%", left: "50%",
          width: 900, height: 900,
          background: "radial-gradient(circle, rgba(140,100,255,0.03) 0%, rgba(223,168,87,0.02) 40%, transparent 65%)",
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
            <div className="process-label section-label" style={{ marginBottom: "1.5rem" }}>
              <div className="section-label-dot" />
              Our Approach
            </div>
            <h2
              className="process-title"
              style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                fontWeight: 300,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Three Stages <br />
              <span className="shimmer-text" style={{ fontWeight: 700 }}>
                Zero Compromise.
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
            Our execution process guarantees strategy alignment, pixel-perfect layouts, responsive code, and domain configuration.
          </p>
        </div>

        {/* Interactive Layout */}
        {isMobile ? (
          /* Mobile layout: Collapsible Accordion Grid */
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {steps.map((s, idx) => {
              const StepIcon = s.icon;
              const isOpen = activeIdx === idx;
              return (
                <div
                  key={idx}
                  className="process-mobile-item"
                  onClick={() => setActiveIdx(idx)}
                  style={{
                    background: "rgba(255,255,255,0.015)",
                    border: isOpen ? "1px solid rgba(223, 168, 87, 0.25)" : "1px solid var(--border-glass)",
                    borderRadius: 16,
                    padding: "1.5rem",
                    cursor: "pointer",
                    transition: "all 0.4s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ fontSize: "0.85rem", fontFamily: "monospace", color: "var(--accent-color)" }}>{s.num}</span>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{s.title}</h3>
                    </div>
                    <StepIcon size={18} color={isOpen ? "var(--accent-color)" : "var(--text-secondary)"} />
                  </div>

                  {isOpen && (
                    <div style={{ marginTop: "1rem", animation: "fadeSlideUp 0.4s ease forwards" }}>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 1.25rem 0" }}>
                        {s.desc}
                      </p>
                      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "1rem" }} />
                      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent-color)", fontWeight: 700, marginBottom: "0.5rem" }}>
                        Key Deliverables:
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {s.deliverables.map((deliv, idx) => (
                          <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "var(--text-primary)" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 12, height: 12, borderRadius: "50%", background: "rgba(223,168,87,0.15)", border: "1px solid rgba(223,168,87,0.3)" }}>
                              <Check size={8} color="var(--accent-color)" strokeWidth={3} />
                            </div>
                            {deliv}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Desktop layout: Asymmetric Splitscreen Timeline */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.1fr",
              gap: "4rem",
              alignItems: "start",
            }}
          >
            {/* Left Col: Navigator */}
            <div className="process-left-col" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveIdx(idx)}
                  style={{
                    padding: "2.25rem 0",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    cursor: "pointer",
                    transition: "all 0.4s ease",
                    opacity: activeIdx === idx ? 1 : 0.35,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                    <span style={{
                      fontSize: "1.1rem",
                      fontFamily: "monospace",
                      color: activeIdx === idx ? "var(--accent-color)" : "var(--text-secondary)",
                      transition: "color 0.3s ease",
                    }}>
                      {s.num}
                    </span>
                    <h3 style={{
                      fontSize: "1.9rem",
                      fontWeight: 300,
                      textTransform: "uppercase",
                      letterSpacing: "-0.02em",
                      color: activeIdx === idx ? "var(--accent-color)" : "var(--text-primary)",
                      margin: 0,
                      transition: "color 0.3s ease",
                    }}>
                      {s.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Col: Detail Screen */}
            <div className="process-right-col">
              <div
                style={{
                  background: "rgba(223, 168, 87, 0.02)",
                  border: "1px solid rgba(223, 168, 87, 0.15)",
                  borderRadius: 24,
                  padding: "3rem",
                  minHeight: 380,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                {/* Glow ring overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: "-20%",
                    right: "-20%",
                    width: 320,
                    height: 320,
                    background: "radial-gradient(circle, rgba(223,168,87,0.05) 0%, transparent 70%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Animated inner stage container */}
                <div
                  key={activeIdx}
                  style={{
                    animation: "fadeSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    flexGrow: 1,
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 16,
                          background: "linear-gradient(145deg, rgba(223,168,87,0.18), rgba(223,168,87,0.04))",
                          border: "1px solid rgba(223,168,87,0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
                        }}
                      >
                        <ActiveIcon size={24} color="var(--accent-color)" strokeWidth={1.5} />
                      </div>
                      <div style={{ fontSize: "1.5rem", fontWeight: 200, fontFamily: "var(--font-display)", color: "rgba(223,168,87,0.2)" }}>
                        STAGE {activeStep.num}
                      </div>
                    </div>

                    <h4 style={{ fontSize: "1.5rem", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 0.85rem 0", letterSpacing: "-0.01em" }}>
                      {activeStep.title}
                    </h4>

                    <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
                      {activeStep.desc}
                    </p>
                  </div>

                  <div>
                    <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "2rem 0 1.5rem 0" }} />
                    <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent-color)", fontWeight: 700, marginBottom: "0.85rem" }}>
                      Key Deliverables:
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.85rem" }}>
                      {activeStep.deliverables.map((deliv, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-primary)" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, borderRadius: "50%", background: "rgba(223,168,87,0.15)", border: "1px solid rgba(223,168,87,0.3)" }}>
                            <Check size={9} color="var(--accent-color)" strokeWidth={3} />
                          </div>
                          {deliv}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Process;
