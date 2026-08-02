import React, { useState } from "react";
import { ArrowUpRight, LayoutDashboard } from "lucide-react";

const products = [
  {
    id: 1,
    title: "Flowlance",
    tag: "SaaS Dashboard",
    summary:
      "A modern client and workspace management dashboard built for freelancers and small studios. Track clients, projects, and workspaces in one clean, organized view, with secure authentication so every workspace stays private.",
    link: "https://flowlance-one.vercel.app/dashboard",
    accent: "#5b9dff",
  },
];

const Products = () => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section
      id="products"
      style={{
        padding: "clamp(3rem, 7vw, 6rem) var(--pad-x)",
        position: "relative",
        zIndex: 2,
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header, matches the editorial style used across other sections */}
        <div
          style={{
            marginBottom: "clamp(2.25rem, 5vw, 4rem)",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <div className="section-label">
            <div className="section-label-dot" />
            Products
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
            Things We've <br />
            <span className="shimmer-text" style={{ fontWeight: 700 }}>
              Built Ourselves.
            </span>
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.05rem",
              lineHeight: 1.6,
              maxWidth: 480,
              margin: 0,
            }}
          >
            Beyond client work, we build our own tools. Real products, shipped and live.
          </p>
        </div>

        {/* Product cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {products.map((product) => (
            <a
              key={product.id}
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
                padding: 0,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 10",
                  overflow: "hidden",
                  borderBottom: "1px solid var(--border-subtle)",
                  background: "linear-gradient(160deg, rgba(91,157,255,0.08) 0%, rgba(10,10,14,0.4) 70%)",
                  transform: hoveredId === product.id ? "scale(1.02)" : "scale(1)",
                  transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <svg
                  viewBox="0 0 400 250"
                  style={{ width: "100%", height: "100%", display: "block" }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="400" height="250" fill="#0c0c10" />
                  {/* Sidebar */}
                  <rect x="0" y="0" width="72" height="250" fill="#111116" />
                  <circle cx="36" cy="30" r="9" fill={product.accent} opacity="0.9" />
                  {[70, 100, 130, 160, 190].map((y, i) => (
                    <rect key={i} x="20" y={y} width="32" height="8" rx="4" fill={i === 0 ? product.accent : "#2a2a32"} opacity={i === 0 ? 0.9 : 0.6} />
                  ))}
                  {/* Top bar */}
                  <rect x="92" y="20" width="130" height="12" rx="6" fill="#e8e8ec" opacity="0.85" />
                  <rect x="92" y="40" width="80" height="8" rx="4" fill="#5a5a66" />
                  <circle cx="376" cy="28" r="14" fill="#1c1c22" stroke={product.accent} strokeWidth="1.5" opacity="0.8" />
                  {/* Stat cards */}
                  {[92, 182, 272].map((x, i) => (
                    <g key={i}>
                      <rect x={x} y="70" width="80" height="56" rx="10" fill="#151519" stroke="#242430" strokeWidth="1" />
                      <rect x={x + 12} y="84" width="36" height="6" rx="3" fill="#4a4a56" />
                      <rect x={x + 12} y="98" width="50" height="12" rx="3" fill={i === 1 ? product.accent : "#d8d8de"} opacity={i === 1 ? 0.9 : 0.8} />
                    </g>
                  ))}
                  {/* Workspace list / table */}
                  <rect x="92" y="142" width="284" height="90" rx="10" fill="#131317" stroke="#212129" strokeWidth="1" />
                  {[0, 1, 2, 3].map((i) => (
                    <g key={i} opacity={i === 3 ? 0.5 : 0.9}>
                      <rect x="108" y={160 + i * 18} width="8" height="8" rx="2" fill={product.accent} opacity="0.7" />
                      <rect x="124" y={161 + i * 18} width="120" height="6" rx="3" fill="#c4c4cc" opacity="0.7" />
                      <rect x="320" y={161 + i * 18} width="40" height="6" rx="3" fill="#3c3c46" />
                    </g>
                  ))}
                </svg>
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.4rem 0.85rem",
                    borderRadius: 999,
                    background: "rgba(10,10,14,0.65)",
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${product.accent}55`,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    color: product.accent,
                  }}
                >
                  <LayoutDashboard size={13} />
                  {product.tag}
                </div>
              </div>

              <div style={{ padding: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.6rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 600,
                      margin: 0,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {product.title}
                  </h3>
                  <ArrowUpRight
                    size={20}
                    style={{
                      color: product.accent,
                      transform: hoveredId === product.id ? "translate(3px, -3px)" : "none",
                      transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                </div>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {product.summary}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
