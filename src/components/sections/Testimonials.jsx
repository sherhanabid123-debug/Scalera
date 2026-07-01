import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const feedbacks = [
  {
    id: 1,
    quote: "They didn't just build a website, they built a digital presence that instantly elevated our brand authority.",
    highlight: "built a digital presence",
    author: "Ratan Singh",
    role: "Founder · Thar Restaurant",
    accent: "#dfa857", // Warm Gold
  },
  {
    id: 2,
    quote: "The modular luxury layout and speed optimization skyrocketed our store conversions. Execution was flawless.",
    highlight: "skyrocketed our store conversions",
    author: "David Chen",
    role: "CTO · Kryptic Platform",
    accent: "#8c64ff", // Purple
  },
  {
    id: 3,
    quote: "A beautiful fusion of heritage storytelling and interactive art. Our digital reservation bookings doubled.",
    highlight: "digital reservation bookings doubled",
    author: "Sanjana Rao",
    role: "MD · The Second House",
    accent: "#2eb872", // Emerald Green
  },
  {
    id: 4,
    quote: "An artistic masterpiece. They captured our bohemian spirit and translated it into a luxurious web experience that captivates every guest.",
    highlight: "captured our bohemian spirit",
    author: "Manesha",
    role: "Creative Director · Fridah",
    accent: "#eb5757", // Crimson Red
  },
];

const Testimonials = () => {
  const containerRef = useRef();
  const spotlightRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeIdxRef = useRef(activeIdx);
  activeIdxRef.current = activeIdx;

  // Fluid transition controller using GSAP
  const changeTestimonial = (nextIdx) => {
    if (nextIdx === activeIdxRef.current) return;

    // Out animation: fade out and slide upward gently
    gsap.to([".test-quote-text", ".test-author-info"], {
      opacity: 0,
      y: -16,
      duration: 0.35,
      ease: "power2.inOut",
      stagger: 0.04,
      onComplete: () => {
        // Swap state index
        setActiveIdx(nextIdx);

        // Instantly position new elements at the bottom offset
        gsap.set([".test-quote-text", ".test-author-info"], {
          y: 18,
        });

        // In animation: fade in and slide to center position
        gsap.to([".test-quote-text", ".test-author-info"], {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.06,
        });
      },
    });
  };

  // Auto-scroll testimonials carousel (every 4 seconds, pauses on mouse hover)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const next = (activeIdxRef.current + 1) % feedbacks.length;
      changeTestimonial(next);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

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
        [".test-quote-text", ".test-author-info"],
        { opacity: 0, y: 25 },
        {
          opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: ".test-text-display", start: "top 78%" },
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const activeFeedback = feedbacks[activeIdx];

  // Mouse spotlight trailing halo handler
  const handleMouseMove = (e) => {
    if (!spotlightRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Position halo at cursor coordinates (spotlight is 500x500, so subtract 250 to center it)
    spotlightRef.current.style.transform = `translate(${x - 250}px, ${y - 250}px)`;
  };

  const renderQuote = (quote, highlight, accent) => {
    if (!quote.includes(highlight)) return quote;
    const parts = quote.split(highlight);
    return (
      <>
        “{parts[0]}
        <span
          style={{
            color: accent,
            fontStyle: "italic",
            textShadow: `0 0 25px ${accent}25`,
            transition: "all 0.6s ease",
            fontWeight: 400,
          }}
        >
          {highlight}
        </span>
        {parts[1]}”
      </>
    );
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        padding: "clamp(4.5rem, 7vw, 6rem) var(--pad-x)",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid var(--border-subtle)",
        // Background is transparent to inherit global dynamic 3D atmosphere
      }}
    >
      <style>{`
        .test-text-display blockquote {
          text-align: center;
        }
      `}</style>

      {/* Cursor trailing spotlight halo */}
      <div
        ref={spotlightRef}
        style={{
          position: "absolute",
          width: 500, height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${activeFeedback.accent}12 0%, transparent 70%)`,
          pointerEvents: "none",
          transition: "background 0.8s ease, transform 0.15s ease-out",
          transform: "translate(-1000px, -1000px)",
          zIndex: 1,
        }}
      />

      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 2 }}>
        
        {/* Unified Label */}
        <div
          className="test-label section-label"
          style={{ marginBottom: "4rem", justifyContent: "center" }}
        >
          <div className="section-label-dot" />
          Client Feedback
        </div>

        {/* Typographic Testimonial (No Card, floats on background) */}
        <div
          className="test-text-display"
          style={{
            position: "relative",
            minHeight: "340px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "3.5rem",
          }}
        >
          {/* Giant background quotation mark */}
          <div
            style={{
              position: "absolute",
              fontSize: "14rem",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              color: activeFeedback.accent,
              opacity: 0.05,
              top: "10%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              userSelect: "none",
              transition: "color 0.8s ease",
            }}
          >
            “
          </div>

          <blockquote
            className="test-quote-text"
            style={{
              fontSize: "clamp(1.6rem, 3.8vw, 2.65rem)",
              fontWeight: 300,
              lineHeight: 1.35,
              letterSpacing: "-0.025em",
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
              margin: "0 0 2.5rem 0",
              position: "relative",
              zIndex: 2,
            }}
          >
            {renderQuote(activeFeedback.quote, activeFeedback.highlight, activeFeedback.accent)}
          </blockquote>

          <div
            className="test-author test-author-info"
            style={{
              textAlign: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            <p
              style={{
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                fontWeight: 700,
                margin: "0 0 0.3rem",
                color: "var(--text-primary)",
              }}
            >
              {activeFeedback.author}
            </p>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.75rem",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              {activeFeedback.role}
            </p>
          </div>
        </div>

        {/* Typographic Navigation capsule */}
        <div style={{ display: "flex", justifyContent: "center", zIndex: 3, position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(15, 15, 20, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "100px",
              padding: "6px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.02)",
              position: "relative",
            }}
          >
            {/* Sliding background highlight pill container */}
            <div
              style={{
                position: "absolute",
                left: 6,
                top: 6,
                width: 130,
                height: 38,
                borderRadius: "100px",
                background: `${activeFeedback.accent}14`,
                border: "1px solid",
                borderColor: `${activeFeedback.accent}28`,
                boxShadow: `0 0 16px ${activeFeedback.accent}10`,
                transform: `translateX(${activeIdx * (130 + 8)}px)`,
                transition: "transform 0.48s cubic-bezier(0.25, 1, 0.5, 1), background 0.8s ease, border-color 0.8s ease, box-shadow 0.8s ease",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />

            {feedbacks.map((fb, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={fb.id}
                  onClick={() => changeTestimonial(idx)}
                  style={{
                    background: "transparent",
                    border: "none",
                    width: 130,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "100px",
                    color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.35)",
                    fontSize: "0.72rem",
                    fontFamily: "monospace",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    transition: "color 0.4s ease",
                    position: "relative",
                    zIndex: 2,
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.35)";
                    }
                  }}
                >
                  0{fb.id}. {fb.author.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
