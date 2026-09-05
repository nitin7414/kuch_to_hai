'use client';

import React, { useEffect, useRef } from 'react';

interface Butterfly {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  wingAngle: number;
  wingSpeed: number;
  angle: number;
  turnSpeed: number;
  opacity: number;
  glowSize: number;
  spawnProgress: number; // 0 to 1 fade in
}

interface CandleButterflyCanvasProps {
  isCandleLit: boolean;
}

export default function CandleButterflyCanvas({ isCandleLit }: CandleButterflyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = document.visibilityState === 'visible';
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive Canvas Resizing with DPR
    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const colors = [
      '#f43f5e', // Ruby Pink
      '#fb7185', // Rose
      '#facc15', // Gold
      '#fb923c', // Warm Amber
      '#fda4af', // Soft Peach Pink
      '#ffffff', // Pure Pearl White
      '#f472b6', // Magenta Rose
    ];

    const butterflies: Butterfly[] = [];
    const maxButterflies = 42;
    let spawnTimer: NodeJS.Timeout[] = [];

    // Helper to spawn a single butterfly emerging from candle/center area
    const spawnButterfly = (fromCenter: boolean = true) => {
      const centerX = width / 2;
      const centerY = height / 2 - 40;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const startX = fromCenter ? centerX + (Math.random() - 0.5) * 60 : Math.random() * width;
      const startY = fromCenter ? centerY + (Math.random() - 0.5) * 40 : Math.random() * height;

      butterflies.push({
        x: startX,
        y: startY,
        size: 9 + Math.random() * 9, // 9px to 18px
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: -0.4 - Math.random() * 0.9, // Gentle upward float
        color,
        wingAngle: Math.random() * Math.PI * 2,
        wingSpeed: 0.14 + Math.random() * 0.1,
        angle: Math.random() * Math.PI * 2,
        turnSpeed: (Math.random() - 0.5) * 0.03,
        opacity: 0.5 + Math.random() * 0.45,
        glowSize: 12 + Math.random() * 12,
        spawnProgress: fromCenter ? 0 : 1,
      });
    };

    // Progressive Spawning Sequence when candle is lit
    if (isCandleLit) {
      // 1. Initial 1-2 butterflies emerge instantly from the candle flame
      spawnButterfly(true);
      spawnButterfly(true);

      // 2. A few more flutter out after 600ms
      spawnTimer.push(
        setTimeout(() => {
          for (let i = 0; i < 3; i++) spawnButterfly(true);
        }, 600)
      );

      // 3. More spread out after 1.4s
      spawnTimer.push(
        setTimeout(() => {
          for (let i = 0; i < 6; i++) spawnButterfly(true);
        }, 1400)
      );

      // 4. Background begins filling after 2.4s
      spawnTimer.push(
        setTimeout(() => {
          for (let i = 0; i < 12; i++) spawnButterfly(false);
        }, 2400)
      );

      // 5. Full background swarm after 3.6s
      spawnTimer.push(
        setTimeout(() => {
          while (butterflies.length < maxButterflies) {
            spawnButterfly(false);
          }
        }, 3600)
      );
    } else {
      // Clear when not lit
      butterflies.length = 0;
      ctx.clearRect(0, 0, width, height);
    }

    // Visibility API Throttling
    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
      if (isVisible) {
        render();
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Draw individual butterfly with radiant wing flap & glow
    const drawButterfly = (b: Butterfly) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle + Math.PI / 2);

      const wingScale = Math.sin(b.wingAngle);
      const currentOpacity = b.opacity * Math.min(1, b.spawnProgress);

      // Radial fairy glow
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, b.glowSize);
      glow.addColorStop(0, b.color);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.globalAlpha = currentOpacity * 0.4;
      ctx.beginPath();
      ctx.arc(0, 0, b.glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Wing fill with vibrant shadow
      ctx.globalAlpha = currentOpacity;
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 8;

      // Left Wing
      ctx.beginPath();
      ctx.ellipse(-b.size * 0.55 * Math.abs(wingScale), 0, b.size * 0.65 * Math.abs(wingScale), b.size * 0.95, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Right Wing
      ctx.beginPath();
      ctx.ellipse(b.size * 0.55 * Math.abs(wingScale), 0, b.size * 0.65 * Math.abs(wingScale), b.size * 0.95, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Slender Pearl Body
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = currentOpacity * 0.95;
      ctx.beginPath();
      ctx.ellipse(0, 0, 1.4, b.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Render 60fps Loop
    const render = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      if (butterflies.length > 0) {
        for (let i = 0; i < butterflies.length; i++) {
          const b = butterflies[i];

          // Fade-in spawn animation
          if (b.spawnProgress < 1) {
            b.spawnProgress += 0.02;
          }

          // Flapping oscillation
          b.wingAngle += b.wingSpeed;

          // Natural flight path curvature
          b.angle += b.turnSpeed;
          if (Math.random() < 0.025) {
            b.turnSpeed = (Math.random() - 0.5) * 0.04;
          }

          // Movement
          b.x += Math.cos(b.angle) * 0.9 + b.speedX;
          b.y += Math.sin(b.angle) * 0.7 + b.speedY;

          // Screen Wrap-around
          const pad = 40;
          if (b.x < -pad) b.x = width + pad;
          if (b.x > width + pad) b.x = -pad;
          if (b.y < -pad) b.y = height + pad;
          if (b.y > height + pad) b.y = -pad;

          drawButterfly(b);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      spawnTimer.forEach(clearTimeout);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isCandleLit]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full gpu-layer"
      aria-hidden="true"
    />
  );
}
