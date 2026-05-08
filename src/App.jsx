import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

import Background3D from './components/canvas/Background3D';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Services from './components/sections/Services';
import ScaleraAIShowcase from './components/sections/ScaleraAIShowcase';
import Process from './components/sections/Process';
import Portfolio from './components/sections/Portfolio';
import WhyScalera from './components/sections/WhyScalera';
import Testimonials from './components/sections/Testimonials';
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

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const tl = gsap.timeline({
      onComplete: () => setLoading(false)
    });

    // Rockstar-style cinematic intro
    tl.fromTo('.preloader-logo',
      { 
        scale: 2.5, 
        opacity: 0, 
        filter: 'blur(20px)' 
      },
      { 
        scale: 1.5, 
        opacity: 1, 
        filter: 'blur(0px)', 
        duration: 1.2, 
        ease: 'expo.out' 
      }
    )
    .to('.preloader-logo', {
      scale: 1.2,
      duration: 2,
      ease: 'linear'
    }, '-=0.5')
    .to('.preloader-logo', {
      top: '32px',
      left: '5%',
      xPercent: 0,
      yPercent: 0,
      scale: 1,
      opacity: 0, // Fade out as it overlaps
      duration: 1,
      ease: 'expo.inOut'
    })
    .to('.preloader', {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut'
    }, '-=0.5');

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

      <div className="main-content" style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
        <Navbar />

        <main style={{ pointerEvents: 'auto' }}>
          <Hero />
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
        <a href="https://wa.me/917975242650" target="_blank" rel="noopener noreferrer" style={{
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
            backgroundColor: '#0a0a0a', zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <div 
            className="preloader-logo"
            style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontWeight: 700, 
                fontSize: '1.5rem', 
                letterSpacing: '-0.03em', 
                color: 'var(--text-primary)',
                pointerEvents: 'none'
            }}
          >
            Scalera<span style={{ color: 'var(--accent-color)' }}>.</span>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
