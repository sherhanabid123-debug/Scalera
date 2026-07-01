import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Monitor, Code2, SearchCheck, Gauge, HeadphonesIcon, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Monitor,
    num: "01",
    title: "Custom Web Design",
    desc: "We craft gorgeous, custom layouts that make your brand look like a million bucks. No templates, just pure visual authority.",
    tag: "Gorgeous UI",
  },
  {
    icon: Code2,
    num: "02",
    title: "Clean React Code",
    desc: "We turn designs into pixel-perfect React code. Lightweight, fully responsive, and structured so it never breaks.",
    tag: "Modern Code",
  },
  {
    icon: SearchCheck,
    num: "03",
    title: "SEO Built-in",
    desc: "We optimize your page structure, speed, and metadata so Google indexes and ranks you from day one. Say goodbye to invisible sites.",
    tag: "Google Ready",
  },
  {
    icon: Gauge,
    num: "04",
    title: "Speed Auditing",
    desc: "Slow websites kill sales. We tune your assets, compress code, and leverage fast hosting to hit 95+ performance scores.",
    tag: "Supercharged",
  },
  {
    icon: HeadphonesIcon,
    num: "05",
    title: "Always-On Support",
    desc: "We don't just build it and ghost you. We're here for monthly updates, additions, and optimizations to keep your site fresh.",
    tag: "We Got You",
  },
  {
    icon: Sparkles,
    num: "06",
    title: "Motion & Interactions",
    desc: "Delightful animations, cursor effects, and smooth transitions that keep users hooked, reading, and ready to buy.",
    tag: "Premium Feel",
  },
];

const ServiceCard = ({ service, index, activeCard, setActiveCard, isMobile }) => {
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});
  const Icon = service.icon;
  const isHovered = activeCard === index;

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const width = rect.width;
    const height = rect.height;
    
    const maxRot = 5; // Maximum tilt rotation degrees
    
    const rotateY = ((x - width / 2) / (width / 2)) * maxRot;
    const rotateX = -((y - height / 2) / (height / 2)) * maxRot;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale(1.025)`,
      transition: "transform 0.4s cubic-bezier(0.215, 0.61, 0.355, 1), box-shadow 0.5s cubic-bezier(0.215, 0.61, 0.355, 1), border-color 0.5s ease",
    });
  };

  const handleMouseEnter = () => {
    setActiveCard(index);
  };

  const handleMouseLeave = () => {
    setActiveCard(null);
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)",
      transition: "transform 0.9s cubic-bezier(0.15, 1, 0.3, 1), box-shadow 0.9s cubic-bezier(0.15, 1, 0.3, 1), border-color 0.9s ease",
    });
  };

  return (
    <div
      ref={cardRef}
      className="service-card glass-card glass-prism-border"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        padding: "2.5rem",
        borderRadius: 20,
        cursor: "pointer",
        background: service.highlight
          ? "linear-gradient(145deg, rgba(223,168,87,0.06), rgba(255,255,255,0.03))"
          : undefined,
        borderColor: service.highlight ? "rgba(223,168,87,0.25)" : undefined,
        minHeight: 260,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        ...tiltStyle,
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
            className="service-icon-container"
            style={{
              width: 48, height: 48,
              borderRadius: 14,
              background: service.highlight
                ? "linear-gradient(145deg, rgba(223,168,87,0.35), rgba(223,168,87,0.12))"
                : "linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid",
              borderColor: service.highlight ? "rgba(223,168,87,0.4)" : "rgba(255,255,255,0.12)",
              boxShadow: service.highlight
                ? "0 4px 16px rgba(223,168,87,0.25), inset 0 1px 0 rgba(255,255,255,0.3)"
                : "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
              transition: "all 0.4s ease",
            }}
          >
            <Icon
              size={21}
              color={isHovered ? "var(--accent-color)" : service.highlight ? "var(--accent-warm)" : "rgba(255,255,255,0.92)"}
              strokeWidth={1.6}
              style={{ transition: "color 0.3s ease" }}
            />
          </div>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: isHovered ? "var(--accent-color)" : service.highlight ? "var(--accent-color)" : "var(--text-secondary)",
              fontFamily: "monospace",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "color 0.3s ease",
            }}
          >
            {service.tag}
          </span>
        </div>

        <h3
          style={{
            fontSize: "1.15rem",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: isHovered ? "var(--accent-color)" : service.highlight ? "var(--accent-warm)" : "var(--text-primary)",
            marginBottom: "0.75rem",
            lineHeight: 1.3,
            transition: "color 0.3s ease",
          }}
        >
          {service.title}
        </h3>

        <p
          style={{
            color: isHovered ? "rgba(255, 255, 255, 0.95)" : "var(--text-secondary)",
            fontSize: "0.88rem",
            lineHeight: 1.6,
            margin: 0,
            transition: "color 0.3s ease",
          }}
        >
          {service.desc}
        </p>
      </div>

      {/* Number footer */}
      <div
        style={{
          fontSize: "0.7rem",
          color: isHovered ? "var(--accent-color)" : service.highlight ? "var(--accent-color)" : "var(--text-secondary)",
          opacity: isHovered ? 0.8 : 0.5,
          fontFamily: "monospace",
          letterSpacing: "0.1em",
          transition: "all 0.3s ease",
        }}
      >
        [{service.num}]
      </div>
    </div>
  );
};

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
      style={{ padding: "clamp(4.5rem, 7vw, 6rem) var(--pad-x)", position: "relative", overflow: "hidden", borderTop: "1px solid var(--border-subtle)" }}
    >
      {/* Background glows */}
      <div
        className="glow-orb"
        style={{
          top: "30%", left: "30%",
          width: 800, height: 800,
          background: "radial-gradient(circle, rgba(223,168,87,0.04) 0%, transparent 65%)",
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
            <div className="services-label section-label" style={{ marginBottom: "1.5rem" }}>
              <div className="section-label-dot" />
              What We Do
            </div>
            <h2
              className="services-title"
              style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                fontWeight: 300,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Capabilities <br />
              <span className="shimmer-text" style={{ fontWeight: 700 }}>
                Built to Scale.
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
            We help your brand command authority online and drive high converting performance with custom design, full stack engineering and dynamic interaction systems
          </p>
        </div>

        {/* Service cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "1.5rem",
          }}
        >
          {services.map((service, i) => (
            <ServiceCard
              key={i}
              service={service}
              index={i}
              activeCard={activeCard}
              setActiveCard={setActiveCard}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
