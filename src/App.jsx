import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { MessageCircle } from 'lucide-react';

import Background3D from './components/canvas/Background3D';
import CustomCursor from './components/ui/CustomCursor';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Services from './components/sections/Services';
import Portfolio from './components/sections/Portfolio';
import WhyScalera from './components/sections/WhyScalera';
import CTA from './components/sections/CTA';
import Footer from './components/layout/Footer';

// ... (skipping unchanged code for brevity in instruction, using exactly what was targeted)
function App() {
  const [loading, setLoading] = useState(true);

  // ... (keep useEffect as is) ...
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenis.on('scroll', gsap.ticker.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const tl = gsap.timeline();

    // Stagger in the letters of "SCALERA"
    tl.fromTo('.preloader-char',
      { y: 80, opacity: 0, rotationX: -50 },
      { y: 0, opacity: 1, rotationX: 0, duration: 1, stagger: 0.08, ease: 'expo.out', delay: 0.2 }
    )
      // Stagger out the letters
      .to('.preloader-char', {
        y: -50, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.in', delay: 0.4
      })
      // Simulate load time, then curtain raise the preloader
      .to('.preloader', {
        yPercent: -100,
        duration: 1.2,
        ease: 'expo.inOut'
      }).add(() => setLoading(false));

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      tl.kill();
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <Background3D />
      <div className="noise-bg" />

      <div className="main-content" style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
        <Navbar />

        <main style={{ pointerEvents: 'auto' }}>
          <Hero />
          <About />
          <Services />
          <Portfolio />
          <WhyScalera />
          <CTA />
        </main>

        <Footer />

        {/* Floating WhatsApp Action */}
        <a href="https://wa.me/917483537959" target="_blank" rel="noopener noreferrer" style={{
          position: 'fixed', bottom: '30px', right: '30px',
          width: '60px', height: '60px', borderRadius: '50%',
          background: '#25D366', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
          zIndex: 9999, pointerEvents: 'auto',
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
          <MessageCircle size={28} />
        </a>
      </div>

      {/* Cinematic Branded Preloader */}
      {loading && (
        <div
          className="preloader"
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: '#050505', zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <div style={{ perspective: '1000px', display: 'flex', overflow: 'hidden', padding: '10px' }}>
            {"SCALERA".split('').map((char, index) => (
              <span
                key={index}
                className="preloader-char text-gradient-accent"
                style={{
                  display: 'inline-block',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  marginRight: index === "SCALERA".length - 1 ? '0' : '0.1em'
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
