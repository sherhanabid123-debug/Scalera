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

  useEffect(() => {
    // On weak devices, skip Lenis entirely. Its rAF loop + scroll virtualization
    // is a constant per-frame cost and native scrolling is far smoother there.
    // ScrollTrigger works fine against native scroll without any wiring.
    let lenis = null;
    let lenisTick = null;
    if (!PERF_LITE) {
      lenis = new Lenis({
        duration: 1.8,
        easing: (t) => 1 - Math.pow(1 - t, 5),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        mouseMultiplier: 0.8,
        smoothTouch: true,
        touchMultiplier: 1.6,
        infinite: false,
      });
      window.lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      lenisTick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(lenisTick);
      gsap.ticker.lagSmoothing(0);
    }

    // The preloader uses flexbox centering (no translate needed).
    // GSAP just needs to manage opacity and scale.
    gsap.set(".preloader-logo", { scale: 2.2, opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => setLoading(false),
    });

    // 1. Fade in the logo "Scalera." at the center of the screen
    tl.to(
      ".preloader-logo",
      {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      }
    );

    // 2. Flight: Logo flies to navbar
    // Pre-compute target coordinates BEFORE animating so we don't reset mid-flight
    tl.to(
      ".preloader-logo",
      {
        x: () => {
          const targetEl = document.getElementById("navbar-logo-target");
          const logoEl = document.querySelector(".preloader-logo");
          if (targetEl && logoEl) {
            const targetRect = targetEl.getBoundingClientRect();
            const logoRect = logoEl.getBoundingClientRect();
            return (targetRect.left + targetRect.width / 2) - (logoRect.left + logoRect.width / 2);
          }
          return 0;
        },
        y: () => {
          const targetEl = document.getElementById("navbar-logo-target");
          const logoEl = document.querySelector(".preloader-logo");
          if (targetEl && logoEl) {
            const targetRect = targetEl.getBoundingClientRect();
            const logoRect = logoEl.getBoundingClientRect();
            return (targetRect.top + targetRect.height / 2) - (logoRect.top + logoRect.height / 2);
          }
          return 0;
        },
        scale: 1.25,
        duration: 1.05,
        ease: "power4.inOut",
      },
      "+=0.25"
    )
    .to(
      ".preloader",
      {
        backgroundColor: "rgba(6, 6, 8, 0)",
        duration: 0.95,
        ease: "power2.inOut",
      },
      "<"
    )
    // Landing squash impact (triggers wave and UI bounce)
    .to(
      ".preloader-logo",
      {
        scale: 0.85,
        duration: 0.12,
        ease: "power2.out",
        onComplete: () => {
          const targetEl = document.getElementById("navbar-logo-target");
          if (targetEl) {
            const rect = targetEl.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            // Concentric borderless glass waves (liquid glass)
            const spawnWave = (delay, scale, blur, opacity) => {
              const wave = document.createElement("div");
              Object.assign(wave.style, {
                position: "fixed",
                left: `${x}px`,
                top: `${y}px`,
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.005) 60%, transparent 80%)",
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                boxShadow: "inset 0 0 50px rgba(255,255,255,0.06), 0 0 30px rgba(255,255,255,0.02)",
                transform: "translate(-50%, -50%) scale(0)",
                pointerEvents: "none",
                zIndex: 95,
                opacity: opacity,
              });
              document.body.appendChild(wave);

              gsap.to(wave, {
                scale: scale,
                opacity: 0,
                duration: 2.2,
                delay: delay,
                ease: "power3.out",
                onComplete: () => wave.remove(),
              });
            };

            spawnWave(0, 18, 5, 0.7);
            spawnWave(0.18, 24, 2.5, 0.4);

            // Liquid UI Displacement
            gsap.to(".desktop-menu:first-of-type > *", {
              x: -20,
              duration: 0.15,
              ease: "power2.out",
              onComplete: () => {
                gsap.to(".desktop-menu:first-of-type > *", {
                  x: 0,
                  duration: 1.4,
                  ease: "elastic.out(1, 0.85)",
                });
              }
            });

            gsap.to(".desktop-menu:last-of-type > *", {
              x: 20,
              duration: 0.15,
              ease: "power2.out",
              onComplete: () => {
                gsap.to(".desktop-menu:last-of-type > *", {
                  x: 0,
                  duration: 1.4,
                  ease: "elastic.out(1, 0.85)",
                });
              }
            });

            gsap.to(".mobile-toggle", {
              x: 20,
              duration: 0.15,
              ease: "power2.out",
              onComplete: () => {
                gsap.to(".mobile-toggle", {
                  x: 0,
                  duration: 1.4,
                  ease: "elastic.out(1, 0.85)",
                });
              }
            });

            gsap.to(".hero-content", {
              y: 20,
              duration: 0.2,
              ease: "power2.out",
              onComplete: () => {
                gsap.to(".hero-content", {
                  y: 0,
                  duration: 1.6,
                  ease: "elastic.out(1, 0.85)",
                });
              }
            });
          }
        }
      }
    )
    // Settle back to natural size
    .to(
      ".preloader-logo",
      {
        scale: 1.0,
        duration: 0.35,
        ease: "power2.out",
      }
    );

    // Failsafe: never let the preloader trap the page if RAF/GSAP stalls
    const failsafe = setTimeout(() => setLoading(false), 6000);

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

        {/* Floating WhatsApp Action — fixed wrapper docks above the footer */}
        <div
          ref={chatDockRef}
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
              fontWeight: 800,
              fontSize: "1.5rem",
              letterSpacing: "-0.04em",
              color: "var(--text-primary)",
              fontFamily: "var(--font-display)",
              pointerEvents: "none",
              display: "flex",
              alignItems: "baseline",
              opacity: 0,
              transform: "scale(2.2)",
              willChange: "transform, opacity",
            }}
          >
            <span>Scalera</span>
            <span
              style={{
                color: "var(--accent-color)",
                textShadow: "0 0 20px rgba(220,180,128,0.5)",
              }}
            >
              .
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
