import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, MessageCircle, Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CTA = () => {
  const containerRef = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitting(true);

    try {
      const key = import.meta.env.VITE_WEB3FORMS_KEY || "YOUR_ACCESS_KEY_HERE";
      if (key === "YOUR_ACCESS_KEY_HERE" || !key) {
        console.warn("Web3Forms API key is missing or set to placeholder. Falling back to local simulation mode.");
        setSubmitted(true);
        return;
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: key,
          subject: `New Lead: Direct Inquiry from ${name}`,
          from_name: "Scalera Direct Form",
          name: name,
          email: email,
          message: message
        })
      });

      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        alert("Something went wrong. Please check your credentials or network and try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      tl.fromTo(
        ".cta-card",
        { opacity: 0, y: 80, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1.6, ease: "expo.out" },
      )
        .fromTo(
          ".cta-label",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.8",
        )
        .fromTo(
          ".cta-title",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" },
          "-=0.6",
        )
        .fromTo(
          ".cta-btn",
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.12, ease: "back.out(1.4)" },
          "-=0.8",
        );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="section"
      style={{
        padding: "clamp(4.5rem, 7vw, 6rem) var(--pad-x)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        zIndex: 2,
        overflow: "hidden",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      {/* Background atmosphere */}
      <div
        className="glow-orb"
        style={{
          top: "50%", left: "50%",
          width: 1100, height: 1100,
          background: "radial-gradient(circle, rgba(223,168,87,0.07) 0%, rgba(140,100,255,0.01) 40%, transparent 65%)",
        }}
      />

      <div
        className="cta-card glass-card glass-animated-border"
        style={{
          width: "100%",
          maxWidth: 880,
          borderRadius: 32,
          overflow: "hidden",
          padding: "0",
          background: "linear-gradient(145deg, rgba(255,255,255,0.045) 0%, rgba(220,180,128,0.025) 100%)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Prismatic top bar */}
        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(220,180,128,0.5), rgba(180,150,255,0.4), rgba(220,180,128,0.5), transparent)",
          }}
        />

        {/* Corner accent */}
        <div
          style={{
            position: "absolute",
            top: -100, right: -100,
            width: 300, height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(220,180,128,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            padding: "5rem 4rem 4rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          {/* Label */}
          <div className="cta-label section-label">
            <div className="section-label-dot" />
            Start a Conversation
          </div>

          {/* Title */}
          <h2
            className="cta-title"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 300,
              letterSpacing: "-0.04em",
              margin: 0,
              lineHeight: 1.05,
              color: "var(--text-primary)",
            }}
          >
            Let's Build Something
            <br />
            <span className="shimmer-text" style={{ fontWeight: 600 }}>
              Extraordinary.
            </span>
          </h2>

          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              style={{
                width: "100%",
                maxWidth: 580,
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
                textAlign: "left",
                marginTop: "1.5rem",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.85rem 1.25rem",
                      borderRadius: 12,
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--border-glass)",
                      color: "#fff",
                      outline: "none",
                      fontSize: "0.95rem",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--accent-color)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border-glass)"}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    Email / WhatsApp
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.85rem 1.25rem",
                      borderRadius: 12,
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--border-glass)",
                      color: "#fff",
                      outline: "none",
                      fontSize: "0.95rem",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--accent-color)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border-glass)"}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  Project Idea / Scope
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your goals, pages needed, visual style, or timeline..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.85rem 1.25rem",
                    borderRadius: 12,
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border-glass)",
                    color: "#fff",
                    outline: "none",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease",
                    resize: "none",
                    fontFamily: "inherit",
                    lineHeight: 1.6,
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--accent-color)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border-glass)"}
                />
              </div>

              <button
                type="submit"
                className="btn-glass"
                style={{
                  width: "100%",
                  padding: "1.1rem",
                  borderRadius: 12,
                  background: "linear-gradient(135deg, var(--accent-warm) 0%, var(--accent-color) 100%)",
                  color: "#080808",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 6px 20px rgba(223,168,87,0.3), inset 0 1px 0 rgba(255,255,255,0.4)",
                  transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(223,168,87,0.45), inset 0 1px 0 rgba(255,255,255,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(223,168,87,0.3), inset 0 1px 0 rgba(255,255,255,0.4)";
                }}
                 disabled={submitting}
              >
                {submitting ? "Sending Request..." : "Submit Project Request"} <ArrowUpRight size={16} />
              </button>
            </form>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.25rem",
                padding: "3rem 1.5rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 56, height: 56,
                  borderRadius: "50%",
                  background: "rgba(223, 168, 87, 0.1)",
                  border: "1px solid rgba(223, 168, 87, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 20px rgba(223,168,87,0.2)",
                }}
              >
                <Check size={24} color="var(--accent-color)" strokeWidth={2.5} />
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 500, margin: 0 }}>
                Inquiry Received!
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", maxWidth: 440, lineHeight: 1.6, margin: 0 }}>
                Thank you, <strong>{name}</strong>. Your project brief has been logged. Our lead designer will review it and follow up at <strong>{email}</strong> within 12 hours.
              </p>
            </div>
          )}

          {/* Alternative triggers */}
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              justifyContent: "center",
              marginTop: "1rem",
              flexWrap: "wrap",
              borderTop: "1px solid var(--border-subtle)",
              paddingTop: "1.5rem",
              width: "100%",
              maxWidth: 580,
            }}
          >
            <a
              href="https://wa.me/917975242650"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--text-secondary)",
                fontSize: "0.8rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
            >
              <MessageCircle size={14} /> WhatsApp Chat
            </a>
            <a
              href="mailto:contact.scalerastudio@gmail.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--text-secondary)",
                fontSize: "0.8rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
            >
              Direct Email
            </a>
          </div>
        </div>

        {/* Bottom gradient bar */}
        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(140,100,255,0.3), rgba(220,180,128,0.4), transparent)",
          }}
        />
      </div>
    </section>
  );
};

export default CTA;
