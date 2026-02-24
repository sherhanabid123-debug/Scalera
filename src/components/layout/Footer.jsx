import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            padding: '80px 5% 40px', background: '#1d1d1f', color: '#ffffff',
            marginTop: '0px', pointerEvents: 'auto'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '1rem' }}>Scalera.</h2>
                    <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '300px', marginBottom: '1.5rem' }}>
                        A digital growth and web development agency.
                    </p>
                    <a href="https://wa.me/917483537959" target="_blank" rel="noopener noreferrer" style={{
                        color: '#ffffff', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        borderBottom: '1px solid rgba(255,255,255,0.4)', paddingBottom: '0.2rem', transition: 'color 0.2s',
                    }} onMouseEnter={(e) => e.target.style.color = '#a3a3a3'} onMouseLeave={(e) => e.target.style.color = '#ffffff'}>
                        Chat on WhatsApp
                    </a>
                </div>
            </div>
            <div style={{ marginTop: '80px', color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
                © 2026 Scalera Agency. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
