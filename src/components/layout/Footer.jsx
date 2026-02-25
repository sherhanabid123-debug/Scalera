import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            padding: '8rem 5% 4rem',
            borderTop: '1px solid var(--border-subtle)',
            pointerEvents: 'auto',
            background: 'var(--bg-primary)'
        }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '8rem' }}>
                {/* Brand Column */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '12px', height: '12px', background: 'var(--accent-color)', borderRadius: '50%' }} />
                        SCALERA
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '280px' }}>
                        A digital creative studio engineering high-performance presence for ambitious brands.
                    </p>
                </div>

                {/* Navigation Column */}
                <div>
                    <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-primary)', marginBottom: '2rem' }}>Navigation</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {['Work', 'Services', 'Approach', 'Contact'].map((item) => (
                            <li key={item}>
                                <a href={`#${item.toLowerCase()}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color = 'var(--text-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Social/Contact Column */}
                <div>
                    <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-primary)', marginBottom: '2rem' }}>Connect</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li>
                            <a href="https://wa.me/917483537959" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color = 'var(--text-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
                                WhatsApp
                            </a>
                        </li>
                        <li>
                            <a href="mailto:hello@scalera.inc" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color = 'var(--text-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
                                Email Us
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                    © {new Date().getFullYear()} SCALERA STUDIO
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                    ALL RIGHTS RESERVED
                </div>
            </div>
        </footer>
    );
};

export default Footer;
