import { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageCircle } from "lucide-react";
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
      <div className="noise-bg" />

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

        {/* Floating WhatsApp Action */}
        <a
          href="https://wa.me/917975242650"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 20px 12px 16px",
            borderRadius: "100px",
            background: "rgba(6,6,8,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
            zIndex: 9999,
            pointerEvents: "auto",
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            textDecoration: "none",
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px) scale(1.03)";
            e.currentTarget.style.borderColor = "rgba(37, 211, 102, 0.4)";
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(37,211,102,0.15), inset 0 1px 0 rgba(255,255,255,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)";
          }}
        >
          <div
            style={{
              width: 32, height: 32,
              borderRadius: "50%",
              background: "#25D366",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 0 12px rgba(37,211,102,0.4)",
            }}
          >
            <MessageCircle size={16} color="#fff" />
          </div>
          Chat With Us
        </a>
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
