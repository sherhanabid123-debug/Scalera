import React, { useEffect, useRef } from "react";

const Background3D = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    let animationFrameId;
    let time = 0;

    const renderScale = window.innerWidth < 768 ? 0.5 : 0.75;

    const resize = () => {
      canvas.width = window.innerWidth * renderScale;
      canvas.height = window.innerHeight * renderScale;
    };

    window.addEventListener("resize", resize);
    resize();

    const waves = [
      { amplitude: 120, frequency: 0.0014, speed: 0.0035, opacity: 0.055, yOffset: 0.62 },
      { amplitude: 150, frequency: 0.0009, speed: 0.0025, opacity: 0.04, yOffset: 0.68 },
      { amplitude: 90, frequency: 0.0018, speed: 0.0045, opacity: 0.025, yOffset: 0.56 },
      { amplitude: 60, frequency: 0.0022, speed: 0.006, opacity: 0.015, yOffset: 0.50 },
    ];

    const draw = () => {
      ctx.fillStyle = "#060608";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        const step = window.innerWidth < 768 ? 40 : 25;
        for (let x = 0; x <= canvas.width + step; x += step) {
          const y =
            Math.sin(
              x * (wave.frequency / renderScale) + time * wave.speed + index * 8,
            ) * (wave.amplitude * renderScale);
          ctx.lineTo(x, canvas.height * wave.yOffset + y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        grad.addColorStop(0, `rgba(220, 180, 128, ${wave.opacity * 0.5})`);
        grad.addColorStop(0.5, `rgba(220, 180, 128, ${wave.opacity})`);
        grad.addColorStop(1, `rgba(140, 100, 200, ${wave.opacity * 0.7})`);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      time += 1.0;
      animationFrameId = requestAnimationFrame(draw);
    };

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
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        background: "#060608",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          filter: "blur(10px)",
          transform: "scale(1.05)",
          willChange: "contents",
        }}
      />
      {/* Vignette overlay for depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(6,6,8,0.6) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default Background3D;
