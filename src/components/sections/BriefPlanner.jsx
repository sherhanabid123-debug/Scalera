import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Sparkles, Calendar, Layers, Palette, ArrowRight, Check, MessageSquare } from "lucide-react";

const NICHES = [
  { id: "Custom Landing Page", label: "Custom Landing Page", desc: "High-converting single scroll experiences for ad campaigns.", basePrice: 10000 },
  { id: "High-End Portfolio", label: "High-End Portfolio", desc: "For agencies, studios, designers, and luxury creators.", basePrice: 14000 },
  { id: "Business Website", label: "Business Website", desc: "Perfect for startups, corporate brands, and professional services.", basePrice: 18000 },
  { id: "Digital Publisher", label: "Digital Publisher / News", desc: "High-content portals, digital magazines, and resource hubs.", basePrice: 22000 },
  { id: "Corporate SaaS", label: "Corporate SaaS Platform", desc: "Startups, software products, and complex tech B2B brands.", basePrice: 26000 },
  { id: "Online Store", label: "Online Store (E-Commerce)", desc: "High-performance storefronts designed to sell products seamlessly.", basePrice: 30000 },
  { id: "Luxury Brand", label: "Luxury Brand Showcase", desc: "Premium fashion, jewelry, high-end real estate, and art.", basePrice: 35000 },
  { id: "Other", label: "Other / Custom Project", desc: "A custom platform, complex application, or unique requirement.", basePrice: 25000 },
];

const SCALES = [
  { id: "1 Page", label: "Single Page Landing", desc: "High-impact single-scroll landing page.", addPrice: 0 },
  { id: "3-5 Pages", label: "Startup Site (3-5 pages)", desc: "Home, Services, About, Contact, Case Studies.", addPrice: 5000 },
  { id: "5-10 Pages", label: "Brand Presence (5-10 pages)", desc: "Comprehensive page setup with custom layouts.", addPrice: 10000 },
  { id: "10+ Pages", label: "Enterprise Scale (10+ pages)", desc: "Deep site architectures and bespoke template integrations.", addPrice: 16000 },
];

const STYLES = [
  { id: "Minimalist & Clean", label: "Minimalist & Clean", desc: "High-contrast typography, ample white space.", addPrice: 0 },
  { id: "Liquid Glass", label: "Liquid Glass (Refractive)", desc: "Immersive glass overlays, soft specular lighting.", addPrice: 3000 },
  { id: "Dark Cyber", label: "Dark Cyber (High Motion)", desc: "Dense text styles, responsive cursor trails, high animation.", addPrice: 6000 },
  { id: "Ultra-Luxury", label: "Ultra-Luxury (Gold Accent)", desc: "Gilded color palettes, thin outlines, smooth transitions.", addPrice: 9000 },
];

const CURRENCIES = {
  INR: { symbol: "₹", rate: 1.0 },
  USD: { symbol: "$", rate: 0.012 },
  EUR: { symbol: "€", rate: 0.011 },
  GBP: { symbol: "£", rate: 0.0094 },
  CAD: { symbol: "C$", rate: 0.016 },
  AUD: { symbol: "A$", rate: 0.018 },
};

