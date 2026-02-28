import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const linksRef = useRef([]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            gsap.to(menuRef.current, {
                x: 0,
                duration: 0.8,
                ease: "expo.out"
            });
            gsap.fromTo(linksRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "expo.out", delay: 0.2 }
            );
        } else {
            document.body.style.overflow = 'auto';
            gsap.to(menuRef.current, {
                x: '100%',
                duration: 0.6,
                ease: "expo.in"
            });
        }
    }, [isOpen]);

    const scrollTo = (id) => (e) => {
        e.preventDefault();
        setIsOpen(false);
        const element = document.querySelector(id);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    };

    return (
        <>
            <nav className={scrolled ? 'glass-nav' : ''} style={{
                position: 'fixed', top: 0, width: '100%', padding: scrolled ? '16px 5%' : '32px 5%',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                zIndex: 110, pointerEvents: 'auto',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                background: !scrolled ? 'transparent' : undefined,
            }}>
                <div
                    style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.03em', cursor: 'pointer', zIndex: 102 }}
                    onClick={() => {
                        if (isOpen) setIsOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    Scalera<span style={{ color: 'var(--accent-color)' }}>.</span>
                </div>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'flex', gap: '2.5rem', fontSize: '0.95rem', fontWeight: 500 }}>
                    <a href="#work" onClick={scrollTo('#work')} style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', color: 'var(--text-secondary)', display: 'inline-block' }} onMouseEnter={(e) => { e.target.style.color = 'var(--text-primary)'; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; e.target.style.transform = 'translateY(0)'; }}>Work</a>
                    <a href="#services" onClick={scrollTo('#services')} style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', color: 'var(--text-secondary)', display: 'inline-block' }} onMouseEnter={(e) => { e.target.style.color = 'var(--text-primary)'; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; e.target.style.transform = 'translateY(0)'; }}>Services</a>
                    <a href="#about" onClick={scrollTo('#about')} style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', color: 'var(--text-secondary)', display: 'inline-block' }} onMouseEnter={(e) => { e.target.style.color = 'var(--text-primary)'; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; e.target.style.transform = 'translateY(0)'; }}>About</a>
                </div>

                {/* Hamburger Toggle */}
                <button
                    className="mobile-toggle"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        zIndex: 102,
                        display: 'none',
                        flexDirection: 'column',
                        gap: '6px',
                        padding: '10px'
                    }}
                >
                    <span style={{
                        width: '24px', height: '2px', background: 'var(--text-primary)',
                        transition: '0.4s', transform: isOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none'
                    }} />
                    <span style={{
                        width: '24px', height: '2px', background: 'var(--text-primary)',
                        opacity: isOpen ? 0 : 1, transition: '0.2s'
                    }} />
                    <span style={{
                        width: '24px', height: '2px', background: 'var(--text-primary)',
                        transition: '0.4s', transform: isOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none'
                    }} />
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                ref={menuRef}
                style={{
                    position: 'fixed', top: 0, right: 0, width: '100%', height: '100dvh',
                    background: 'rgba(10, 10, 10, 0.98)', backdropFilter: 'blur(20px)',
                    zIndex: 101, display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'center', gap: '3rem',
                    transform: 'translateX(100%)'
                }}
            >
                <a
                    ref={el => linksRef.current[0] = el}
                    href="#work"
                    onClick={scrollTo('#work')}
                    className="mobile-nav-link"
                    style={{ fontSize: '3rem', fontWeight: 600, letterSpacing: '-0.02em', textTransform: 'uppercase' }}
                >
                    Work
                </a>
                <a
                    ref={el => linksRef.current[1] = el}
                    href="#services"
                    onClick={scrollTo('#services')}
                    className="mobile-nav-link"
                    style={{ fontSize: '3rem', fontWeight: 600, letterSpacing: '-0.02em', textTransform: 'uppercase' }}
                >
                    Services
                </a>
                <a
                    ref={el => linksRef.current[2] = el}
                    href="#about"
                    onClick={scrollTo('#about')}
                    className="mobile-nav-link"
                    style={{ fontSize: '3rem', fontWeight: 600, letterSpacing: '-0.02em', textTransform: 'uppercase' }}
                >
                    About
                </a>
            </div>
        </>
    );
};

export default Navbar;
