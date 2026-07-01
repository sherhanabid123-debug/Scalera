import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Activity, ShieldAlert, Cpu, Layers, Terminal } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  { 
    id: 1, 
    title: "Direct Collaboration", 
    sub: "Direct updates, transparent timelines, and clear pricing without account managers.",
    code: "SYS_DIRECT_SYNC",
    statName: "TIMELINE INTEGRITY",
    statVal: "100% DIRECT",
    progress: 100,
    accent: "#dfa857", // Warm Gold
    icon: Activity,
  },
  { 
    id: 2, 
    title: "Mobile Fluidity", 
    sub: "We ensure your site looks gorgeous and operates flawlessly on all modern device viewports.",
    code: "MOBILE_FLUID_READY",
    statName: "RESPONSIVENESS",
    statVal: "100% FLUID",
    progress: 100,
    accent: "#8c64ff", // Purple
    icon: Layers,
  },
  { 
    id: 3, 
    title: "Verified SEO", 
    sub: "Built-in indexing and structured metadata to help you rank on search engines.",
    code: "INDEX_RANK_VERIFIED",
    statName: "INDEXABILITY",
    statVal: "100/100 SCORE",
    progress: 100,
    accent: "#2eb872", // Emerald Green
    icon: ShieldAlert,
  },
  { 
    id: 4, 
    title: "High Performance", 
    sub: "Sub-second load times that keep visitors happy and conversion rates high.",
    code: "PERF_COMPILATION_PASS",
    statName: "LATENCY TTFB",
    statVal: "< 150MS TTFB",
    progress: 98,
    accent: "#eb5757", // Crimson Red
    icon: Cpu,
  },
  { 
    id: 5, 
    title: "Clean Architecture", 
    sub: "Lightweight React components designed to last without framework or theme bloat.",
    code: "CODE_INTEGRITY_OPTIMAL",
    statName: "DEPENDENCY OVERHEAD",
    statVal: "0% BLOAT",
    progress: 100,
    accent: "#00d2ff", // Cyan
    icon: Terminal,
  },
];