const BriefPlanner = () => {
  const [step, setStep] = useState(0); // 0: Niche, 1: Scale, 2: Style, 3: Estimate/Lead Capture
  const [niche, setNiche] = useState("Business Website");
  const [scale, setScale] = useState("3-5 Pages");
  const [style, setStyle] = useState("Liquid Glass");
  const [currency, setCurrency] = useState("INR");
  
  // Lead info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const stepContainerRef = useRef(null);

  // Listen to niche event from Hero and check screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleNicheChange = (e) => {
      setNiche(e.detail);
      setStep(1); // Automatically jump to step 1
    };
    window.addEventListener("setPlannerNiche", handleNicheChange);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("setPlannerNiche", handleNicheChange);
    };
  }, []);

  // Animates the success panel on mount
  useEffect(() => {
    if (submitted) {
      gsap.fromTo(".planner-success", 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [submitted]);

  // Compute estimate range
  const base = NICHES.find(n => n.id === niche)?.basePrice || 5500;
  const scaleAdd = SCALES.find(s => s.id === scale)?.addPrice || 0;
  const styleAdd = STYLES.find(st => st.id === style)?.addPrice || 0;
  const totalMin = base + scaleAdd + styleAdd;
  const totalMax = Math.round(totalMin * 1.25);

  const { symbol, rate } = CURRENCIES[currency] || CURRENCIES.USD;
  const convertedMin = Math.round(totalMin * rate);
  const convertedMax = Math.round(totalMax * rate);

  const handleNext = () => {
    if (step < 3) {
      gsap.fromTo(stepContainerRef.current, 
        { opacity: 1, x: 0 },
        { 
          opacity: 0, x: -20, duration: 0.25, ease: "power2.in",
          onComplete: () => {
            setStep(prev => prev + 1);
            gsap.fromTo(stepContainerRef.current, 
              { opacity: 0, x: 20 },
              { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" }
            );
          }
        }
      );
    }
  };

  const handleBack = () => {
    if (step > 0) {
      gsap.fromTo(stepContainerRef.current, 
        { opacity: 1, x: 0 },
        { 
          opacity: 0, x: 20, duration: 0.25, ease: "power2.in",
          onComplete: () => {
            setStep(prev => prev - 1);
            gsap.fromTo(stepContainerRef.current, 
              { opacity: 0, x: -20 },
              { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" }
            );
          }
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);
    
    try {
      const key = import.meta.env.VITE_WEB3FORMS_KEY || "YOUR_ACCESS_KEY_HERE";
      if (key === "YOUR_ACCESS_KEY_HERE" || !key) {
        console.warn("Web3Forms API key is missing or set to placeholder. Falling back to local simulation mode.");
        // Proceed with simulated success state so they don't get blocked
        gsap.to(".planner-card-inner", {
          opacity: 0, y: -20, duration: 0.4, ease: "power2.in",
          onComplete: () => {
            setSubmitted(true);
          }
        });
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
          subject: `New Lead: ${name} - ${niche} Project Configurator`,
          from_name: "Scalera Bespoke Planner",
          name: name,
          email: email,
          project_niche: niche,
          project_scale: scale,
          project_style: style,
          estimated_cost: `${symbol}${convertedMin.toLocaleString()} - ${symbol}${convertedMax.toLocaleString()} (${currency})`
        })
      });

      const result = await response.json();
      if (result.success) {
        gsap.to(".planner-card-inner", {
          opacity: 0, y: -20, duration: 0.4, ease: "power2.in",
          onComplete: () => {
            setSubmitted(true);
          }
        });
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

  return (
    <section
      id="estimator"
      className="section"
      style={{
        padding: "clamp(4.5rem, 7vw, 6rem) var(--pad-x)",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      {/* Background glow orb */}
      <div
        className="glow-orb"
        style={{
          top: "40%", left: "80%",
          width: 800, height: 800,
          background: "radial-gradient(circle, rgba(223,168,87,0.05) 0%, transparent 65%)",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
        
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
            <div className="section-label" style={{ marginBottom: "1.5rem" }}>
              <div className="section-label-dot" />
              Bespoke Estimator
            </div>
            <h2
              style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                fontWeight: 300,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Design Your <br />
              <span className="shimmer-text" style={{ fontWeight: 700 }}>
                Digital Presence.
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
            Select your project specifications below to calculate an instant cost range. No templates, no artificial limitations. Pure bespoke agency engineering.
          </p>
        </div>

        {/* Multi-step Estimator Interface */}
        <div
          className="glass-card glass-animated-border"
          style={{
            maxWidth: 960,
            margin: "0 auto",
            borderRadius: 28,
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "var(--glass-shadow)",
            overflow: "hidden",
            background: "linear-gradient(145deg, rgba(255,255,255,0.045) 0%, rgba(223,168,87,0.01) 100%)",
          }}
        >
          {/* Header Progress Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1.5rem 2.5rem",
              background: "rgba(0,0,0,0.2)",
              borderBottom: "1px solid var(--border-subtle)",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: step === i ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: step === i ? "var(--accent-color)" : step > i ? "rgba(223, 168, 87, 0.4)" : "rgba(255,255,255,0.1)",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              ))}
            </div>
            
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {step === 0 && "Step 1: Project Niche"}
              {step === 1 && "Step 2: Scale & Pages"}
              {step === 2 && "Step 3: Design Style"}
              {step === 3 && "Final: Pricing Summary"}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{
                  background: "rgba(6, 6, 8, 0.45)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-glass)",
                  borderRadius: "8px",
                  padding: "0.3rem 0.6rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  outline: "none",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-color)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-glass)"}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
              </select>

              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "var(--accent-color)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {symbol}{convertedMin.toLocaleString()} - {symbol}{convertedMax.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div style={{ padding: "3rem 2.5rem" }}>
            
            {!submitted ? (
              <div className="planner-card-inner">
                <div ref={stepContainerRef}>
                  
                  {/* STEP 0: NICHE */}
                  {step === 0 && (
                    <div>
                      <h3 style={{ fontSize: "1.5rem", fontWeight: 400, marginBottom: "2rem", display: "flex", alignItems: "center", gap: "10px" }}>
                        <Sparkles size={20} color="var(--accent-color)" /> What niche represents your business best?
                      </h3>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                        {NICHES.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => setNiche(n.id)}
                            className="glass-card"
                            style={{
                              padding: "1.75rem",
                              borderRadius: 16,
                              cursor: "pointer",
                              border: "1px solid",
                              borderColor: niche === n.id ? "rgba(223, 168, 87, 0.3)" : "rgba(255, 255, 255, 0.06)",
                              background: niche === n.id ? "rgba(223, 168, 87, 0.04)" : "rgba(255, 255, 255, 0.02)",
                              boxShadow: niche === n.id ? "var(--glass-shadow-hover)" : "var(--glass-shadow)",
                              transition: "all 0.35s ease",
                            }}
                          >
                            <h4 style={{ fontSize: "1.1rem", fontWeight: 600, color: niche === n.id ? "var(--accent-color)" : "var(--text-primary)", marginBottom: "0.5rem" }}>
                              {n.label}
                            </h4>
                            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                              {n.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 1: SCALE */}
                  {step === 1 && (
                    <div>
                      <h3 style={{ fontSize: "1.5rem", fontWeight: 400, marginBottom: "2rem", display: "flex", alignItems: "center", gap: "10px" }}>
                        <Layers size={20} color="var(--accent-color)" /> What scale of site do you require?
                      </h3>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                        {SCALES.map((s) => (
                          <div
                            key={s.id}
                            onClick={() => setScale(s.id)}
                            className="glass-card"
                            style={{
                              padding: "1.75rem",
                              borderRadius: 16,
                              cursor: "pointer",
                              border: "1px solid",
                              borderColor: scale === s.id ? "rgba(223, 168, 87, 0.3)" : "rgba(255, 255, 255, 0.06)",
                              background: scale === s.id ? "rgba(223, 168, 87, 0.04)" : "rgba(255, 255, 255, 0.02)",
                              boxShadow: scale === s.id ? "var(--glass-shadow-hover)" : "var(--glass-shadow)",
                              transition: "all 0.35s ease",
                            }}
                          >
                            <h4 style={{ fontSize: "1.1rem", fontWeight: 600, color: scale === s.id ? "var(--accent-color)" : "var(--text-primary)", marginBottom: "0.5rem" }}>
                              {s.label}
                            </h4>
                            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                              {s.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: VISUAL STYLE */}
                  {step === 2 && (
                    <div>
                      <h3 style={{ fontSize: "1.5rem", fontWeight: 400, marginBottom: "2rem", display: "flex", alignItems: "center", gap: "10px" }}>
                        <Palette size={20} color="var(--accent-color)" /> Select a visual design aesthetic
                      </h3>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                        {STYLES.map((st) => (
                          <div
                            key={st.id}
                            onClick={() => setStyle(st.id)}
                            className="glass-card"
                            style={{
                              padding: "1.75rem",
                              borderRadius: 16,
                              cursor: "pointer",
                              border: "1px solid",
                              borderColor: style === st.id ? "rgba(223, 168, 87, 0.3)" : "rgba(255, 255, 255, 0.06)",
                              background: style === st.id ? "rgba(223, 168, 87, 0.04)" : "rgba(255, 255, 255, 0.02)",
                              boxShadow: style === st.id ? "var(--glass-shadow-hover)" : "var(--glass-shadow)",
                              transition: "all 0.35s ease",
                            }}
                          >
                            <h4 style={{ fontSize: "1.1rem", fontWeight: 600, color: style === st.id ? "var(--accent-color)" : "var(--text-primary)", marginBottom: "0.5rem" }}>
                              {st.label}
                            </h4>
                            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                              {st.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 3: PRICE SUMMARY & LEAD CAPTURE */}
                  {step === 3 && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
                      
                      {/* Left: Summary */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <h3 style={{ fontSize: "1.6rem", fontWeight: 400, margin: 0 }}>
                          Project Specifications
                        </h3>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                          {[
                            { label: "Niche Theme", value: niche },
                            { label: "Project Scale", value: scale },
                            { label: "Aesthetic Direction", value: style },
                            { label: "SEO Foundation", value: "Included Standard" },
                            { label: "Lighthouse Tuning", value: "Included Standard" }
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                paddingBottom: "0.75rem",
                                borderBottom: "1px solid var(--border-subtle)",
                                fontSize: "0.9rem",
                              }}
                            >
                              <span style={{ color: "var(--text-secondary)" }}>{item.label}</span>
                              <span style={{ fontWeight: 600, color: "var(--accent-color)" }}>{item.value}</span>
                            </div>
                          ))}
                        </div>

                        <div
                          style={{
                            padding: "1.5rem",
                            borderRadius: 14,
                            background: "rgba(223, 168, 87, 0.04)",
                            border: "1px solid rgba(223, 168, 87, 0.15)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem"
                          }}
                        >
                          <div style={{ fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)" }}>
                            Dynamic Estimated Range
                          </div>
                          <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--accent-color)", fontFamily: "var(--font-display)" }}>
                            {symbol}{convertedMin.toLocaleString()} - {symbol}{convertedMax.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Right: Contact Form */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <div>
                          <h3 style={{ fontSize: "1.6rem", fontWeight: 400, margin: "0 0 0.5rem" }}>
                            Secure Your Estimate
                          </h3>
                          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                            Enter your details below. We'll lock in this estimate and reach out via email or WhatsApp in under 12 hours.
                          </p>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
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
                            <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                              Your Email / WhatsApp
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="john@example.com or +1 (555) 019-2834"
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

                          <button
                            type="submit"
                            className="btn-glass"
                            style={{
                              marginTop: "1rem",
                              width: "100%",
                              padding: "1.1rem",
                              borderRadius: 14,
                              background: "rgba(223, 168, 87, 0.12)",
                              border: "1px solid rgba(223, 168, 87, 0.45)",
                              color: "#ffffff",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "8px",
                              cursor: "pointer",
                              transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-2px)";
                              e.currentTarget.style.borderColor = "rgba(223, 168, 87, 0.7)";
                              e.currentTarget.style.background = "rgba(223, 168, 87, 0.25)";
                              e.currentTarget.style.boxShadow = "0 8px 24px rgba(223, 168, 87, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.borderColor = "rgba(223, 168, 87, 0.45)";
                              e.currentTarget.style.background = "rgba(223, 168, 87, 0.12)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                             disabled={submitting}
                          >
                            <MessageSquare size={16} /> {submitting ? "Sending Spec Brief..." : "Get Estimates & Plan Project"}
                          </button>
                        </form>

                      </div>

                    </div>
                  )}

                </div>

                {/* Footer Controls */}
                {step < 3 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "3rem",
                      paddingTop: "2rem",
                      borderTop: "1px solid var(--border-subtle)",
                    }}
                  >
                    <button
                      onClick={handleBack}
                      disabled={step === 0}
                      style={{
                        padding: "0.75rem 1.5rem",
                        borderRadius: 12,
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        border: "1px solid var(--border-glass)",
                        color: step === 0 ? "var(--text-secondary)" : "#fff",
                        background: "rgba(255,255,255,0.02)",
                        opacity: step === 0 ? 0.3 : 1,
                        cursor: step === 0 ? "not-allowed" : "pointer",
                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                      onMouseEnter={(e) => {
                        if (step > 0) {
                          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (step > 0) {
                          e.currentTarget.style.borderColor = "var(--border-glass)";
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                        }
                      }}
                    >
                      Back
                    </button>
                    
                    <button
                      onClick={handleNext}
                      className="btn-glass"
                      style={{
                        padding: "0.75rem 1.75rem",
                        borderRadius: 12,
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        background: "rgba(223, 168, 87, 0.12)",
                        border: "1px solid rgba(223, 168, 87, 0.35)",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 4px 16px rgba(223,168,87,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
                        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-1px) scale(1.02)";
                        e.currentTarget.style.background = "rgba(223, 168, 87, 0.22)";
                        e.currentTarget.style.borderColor = "rgba(223, 168, 87, 0.6)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(223, 168, 87, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0) scale(1)";
                        e.currentTarget.style.background = "rgba(223, 168, 87, 0.12)";
                        e.currentTarget.style.borderColor = "rgba(223, 168, 87, 0.35)";
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(223,168,87,0.1), inset 0 1px 0 rgba(255,255,255,0.15)";
                      }}
                    >
                      Continue <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Success State */
              <div
                className="planner-success"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "4rem 2rem",
                  gap: "1.5rem"
                }}
              >
                <div
                  style={{
                    width: 72, height: 72,
                    borderRadius: "50%",
                    background: "rgba(223, 168, 87, 0.1)",
                    border: "1px solid rgba(223, 168, 87, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 32px rgba(223, 168, 87, 0.2)",
                  }}
                >
                  <Check size={36} color="var(--accent-color)" strokeWidth={2} />
                </div>
                
                <h3 style={{ fontSize: "2rem", fontWeight: 400, margin: 0 }}>
                  Brief Created Successfully!
                </h3>
                
                <p style={{ color: "var(--text-secondary)", maxWidth: 500, fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                  Thank you, <strong>{name}</strong>. We've locked in your project specifications for a <strong>{scale} {niche}</strong> website in the <strong>{style}</strong> aesthetic direction.
                  <br /><br />
                  A senior design partner will contact you at <strong>{email}</strong> within 12 hours with a comprehensive breakdown.
                </p>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setStep(0);
                    setName("");
                    setEmail("");
                  }}
                  style={{
                    marginTop: "1.5rem",
                    padding: "0.75rem 1.75rem",
                    borderRadius: 12,
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    border: "1px solid var(--border-glass)",
                    color: "#fff",
                    background: "rgba(255,255,255,0.02)",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-glass)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                  }}
                >
                  Restart Planner
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};

export default BriefPlanner;
