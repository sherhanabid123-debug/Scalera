import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Lock, ExternalLink, Activity } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: "Thar",
    category: "Restaurant Experience",
    summary: "An immersive digital experience bringing authentic culinary heritage and traditional Indian hospitality online.",
    link: "https://tharthetasteofrajasthan.com",
    img: "/assets/thar-preview.jpg",
    tag: "Hospitality",
    accent: "#dfa857", // Warm Gold
    accentGlow: "radial-gradient(circle, rgba(223, 168, 87, 0.06) 0%, transparent 70%)",
    accentBorder: "rgba(223, 168, 87, 0.3)",
    accentBg: "rgba(223, 168, 87, 0.05)",
  },
  {
    id: 2,
    title: "Kryptic",
    category: "E-Commerce Platform",
    summary: "A high-performance luxury storefront designed for maximum conversion rates, modular layout setups, and speed.",
    link: "https://kryptic.shop",
    img: "/assets/kryptic-preview.jpg",
    tag: "E-Commerce",
    accent: "#8c64ff", // Kryptic Purple
    accentGlow: "radial-gradient(circle, rgba(140, 100, 255, 0.07) 0%, transparent 70%)",
    accentBorder: "rgba(140, 100, 255, 0.3)",
    accentBg: "rgba(140, 100, 255, 0.05)",
  },
  {
    id: 3,
    title: "The Second House",
    category: "Heritage Dining & Art",
    summary: "A unique culinary journey blending Goan heritage and modern art in a 108-year-old Indo-Portuguese bungalow.",
    link: "https://the-second-house.vercel.app",
    img: "/assets/second-house-real-v2.jpg",
    tag: "Dining",
    accent: "#2eb872", // Emerald Green
    accentGlow: "radial-gradient(circle, rgba(46, 184, 114, 0.07) 0%, transparent 70%)",
    accentBorder: "rgba(46, 184, 114, 0.3)",
    accentBg: "rgba(46, 184, 114, 0.05)",
  },
  {
    id: 4,
    title: "Fridah by Bohemians",
    category: "Immersive Restaurant",
    summary: "An immersive digital journey through bohemian luxury, custom animations, and artisanal multicuisine.",
    link: "https://fridah-by-bohemians.vercel.app/#",
    img: "/assets/fridah-preview-v2.jpg",
    tag: "Luxury",
    accent: "#eb5757", // Crimson Red
    accentGlow: "radial-gradient(circle, rgba(235, 87, 87, 0.06) 0%, transparent 70%)",
    accentBorder: "rgba(235, 87, 87, 0.3)",
    accentBg: "rgba(235, 87, 87, 0.05)",
  },
];

