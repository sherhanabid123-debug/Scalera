import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Monitor, Code2, SearchCheck, Gauge, HeadphonesIcon, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Monitor,
    num: "01",
    title: "Custom Website Design",
    desc: "Premium, clean layouts tailored to your brand identity. Every pixel is intentional, every interaction refined.",
    tag: "Design",
  },
  {
    icon: Code2,
    num: "02",
    title: "Website Development",
    desc: "Fast, responsive, mobile-first builds with modern structure. Performance is never an afterthought.",
    tag: "Engineering",
  },
  {
    icon: SearchCheck,
    num: "03",
    title: "Basic SEO Setup",
    desc: "On-page optimization and structured setup for better visibility across all search engines.",
    tag: "Growth",
  },
  {
    icon: Gauge,
    num: "04",
    title: "Performance Optimization",
    desc: "Speed, responsiveness, and clean technical foundation. 95+ Lighthouse scores as standard.",
    tag: "Speed",
  },
  {
    icon: HeadphonesIcon,
    num: "05",
    title: "Ongoing Support",
    desc: "Minor updates and assistance after launch. We stay in your corner long after go-live.",
    tag: "Support",
  },
  {
    icon: Sparkles,
    num: "06",
    title: "Scalera AI Builder",
    desc: "Describe your vision in plain language. Our AI generates a fully functional, personalized website in under 60 seconds.",
    tag: "AI",
    highlight: true,
  },
];

const Services = () => {
  const containerRef = useRef();
  const [isMobile, setIsMobile] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".services-label",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1,
          scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
        },
      );
      gsap.fromTo(
        ".services-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1.4, ease: "expo.out",
          scrollTrigger: { trigger: ".services-title", start: "top 80%" },
        },
      );
      gsap.fromTo(
        ".service-card",
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 1.2, stagger: 0.1, ease: "expo.out",
          scrollTrigger: { trigger: ".service-card", start: "top 85%" },
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={containerRef}
      className="section"
      style={{ padding: "10rem 5%", position: "relative", overflow: "hidden" }}
    >
      {/* Background glows */}
      <div
        className="glow-orb"
        style={{
          top: "30%", left: "30%",
          width: 800, height: 800,
          background: "radial-gradient(circle, rgba(220,180,128,0.04) 0%, transparent 65%)",
        }}
      />

      <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
            gap: "2rem",
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "4rem",
            marginBottom: "4rem",
          }}
        >
          <div className="services-label section-label">
            <div className="section-label-dot" />
            What We Do
          </div>
          <h2
            className="services-title"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: 0,
              textAlign: isMobile ? "left" : "right",
            }}
          >
            Capabilities
            <br />
            <span style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>
              Built to Scale
            </span>
          </h2>
        </div>

        {/* Service cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "1rem",
          }}
        >
          {services.map((service, i) => {
            const Icon = service.icon;
            const isActive = activeCard === i;
            return (
              <div
                key={i}
                className="service-card glass-card glass-prism-border"
                onMouseEnter={() => setActiveCard(i)}
                onMouseLeave={() => setActiveCard(null)}
                style={{
                  padding: "2.5rem",
                  borderRadius: 20,
                  cursor: "pointer",
                  background: service.highlight
                    ? "linear-gradient(145deg, rgba(220,180,128,0.06), rgba(255,255,255,0.03))"
                    : undefined,
                  borderColor: service.highlight ? "rgba(220,180,128,0.2)" : undefined,
                  minHeight: 240,
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  {/* Top row: icon + number */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: 44, height: 44,
                        borderRadius: 12,
                        background: service.highlight
                          ? "rgba(220,180,128,0.15)"
                          : "rgba(255,255,255,0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid rgba(255,255,255,0.08)",
                        transition: "all 0.4s ease",
                      }}
                    >
                      <Icon
                        size={20}
                        color={service.highlight ? "var(--accent-color)" : "rgba(255,255,255,0.5)"}
                        strokeWidth={1.5}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: service.highlight ? "var(--accent-color)" : "var(--text-secondary)",
                        fontFamily: "monospace",
                        letterSpacing: "0.05em",
                        padding: "3px 10px",
                        border: "1px solid",
                        borderColor: service.highlight ? "rgba(220,180,128,0.3)" : "var(--border-glass)",
                        borderRadius: "100px",
                        background: service.highlight ? "rgba(220,180,128,0.05)" : "transparent",
                      }}
                    >
                      {service.tag}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                      color: service.highlight ? "var(--accent-warm)" : "var(--text-primary)",
                      marginBottom: "0.75rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {service.title}
                  </h3>

                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.9rem",
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {service.desc}
                  </p>
                </div>

                {/* Number footer */}
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: service.highlight ? "var(--accent-color)" : "var(--text-secondary)",
                    opacity: 0.5,
                    fontFamily: "monospace",
                    letterSpacing: "0.1em",
                  }}
                >
                  [{service.num}]
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
