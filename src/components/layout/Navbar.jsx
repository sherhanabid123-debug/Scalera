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
                position: 'fixed', 
                top: scrolled ? '20px' : 0, 
                left: '50%',
                transform: 'translateX(-50%)',
                width: scrolled ? 'calc(100% - 40px)' : '100%',
                maxWidth: scrolled ? '800px' : '100%',
                padding: scrolled ? '12px 32px' : '32px 5%',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                zIndex: 110, pointerEvents: 'auto',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                background: !scrolled ? 'transparent' : undefined,
            }}>
                <div
                    style={{ 
                        fontWeight: 300, 
                        fontSize: '1.25rem', 
                        letterSpacing: '0.1em', 
                        cursor: 'pointer', 
                        zIndex: 102,
                        textTransform: 'uppercase',
                        color: '#fff'
                    }}
                    onClick={() => {
                        if (isOpen) setIsOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    Scalera<span style={{ color: 'var(--accent-color)' }}>.</span>
                </div>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '3rem', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    <a href="#about" onClick={scrollTo('#about')} style={{ transition: 'color 0.4s ease', color: 'var(--text-secondary)' }} onMouseEnter={(e) => { e.target.style.color = '#fff'; }} onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; }}>About</a>
                    <a href="#services" onClick={scrollTo('#services')} style={{ transition: 'color 0.4s ease', color: 'var(--text-secondary)' }} onMouseEnter={(e) => { e.target.style.color = '#fff'; }} onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; }}>Services</a>
                    <a href="#work" onClick={scrollTo('#work')} style={{ transition: 'color 0.4s ease', color: 'var(--text-secondary)' }} onMouseEnter={(e) => { e.target.style.color = '#fff'; }} onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; }}>Work</a>
                    <a href="#products" onClick={scrollTo('#products')} style={{ transition: 'color 0.4s ease', color: 'var(--text-secondary)' }} onMouseEnter={(e) => { e.target.style.color = '#fff'; }} onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; }}>Products</a>
                    <a href="https://wa.me/917975242650" target="_blank" rel="noopener noreferrer" className="nav-contact-btn">
                        Let's Talk
                    </a>
                </div>

                {/* Hamburger Toggle */}
                <button
                    className="mobile-toggle"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        zIndex: 102,
                        display: 'none',
                        flexDirection: 'column',
                        gap: '8px',
                        padding: '10px'
                    }}
                >
                    <span style={{
                        width: '28px', height: '1px', background: '#fff',
                        transition: '0.4s', transform: isOpen ? 'rotate(45deg) translate(6px, 6px)' : 'none'
                    }} />
                    <span style={{
                        width: '28px', height: '1px', background: '#fff',
                        opacity: isOpen ? 0 : 1, transition: '0.2s'
                    }} />
                    <span style={{
                        width: '28px', height: '1px', background: '#fff',
                        transition: '0.4s', transform: isOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'none'
                    }} />
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                ref={menuRef}
                style={{
                    position: 'fixed', top: 0, right: 0, width: '100%', height: '100dvh',
                    background: 'rgba(10, 10, 10, 0.99)', backdropFilter: 'blur(30px)',
                    zIndex: 101, display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'center', gap: '2.5rem',
                    transform: 'translateX(100%)', pointerEvents: 'auto'
                }}
            >
                <a
                    ref={el => linksRef.current[0] = el}
                    href="#about"
                    onClick={scrollTo('#about')}
                    className="mobile-nav-link"
                    style={{ fontSize: '2.5rem', fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                    About
                </a>
                <a
                    ref={el => linksRef.current[1] = el}
                    href="#services"
                    onClick={scrollTo('#services')}
                    className="mobile-nav-link"
                    style={{ fontSize: '2.5rem', fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                    Services
                </a>
                <a
                    ref={el => linksRef.current[2] = el}
                    href="#work"
                    onClick={scrollTo('#work')}
                    className="mobile-nav-link"
                    style={{ fontSize: '2.5rem', fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                    Work
                </a>
                <a
                    ref={el => linksRef.current[3] = el}
                    href="#products"
                    onClick={scrollTo('#products')}
                    className="mobile-nav-link"
                    style={{ fontSize: '2.5rem', fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                    Products
                </a>
                <a
                    ref={el => linksRef.current[4] = el}
                    href="https://wa.me/917975242650"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-contact-btn"
                    style={{ marginTop: '2rem', fontSize: '1.2rem', padding: '16px 40px' }}
                >
                    Let's Talk
                </a>
            </div>
        </>
    );
};

export default Navbar;
