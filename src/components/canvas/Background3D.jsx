import React from 'react';

const Background3D = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 0,
            pointerEvents: 'none',
            background: 'var(--bg-primary)',
            overflow: 'hidden'
        }}>
            {/* Elegant slow-moving mesh gradient / aura */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle at 30% 70%, rgba(220,180,128,0.02) 0%, transparent 40%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.015) 0%, transparent 50%)',
                animation: 'drift 25s infinite alternate cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: 0.9
            }} />

            {/* High-end subtle film grain noise via SVG filter */}
            <svg style={{ display: 'none' }}>
                <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                </filter>
            </svg>
            <div style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                filter: 'url(#noiseFilter)',
                opacity: 0.035, /* Extremely subtle */
                mixBlendMode: 'overlay'
            }} />

            <style>{`
                @keyframes drift {
                    0% { transform: translate(0, 0) rotate(0deg) scale(1); }
                    100% { transform: translate(-2%, -3%) rotate(2deg) scale(1.05); }
                }
            `}</style>
        </div>
    );
};

export default Background3D;
