import React, { useEffect, useRef } from "react";

const Background3D = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false }); // Optimization: no alpha channel if background is solid
    let animationFrameId;
    let time = 0;

    // Performance optimization: render at lower resolution and scale up
    const renderScale = window.innerWidth < 768 ? 0.5 : 0.75;

    const resize = () => {
      canvas.width = window.innerWidth * renderScale;
      canvas.height = window.innerHeight * renderScale;
    };

    window.addEventListener("resize", resize);
    resize();

    // Fewer waves for better performance on slow devices
    const waves = [
      {
        amplitude: 100,
        frequency: 0.0015,
        speed: 0.004,
        opacity: 0.04,
        yOffset: 0.6,
      },
      {
        amplitude: 130,
        frequency: 0.001,
        speed: 0.003,
        opacity: 0.03,
        yOffset: 0.65,
      },
      {
        amplitude: 80,
        frequency: 0.002,
        speed: 0.005,
        opacity: 0.02,
        yOffset: 0.55,
      },
    ];

    const draw = () => {
      // Draw dark background directly instead of clearRect for performance
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        // Lower density for sine curve drawing
        const step = window.innerWidth < 768 ? 40 : 30;
        for (let x = 0; x <= canvas.width + step; x += step) {
          const y =
            Math.sin(
              x * (wave.frequency / renderScale) +
                time * wave.speed +
                index * 10,
            ) *
            (wave.amplitude * renderScale);
          ctx.lineTo(x, canvas.height * wave.yOffset + y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        ctx.fillStyle = `rgba(220, 180, 128, ${wave.opacity})`;
        ctx.fill();
      });

      time += 1.2;
      animationFrameId = requestAnimationFrame(draw);
    };

    // Simple throttle for low-end devices
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        background: "#0a0a0a",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          filter: "blur(8px)",
          transform: "scale(1.05)",
          willChange: "contents",
        }}
      />

      {/* Reduced complexity noise overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          opacity: 0.02,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default Background3D;
