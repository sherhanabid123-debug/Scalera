import { useEffect, useState, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import { PERF_LITE } from "./utils/perf";

gsap.registerPlugin(ScrollTrigger);

import Background3D from "./components/canvas/Background3D";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Services from "./components/sections/Services";
import BriefPlanner from "./components/sections/BriefPlanner";
import Process from "./components/sections/Process";
import Portfolio from "./components/sections/Portfolio";
import WhyScalera from "./components/sections/WhyScalera";
import Testimonials from "./components/sections/Testimonials";
import CTA from "./components/sections/CTA";
import FAQ from "./components/sections/FAQ";
import Footer from "./components/layout/Footer";

function App() {
  const [loading, setLoading] = useState(true);
  const chatDockRef = useRef(null);

  // Keep the floating chat button from overlapping the footer: it stays fixed
  // at the bottom while scrolling, then docks just above the footer's top edge
  // and rides up with it — never covering the footer content.
  useEffect(() => {
    const dock = chatDockRef.current;
    if (!dock) return;
    const BASE = 30; // resting distance from viewport bottom (matches CSS)
    const GAP = 24; // breathing room to keep above the footer
    let raf = 0;

    const update = () => {
      raf = 0;
      const footer = document.querySelector("footer");
      if (!footer) return;
      const footerTop = footer.getBoundingClientRect().top;
      const bottomEdge = window.innerHeight - BASE; // button's resting bottom
      const shift = Math.max(0, bottomEdge - (footerTop - GAP));
      dock.style.transform = `translate3d(0, ${-shift}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Global smooth-scroll: any in-page anchor link (href="#section") anywhere on
  // the site scrolls smoothly to its target. Links that already handle their own
  // click (they call preventDefault) are skipped, so this never double-fires.
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const target = e.target;
      if (!target || typeof target.closest !== "function") return;
      const a = target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      if (window.lenis) {
        window.lenis.scrollTo(href, {
          duration: 1,
          easing: (t) => 1 - Math.pow(1 - t, 4),
        });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    // On weak devices, skip Lenis entirely. Its rAF loop + scroll virtualization
    // is a constant per-frame cost and native scrolling is far smoother there.
    // ScrollTrigger works fine against native scroll without any wiring.
    let lenis = null;
    let lenisTick = null;
    if (!PERF_LITE) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
      });

      window.lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      lenisTick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(lenisTick);
      gsap.ticker.lagSmoothing(0);
    }

    const tl = gsap.timeline({
      onComplete: () => setLoading(false),
    });

    tl.to(
      ".preloader",
      {
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
      }
    );

    // Failsafe: never let the preloader trap the page if RAF/GSAP stalls
    // (backgrounded tab, throttled device, reduced-motion engines, etc.)
    const failsafe = setTimeout(() => setLoading(false), 400);

    return () => {
      if (lenis) {
        lenis.destroy();
        if (lenisTick) gsap.ticker.remove(lenisTick);
        window.lenis = undefined;
      }
      tl.kill();
      clearTimeout(failsafe);
    };
  }, []);

  return (
    <>
      {/* Canvas is GPU/device-dependent — isolate it so a failure can never
          blank the whole page (aurora + solid bg still carry the look). */}
      <ErrorBoundary>
        <Background3D />
      </ErrorBoundary>
      {/* Aurora atmosphere — colored light that the glass refracts */}
      <div className="aurora" aria-hidden="true">
        <div className="aurora-blob a" />
        <div className="aurora-blob b" />
        <div className="aurora-blob c" />
        <div className="aurora-veil" />
      </div>

      <div
        className="main-content"
        style={{ position: "relative", zIndex: 1, pointerEvents: "none" }}
      >
        <Navbar
          loading={loading}
        />

        <main style={{ pointerEvents: "auto" }}>
          <Hero />
          <About />
          <Services />
          <BriefPlanner />
          <Process />
          <Portfolio />
          <WhyScalera />
          <Testimonials />
          <FAQ />
          <CTA />
        </main>

        <Footer />

        {/* Floating WhatsApp Action — fixed wrapper docks above the footer.
            Hidden on mobile (blocks content); contact is available in the nav/footer. */}
        <div
          ref={chatDockRef}
          className="chat-dock"
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            zIndex: 9999,
            pointerEvents: "none",
            willChange: "transform",
          }}
        >
          <div className="chat-widget">
            {/* Hover-revealed invite card */}
            <div className="chat-pop">
              <a
                href="https://wa.me/917975242650"
                target="_blank"
                rel="noopener noreferrer"
                className="chat-pop-card"
              >
                <div className="chat-pop-head">
                  <span className="chat-pop-avatar">
                    <MessageCircle size={17} color="#fff" />
                    <span className="chat-pop-online" />
                  </span>
                  <span className="chat-pop-meta">
                    <span className="chat-pop-name">Scalera Team</span>
                    <span className="chat-pop-status">
                      <span className="chat-pop-dot" /> Online · replies in minutes
                    </span>
                  </span>
                </div>
                <div className="chat-pop-bubble">
                  Hey there! 👋 Have a project in mind? Message us — real humans,
                  fast replies.
                  <span className="chat-typing" aria-hidden="true">
                    <i /><i /><i />
                  </span>
                </div>
                <span className="chat-pop-cta">
                  Start the conversation <ArrowUpRight size={14} />
                </span>
              </a>
            </div>

            {/* The FAB trigger */}
            <a
              href="https://wa.me/917975242650"
              target="_blank"
              rel="noopener noreferrer"
              className="chat-fab"
              aria-label="Chat with us on WhatsApp"
            >
              <span className="chat-fab-icon">
                <MessageCircle size={17} color="#fff" />
              </span>
              <span className="chat-fab-label">Chat With Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Cinematic Branded Preloader */}
      {loading && (
        <div
          className="preloader"
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100vw", height: "100vh",
            backgroundColor: "#060608",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Ambient glow orb */}
          <div
            style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600, height: 600,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(220,180,128,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            className="preloader-logo"
            style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: 800,
              fontSize: "2rem",
              letterSpacing: "-0.04em",
              color: "var(--text-primary)",
              fontFamily: "var(--font-display)",
              pointerEvents: "none",
              opacity: 0,
              filter: "blur(15px)",
            }}
          >
            Scalera<span style={{ color: "var(--accent-color)", textShadow: "0 0 20px rgba(220,180,128,0.5)" }}>.</span>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
