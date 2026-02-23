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
        <nav className={scrolled ? 'glass-nav' : ''} style={{
            position: 'fixed', top: 0, width: '100%', padding: scrolled ? '16px 5%' : '32px 5%',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            zIndex: 100, pointerEvents: 'auto',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            background: !scrolled ? 'transparent' : undefined,
        }}>
            <div style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.03em', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Scalera<span style={{ color: 'var(--accent-color)' }}>.</span>
            </div>
            <div style={{ display: 'flex', gap: '2.5rem', fontSize: '0.95rem', fontWeight: 500 }}>
                <a href="#work" onClick={scrollTo('#work')} style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', color: 'var(--text-secondary)', display: 'inline-block' }} onMouseEnter={(e) => { e.target.style.color = 'var(--text-primary)'; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; e.target.style.transform = 'translateY(0)'; }}>Work</a>
                <a href="#services" onClick={scrollTo('#services')} style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', color: 'var(--text-secondary)', display: 'inline-block' }} onMouseEnter={(e) => { e.target.style.color = 'var(--text-primary)'; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; e.target.style.transform = 'translateY(0)'; }}>Services</a>
                <a href="#about" onClick={scrollTo('#about')} style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', color: 'var(--text-secondary)', display: 'inline-block' }} onMouseEnter={(e) => { e.target.style.color = 'var(--text-primary)'; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; e.target.style.transform = 'translateY(0)'; }}>About</a>
            </div>
        </nav>
    );
};

export default Navbar;
