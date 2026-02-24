import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            padding: '80px 5% 40px', borderTop: '1px solid var(--border-subtle)',
            marginTop: '120px', pointerEvents: 'auto'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '1rem' }}>Scalera.</h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '300px', marginBottom: '1.5rem' }}>
                        A digital growth and web development agency.
                    </p>
                    <a href="https://wa.me/917483537959" target="_blank" rel="noopener noreferrer" style={{
                        color: 'var(--text-primary)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        borderBottom: '1px solid var(--accent-color)', paddingBottom: '0.2rem', transition: 'color 0.2s',
                    }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}>
                        Chat on WhatsApp
                    </a>
                </div>
            </div>
            <div style={{ marginTop: '80px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                © 2026 Scalera Agency. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
