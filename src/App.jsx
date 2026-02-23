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
    // Simulate load time, then curtain raise the preloader
    tl.to('.preloader', {
      yPercent: -100,
      duration: 1.2,
      ease: 'expo.inOut',
      delay: 0.8
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

      {/* Cinematic Preloader */}
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
          <div style={{
            width: '60px', height: '2px', background: 'rgba(255,255,255,0.1)',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, height: '100%', width: '100%',
              background: 'var(--text-primary)',
              animation: 'loaderProgress 1s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }} />
          </div>
          <style>{`
                @keyframes loaderProgress {
                    0% { transform: scaleX(0); transform-origin: left; }
                    50% { transform: scaleX(1); transform-origin: left; }
                    51% { transform: scaleX(1); transform-origin: right; }
                    100% { transform: scaleX(0); transform-origin: right; }
                }
            `}</style>
        </div>
      )}
    </>
  );
}

export default App;
