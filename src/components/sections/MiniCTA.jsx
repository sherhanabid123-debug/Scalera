import React from 'react';
import { ArrowRight } from 'lucide-react';

const MiniCTA = ({ title = "Ready to build your high-conversion website?", btnText = "Book a Call", link = "https://wa.me/917975242650" }) => {
    return (
        <div style={{ 
            padding: '4rem 5%', 
            background: 'rgba(34, 211, 238, 0.03)', 
            borderTop: '1px solid rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem'
        }}>
            <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
                {title}
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href={link} target="_blank" rel="noopener noreferrer" className="nav-contact-btn" style={{ padding: '12px 32px', fontSize: '0.9rem' }}>
                    {btnText} <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                </a>
                <a href="#work" style={{ 
                    padding: '12px 32px', 
                    borderRadius: '50px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    color: '#fff', 
                    fontSize: '0.9rem', 
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.3s'
                }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                    Get a Demo
                </a>
            </div>
        </div>
    );
};

export default MiniCTA;
