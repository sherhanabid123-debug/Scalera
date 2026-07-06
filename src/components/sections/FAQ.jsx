import React, { useState } from "react";
import { Plus, HelpCircle } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "What services does Scalera specialize in?",
    answer: "We design and build bespoke, high-performance web experiences, luxury brand showcases, corporate SaaS sites, and immersive interactive products. Every layout is custom-engineered from scratch with an emphasis on rich motion typography, glassmorphism aesthetics, and optional 3D background elements."
  },
  {
    question: "How does the Bespoke Estimator pricing work?",
    answer: "Our estimator calculates project scope dynamically based on your niche complexity, required scale (page count), and chosen aesthetic direction (e.g. Minimalist vs. Liquid Glass). This gives you transparent pricing options instantly, allowing you to configure variables to match your exact budget before submitting your brief."
  },
  {
    question: "How long does a typical project take?",
    answer: "Project schedules range depending on scale. A high-impact single landing page typically takes 2-3 weeks. A standard corporate or startup site (3-5 pages) takes 4-6 weeks, and deep enterprise-scale architectures or custom storefront platforms range from 8-12 weeks from strategy to deployment."
  },
  {
    question: "Will my website perform well on mobile and search engines?",
    answer: "Absolutely. Responsive design is core to our build system, using fluid layouts and clamp-based typography that scale perfectly across all screens. We also optimize assets, load critical scripts asynchronously, and enforce semantic markup structure to achieve fast load speeds and index-ready SEO signals."
  },
  {
    question: "Do you offer post-launch support and updates?",
    answer: "Yes, we provide flexible monthly support retainers and maintenance packages. This covers server hosting oversight, regular backups, security patches, performance reviews, and minor styling updates to ensure your digital presence stays fast and modern."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      style={{
        borderTop: "1px solid var(--border-subtle)",
        padding: "clamp(3rem, 7vw, 6rem) var(--pad-x)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1.3fr",
          gap: "4rem",
        }}
        className="faq-grid"
      >
        {/* Left Column: Heading */}
        <div style={{ textAlign: "left", position: "relative", zIndex: 2 }}>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--accent-color)",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <HelpCircle size={14} /> Clear Answers
          </div>
          <h2
            style={{
              fontSize: "clamp(2.2rem, 4vw, 3rem)",
              fontWeight: 300,
              lineHeight: 1.15,
              margin: 0,
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            Frequently Asked
            <br />
            <span className="shimmer-text" style={{ fontWeight: 600 }}>
              Questions.
            </span>
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              marginTop: "1.5rem",
              maxWidth: 380,
            }}
          >
            Can't find what you are looking for? Build your brief in our interactive estimator or drop us a direct line through the contact form below.
          </p>

          {/* Decorative gold light source in background */}
          <div
            style={{
              position: "absolute",
              bottom: "-20%",
              left: "-10%",
              width: 250,
              height: 250,
              background: "radial-gradient(circle, rgba(223, 168, 87, 0.08) 0%, transparent 70%)",
              filter: "blur(40px)",
              pointerEvents: "none",
              zIndex: -1,
            }}
          />
        </div>

        {/* Right Column: Borderless Accordion Rows */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div
                key={idx}
                className="faq-row"
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="faq-btn"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1.8rem 0",
                    background: "none",
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: isOpen ? "var(--accent-color)" : "#ffffff",
                    transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <span
                    className="faq-question-text"
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 400,
                      lineHeight: 1.4,
                      paddingRight: "1.5rem",
                      transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {item.question}
                  </span>
                  
                  {/* Plus icon rotates 135deg to turn into X */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isOpen ? "var(--accent-color)" : "rgba(255, 255, 255, 0.4)",
                      transform: isOpen ? "rotate(135deg)" : "rotate(0deg)",
                      transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease",
                      flexShrink: 0,
                    }}
                  >
                    <Plus size={20} strokeWidth={1.5} />
                  </div>
                </button>

                {/* Accordion Body (Modern CSS Grid template fraction expander) */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <p
                      style={{
                        paddingBottom: "1.8rem",
                        margin: 0,
                        fontSize: "0.92rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.7,
                        opacity: isOpen ? 1 : 0,
                        transform: isOpen ? "translateY(0)" : "translateY(8px)",
                        transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global CSS Styles for FAQ hover micro-interactions */}
      <style>{`
        .faq-row {
          position: relative;
        }
        /* Subtly indent text on hover */
        .faq-btn:hover {
          color: var(--accent-color) !important;
        }
        .faq-btn:hover .faq-question-text {
          transform: translateX(8px);
        }
        .faq-btn:hover div {
          color: var(--accent-color) !important;
        }
        @media (max-width: 900px) {
          .faq-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default FAQ;