const Portfolio = () => {
  const containerRef = useRef();
  const previewRef = useRef(null);
  const progressFillRef = useRef(null);
  const progressHandleRef = useRef(null);

  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const rafId = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHoveringViewport, setIsHoveringViewport] = useState(false);

  // For mobile auto-scroll play state
  const [mobileScrollState, setMobileScrollState] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".portfolio-label",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1,
          scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
        },
      );
      gsap.fromTo(
        ".portfolio-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1.4, ease: "expo.out",
          scrollTrigger: { trigger: ".portfolio-title", start: "top 82%" },
        },
      );
      if (!isMobile) {
        gsap.fromTo(
          ".portfolio-left-col",
          { opacity: 0, x: -45 },
          {
            opacity: 1, x: 0, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: ".portfolio-left-col", start: "top 78%" },
          },
        );
        gsap.fromTo(
          ".portfolio-right-col",
          { opacity: 0, x: 45 },
          {
            opacity: 1, x: 0, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: ".portfolio-right-col", start: "top 78%" },
          },
        );
      } else {
        gsap.fromTo(
          ".portfolio-mobile-card",
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: ".portfolio-mobile-card", start: "top 82%" },
          },
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, [isMobile]);

  // RequestAnimationFrame Spring Lerp Loop for ultra-smooth momentum scrolling
  useEffect(() => {
    const updateScroll = () => {
      const diff = targetScroll.current - currentScroll.current;
      // Soft, dampened scroll speed to remove intensity; slow organic return on exit
      const lerpSpeed = isHoveringViewport ? 0.042 : 0.022;
      currentScroll.current += diff * lerpSpeed;

      if (Math.abs(diff) < 0.005) {
        currentScroll.current = targetScroll.current;
      }

      // Direct DOM styling updates to bypass React renders and keep 120 FPS performance
      if (previewRef.current) {
        previewRef.current.style.backgroundPosition = `center ${currentScroll.current}%`;
      }
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${currentScroll.current}%`;
      }
      if (progressHandleRef.current) {
        progressHandleRef.current.style.left = `${currentScroll.current}%`;
      }

      rafId.current = requestAnimationFrame(updateScroll);
    };

    rafId.current = requestAnimationFrame(updateScroll);
    return () => cancelAnimationFrame(rafId.current);
  }, [isHoveringViewport]);

  // Desktop viewport hover mouse tracking scroll setter
  const handleViewportMouseMove = (e) => {
    setIsHoveringViewport(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percent = Math.min(Math.max(y / rect.height, 0), 1);
    targetScroll.current = percent * 100;
  };

  const handleViewportMouseLeave = () => {
    setIsHoveringViewport(false);
    targetScroll.current = 0;
  };

  // Mobile tap-to-scroll simulation
  const handleMobileCardTap = (idx) => {
    setMobileScrollState((prev) => {
      const next = [...prev];
      next[idx] = next[idx] === 100 ? 0 : 100;
      return next;
    });
  };

  const activeProject = projects[activeIdx];

  return (
    <section
      id="work"
      ref={containerRef}
      style={{
        padding: "clamp(4.5rem, 7vw, 6rem) var(--pad-x)",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid var(--border-subtle)",
        transition: "all 0.8s ease",
      }}
    >
      <style>{`
        @keyframes blinkingDotPulse {
          0% { opacity: 0.45; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.45; transform: scale(0.9); }
        }
        .live-pulse-dot {
          animation: blinkingDotPulse 1.8s infinite ease-in-out;
        }
      `}</style>

      {/* Dynamic shifting background glow orb */}
      <div
        className="glow-orb"
        style={{
          top: "40%", left: "80%",
          width: 800, height: 800,
          background: activeProject.accentGlow,
          transition: "background 1.2s ease",
          pointerEvents: "none",
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
            <div className="portfolio-label section-label" style={{ marginBottom: "1.5rem" }}>
              <div className="section-label-dot" />
              Selected Work
            </div>
            <h2
              className="portfolio-title"
              style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                fontWeight: 300,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Projects That <br />
              <span className="shimmer-text" style={{ fontWeight: 700 }}>
                Define Brands.
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
            A curated collection of visual experiences engineered for structural clarity, high-converting copy flows, and premium motion systems.
          </p>
        </div>

        {/* Dynamic Project Workspace Container */}
        {isMobile ? (
          /* Mobile layout: Tap-to-Scroll Web mockups */
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {projects.map((project, idx) => {
              const isScrolled = mobileScrollState[idx] === 100;
              return (
                <div
                  key={project.id}
                  className="portfolio-mobile-card"
                  onClick={() => handleMobileCardTap(idx)}
                  style={{
                    background: "rgba(255,255,255,0.01)",
                    border: "1px solid var(--border-glass)",
                    borderRadius: 20,
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                    cursor: "pointer",
                  }}
                >
                  {/* Browser Mockup */}
                  <div
                    style={{
                      background: "rgba(10, 10, 12, 0.4)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff5f56" }} />
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffbd2e" }} />
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#27c93f" }} />
                      </div>
                      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(0,0,0,0.3)", padding: "2px 12px", borderRadius: 4, fontSize: "0.55rem", color: "rgba(255,255,255,0.45)", fontFamily: "monospace" }}>
                          <Lock size={6} />
                          {(project.link || "").replace("https://", "")}
                        </div>
                      </div>
                    </div>

                    {/* Viewport */}
                    <div style={{ position: "relative", height: 200, width: "100%", overflow: "hidden" }}>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage: `url(${project.img})`,
                          backgroundSize: "100% auto",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: `center ${mobileScrollState[idx]}%`,
                          transition: "background-position 2.5s ease-in-out",
                        }}
                      />
                      {/* Interaction hint overlay */}
                      <div style={{ position: "absolute", bottom: 8, right: 8, padding: "3px 8px", background: "rgba(0,0,0,0.65)", borderRadius: 4, fontSize: "0.55rem", color: project.accent, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        {isScrolled ? "Tap to Reset" : "Tap to Scroll"}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                        {project.category}
                      </div>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 0.5rem 0" }}>
                        {project.title}
                      </h3>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0, maxWidth: "85%" }}>
                        {project.summary}
                      </p>
                    </div>
                    
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: 38, height: 38,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textDecoration: "none",
                      }}
                    >
                      <ArrowUpRight size={15} color="var(--text-primary)" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Desktop layout: Interactive Browser Console workspace */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.35fr",
              gap: "4.5rem",
              alignItems: "start",
            }}
          >
            {/* Left Col: Typographic Selector */}
            <div className="portfolio-left-col" style={{ display: "flex", flexDirection: "column" }}>
              {projects.map((project, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <div
                    key={project.id}
                    onMouseEnter={() => {
                      setActiveIdx(idx);
                      // Reset LERP refs back to 0 immediately on project shift
                      targetScroll.current = 0;
                      currentScroll.current = 0;
                    }}
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      padding: "1.85rem 0",
                      cursor: "pointer",
                      transition: "all 0.4s ease",
                      opacity: isActive ? 1 : 0.25,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "1.75rem" }}>
                      <span style={{
                        fontSize: "0.85rem",
                        fontFamily: "monospace",
                        color: isActive ? project.accent : "var(--text-secondary)",
                        marginTop: "0.35rem",
                        transition: "color 0.4s ease",
                      }}>
                        0{idx + 1}.
                      </span>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <h3 style={{
                            fontSize: "1.85rem",
                            fontWeight: 400,
                            letterSpacing: "-0.01em",
                            color: isActive ? project.accent : "var(--text-primary)",
                            margin: 0,
                            transition: "color 0.4s ease",
                          }}>
                            {project.title}
                          </h3>
                          <span style={{
                            fontSize: "0.7rem",
                            fontFamily: "monospace",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: isActive ? project.accent : "var(--text-secondary)",
                            padding: "2px 8px",
                            border: "1px solid",
                            borderColor: isActive ? project.accentBorder : "rgba(255,255,255,0.08)",
                            borderRadius: 4,
                            background: isActive ? project.accentBg : "transparent",
                            transition: "all 0.4s ease",
                          }}>
                            {project.tag}
                          </span>
                        </div>

                        {isActive && (
                          <div style={{ animation: "fadeSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards", marginTop: "0.85rem" }}>
                            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", marginBottom: "0.25rem" }}>
                              {project.category}
                            </div>
                            <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, maxWidth: "90%" }}>
                              {project.summary}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
            </div>

            {/* Right Col: Browser Preview Console */}
            <div className="portfolio-right-col">
              {/* Safari Browser Shell */}
              <div
                style={{
                  background: "rgba(10, 10, 12, 0.45)",
                  border: "1px solid",
                  borderColor: activeProject.accentBorder,
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.05)",
                  transition: "border-color 0.8s ease",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "130px 1fr 130px",
                    alignItems: "center",
                    padding: "12px 18px",
                    background: "rgba(255,255,255,0.02)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {/* Traffic lights */}
                  <div style={{ display: "flex", gap: "6px" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f56" }} />
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#27c93f" }} />
                  </div>

                  {/* URL Input Box */}
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "rgba(0,0,0,0.45)",
                        border: "1px solid rgba(255,255,255,0.04)",
                        padding: "5px 18px",
                        borderRadius: 6,
                        width: "90%",
                        maxWidth: 380,
                        fontSize: "0.68rem",
                        color: "rgba(255,255,255,0.45)",
                        fontFamily: "monospace",
                      }}
                    >
                      <Lock size={9} color={activeProject.accent} style={{ transition: "color 0.8s ease" }} />
                      <span style={{ color: "rgba(255,255,255,0.2)" }}>https://</span>
                      <span style={{ color: "var(--text-primary)" }}>{(activeProject.link || "").replace("https://", "")}</span>
                    </div>
                  </div>
                  
                  {/* Action link + status dot */}
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <span
                        className="live-pulse-dot"
                        style={{
                          width: 5, height: 5,
                          borderRadius: "50%",
                          background: activeProject.accent,
                          boxShadow: `0 0 8px ${activeProject.accent}`,
                          transition: "all 0.8s ease",
                        }}
                      />
                      <span style={{ fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)" }}>
                        Active
                      </span>
                    </div>
                    <a
                      href={activeProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "0.65rem",
                        color: activeProject.accent,
                        textDecoration: "none",
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                        opacity: 0.8,
                        transition: "all 0.4s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = 0.8}
                    >
                      Visit <ExternalLink size={10} />
                    </a>
                  </div>
                </div>

                {/* Website Viewport Area */}
                <div
                  onMouseMove={handleViewportMouseMove}
                  onMouseLeave={handleViewportMouseLeave}
                  style={{
                    position: "relative",
                    height: 430,
                    width: "100%",
                    overflow: "hidden",
                    cursor: "ns-resize",
                    background: "#080808",
                  }}
                >
                  <div
                    ref={previewRef}
                    key={activeProject.id} // Re-creates DOM node on swap to cleanly trigger scale-in CSS keyframes
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `url(${activeProject.img})`,
                      backgroundSize: "120% auto",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center 0%",
                      animation: "projectScaleFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                    }}
                  />
                  
                  {/* Interactive Vignette Shadows */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 8%, transparent 92%, rgba(0,0,0,0.3) 100%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>

                {/* Horizontal Scroll Progress Controller */}
                <div
                  style={{
                    padding: "1.25rem 2rem",
                    background: "rgba(255,255,255,0.015)",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "2.5rem",
                  }}
                >
                  {/* Progressbar Track */}
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "1.25rem" }}>
                    <span style={{ fontSize: "0.62rem", fontFamily: "monospace", color: "rgba(255,255,255,0.25)" }}>00% / TOP</span>
                    <div style={{ flex: 1, height: 2, background: "rgba(255,255,255,0.06)", position: "relative", borderRadius: 1 }}>
                      <div
                        ref={progressFillRef}
                        style={{
                          position: "absolute",
                          left: 0, top: 0,
                          height: "100%",
                          width: "0%",
                          background: activeProject.accent,
                          boxShadow: `0 0 10px ${activeProject.accent}`,
                          transition: "background 0.8s ease",
                        }}
                      />
                      <div
                        ref={progressHandleRef}
                        style={{
                          position: "absolute",
                          left: "0%",
                          top: "50%",
                          width: 8, height: 8,
                          borderRadius: "50%",
                          background: "#ffffff",
                          border: "1px solid",
                          borderColor: activeProject.accent,
                          transform: "translate(-50%, -50%)",
                          boxShadow: `0 0 8px ${activeProject.accent}`,
                          transition: "border-color 0.8s ease, box-shadow 0.8s ease",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "0.62rem", fontFamily: "monospace", color: "rgba(255,255,255,0.25)" }}>100% / END</span>
                  </div>

                  {/* Scroll instructions */}
                  <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", color: isHoveringViewport ? activeProject.accent : "var(--text-secondary)", fontWeight: 600, transition: "color 0.4s ease", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: isHoveringViewport ? activeProject.accent : "rgba(255,255,255,0.2)", transition: "background 0.4s ease" }} />
                    {isHoveringViewport ? "Momentum Track Active" : "Hover cursor inside preview to scroll"}
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

export default Portfolio;
