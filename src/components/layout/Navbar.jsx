import React, { useEffect, useState } from 'react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => (e) => {
        e.preventDefault();
        const element = document.querySelector(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav style={{
            position: 'fixed', top: 0, width: '100%', padding: scrolled ? '16px 5%' : '24px 5%',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            zIndex: 100, pointerEvents: 'auto',
            background: scrolled ? 'rgba(10, 10, 10, 0.8)' : 'transparent',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.03em', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Scalera<span style={{ color: 'var(--accent-color)' }}>.</span>
            </div>
            <div style={{ display: 'flex', gap: '2.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                <a href="#work" onClick={scrollTo('#work')} style={{ transition: 'color 0.2s', color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Work</a>
                <a href="#services" onClick={scrollTo('#services')} style={{ transition: 'color 0.2s', color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Services</a>
                <a href="#about" onClick={scrollTo('#about')} style={{ transition: 'color 0.2s', color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>About</a>
            </div>
        </nav>
    );
};

export default Navbar;
