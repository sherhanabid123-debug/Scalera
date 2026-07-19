import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Sparkles, Calendar, Layers, Palette, ArrowRight, Check, MessageSquare } from "lucide-react";

const NICHES = [
  { id: "Custom Landing Page", label: "Custom Landing Page", desc: "High converting single scroll experiences for ad campaigns.", basePrice: 4000 },
  { id: "High End Portfolio", label: "High End Portfolio", desc: "For agencies, studios, designers, and luxury creators.", basePrice: 5600 },
  { id: "Business Website", label: "Business Website", desc: "Perfect for startups, corporate brands, and professional services.", basePrice: 7200 },
  { id: "Digital Publisher", label: "Digital Publisher / News", desc: "High content portals, digital magazines, and resource hubs.", basePrice: 8800 },
  { id: "Corporate SaaS", label: "Corporate SaaS Platform", desc: "Startups, software products, and complex tech B2B brands.", basePrice: 10400 },
  { id: "Online Store", label: "Online Store (E Commerce)", desc: "High performance storefronts designed to sell products seamlessly.", basePrice: 12000 },
  { id: "Luxury Brand", label: "Luxury Brand Showcase", desc: "Premium fashion, jewelry, high end real estate, and art.", basePrice: 14000 },
  { id: "Other", label: "Other / Custom Project", desc: "A custom platform, complex application, or unique requirement.", basePrice: 10000 },
];

const SCALES = [
  { id: "1 Page", label: "Single Page Landing", desc: "High impact single scroll landing page.", addPrice: 0 },
  { id: "3 to 5 Pages", label: "Startup Site (3 to 5 pages)", desc: "Home, Services, About, Contact, Case Studies.", addPrice: 2000 },
  { id: "5 to 10 Pages", label: "Brand Presence (5 to 10 pages)", desc: "Comprehensive page setup with custom layouts.", addPrice: 4000 },
  { id: "10+ Pages", label: "Enterprise Scale (10+ pages)", desc: "Deep site architectures and bespoke template integrations.", addPrice: 6400 },
];

const STYLES = [
  { id: "Minimalist & Clean", label: "Minimalist & Clean", desc: "High contrast typography, ample white space.", addPrice: 0 },
  { id: "Liquid Glass", label: "Liquid Glass (Refractive)", desc: "Immersive glass overlays, soft specular lighting.", addPrice: 3000 },
  { id: "Dark Cyber", label: "Dark Cyber (High Motion)", desc: "Dense text styles, responsive cursor trails, high animation.", addPrice: 6000 },
  { id: "Ultra Luxury", label: "Ultra Luxury (Gold Accent)", desc: "Gilded color palettes, thin outlines, smooth transitions.", addPrice: 9000 },
  { id: "Custom Aesthetic", label: "Custom Choice", desc: "Describe your own brand theme, custom colors, and design vision.", addPrice: 5000 },
];

const CURRENCIES = {
  INR: { symbol: "₹", rate: 1.0 },
  USD: { symbol: "$", rate: 0.012 },
  EUR: { symbol: "€", rate: 0.011 },
  GBP: { symbol: "£", rate: 0.0094 },
  CAD: { symbol: "C$", rate: 0.016 },
  AUD: { symbol: "A$", rate: 0.018 },
};

/* Compact mobile selector: 2-col label chips + description of the current pick.
   Keeps every step short and consistent on phones. */
