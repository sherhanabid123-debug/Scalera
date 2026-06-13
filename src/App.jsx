import { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

import Background3D from "./components/canvas/Background3D";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Services from "./components/sections/Services";
import ScaleraAIShowcase from "./components/sections/ScaleraAIShowcase";
import Process from "./components/sections/Process";
import Portfolio from "./components/sections/Portfolio";
import WhyScalera from "./components/sections/WhyScalera";
import Testimonials from "./components/sections/Testimonials";
import CTA from "./components/sections/CTA";
import Footer from "./components/layout/Footer";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const tl = gsap.timeline({
      onComplete: () => setLoading(false),
      delay: 0.2, // Slight delay to ensure DOM is ready
    });

    tl.to(
      ".preloader",
      {
        opacity: 0,
        duration: 0.6,
        ease: "power3.inOut",
      }
    );

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      tl.kill();
    };
  }, []);

  return (
    <>
      <Background3D />
      <div className="noise-bg" />

      <div
        className="main-content"
        style={{ position: "relative", zIndex: 1, pointerEvents: "none" }}
      >
        <Navbar
          loading={loading}
        />

        <main style={{ pointerEvents: "auto" }}>
          <Hero loading={loading} />
          <About />
          <Services />
          <ScaleraAIShowcase />
          <Process />
          <Portfolio />
          <WhyScalera />
          <Testimonials />
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
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#25D366",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(37, 211, 102, 0.4)",
            zIndex: 9999,
            pointerEvents: "auto",
            transition:
              "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <MessageCircle size={28} />
        </a>
      </div>

      {/* Cinematic Branded Preloader */}
      {loading && (
        <div
          className="preloader"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#0a0a0a",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="preloader-logo"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: 700,
              fontSize: "1.5rem",
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              pointerEvents: "none",
              opacity: 0, // Prevent visual pop before GSAP timeline runs
              filter: "blur(15px)", // Prevent visual pop before GSAP timeline runs
            }}
          >
            Scalera<span style={{ color: "var(--accent-color)" }}>.</span>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
