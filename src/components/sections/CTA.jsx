import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, MessageCircle, Check, Mail, User, Globe, FileText, Settings } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const NICHES = ["Corporate SaaS", "E-Commerce", "Luxury Showcase", "Portfolio", "Custom / Other"];
const CURRENCIES = ["USD", "INR", "EUR", "GBP", "CAD", "AUD"];

const BUDGET_PLACEHOLDERS = {
  USD: "e.g. 15,000 - 25,000",
  INR: "e.g. 12,00,000 - 20,00,000",
  EUR: "e.g. 14,000 - 24,000",
  GBP: "e.g. 12,00,000 - 20,00,000",
  CAD: "e.g. 20,000 - 35,000",
  AUD: "e.g. 22,000 - 38,000",
};

const CTA = () => {
  const containerRef = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("Corporate SaaS");
  const [customNiche, setCustomNiche] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [budgetRange, setBudgetRange] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    if (selectedNiche === "Custom / Other" && !customNiche) return;
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
          project_niche: selectedNiche === "Custom / Other" ? customNiche : selectedNiche,
          project_budget: `${selectedCurrency} ${budgetRange}`,
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
        { opacity: 0, y: 80, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1.6, ease: "expo.out" },
      )
        .fromTo(
          ".cta-left-anim",
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 1.0, stagger: 0.1, ease: "power2.out" },
          "-=1.0"
        )
        .fromTo(
          ".cta-right-anim",
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 1.0, stagger: 0.1, ease: "power2.out" },
          "-=1.0"
        );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Compute live completeness status
  const isReady = name.trim() !== "" && email.trim() !== "" && message.trim() !== "" && (selectedNiche !== "Custom / Other" || customNiche.trim() !== "");

  return (
    <section
      ref={containerRef}
      id="contact"
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
          background: "radial-gradient(circle, rgba(223,168,87,0.05) 0%, rgba(140,100,255,0.01) 40%, transparent 65%)",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Main card */}
      <div
        className="cta-card glass-card ios-border-shine"
        style={{
          width: "100%",
          maxWidth: 1040,
          borderRadius: 32,
          overflow: "hidden",
          position: "relative",
          zIndex: 2,
          "--shine-duration": "6.5s",
          "--shine-delay": "0s",
          boxShadow: "var(--glass-shadow-hover)",
        }}
      >
        {/* Split grid layout */}
        <div
          className="cta-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            padding: "clamp(2.5rem, 4vw, 3.5rem) clamp(2rem, 4vw, 3rem)",
            gap: "3.5rem",
            textAlign: "left",
          }}
        >
          {/* LEFT COLUMN: BRAND INFO & LIVE BRIEF CONFIGURATOR TICKET */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", position: "relative" }}>
            
            {/* Header Title Content */}
            <div className="cta-left-anim" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--accent-color)",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: 6, height: 6,
                    borderRadius: "50%",
                    background: "#10b981",
                    boxShadow: "0 0 10px #10b981",
                    animation: "pulse 2s infinite"
                  }}
                />
                Currently booking for Q3 2026
              </div>

              <h2
                style={{
                  fontSize: "clamp(1.8rem, 2.8vw, 2.3rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.03em",
                  margin: 0,
                  lineHeight: 1.15,
                  color: "#fff",
                  fontFamily: "var(--font-display)",
                }}
              >
                Let's Build Something
                <br />
                <span className="shimmer-text" style={{ fontWeight: 600 }}>
                  Extraordinary.
                </span>
              </h2>

              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.5, margin: 0, maxWidth: 360 }}>
                Fill out the variables on the right to compile your project brief ticket in real time.
              </p>
            </div>

            {/* LIVE CONFIGURATOR BRIEF TICKET */}
            <div
              className="cta-left-anim"
              style={{
                background: "rgba(255, 255, 255, 0.015)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: 20,
                padding: "1.5rem",
                fontFamily: "monospace",
                fontSize: "0.78rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
                color: "rgba(255, 255, 255, 0.8)",
                position: "relative",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
              }}
            >
              {/* Ticket header watermark */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed rgba(255,255,255,0.12)", paddingBottom: "0.6rem" }}>
                <span style={{ color: "var(--accent-color)", fontWeight: "bold", letterSpacing: "0.08em" }}>SCALERA BRIEF METRIC</span>
                <span style={{ color: "rgba(255, 255, 255, 0.25)" }}>ID: #{(name ? name.length * 7 + 100 : 999)}</span>
              </div>

              {/* Live bound values */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(255, 255, 255, 0.35)" }}>CLIENT:</span>
                  <span style={{ color: name ? "#fff" : "rgba(255, 255, 255, 0.2)", fontWeight: name ? "bold" : "normal" }}>
                    {name ? name.toUpperCase() : "[ AWAITING INPUT ]"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(255, 255, 255, 0.35)" }}>CHANNEL:</span>
                  <span style={{ color: email ? "var(--accent-color)" : "rgba(255, 255, 255, 0.2)" }}>
                    {email ? email : "[ AWAITING INPUT ]"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(255, 255, 255, 0.35)" }}>PROJECT TYPE:</span>
                  <span style={{ color: "#fff", fontWeight: "bold" }}>
                    {selectedNiche === "Custom / Other" ? (customNiche ? customNiche.toUpperCase() : "CUSTOM NICHE") : selectedNiche.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(255, 255, 255, 0.35)" }}>BUDGET EST:</span>
                  <span style={{ color: budgetRange ? "var(--accent-color)" : "rgba(255, 255, 255, 0.2)" }}>
                    {budgetRange ? `${selectedCurrency} ${budgetRange}` : "[ UNSPECIFIED ]"}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", borderTop: "1px dashed rgba(255,255,255,0.06)", paddingTop: "0.5rem" }}>
                  <span style={{ color: "rgba(255, 255, 255, 0.35)" }}>BRIEF SUMMARY:</span>
                  <span style={{ color: message ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.15)", fontStyle: message ? "normal" : "italic", lineHeight: 1.4, marginTop: "2px" }}>
                    {message ? (message.length > 60 ? `${message.substring(0, 60)}...` : message) : "Provide project details to fill brief scope..."}
                  </span>
                </div>
              </div>

              {/* Barcode styling to look like a premium tech ticket */}
              <div style={{ display: "flex", gap: "1.5px", height: "24px", opacity: 0.25, justifyContent: "center", margin: "0.25rem 0", borderTop: "1px dashed rgba(255,255,255,0.12)", paddingTop: "0.6rem" }}>
                {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 1, 3].map((w, idx) => (
                  <div key={idx} style={{ width: w, background: "#fff", height: "100%" }} />
                ))}
              </div>

              {/* Pulsing Status Tag */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  color: isReady ? "#10b981" : "var(--accent-color)",
                  letterSpacing: "0.08em",
                  borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                  paddingTop: "0.6rem",
                }}
              >
                <div
                  style={{
                    width: 5, height: 5,
                    borderRadius: "50%",
                    background: isReady ? "#10b981" : "var(--accent-color)",
                    boxShadow: isReady ? "0 0 8px #10b981" : "0 0 8px var(--accent-color)",
                    animation: "pulse 2s infinite",
                  }}
                />
                {isReady ? "TICKET READY TO TRANSMIT" : "COMPILING DATA FIELDS..."}
              </div>
            </div>

            {/* Direct Contacts */}
            <div className="cta-left-anim" style={{ display: "flex", gap: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem" }}>
              <a
                href="mailto:contact.scalerastudio@gmail.com"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--text-secondary)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                  fontFamily: "monospace",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
              >
                <Mail size={12} color="var(--accent-color)" /> email
              </a>
              <a
                href="https://wa.me/917975242650"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--text-secondary)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                  fontFamily: "monospace",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
              >
                <MessageCircle size={12} color="#10b981" /> whatsapp
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILED CONFIGURABLE FORM */}
          <div className="cta-right-anim" style={{ position: "relative" }}>
            {!submitted ? (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                
                {/* Inputs Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="form-row-grid">
                  <div style={{ position: "relative" }}>
                    <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                      Your Name
                    </label>
                    <div style={{ position: "relative" }}>
                      <User size={14} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.2)", pointerEvents: "none" }} />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.85rem 1.25rem 0.85rem 2.25rem",
                          borderRadius: 12,
                          background: "rgba(255, 255, 255, 0.01)",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                          color: "#fff",
                          outline: "none",
                          fontSize: "0.9rem",
                          transition: "all 0.3s ease",
                        }}
                        onFocus={(e) => e.target.style.borderColor = "var(--accent-color)"}
                        onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.06)"}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                      Email / WhatsApp
                    </label>
                    <div style={{ position: "relative" }}>
                      <Globe size={14} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.2)", pointerEvents: "none" }} />
                      <input
                        type="text"
                        required
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.85rem 1.25rem 0.85rem 2.25rem",
                          borderRadius: 12,
                          background: "rgba(255, 255, 255, 0.01)",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                          color: "#fff",
                          outline: "none",
                          fontSize: "0.9rem",
                          transition: "all 0.3s ease",
                        }}
                        onFocus={(e) => e.target.style.borderColor = "var(--accent-color)"}
                        onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.06)"}
                      />
                    </div>
                  </div>
                </div>

                {/* Project Niche Pills */}
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                    Project Type / Niche
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {NICHES.map((n) => {
                      const isSelected = selectedNiche === n;
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setSelectedNiche(n)}
                          style={{
                            padding: "0.55rem 0.9rem",
                            borderRadius: 8,
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            border: "1px solid",
                            borderColor: isSelected ? "rgba(223, 168, 87, 0.35)" : "rgba(255, 255, 255, 0.05)",
                            background: isSelected ? "rgba(223, 168, 87, 0.08)" : "rgba(255, 255, 255, 0.01)",
                            color: isSelected ? "var(--accent-color)" : "var(--text-secondary)",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          {isSelected && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent-color)" }} />}
                          {n}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Custom Niche Text Input Box */}
                  {selectedNiche === "Custom / Other" && (
                    <div style={{ marginTop: "0.75rem" }}>
                      <input
                        type="text"
                        required
                        placeholder="Specify custom project type (e.g. Web3, Real Estate, Art Gallery...)"
                        value={customNiche}
                        onChange={(e) => setCustomNiche(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem 1.1rem",
                          borderRadius: 10,
                          background: "rgba(255, 255, 255, 0.01)",
                          border: "1px solid rgba(223, 168, 87, 0.25)",
                          color: "#fff",
                          outline: "none",
                          fontSize: "0.85rem",
                          transition: "border-color 0.3s ease",
                        }}
                        onFocus={(e) => e.target.style.borderColor = "var(--accent-color)"}
                        onBlur={(e) => e.target.style.borderColor = "rgba(223, 168, 87, 0.25)"}
                      />
                    </div>
                  )}
                </div>

                {/* Target Budget with Integrated Capsule design */}
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    Target Budget Range
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "100px 1fr",
                      borderRadius: 12,
                      background: "rgba(255, 255, 255, 0.01)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      style={{
                        padding: "0.85rem 1rem",
                        background: "transparent",
                        border: "none",
                        borderRight: "1px solid rgba(255, 255, 255, 0.06)",
                        color: "#fff",
                        outline: "none",
                        fontSize: "0.9rem",
                        cursor: "pointer",
                      }}
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c} style={{ background: "#0c0c0e", color: "#fff" }}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      required
                      placeholder={BUDGET_PLACEHOLDERS[selectedCurrency] || "e.g. 15,000 - 25,000"}
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.85rem 1.25rem",
                        background: "transparent",
                        border: "none",
                        color: "#fff",
                        outline: "none",
                        fontSize: "0.9rem",
                      }}
                    />
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    Project Idea / Goals
                  </label>
                  <textarea
                    required
                    placeholder="Describe your design vision, timeline parameters, or specific features..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.85rem 1.25rem",
                      borderRadius: 12,
                      background: "rgba(255, 255, 255, 0.01)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      color: "#fff",
                      outline: "none",
                      fontSize: "0.9rem",
                      transition: "border-color 0.3s ease",
                      resize: "none",
                      fontFamily: "inherit",
                      lineHeight: 1.5,
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--accent-color)"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.06)"}
                  />
                </div>

                {/* Restyled premium submit button */}
                <button
                  type="submit"
                  className="btn-glass"
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "1.1rem",
                    borderRadius: 12,
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    background: "rgba(223, 168, 87, 0.08)",
                    border: "1px solid rgba(223, 168, 87, 0.3)",
                    color: "#ffffff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 16px rgba(223,168,87,0.06), inset 0 1px 0 rgba(255,255,255,0.05)",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.background = "linear-gradient(135deg, var(--accent-warm) 0%, var(--accent-color) 100%)";
                    e.currentTarget.style.color = "#080808";
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(223,168,87,0.35), inset 0 1px 0 rgba(255,255,255,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.background = "rgba(223, 168, 87, 0.08)";
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.borderColor = "rgba(223, 168, 87, 0.3)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(223,168,87,0.06), inset 0 1px 0 rgba(255,255,255,0.05)";
                  }}
                >
                  {submitting ? "Sending Request..." : "Submit Project Request"} <ArrowUpRight size={14} />
                </button>
              </form>
            ) : (
              /* Success State */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1.25rem",
                  padding: "4.5rem 1.5rem",
                  textAlign: "center",
                  background: "rgba(223, 168, 87, 0.01)",
                  border: "1px dashed rgba(223, 168, 87, 0.2)",
                  borderRadius: 20,
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: 60, height: 60,
                    borderRadius: "50%",
                    background: "rgba(223, 168, 87, 0.08)",
                    border: "1px solid rgba(223, 168, 87, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 20px rgba(223,168,87,0.15)",
                  }}
                >
                  <Check size={26} color="var(--accent-color)" strokeWidth={2} />
                </div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 400, margin: 0, color: "#fff" }}>
                  Inquiry Logged!
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: 400, lineHeight: 1.6, margin: 0 }}>
                  Thank you, <strong>{name}</strong>. We have registered your request for a <strong>{selectedNiche === "Custom / Other" ? customNiche : selectedNiche}</strong> project (budget: {selectedCurrency} {budgetRange}).
                  <br /><br />
                  Our design partner will email you at <strong>{email}</strong> within 12 hours.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setEmail("");
                    setMessage("");
                    setCustomNiche("");
                    setBudgetRange("");
                  }}
                  style={{
                    marginTop: "1.25rem",
                    padding: "0.55rem 1.25rem",
                    borderRadius: 8,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.01)",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.01)"}
                >
                  Send Another Inquiry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global CSS adjustments for mobile views & ios-border-shine override */}
      <style>{`
        .cta-card.ios-border-shine::after {
          border-radius: 31px !important;
          background: linear-gradient(145deg, rgba(32, 32, 38, 0.96) 0%, rgba(18, 18, 22, 0.98) 100%) !important;
        }
        .cta-card.ios-border-shine {
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .cta-card.ios-border-shine:hover {
          transform: translateY(-8px) scale(1.01) !important;
          box-shadow: 0 20px 45px rgba(0,0,0,0.55), 0 0 30px rgba(223, 168, 87, 0.07) !important;
        }
        .cta-card.ios-border-shine::before {
          border-radius: 32px !important;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        @media (max-width: 900px) {
          .cta-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .form-row-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CTA;
