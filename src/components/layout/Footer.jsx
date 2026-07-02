import React from "react";
import { ArrowUpRight } from "lucide-react";

const links = {
  Navigation: [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "Project Planner", href: "#estimator" },
  ],
  Connect: [
    { label: "WhatsApp", href: "https://wa.me/917975242650", external: true },
    { label: "Email Us", href: "mailto:contact.scalerastudio@gmail.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/scaleraofficial", external: true },
    { label: "Instagram", href: "https://www.instagram.com/scalera.studio", external: true },
  ],
};

const Footer = () => {
  return (
    <footer
      style={{
        padding: "6rem 5% 3rem",
        borderTop: "1px solid var(--border-subtle)",
        background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0, left: "50%",
          transform: "translateX(-50%)",
          width: 800, height: 400,
          background: "radial-gradient(ellipse, rgba(220,180,128,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Main footer grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "4rem",
            marginBottom: "5rem",
          }}
        >
          {/* Brand column */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  width: 10, height: 10,
                  background: "var(--accent-color)",
                  borderRadius: "50%",
                  boxShadow: "0 0 12px var(--accent-color)",
                }}
              />
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  fontFamily: "var(--font-display)",
                }}
              >
                SCALERA
              </span>
            </div>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                maxWidth: 260,
              }}
            >
              A digital creative studio engineering high-performance presence for
              ambitious brands.
            </p>

            {/* Mini glass badge */}
            <div
              style={{
                marginTop: "1.5rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "5px 12px",
                borderRadius: "100px",
                border: "1px solid rgba(220,180,128,0.2)",
                background: "rgba(220,180,128,0.05)",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent-color)",
              }}
            >
              Est. 2024
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h3
                style={{
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "1.75rem",
                  fontWeight: 600,
                }}
              >
                {group}
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.9rem",
                }}
              >
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : "_self"}
                      rel={item.external ? "noopener noreferrer" : ""}
                      style={{
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                        fontSize: "0.92rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--text-primary)";
                        e.currentTarget.style.paddingLeft = "4px";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--text-secondary)";
                        e.currentTarget.style.paddingLeft = "0";
                      }}
                    >
                      {item.label}
                      {item.external && (
                        <ArrowUpRight size={11} strokeWidth={1.5} style={{ opacity: 0.5 }} />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <div
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.78rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            © {new Date().getFullYear()} Scalera Studio
          </div>
          <div
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.78rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
