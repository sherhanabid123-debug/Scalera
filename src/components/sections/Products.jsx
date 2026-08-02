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
    img: "/assets/flowlance-preview.jpg",
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
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 520px))",
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
                maxWidth: 520,
                width: "100%",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  overflow: "hidden",
                  borderBottom: "1px solid var(--border-subtle)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <img
                  src={product.img}
                  alt={`${product.title} landing page preview`}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top",
                    transform: hoveredId === product.id ? "scale(1.04)" : "scale(1)",
                    transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.35rem 0.75rem",
                    borderRadius: 999,
                    background: "rgba(10,10,14,0.65)",
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${product.accent}55`,
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    color: product.accent,
                  }}
                >
                  <LayoutDashboard size={12} />
                  {product.tag}
                </div>
              </div>

              <div style={{ padding: "1.25rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      margin: 0,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {product.title}
                  </h3>
                  <ArrowUpRight
                    size={18}
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
                    fontSize: "0.88rem",
                    lineHeight: 1.55,
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