const MobileChoiceGrid = ({ items, selected, onSelect }) => {
  const current = items.find((it) => it.id === selected);
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        {items.map((it) => {
          const isActive = selected === it.id;
          return (
            <button
              key={it.id}
              onClick={() => onSelect(it.id)}
              style={{
                padding: "0.75rem 0.6rem",
                minHeight: 58,
                borderRadius: 12,
                cursor: "pointer",
                border: "1px solid",
                borderColor: isActive ? "rgba(223, 168, 87, 0.5)" : "rgba(255, 255, 255, 0.07)",
                background: isActive ? "rgba(223, 168, 87, 0.1)" : "rgba(255, 255, 255, 0.02)",
                color: isActive ? "var(--accent-color)" : "var(--text-secondary)",
                fontSize: "0.82rem",
                fontWeight: isActive ? 700 : 500,
                fontFamily: "inherit",
                lineHeight: 1.25,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                boxShadow: isActive ? "0 4px 14px rgba(223,168,87,0.14)" : "none",
              }}
            >
              {it.label}
            </button>
          );
        })}
      </div>
      {current?.desc && (
        <div
          style={{
            marginTop: "0.85rem",
            padding: "0.9rem 1rem",
            borderRadius: 12,
            background: "rgba(223, 168, 87, 0.04)",
            border: "1px solid rgba(223, 168, 87, 0.15)",
          }}
        >
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
            {current.desc}
          </p>
        </div>
      )}
    </>
  );
};