const WhyScalera = () => {
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
        ".why-label",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1,
          scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
        },
      );
      gsap.fromTo(
        ".why-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1.4, ease: "expo.out",
          scrollTrigger: { trigger: ".why-title", start: "top 82%" },
        },
      );
      if (!isMobile) {
        gsap.fromTo(
          ".why-console-hud",
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: ".why-console-hud", start: "top 78%" },
          },
        );
        gsap.fromTo(
          ".why-left-menu",
          { opacity: 0, x: 40 },
          {
            opacity: 1, x: 0, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: ".why-left-menu", start: "top 78%" },
          },
        );
      } else {
        gsap.fromTo(
          ".why-mobile-spec",
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: ".why-mobile-spec", start: "top 82%" },
          },
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, [isMobile]);

  const activeReason = reasons[activeIdx];
  const IconComponent = activeReason.icon;

  // Compact Radar Screen circular dimensions
  const centerX = 120;
  const centerY = 120;
  const radius = 76;
  const angles = [-90, -18, 54, 126, 198];

  return (
    <section
      ref={containerRef}
      style={{
        padding: "clamp(4.5rem, 7vw, 6rem) var(--pad-x)",
        position: "relative",
        zIndex: 2,
        overflow: "hidden",
        borderTop: "1px solid var(--border-subtle)",
        transition: "all 0.8s ease",
      }}
    >
      <style>{`
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseCenterGlow {
          0% { transform: scale(0.95); opacity: 0.2; }
          50% { transform: scale(1.05); opacity: 0.45; }
          100% { transform: scale(0.95); opacity: 0.2; }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.8); opacity: 0.7; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .radar-sweep-line {
          animation: radarSweep 10s linear infinite;
          transform-origin: 120px 120px;
        }
        .radar-pulse-core {
          animation: pulseCenterGlow 2.5s ease-in-out infinite;
          transform-origin: 120px 120px;
        }
        .hud-pulse-ring {
          animation: pulseRing 1.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        .spec-item-btn {
          position: relative;
          padding: 1.5rem 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          cursor: pointer;
          transition: all 0.35s ease;
        }
        .spec-item-btn:hover {
          padding-left: 0.5rem;
        }
        .terminal-glow {
          text-shadow: 0 0 10px var(--glow-color);
        }
      `}</style>

      {/* Dynamic background glow matching the active accent color */}
      <div
        className="glow-orb"
        style={{
          top: "50%", left: "70%",
          width: 700, height: 700,
          background: `radial-gradient(circle, ${activeReason.accent}0d 0%, transparent 65%)`,
          transition: "background 1s ease",
          pointerEvents: "none",
          transform: "translate(-50%, -50%)",
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
            <div className="why-label section-label" style={{ marginBottom: "1.5rem" }}>
              <div className="section-label-dot" />
              Why Choose Us
            </div>
            <h2
              className="why-title"
              style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                fontWeight: 300,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Why Work <br />
              <span className="shimmer-text" style={{ fontWeight: 700 }}>
                With Us.
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
            We discard template boilerplate and bloated builders, crafting responsive custom-coded applications designed to scale with your traffic.
          </p>
        </div>

        {/* HUD Selector layout */}
        {isMobile ? (
          /* Mobile Accordion View */
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {reasons.map((reason, idx) => {
              const isOpen = activeIdx === idx;
              return (
                <div
                  key={reason.id}
                  className="why-mobile-spec"
                  onClick={() => setActiveIdx(idx)}
                  style={{
                    background: "rgba(10, 10, 12, 0.4)",
                    border: "1px solid",
                    borderColor: isOpen ? reason.accent : "rgba(255,255,255,0.06)",
                    borderRadius: 16,
                    padding: "1.25rem 1.5rem",
                    transition: "all 0.4s ease",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: isOpen ? reason.accent : "rgba(255,255,255,0.25)" }}>
                        0{reason.id}.
                      </span>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 500, margin: 0, color: isOpen ? "var(--text-primary)" : "rgba(255,255,255,0.6)" }}>
                        {reason.title}
                      </h3>
                    </div>
                    <span
                      style={{
                        width: 8, height: 8,
                        borderRadius: "50%",
                        background: isOpen ? reason.accent : "transparent",
                        border: "1px solid",
                        borderColor: isOpen ? "transparent" : "rgba(255,255,255,0.2)",
                        transition: "all 0.4s ease",
                      }}
                    />
                  </div>

                  {isOpen && (
                    <div style={{ marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem", animation: "fadeSlideUp 0.3s ease forwards" }}>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: "0 0 1.25rem 0" }}>
                        {reason.sub}
                      </p>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", fontFamily: "monospace", color: "rgba(255,255,255,0.4)" }}>
                          <span>DIAGNOSTIC_CODE:</span>
                          <span style={{ color: reason.accent }}>{reason.code}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", fontFamily: "monospace", color: "rgba(255,255,255,0.4)" }}>
                          <span>{reason.statName}:</span>
                          <span style={{ color: reason.accent, fontWeight: 600 }}>{reason.statVal}</span>
                        </div>
                        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden", marginTop: "0.25rem" }}>
                          <div style={{ height: "100%", width: `${reason.progress}%`, background: reason.accent, borderRadius: 2 }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Desktop: Unified Cockpit Console on Left + Minimal Menu on Right */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.35fr 1fr",
              gap: "4.5rem",
              alignItems: "center",
            }}
          >
            {/* Left: Unified Glass Diagnostic Console */}
            <div className="why-console-hud">
              <div
                style={{
                  background: "rgba(10, 10, 12, 0.45)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 24,
                  padding: "2.5rem",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.03)",
                }}
              >
                {/* Console header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "1rem", marginBottom: "1.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: activeReason.accent, boxShadow: `0 0 8px ${activeReason.accent}`, transition: "background 0.5s ease" }} />
                    <span style={{ fontSize: "0.62rem", fontFamily: "monospace", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>TERMINAL_SPEC_CONSOLE</span>
                  </div>
                  <span style={{ fontSize: "0.62rem", fontFamily: "monospace", color: "rgba(255,255,255,0.25)" }}>[ MONITORING_ON ]</span>
                </div>

                {/* Splitscreen inside the console */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1fr",
                    gap: "2.5rem",
                    alignItems: "center",
                  }}
                >
                  {/* Console Specs */}
                  <div key={activeReason.id} style={{ animation: "fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.85rem" }}>
                      <div
                        style={{
                          width: 42, height: 42,
                          borderRadius: 12,
                          background: `${activeReason.accent}12`,
                          border: "1px solid",
                          borderColor: `${activeReason.accent}25`,
                          display: "flex", alignItems: "center",
                          color: activeReason.accent,
                          transition: "all 0.5s ease",
                          justifyContent: "center",
                        }}
                      >
                        <IconComponent size={18} />
                      </div>
                      <h4 style={{ fontSize: "1.25rem", fontWeight: 500, margin: 0, color: "var(--text-primary)" }}>
                        {activeReason.title}
                      </h4>
                    </div>

                    <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: "0 0 1.5rem 0", minHeight: "68px" }}>
                      {activeReason.sub}
                    </p>

                    {/* Numeric parameters list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: 12, padding: "1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                        <span style={{ fontSize: "0.62rem", fontFamily: "monospace", color: activeReason.accent }}>{activeReason.code}</span>
                      </div>

                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "0.85rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: "0.4rem" }}>
                          <span style={{ fontSize: "0.62rem", fontFamily: "monospace", color: "rgba(255,255,255,0.3)" }}>
                            {activeReason.statName}
                          </span>
                          <span
                            className="terminal-glow"
                            style={{
                              fontSize: "1rem",
                              fontFamily: "monospace",
                              fontWeight: 600,
                              color: activeReason.accent,
                              "--glow-color": activeReason.accent,
                            }}
                          >
                            {activeReason.statVal}
                          </span>
                        </div>
                        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${activeReason.progress}%`,
                              background: activeReason.accent,
                              boxShadow: `0 0 10px ${activeReason.accent}`,
                              borderRadius: 2,
                              transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1), background 0.5s ease",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compact HUD Radar screen */}
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <svg width="240" height="240" viewBox="0 0 240 240" style={{ overflow: "visible" }}>
                      <defs>
                        {/* Dot Grid Pattern */}
                        <pattern id="hudDotGrid" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                          <circle cx="2" cy="2" r="0.75" fill="rgba(255,255,255,0.06)" />
                        </pattern>
                        {/* Volumetric Glow Filter */}
                        <filter id="neonGlowHud" filterUnits="userSpaceOnUse" x="0" y="0" width="240" height="240">
                          <feGaussianBlur stdDeviation="3.5" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Dot Grid Background Panel */}
                      <circle cx={centerX} cy={centerY} r={radius + 32} fill="url(#hudDotGrid)" style={{ opacity: 0.85 }} />

                      {/* Outer boundary scale with degree ticks */}
                      <circle cx={centerX} cy={centerY} r={radius + 18} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" strokeDasharray="1, 7" />
                      
                      {/* Main Orbit Ring */}
                      <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="6,4" />

                      {/* Inner orbit boundary */}
                      <circle cx={centerX} cy={centerY} r={radius - 20} fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="2, 6" />

                      {/* Scanning sweep beam */}
                      <line
                        className="radar-sweep-line"
                        x1={centerX}
                        y1={centerY}
                        x2={centerX + (radius + 28) * Math.cos(0)}
                        y2={centerY + (radius + 28) * Math.sin(0)}
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth="1.2"
                        pointerEvents="none"
                      />

                      {/* Central core */}
                      <circle cx={centerX} cy={centerY} r="32" fill="rgba(8,8,10,0.85)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                      <circle
                        className="radar-pulse-core"
                        cx={centerX} cy={centerY} r="28"
                        fill="none"
                        stroke={activeReason.accent}
                        strokeWidth="1.5"
                        style={{ transition: "stroke 0.8s ease" }}
                      />
                      
                      {/* Compass Crosshairs */}
                      <path d={`M ${centerX - 16} ${centerY} L ${centerX - 6} ${centerY} M ${centerX + 6} ${centerY} L ${centerX + 16} ${centerY} M ${centerX} ${centerY - 16} L ${centerX} ${centerY - 6} M ${centerX} ${centerY + 6} L ${centerX} ${centerY + 16}`} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                      {/* Connection wires */}
                      {reasons.map((reason, idx) => {
                        const angleRad = (angles[idx] * Math.PI) / 180;
                        const targetX = centerX + radius * Math.cos(angleRad);
                        const targetY = centerY + radius * Math.sin(angleRad);
                        const isActive = activeIdx === idx;
                        return (
                          <line
                            key={reason.id}
                            x1={centerX}
                            y1={centerY}
                            x2={targetX}
                            y2={targetY}
                            stroke={isActive ? reason.accent : "rgba(255,255,255,0.015)"}
                            strokeWidth={isActive ? 1.5 : 1}
                            strokeDasharray={isActive ? "none" : "2,5"}
                            filter={isActive ? "url(#neonGlowHud)" : "none"}
                            style={{
                              transition: "all 0.5s ease",
                            }}
                          />
                        );
                      })}

                      {/* Circular active nodes */}
                      {reasons.map((reason, idx) => {
                        const angleRad = (angles[idx] * Math.PI) / 180;
                        const nodeX = centerX + radius * Math.cos(angleRad);
                        const nodeY = centerY + radius * Math.sin(angleRad);
                        const isActive = activeIdx === idx;
                        
                        return (
                          <g
                            key={reason.id}
                            onMouseEnter={() => setActiveIdx(idx)}
                            style={{ cursor: "pointer" }}
                          >
                            {/* Hover trigger circle */}
                            <circle cx={nodeX} cy={nodeY} r="18" fill="transparent" />

                            {/* Active Sonar Ripple Ring (Only visible on active node) */}
                            {isActive && (
                              <circle
                                className="hud-pulse-ring"
                                cx={nodeX}
                                cy={nodeY}
                                r="10"
                                fill="none"
                                stroke={reason.accent}
                                strokeWidth="1.5"
                                style={{ transformOrigin: `${nodeX}px ${nodeY}px` }}
                              />
                            )}

                            {/* Node outer border ring */}
                            <circle
                              cx={nodeX}
                              cy={nodeY}
                              r="8"
                              fill="none"
                              stroke={isActive ? reason.accent : "rgba(255,255,255,0.06)"}
                              strokeWidth="1.5"
                              filter={isActive ? "url(#neonGlowHud)" : "none"}
                              style={{
                                transition: "all 0.4s ease",
                                transform: isActive ? "scale(1.3)" : "scale(1)",
                                transformOrigin: `${nodeX}px ${nodeY}px`,
                              }}
                            />

                            {/* Center solid indicator dot */}
                            <circle
                              cx={nodeX}
                              cy={nodeY}
                              r="4"
                              fill={isActive ? reason.accent : "rgba(15,15,18,0.95)"}
                              stroke={isActive ? "transparent" : "rgba(255,255,255,0.15)"}
                              strokeWidth="1"
                              style={{
                                transition: "all 0.4s ease",
                              }}
                            />
                          </g>
                        );
                      })}

                    </svg>
                  </div>
                </div>

              </div>
            </div>

            {/* Right: Minimal Typographic Tab Selector */}
            <div className="why-left-menu" style={{ display: "flex", flexDirection: "column" }}>
              {reasons.map((reason, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <div
                    key={reason.id}
                    className="spec-item-btn"
                    onMouseEnter={() => setActiveIdx(idx)}
                    style={{
                      opacity: isActive ? 1 : 0.25,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                      <span style={{
                        fontSize: "0.85rem",
                        fontFamily: "monospace",
                        color: isActive ? reason.accent : "var(--text-secondary)",
                        transition: "color 0.35s ease",
                      }}>
                        0{reason.id}.
                      </span>
                      
                      <h3 style={{
                        fontSize: "1.5rem",
                        fontWeight: 400,
                        letterSpacing: "-0.01em",
                        color: isActive ? "var(--text-primary)" : "rgba(255,255,255,0.75)",
                        margin: 0,
                        transition: "color 0.35s ease",
                      }}>
                        {reason.title}
                      </h3>
                      
                      {isActive && (
                        <span
                          style={{
                            marginLeft: "auto",
                            width: 6, height: 6,
                            borderRadius: "50%",
                            background: reason.accent,
                            boxShadow: `0 0 8px ${reason.accent}`,
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WhyScalera;
