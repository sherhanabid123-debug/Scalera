import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: "Thar",
    category: "Restaurant Experience",
    summary: "An immersive digital experience bringing authentic culinary heritage online.",
    link: "https://tharthetasteofrajasthan.com",
    img: "/assets/thar-preview.jpg",
    tag: "Hospitality",
  },
  {
    id: 2,
    title: "Kryptic",
    category: "E-Commerce Platform",
    summary: "A high-performance storefront designed for maximum conversion and speed.",
    link: "https://kryptic.shop",
    img: "/assets/kryptic-preview.jpg",
    tag: "E-Commerce",
  },
  {
    id: 3,
    title: "The Second House",
    category: "Heritage Dining & Art",
    summary: "A unique culinary journey blending Goan heritage and modern art in a 108-year-old Indo-Portuguese bungalow.",
    link: "https://the-second-house.vercel.app",
    img: "/assets/second-house-real.png",
    tag: "Dining",
  },
  {
    id: 4,
    title: "Fridah by Bohemians",
    category: "Immersive Restaurant / UI Design",
    summary: "An immersive digital journey through bohemian luxury and artisanal multicuisine.",
    img: "/assets/fridah-preview.png",
    link: "https://fridah-by-bohemians.vercel.app/#",
    tag: "Luxury",
  },
];

const Portfolio = () => {
  const containerRef = useRef();
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".portfolio-header",
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1.5, ease: "expo.out",
          scrollTrigger: { trigger: ".portfolio-header", start: "top 80%" },
        },
      );

      gsap.utils.toArray(".portfolio-item").forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 80, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 1.4, ease: "expo.out",
            delay: i * 0.05,
            scrollTrigger: { trigger: item, start: "top 85%" },
          },
        );
      });

      gsap.utils.toArray(".img-parallax").forEach((img) => {
        gsap.to(img, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      ref={containerRef}
      style={{
        padding: "10rem 5%",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      {/* Background glow */}
      <div
        className="glow-orb"
        style={{
          top: "30%", left: "70%",
          width: 700, height: 700,
          background: "radial-gradient(circle, rgba(220,180,128,0.04) 0%, transparent 65%)",
        }}
      />

      <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div className="portfolio-header" style={{ marginBottom: "5rem" }}>
          <div className="section-label" style={{ marginBottom: "2.5rem" }}>
            <div className="section-label-dot" />
            Selected Work
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "2rem",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(3rem, 7vw, 6rem)",
                fontWeight: 300,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                margin: 0,
              }}
            >
              Projects That
              <br />
              <span className="shimmer-text" style={{ fontWeight: 600 }}>
                Define Brands
              </span>
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "1rem",
                maxWidth: 340,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              A selection of work focused on clarity,
              structure, and measurable impact.
            </p>
          </div>
        </div>

        {/* Projects grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          {projects.map((project, index) => (
            <a
              href={project.link || "#"}
              target={project.link ? "_blank" : "_self"}
              rel={project.link ? "noopener noreferrer" : ""}
              key={project.id}
              className="portfolio-item"
              style={{
                display: "block",
                cursor: "pointer",
                textDecoration: "none",
                position: "relative",
                borderRadius: 20,
                overflow: "hidden",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => {
                setHoveredIdx(index);
                e.currentTarget.style.borderColor = "rgba(220,180,128,0.2)";
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.45), 0 0 40px rgba(220,180,128,0.06)";
              }}
              onMouseLeave={(e) => {
                setHoveredIdx(null);
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
              }}
            >
              {/* Image area */}
              <div
                style={{
                  aspectRatio: "16/10",
                  overflow: "hidden",
                  position: "relative",
                  background: "#0a0a0a",
                }}
              >
                <div
                  className="img-parallax"
                  style={{
                    position: "absolute",
                    top: "-10%", left: 0,
                    width: "100%", height: "120%",
                    backgroundImage: `url(${project.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transition: "filter 0.7s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)",
                    filter: hoveredIdx === index
                      ? "brightness(0.95)"
                      : "brightness(0.75)",
                    transform: hoveredIdx === index ? "scale(1.04)" : "scale(1)",
                  }}
                />
                {/* Glass overlay on hover */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
                    transition: "opacity 0.5s ease",
                  }}
                />
                {/* Tag */}
                <div
                  style={{
                    position: "absolute",
                    top: 16, right: 16,
                    padding: "5px 12px",
                    borderRadius: "100px",
                    background: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {project.tag}
                </div>
              </div>

              {/* Info area */}
              <div
                style={{
                  padding: "1.75rem 2rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {project.category}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                      color: "var(--text-primary)",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {project.title}
                  </h3>
                </div>

                <div
                  style={{
                    width: 40, height: 40,
                    borderRadius: "50%",
                    background: hoveredIdx === index
                      ? "rgba(220,180,128,0.15)"
                      : "rgba(255,255,255,0.05)",
                    border: "1px solid",
                    borderColor: hoveredIdx === index
                      ? "rgba(220,180,128,0.3)"
                      : "rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.4s ease",
                    flexShrink: 0,
                  }}
                >
                  <ArrowUpRight
                    size={16}
                    color={hoveredIdx === index ? "var(--accent-color)" : "rgba(255,255,255,0.5)"}
                    strokeWidth={1.5}
                    style={{
                      transform: hoveredIdx === index ? "translate(2px,-2px)" : "translate(0,0)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
