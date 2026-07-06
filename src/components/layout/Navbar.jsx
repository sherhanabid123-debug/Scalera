import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { Sparkles, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  {
    label: "About",
    href: "#about",
    children: [
      { label: "Our Studio", href: "#about", desc: "Who we are" },
      { label: "Our Process", href: "#process", desc: "How we work" },
      { label: "Why Scalera", href: "#why", desc: "What sets us apart" },
      { label: "Testimonials", href: "#testimonials", desc: "Client results" },
      { label: "FAQ", href: "#faq", desc: "Common questions" },
    ],
  },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
];

const Navbar = ({ loading }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const menuRef = useRef(null);
  const linksRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    if (loading) return;
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".desktop-menu > *",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: "expo.out", delay: 0.05 },
      );
      gsap.fromTo(
        ".mobile-toggle",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "expo.out", delay: 0.05 },
      );
    });
    return () => ctx.revert();
  }, [loading]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.to(menuRef.current, { x: 0, duration: 0.8, ease: "expo.out" });
      gsap.fromTo(
        linksRef.current.filter(Boolean),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "expo.out", delay: 0.2 },
      );
    } else {
      document.body.style.overflow = "auto";
      gsap.to(menuRef.current, { x: "100%", duration: 0.6, ease: "expo.in" });
      setMobileAboutOpen(false);
    }
  }, [isOpen]);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const wasOpen = isOpen;
    setIsOpen(false);
    
    const triggerScroll = () => {
      if (window.lenis) {
        window.lenis.scrollTo(id, { duration: 0.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
      } else {
        const el = document.querySelector(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    };

    if (wasOpen) {
      setTimeout(triggerScroll, 300);
    } else {
      triggerScroll();
    }
  };

  return (
    <>
      <nav
        className={scrolled ? "glass-nav" : ""}
        style={{
          position: "fixed",
          top: scrolled ? 20 : 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: scrolled ? "calc(100% - 40px)" : "100%",
          maxWidth: scrolled ? "940px" : "100%",
          padding: scrolled ? "12px 28px" : "32px 5%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 110,
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          background: !scrolled ? "transparent" : undefined,
          pointerEvents: "auto",
        }}
      >
        {/* Left nav links */}
        <div
          className="desktop-menu"
          style={{
            display: "flex",
            alignItems: "center",
            gap: scrolled ? "1.75rem" : "2.5rem",
            fontSize: scrolled ? "0.82rem" : "0.92rem",
            fontWeight: 500,
            transition: "all 0.4s ease",
            flex: 1,
          }}
        >
          {NAV_LINKS.map((link) =>
            link.children ? (
              <div className="nav-dropdown" key={link.label}>
                <a
                  className="nav-desktop-link nav-dropdown-trigger"
                  href={link.href}
                  onClick={scrollTo(link.href)}
                >
                  {link.label}
                  <ChevronDown size={13} className="nav-dropdown-caret" />
                </a>
                <div className="nav-dropdown-menu">
                  <div className="nav-dropdown-inner">
                    {link.children.map((child) => (
                      <a
                        key={child.label}
                        className="nav-dropdown-item"
                        href={child.href}
                        onClick={scrollTo(child.href)}
                      >
                        <span className="nav-dropdown-item-dot" />
                        <span className="nav-dropdown-item-text">
                          <span className="nav-dropdown-item-label">
                            {child.label}
                          </span>
                          <span className="nav-dropdown-item-desc">
                            {child.desc}
                          </span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={link.label}
                className="nav-desktop-link"
                href={link.href}
                onClick={scrollTo(link.href)}
              >
                {link.label}
              </a>
            ),
          )}
        </div>

        {/* Mobile placeholder */}
        <div className="mobile-nav-placeholder" style={{ display: "none", flex: 1 }} />

        {/* Center logo */}
        <div
          id="navbar-logo-target"
          style={{
            fontWeight: 800,
            fontSize: scrolled ? "1.3rem" : "1.5rem",
            letterSpacing: "-0.04em",
            cursor: "pointer",
            zIndex: 102,
            flex: 1,
            display: "flex",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            transition: "font-size 0.4s ease",
          }}
          onClick={() => {
            if (isOpen) setIsOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Scalera
          <span
            style={{
              color: "var(--accent-color)",
              textShadow: "0 0 20px rgba(220,180,128,0.5)",
            }}
          >
            .
          </span>
        </div>

        {/* Right: CTA */}
        <div
          className="desktop-menu"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              if (window.lenis) {
                window.lenis.scrollTo('#estimator', { duration: 0.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
              } else {
                const el = document.querySelector('#estimator');
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="btn-glass"
            style={{
              color: "#ffffff",
              background: "rgba(223, 168, 87, 0.12)",
              border: "1px solid rgba(223, 168, 87, 0.35)",
              padding: scrolled ? "7px 18px" : "9px 20px",
              borderRadius: "100px",
              fontWeight: 700,
              fontSize: scrolled ? "0.78rem" : "0.86rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 16px rgba(223, 168, 87, 0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
              e.currentTarget.style.background = "rgba(223, 168, 87, 0.25)";
              e.currentTarget.style.borderColor = "var(--accent-color)";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(223, 168, 87, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.background = "rgba(223, 168, 87, 0.12)";
              e.currentTarget.style.borderColor = "rgba(223, 168, 87, 0.35)";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(223,168,87,0.1), inset 0 1px 0 rgba(255,255,255,0.15)";
            }}
          >
            <Sparkles size={13} />
            Start Project
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            zIndex: 102,
            display: "none",
            flexDirection: "column",
            gap: "5px",
            padding: "10px",
            flex: 1,
            alignItems: "flex-end",
            background: "none",
            border: "none",
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: i === 1 ? "16px" : "24px",
                height: "1.5px",
                background: "var(--text-primary)",
                borderRadius: 2,
                transition: "0.4s cubic-bezier(0.16,1,0.3,1)",
                transform:
                  isOpen && i === 0 ? "rotate(45deg) translate(4.5px, 4.5px)"
                  : isOpen && i === 2 ? "rotate(-45deg) translate(4.5px, -4.5px)"
                  : "none",
                opacity: isOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        ref={menuRef}
        style={{
          position: "fixed",
          top: 0, right: 0,
          width: "100%",
          height: "100dvh",
          background: "rgba(6,6,8,0.98)",
          backdropFilter: "blur(40px)",
          zIndex: 101,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: "translateX(100%)",
          borderLeft: "1px solid var(--border-glass)",
          pointerEvents: "auto",
          overflowY: "auto",
        }}
      >
        {/* Inner wrapper: centers when short, scrolls when tall (e.g. About expanded) */}
        <div
          style={{
            margin: "auto 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2.25rem",
            padding: "6rem 1.5rem",
            width: "100%",
          }}
        >
        {NAV_LINKS.map((link, i) =>
          link.children ? (
            <div
              key={link.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: mobileAboutOpen ? "1.5rem" : "0rem",
                transition: "gap 0.4s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <button
                ref={(el) => (linksRef.current[i] = el)}
                onClick={() => setMobileAboutOpen((v) => !v)}
                className="mobile-nav-link"
                style={{
                  fontSize: "3rem",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-display)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                }}
              >
                {link.label}
                <ChevronDown
                  size={26}
                  style={{
                    opacity: 0.7,
                    transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
                    transform: mobileAboutOpen ? "rotate(180deg)" : "none",
                  }}
                />
              </button>
              {mobileAboutOpen && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1.1rem",
                    animation: "fadeSlideUp 0.4s ease",
                  }}
                >
                  {link.children.map((child) => (
                    <a
                      key={child.label}
                      href={child.href}
                      onClick={scrollTo(child.href)}
                      className="mobile-nav-link"
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <a
              key={link.label}
              ref={(el) => (linksRef.current[i] = el)}
              href={link.href}
              onClick={scrollTo(link.href)}
              className="mobile-nav-link"
              style={{
                fontSize: "3rem",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                fontFamily: "var(--font-display)",
              }}
            >
              {link.label}
            </a>
          ),
        )}
        <button
          ref={(el) => (linksRef.current[3] = el)}
          onClick={() => {
            setIsOpen(false);
            if (window.lenis) {
              setTimeout(() => window.lenis.scrollTo('#estimator', { duration: 0.8, easing: (t) => 1 - Math.pow(1 - t, 4) }), 300);
            } else {
              const el = document.querySelector('#estimator');
              if (el) {
                setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 300);
              }
            }
          }}
          className="mobile-nav-link btn-glass"
          style={{
            fontSize: "1.6rem",
            fontWeight: 700,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            color: "#ffffff",
            background: "rgba(223, 168, 87, 0.12)",
            padding: "14px 34px",
            borderRadius: "99px",
            boxShadow: "0 4px 16px rgba(223, 168, 87, 0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
            marginTop: "1.5rem",
            cursor: "pointer",
            border: "1px solid rgba(223, 168, 87, 0.35)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontFamily: "inherit",
          }}
        >
          <Sparkles size={24} />
          Start Project
        </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