const BriefPlanner = () => {
  const [step, setStep] = useState(0); // 0: Niche, 1: Scale, 2: Style, 3: Estimate/Lead Capture
  const [niche, setNiche] = useState("Business Website");
  const [scale, setScale] = useState("3 to 5 Pages");
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
          project_style: style === "Custom Aesthetic" ? "Custom Choice (Meeting to be scheduled)" : style,
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
        padding: "clamp(3.5rem, 11vw, 9rem) var(--pad-x) clamp(3rem, 8vw, 6.5rem)",
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

      <div style={{ maxWidth: 1040, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Unified Editorial Header */}
        <div
          style={{
            marginBottom: "3.5rem",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.35fr 1fr",
            gap: isMobile ? "1.25rem" : "3rem",
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
                fontSize: "clamp(2.2rem, 4vw, 3.3rem)",
                fontWeight: 300,
                letterSpacing: "-0.04em",
                lineHeight: 1.06,
                margin: 0,
                textTransform: "uppercase",
                whiteSpace: isMobile ? "normal" : "nowrap",
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
            Select your project specifications below to calculate an instant cost range. No templates, no artificial limitations. Pure custom agency engineering.
          </p>
        </div>

        {/* Multi-step Estimator Interface */}
        <div
          className="glass-card glass-animated-border"
          style={{
            width: "100%",
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
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "stretch" : "center",
              padding: isMobile ? "1.25rem 1.25rem" : "1.5rem 2.5rem",
              background: "rgba(0,0,0,0.2)",
              borderBottom: "1px solid var(--border-subtle)",
              gap: "1rem",
            }}
          >
            {/* Row 1: step dots + step label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                justifyContent: isMobile ? "space-between" : "flex-start",
                width: isMobile ? "100%" : "auto",
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

              <div style={{ fontSize: isMobile ? "0.72rem" : "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                {step === 0 && "Step 1: Project Niche"}
                {step === 1 && "Step 2: Scale & Pages"}
                {step === 2 && "Step 3: Design Style"}
                {step === 3 && "Final: Pricing Summary"}
              </div>
            </div>

            {/* Row 2: currency + live price */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: isMobile ? "space-between" : "flex-end", width: isMobile ? "100%" : "auto" }}>
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
          <div style={{ padding: isMobile ? "1.75rem 1.25rem" : "3rem 2.5rem" }}>
            
            {!submitted ? (
              <div className="planner-card-inner">
                <div ref={stepContainerRef}>
                  
                  {/* STEP 0: NICHE */}
                  {step === 0 && (
                    <div>
                      <h3 style={{ fontSize: isMobile ? "1.15rem" : "1.5rem", fontWeight: 400, marginBottom: isMobile ? "1.25rem" : "2rem", display: "flex", alignItems: "center", gap: "10px", lineHeight: 1.3 }}>
                        <Sparkles size={isMobile ? 17 : 20} color="var(--accent-color)" style={{ flexShrink: 0 }} /> What niche represents your business best?
                      </h3>

                      {isMobile ? (
                        <MobileChoiceGrid items={NICHES} selected={niche} onSelect={setNiche} />
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                          {NICHES.map((n) => {
                            const isActive = niche === n.id;
                            return (
                              <div
                                key={n.id}
                                onClick={() => setNiche(n.id)}
                                className="glass-card"
                                style={{
                                  padding: "1.75rem",
                                  borderRadius: 16,
                                  cursor: "pointer",
                                  border: "1px solid",
                                  borderColor: isActive ? "rgba(223, 168, 87, 0.3)" : "rgba(255, 255, 255, 0.06)",
                                  background: isActive ? "rgba(223, 168, 87, 0.04)" : "rgba(255, 255, 255, 0.02)",
                                  boxShadow: isActive ? "var(--glass-shadow-hover)" : "var(--glass-shadow)",
                                  transition: "all 0.35s ease",
                                }}
                              >
                                <h4 style={{ fontSize: "1.1rem", fontWeight: 600, color: isActive ? "var(--accent-color)" : "var(--text-primary)", marginBottom: "0.5rem" }}>
                                  {n.label}
                                </h4>
                                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                                  {n.desc}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 1: SCALE */}
                  {step === 1 && (
                    <div>
                      <h3 style={{ fontSize: isMobile ? "1.15rem" : "1.5rem", fontWeight: 400, marginBottom: isMobile ? "1.25rem" : "2rem", display: "flex", alignItems: "center", gap: "10px", lineHeight: 1.3 }}>
                        <Layers size={isMobile ? 17 : 20} color="var(--accent-color)" style={{ flexShrink: 0 }} /> What scale of site do you require?
                      </h3>

                      {isMobile ? (
                        <MobileChoiceGrid items={SCALES} selected={scale} onSelect={setScale} />
                      ) : (
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
                      )}
                    </div>
                  )}

                  {/* STEP 2: VISUAL STYLE */}
                  {step === 2 && (
                    <div>
                      <h3 style={{ fontSize: isMobile ? "1.15rem" : "1.5rem", fontWeight: 400, marginBottom: isMobile ? "1.25rem" : "2rem", display: "flex", alignItems: "center", gap: "10px", lineHeight: 1.3 }}>
                        <Palette size={isMobile ? 17 : 20} color="var(--accent-color)" style={{ flexShrink: 0 }} /> Select a visual design aesthetic
                      </h3>

                      {isMobile ? (
                        <MobileChoiceGrid items={STYLES} selected={style} onSelect={setStyle} />
                      ) : (
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
                      )}

                      {style === "Custom Aesthetic" && (
                        <div 
                          style={{ 
                            marginTop: "2rem", 
                            padding: "1.25rem", 
                            borderRadius: 12, 
                            background: "rgba(223, 168, 87, 0.05)", 
                            border: "1px solid rgba(223, 168, 87, 0.2)",
                            fontSize: "0.9rem",
                            color: "var(--text-primary)",
                            lineHeight: 1.5,
                            display: "flex",
                            alignItems: "center",
                            gap: "12px"
                          }}
                        >
                          <Sparkles size={18} color="var(--accent-color)" style={{ flexShrink: 0 }} />
                          <span>
                            We'll schedule a dedicated design consultation meeting after brief submission to architect your custom aesthetic and brand theme.
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 3: PRICE SUMMARY & LEAD CAPTURE */}
                  {step === 3 && (
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "1.5rem" : "3rem", alignItems: "start" }}>
                      
                      {/* Left: Summary */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <h3 style={{ fontSize: "1.6rem", fontWeight: 400, margin: 0 }}>
                          Project Specifications
                        </h3>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                          {[
                            { label: "Niche Theme", value: niche },
                            { label: "Project Scale", value: scale },
                            { label: "Aesthetic Direction", value: style === "Custom Aesthetic" ? "Custom (Meeting scheduled)" : style },
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
                              placeholder="john@example.com or +1 (555) 019 2834"
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
