import React from 'react';
import { ArrowRight } from 'lucide-react';

const MiniCTA = ({ title = "Ready to build a website that gets results?", btnText = "Book a Call", link = "https://wa.me/917975242650" }) => {
    return (
        <div style={{ 
            padding: '6rem 5%', 
            background: 'var(--bg-primary)', 
            borderTop: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem'
        }}>
            <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                {title.split('?')[0]}? <span style={{ fontWeight: 600 }}>Let's Talk.</span>
            </h3>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href={link} target="_blank" rel="noopener noreferrer" className="nav-contact-btn" style={{ padding: '14px 36px', fontSize: '0.9rem' }}>
                    {btnText} <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                </a>
                <a href="#work" style={{ 
                    padding: '14px 36px', 
                    borderRadius: '50px', 
                    border: '1px solid var(--border-subtle)', 
                    color: 'var(--text-secondary)', 
                    fontSize: '0.85rem', 
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    textDecoration: 'none',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }} onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = '#fff'; }} onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-secondary)'; }}>
                    Get a Demo
                </a>
            </div>
        </div>
    );
};

export default MiniCTA;
