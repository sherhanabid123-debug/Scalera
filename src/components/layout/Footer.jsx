import React from "react";
import { MessageCircle, Mail, Linkedin, Instagram, ArrowUpRight, ArrowUp } from "lucide-react";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Project Planner", href: "#estimator" },
];

const socials = [
  { label: "WhatsApp", href: "https://wa.me/917975242650", Icon: MessageCircle, color: "#25D366" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/scaleraofficial", Icon: Linkedin, color: "#0A66C2" },
  { label: "Instagram", href: "https://www.instagram.com/scalera.studio", Icon: Instagram, color: "#E4405F" },
  { label: "Email", href: "mailto:contact.scalerastudio@gmail.com", Icon: Mail, color: "#dfa857" },
];

const Footer = () => {
  const scrollTop = () => {
    if (window.lenis) window.lenis.scrollTo(0, { duration: 1 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNav = (href) => (e) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (!el) return;
    if (window.lenis) {
      window.lenis.scrollTo(href, { duration: 1, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-accent-line" />
      <div className="footer-glow" />

      <div className="footer-inner">
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              Scalera<span>.</span>
            </div>
            <p className="footer-tagline">
              A digital creative studio engineering high-performance presence for
              ambitious brands.
            </p>

            <div className="footer-socials">
              {socials.map(({ label, href, Icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social"
                  style={{ "--brand": color }}
                  aria-label={label}
                >
                  <Icon size={17} strokeWidth={1.7} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <h3 className="footer-col-title">Navigation</h3>
            <ul className="footer-list">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} onClick={handleNav(l.href)} className="footer-link">
                    <span className="footer-link-arrow">
                      <ArrowUpRight size={14} strokeWidth={2} />
                    </span>
                    <span>{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div className="footer-col">
            <h3 className="footer-col-title">Get in Touch</h3>
            <a href="mailto:contact.scalerastudio@gmail.com" className="footer-contact">
              contact.scalerastudio@gmail.com
            </a>
            <a
              href="https://wa.me/917975242650"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-contact"
            >
              +91 79752 42650
            </a>
            <div className="footer-avail">
              <span className="footer-avail-dot" />
              Available for new projects
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span className="footer-copy">
            © {new Date().getFullYear()} Scalera Studio — Crafted with precision.
          </span>
          <button className="footer-top-btn" onClick={scrollTop}>
            Back to top
            <span className="footer-top-icon">
              <ArrowUp size={14} strokeWidth={2} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
