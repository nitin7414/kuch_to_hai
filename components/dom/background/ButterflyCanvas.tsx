'use client';

import React, { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { EXPERIENCE_CONFIG } from '@/constants/config';

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
  targetAngle: number;
  opacity: number;
  glowSize: number;
}

export default function ButterflyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const performanceTier = useAppStore((state) => state.performanceTier);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = document.visibilityState === 'visible';
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive Canvas Resizing with Device Pixel Ratio (DPR)
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

    // Determine count by performance tier
    const config = EXPERIENCE_CONFIG.butterflies;
    let butterflyCount: number = config.baseCountHighTier;
    if (performanceTier === 'medium') butterflyCount = config.baseCountMediumTier;
    if (performanceTier === 'low') butterflyCount = config.baseCountLowTier;

    // Initialize Butterflies
    const butterflies: Butterfly[] = [];
    for (let i = 0; i < butterflyCount; i++) {
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      butterflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 8 + Math.random() * 8, // 8px - 16px
        speedX: (Math.random() - 0.5) * config.maxSpeed,
        speedY: -0.3 - Math.random() * 0.8, // gentle upward drift
        color,
        wingAngle: Math.random() * Math.PI * 2,
        wingSpeed: 0.12 + Math.random() * 0.1,
        angle: Math.random() * Math.PI * 2,
        turnSpeed: (Math.random() - 0.5) * 0.02,
        targetAngle: Math.random() * Math.PI * 2,
        opacity: 0.4 + Math.random() * 0.45,
        glowSize: 12 + Math.random() * 10,
      });
    }

    // Visibility API Throttling
    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
      if (isVisible) {
        lastTime = performance.now();
        render(performance.now());
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Render & Physics Loop
    let lastTime = performance.now();

    const drawButterfly = (b: Butterfly) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle + Math.PI / 2);

      const wingScale = Math.sin(b.wingAngle); // -1 to 1 sine wave flapping

      // Ambient radial glow behind butterfly
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, b.glowSize);
      glow.addColorStop(0, b.color);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.globalAlpha = b.opacity * 0.35;
      ctx.beginPath();
      ctx.arc(0, 0, b.glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Wing fill with gradient
      ctx.globalAlpha = b.opacity;
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 6;

      // Left Wing
      ctx.beginPath();
      ctx.ellipse(-b.size * 0.5 * Math.abs(wingScale), 0, b.size * 0.6 * Math.abs(wingScale), b.size * 0.9, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Right Wing
      ctx.beginPath();
      ctx.ellipse(b.size * 0.5 * Math.abs(wingScale), 0, b.size * 0.6 * Math.abs(wingScale), b.size * 0.9, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Slender Butterfly Body & Antennae
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = b.opacity * 0.9;
      ctx.beginPath();
      ctx.ellipse(0, 0, 1.2, b.size * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const render = (currentTime: number) => {
      if (!isVisible) return;

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Clear frame
      ctx.clearRect(0, 0, width, height);

      // Update & Draw Each Butterfly
      for (let i = 0; i < butterflies.length; i++) {
        const b = butterflies[i];

        // Flapping oscillation
        b.wingAngle += b.wingSpeed;

        // Fluid wandering trajectory
        b.angle += b.turnSpeed;
        if (Math.random() < 0.02) {
          b.turnSpeed = (Math.random() - 0.5) * 0.04;
        }

        // Motion physics
        b.x += Math.cos(b.angle) * 0.8 + b.speedX;
        b.y += Math.sin(b.angle) * 0.6 + b.speedY;

        // Screen wrap-around with padding
        const pad = 40;
        if (b.x < -pad) b.x = width + pad;
        if (b.x > width + pad) b.x = -pad;
        if (b.y < -pad) b.y = height + pad;
        if (b.y > height + pad) b.y = -pad;

        drawButterfly(b);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [performanceTier]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full gpu-layer"
      aria-hidden="true"
    />
  );
}
