import React, { useEffect, useRef } from 'react';

const Background3D = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        // Wave parameters mapped for a deep, organic liquid feel
        const waves = [
            { amplitude: 120, frequency: 0.0015, speed: 0.005, opacity: 0.03, yOffset: 0.6 },
            { amplitude: 160, frequency: 0.001, speed: 0.004, opacity: 0.02, yOffset: 0.65 },
            { amplitude: 90, frequency: 0.0025, speed: 0.006, opacity: 0.04, yOffset: 0.55 },
            { amplitude: 140, frequency: 0.002, speed: 0.003, opacity: 0.015, yOffset: 0.7 },
        ];

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Apply blur natively on the canvas context for better performance than CSS filters
            ctx.filter = 'blur(12px)';

            waves.forEach((wave, index) => {
                ctx.beginPath();
                ctx.moveTo(0, canvas.height);

                // Draw dynamic sine curves
                for (let x = 0; x <= canvas.width + 10; x += 20) {
                    const y = Math.sin(x * wave.frequency + time * wave.speed + (index * 10)) * wave.amplitude;
                    ctx.lineTo(x, canvas.height * wave.yOffset + y);
                }

                ctx.lineTo(canvas.width, canvas.height);
                ctx.lineTo(0, canvas.height);
                ctx.closePath();

                // Elegant accent color tones for the waves, matching the logo full stop
                ctx.fillStyle = `rgba(220, 180, 128, ${wave.opacity})`;
                ctx.fill();
            });

            // Reset filter after drawing so clearRect isn't blurred
            ctx.filter = 'none';

            time += 1.5;
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

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
            {/* Liquid Waveform Canvas */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    transform: 'scale(1.1)' /* Prevent edges from showing transparent gaps */
                }}
            />

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
                opacity: 0.035,
                mixBlendMode: 'overlay'
            }} />
        </div>
    );
};

export default Background3D;
