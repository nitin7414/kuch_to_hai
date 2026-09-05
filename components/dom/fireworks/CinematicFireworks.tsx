'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Sparkles, Stars } from 'lucide-react';
import { soundFx } from '@/utils/soundEffects';

interface Particle {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;
  gravity: number;
  friction: number;
  flicker: boolean;
  isCrackle?: boolean;
  crackleTime?: number;
}

interface Rocket {
  x: number;
  y: number;
  px: number;
  py: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  trailColor: string;
  shellType: 'peony' | 'willow' | 'ring' | 'crossette';
  size: 'small' | 'medium' | 'large';
}

const COLOR_PALETTES = [
  // Golden Brocade & Champagne
  ['#ffd700', '#ffe066', '#ffb703', '#ffffff'],
  // Romantic Rose & Ruby Pink
  ['#ff007f', '#ff4d94', '#ff758c', '#ffffff'],
  // Neon Cyber Cyan & Emerald
  ['#00f0ff', '#00ff87', '#38ef7d', '#ffffff'],
  // Royal Amethyst & Magenta
  ['#bd00ff', '#d946ef', '#f43f5e', '#ffffff'],
  // Electric Turquoise & Gold
  ['#00e5ff', '#ffd600', '#ff0055', '#ffffff'],
  // Sunset Coral & Amber
  ['#ff4d4d', '#ff9900', '#ffea00', '#ffffff'],
];

export default function CinematicFireworks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isWishingActive, setIsWishingActive] = useState<boolean>(false);
  const [showGroundShockwave, setShowGroundShockwave] = useState<boolean>(false);
  const animFrameRef = useRef<number | null>(null);

  const rocketsRef = useRef<Rocket[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const skyFlashRef = useRef<number>(0);
  const skyFlashColorRef = useRef<string>('#ffffff');

  // Main Canvas & Automatic Fireworks Engine (Mounts once & runs continuously)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth || 1200);
    let height = (canvas.height = window.innerHeight || 800);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth || 1200;
      height = canvas.height = window.innerHeight || 800;
    };

    window.addEventListener('resize', handleResize);

    // High-performance Rocket Launcher with Sparkling Comet Trails
    const launchRocket = (
      startX: number,
      targetY: number,
      shellType?: 'peony' | 'willow' | 'ring' | 'crossette',
      colorPalette?: string[],
      size: 'small' | 'medium' | 'large' = 'medium'
    ) => {
      const palette = colorPalette || COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
      const types: ('peony' | 'willow' | 'ring' | 'crossette')[] = ['peony', 'willow', 'ring', 'crossette'];
      const selectedType = shellType || types[Math.floor(Math.random() * types.length)];

      // Fast, dynamic ascent speed
      const speed = size === 'large' ? 18.5 + Math.random() * 3 : 16.5 + Math.random() * 2.5;
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.18;

      rocketsRef.current.push({
        x: startX,
        y: height - 10,
        px: startX,
        py: height - 10,
        targetY,
        vx: Math.cos(angle) * speed * 0.35,
        vy: Math.sin(angle) * speed,
        color: palette[0],
        trailColor: palette[1] || '#ffd700',
        shellType: selectedType,
        size,
      });

      soundFx.playFireworkRocketLaunch();
    };

    // Detonate Firework Shell at apex into dazzling starburst
    const explodeShell = (rocket: Rocket) => {
      const palette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
      const count = rocket.size === 'large' ? 110 : rocket.size === 'medium' ? 80 : 55;

      // Sky flash illumination
      skyFlashRef.current = rocket.size === 'large' ? 0.35 : 0.22;
      skyFlashColorRef.current = rocket.color;

      // Audio effects
      soundFx.playFireworkExplosion(rocket.size);

      if (rocket.shellType === 'crossette') {
        setTimeout(() => {
          soundFx.playFireworkCrackle(rocket.size === 'large' ? 24 : 16);
        }, 360);
      } else if (rocket.shellType === 'willow') {
        soundFx.playFireworkWillowShimmer();
      }

      if (rocket.shellType === 'ring') {
        // Geometric Outer Ring + Inner Bright Star Pistil
        const ringSpeed = 5.2 + Math.random() * 1.6;
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count;
          particlesRef.current.push({
            x: rocket.x,
            y: rocket.y,
            px: rocket.x,
            py: rocket.y,
            vx: Math.cos(angle) * ringSpeed,
            vy: Math.sin(angle) * ringSpeed,
            color: palette[i % palette.length],
            alpha: 1,
            decay: 0.012 + Math.random() * 0.007,
            size: 2.4,
            gravity: 0.042,
            friction: 0.978,
            flicker: Math.random() > 0.4,
          });
        }
        // Inner Glowing Core
        for (let i = 0; i < 18; i++) {
          const angle = Math.random() * Math.PI * 2;
          const coreSpeed = 1.0 + Math.random() * 2.0;
          particlesRef.current.push({
            x: rocket.x,
            y: rocket.y,
            px: rocket.x,
            py: rocket.y,
            vx: Math.cos(angle) * coreSpeed,
            vy: Math.sin(angle) * coreSpeed,
            color: '#ffffff',
            alpha: 1,
            decay: 0.02,
            size: 2.2,
            gravity: 0.03,
            friction: 0.96,
            flicker: true,
          });
        }
      } else if (rocket.shellType === 'willow') {
        // Grand Golden Willow / Brocade Waterfall with Long Trails
        for (let i = 0; i < count + 30; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.0 + Math.random() * 6.5;
          particlesRef.current.push({
            x: rocket.x,
            y: rocket.y,
            px: rocket.x,
            py: rocket.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.8,
            color: '#ffd700',
            alpha: 1,
            decay: 0.007 + Math.random() * 0.005,
            size: 2.2,
            gravity: 0.048,
            friction: 0.975,
            flicker: true,
          });
        }
      } else if (rocket.shellType === 'crossette') {
        // Multi-splitting Crossette with Crackle Pops
        for (let i = 0; i < 28; i++) {
          const angle = (Math.PI * 2 * i) / 28 + (Math.random() - 0.5) * 0.18;
          const speed = 4.2 + Math.random() * 3.5;
          particlesRef.current.push({
            x: rocket.x,
            y: rocket.y,
            px: rocket.x,
            py: rocket.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: palette[i % palette.length],
            alpha: 1,
            decay: 0.014,
            size: 2.8,
            gravity: 0.04,
            friction: 0.978,
            flicker: false,
            isCrackle: true,
            crackleTime: 20 + Math.floor(Math.random() * 14),
          });
        }
      } else {
        // Multi-Layer Peony / Chrysanthemum with Golden Strobe Pistil
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.pow(Math.random(), 0.45) * (rocket.size === 'large' ? 8.5 : 6.8);
          particlesRef.current.push({
            x: rocket.x,
            y: rocket.y,
            px: rocket.x,
            py: rocket.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: palette[Math.floor(Math.random() * palette.length)],
            alpha: 1,
            decay: 0.011 + Math.random() * 0.009,
            size: 2.4,
            gravity: 0.042,
            friction: 0.976,
            flicker: Math.random() > 0.4,
          });
        }
      }
    };

    // -----------------------------------------------------------------
    // AUTOMATIC FIREWORKS ORCHESTRATION (Instant & Continuous Salvos)
    // -----------------------------------------------------------------
    const timeouts: NodeJS.Timeout[] = [];

    // Instant Opening Salvo 1 (t=50ms): 2 Rockets soaring immediately!
    timeouts.push(
      setTimeout(() => {
        launchRocket(width * 0.35, height * 0.26, 'willow', COLOR_PALETTES[0], 'large');
        launchRocket(width * 0.65, height * 0.26, 'peony', COLOR_PALETTES[1], 'large');
      }, 50)
    );

    // Opening Salvo 2 (t=600ms): 2 Side Rockets
    timeouts.push(
      setTimeout(() => {
        launchRocket(width * 0.20, height * 0.32, 'crossette', COLOR_PALETTES[3], 'medium');
        launchRocket(width * 0.80, height * 0.32, 'peony', COLOR_PALETTES[4], 'medium');
      }, 600)
    );

    // Salvo 3 (t=1400ms): 3 Fireworks across sky -> reaches 7 total automatic fireworks
    timeouts.push(
      setTimeout(() => {
        launchRocket(width * 0.28, height * 0.28, 'peony', COLOR_PALETTES[2], 'large');
        launchRocket(width * 0.50, height * 0.18, 'ring', COLOR_PALETTES[0], 'large');
        launchRocket(width * 0.72, height * 0.28, 'willow', COLOR_PALETTES[5], 'large');
      }, 1400)
    );

    // Salvo 4 (t=2500ms): 3 Grand Crossette & Willow fireworks
    timeouts.push(
      setTimeout(() => {
        launchRocket(width * 0.22, height * 0.32, 'crossette', COLOR_PALETTES[1], 'medium');
        launchRocket(width * 0.52, height * 0.22, 'willow', COLOR_PALETTES[0], 'large');
        launchRocket(width * 0.78, height * 0.30, 'ring', COLOR_PALETTES[3], 'medium');
      }, 2500)
    );

    // Salvo 5 (t=3600ms): 3 Fireworks preceding the wish reveal
    timeouts.push(
      setTimeout(() => {
        launchRocket(width * 0.30, height * 0.25, 'peony', COLOR_PALETTES[4], 'large');
        launchRocket(width * 0.50, height * 0.18, 'willow', COLOR_PALETTES[0], 'large');
        launchRocket(width * 0.70, height * 0.25, 'crossette', COLOR_PALETTES[2], 'large');
      }, 3600)
    );

    // Automatic Wish Reveal: Triggers itself smoothly at 4.6s
    timeouts.push(
      setTimeout(() => {
        setIsWishingActive(true);
      }, 4600)
    );

    // Continuous High-Frequency Automatic Fireworks in Background (2-3 rockets every 1.4s)
    const interval = setInterval(() => {
      const salvoCount = Math.random() > 0.4 ? 3 : 2;
      for (let s = 0; s < salvoCount; s++) {
        setTimeout(() => {
          const randX = width * 0.12 + (width * 0.76 * (s + 0.5)) / salvoCount + (Math.random() - 0.5) * (width * 0.12);
          const randY = height * 0.14 + Math.random() * (height * 0.28);
          const isBig = Math.random() > 0.45;
          launchRocket(randX, randY, undefined, undefined, isBig ? 'large' : 'medium');
        }, s * 160);
      }
    }, 1400);

    // Stop Automatic Fireworks exactly 4 seconds after animated wish appears (4.6s + 4.0s = 8.6s)
    timeouts.push(
      setTimeout(() => {
        clearInterval(interval);
      }, 8600)
    );

    // -----------------------------------------------------------------
    // Buttery Smooth 60FPS / 120FPS GPU Render Loop (Zero GC, Zero shadowBlur)
    // -----------------------------------------------------------------
    const render = () => {
      // 1. Semi-transparent clear for smooth motion trails
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // 2. Sky flash illumination
      if (skyFlashRef.current > 0.01) {
        ctx.fillStyle = skyFlashColorRef.current;
        ctx.globalAlpha = skyFlashRef.current * 0.25;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1.0;
        skyFlashRef.current *= 0.86;
      }

      // Additive blending for luminous bright light
      ctx.globalCompositeOperation = 'lighter';

      // 3. Update & Render Rockets with Ascending Sparkling Trails
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const r = rocketsRef.current[i];
        r.px = r.x;
        r.py = r.y;
        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.18; // Gravity slowing ascent

        // Spawn ascending sparkle ember particles behind rocket
        if (Math.random() > 0.25) {
          particlesRef.current.push({
            x: r.x + (Math.random() - 0.5) * 4,
            y: r.y + (Math.random() - 0.5) * 4,
            px: r.x,
            py: r.y,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 2.2 + 0.8,
            color: r.trailColor,
            alpha: 0.9,
            decay: 0.045,
            size: 1.8,
            gravity: 0.08,
            friction: 0.95,
            flicker: true,
          });
        }

        // Draw crisp laser rocket tail line
        ctx.beginPath();
        ctx.moveTo(r.px, r.py);
        ctx.lineTo(r.x, r.y);
        ctx.strokeStyle = r.trailColor;
        ctx.lineWidth = 3.0;
        ctx.stroke();

        // Rocket bright head dot
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3.0, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Check if rocket reached apex
        if (r.vy >= -1.0 || r.y <= r.targetY) {
          explodeShell(r);
          rocketsRef.current.splice(i, 1);
        }
      }

      // 4. Update & Render Exploded Star Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];

        p.px = p.x;
        p.py = p.y;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        // Crossette micro-crackle split
        if (p.isCrackle && p.crackleTime !== undefined) {
          p.crackleTime--;
          if (p.crackleTime <= 0) {
            p.isCrackle = false;
            for (let c = 0; c < 4; c++) {
              const cAngle = Math.random() * Math.PI * 2;
              const cSpeed = 2.0 + Math.random() * 2.5;
              particlesRef.current.push({
                x: p.x,
                y: p.y,
                px: p.x,
                py: p.y,
                vx: Math.cos(cAngle) * cSpeed,
                vy: Math.sin(cAngle) * cSpeed,
                color: '#ffffff',
                alpha: 1,
                decay: 0.04,
                size: 1.8,
                gravity: 0.05,
                friction: 0.95,
                flicker: true,
              });
            }
          }
        }

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        // Draw particle streak from px,py to x,y
        const starAlpha = p.flicker ? p.alpha * (0.65 + Math.random() * 0.35) : p.alpha;
        ctx.globalAlpha = starAlpha;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.stroke();

        // Center particle glow head
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    // User Interactive Click/Tap to launch custom fireworks at clicked position
    const handleCanvasClick = (e: MouseEvent | TouchEvent) => {
      let clientX = width / 2;
      let clientY = height / 3;
      if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      launchRocket(clientX, clientY, undefined, undefined, 'large');
    };

    window.addEventListener('click', handleCanvasClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleCanvasClick);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      clearInterval(interval);
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Audio & Shockwave choreography when wishing sequence activates
  useEffect(() => {
    if (!isWishingActive) return;

    // 1. Meteor Whoosh Sound as "Happy" plunges
    const t1 = setTimeout(() => {
      soundFx.playSlideTransition();
    }, 200);

    // 2. Ground Impact Sound + Shockwave when "Happy" hits bottom
    const t2 = setTimeout(() => {
      soundFx.playFireworkExplosion('large');
      setShowGroundShockwave(true);
      setTimeout(() => setShowGroundShockwave(false), 800);
    }, 1500);

    // 3. String Drop Tension Sound for "Birthday"
    const t3 = setTimeout(() => {
      soundFx.playRopeTighten(0.85);
    }, 3600);

    // 4. Fanfare for Center Shalini Reveal
    const t4 = setTimeout(() => {
      soundFx.playCelebrationFanfare();
    }, 6200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isWishingActive]);

  return (
    <div className="fixed inset-0 z-50 flex h-full w-full flex-col items-center justify-center overflow-hidden bg-black select-none">
      {/* High-Performance 60FPS / 120FPS Fireworks Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full cursor-pointer" />

      {/* Floating Interactive Prompt at Bottom */}
      <div className="pointer-events-none absolute bottom-6 z-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: [0.5, 0.95, 0.5], y: 0 }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          className="rounded-full border border-amber-300/30 bg-white/5 px-6 py-2.5 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.25)]"
        >
          <p className="text-xs sm:text-sm font-medium tracking-widest text-amber-200/90 flex items-center gap-2">
            <Stars className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            <span>click kro screen pe kahi bhi</span>
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-spin" />
          </p>
        </motion.div>
      </div>

      {/* Ground Meteor Impact Shockwave Flash at Bottom */}
      <AnimatePresence>
        {showGroundShockwave && (
          <motion.div
            initial={{ scale: 0.3, opacity: 1 }}
            animate={{ scale: 3.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="pointer-events-none fixed bottom-12 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-radial from-amber-300 via-rose-500/50 to-transparent blur-xl z-25"
          />
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------------------- */}
      {/* DRAMATIC CURSIVE WISH ANIMATION (Meteor Fall & Hanging String Drop) */}
      {/* ----------------------------------------------------------------- */}
      <AnimatePresence>
        {isWishingActive && (
          <div className="pointer-events-none relative z-30 flex flex-col items-center justify-center w-full max-w-5xl px-4 select-none">
            {/* Main "Happy Birthday" Cursive Composition */}
            <div className="relative flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8 gap-y-2 py-4">
              {/* 1. "Happy" - Meteor Falling Slowly from Space to Bottom, Impacting, & Bouncing Back to Center */}
              <motion.div
                initial={{
                  y: '-140vh',
                  x: -35,
                  rotate: -24,
                  scale: 2.2,
                  opacity: 0,
                  filter: 'blur(8px)',
                }}
                animate={{
                  y: ['-140vh', '58vh', '-10vh', '5vh', '0vh'],
                  x: [-35, -15, 0, 0, 0],
                  rotate: [-24, 12, -4, 2, 0],
                  scale: [2.2, 1.25, 0.95, 1.05, 1],
                  opacity: [0, 1, 1, 1, 1],
                  filter: ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'],
                }}
                transition={{
                  delay: 0.3,
                  duration: 2.8,
                  times: [0, 0.52, 0.75, 0.88, 1],
                  ease: 'easeInOut',
                }}
                className="relative flex items-center justify-center"
              >
                {/* Fiery Meteor Trail Glow Effect */}
                <motion.div
                  initial={{ opacity: 1, scale: 1.6 }}
                  animate={{ opacity: [1, 0.3, 0], scale: [1.6, 2.2, 0.8] }}
                  transition={{ delay: 0.3, duration: 1.6 }}
                  className="pointer-events-none absolute -inset-8 rounded-full bg-radial from-amber-400/60 via-rose-500/40 to-transparent blur-2xl"
                />

                <span
                  style={{ fontFamily: 'var(--font-cursive), cursive' }}
                  className="inline-block px-6 py-3 overflow-visible text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-wide bg-gradient-to-r from-[#fff3b0] via-[#ff758c] to-[#ffb703] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(255,215,0,0.85)] leading-tight select-none"
                >
                  Happy
                </span>
              </motion.div>

              {/* 2. "Birthday" - Falling Slowly Straight Down from Top with a Hanging String (Starts after Happy settles) */}
              <motion.div
                initial={{ y: '-140vh', opacity: 0 }}
                animate={{
                  y: ['-140vh', '0vh', '12px', '-6px', '0px'],
                  rotate: [0, 8, -5, 2, 0],
                  opacity: [0, 1, 1, 1, 1],
                }}
                transition={{
                  delay: 3.6,
                  duration: 2.2,
                  times: [0, 0.65, 0.82, 0.92, 1],
                  ease: 'easeOut',
                }}
                className="relative flex flex-col items-center justify-center -mt-2 sm:-mt-4 overflow-visible"
              >
                {/* Physical Hanging String SVG from Ceiling */}
                <div className="absolute bottom-[85%] left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center">
                  {/* Top Ceiling Anchor / Glowing Ring */}
                  <div className="h-3 w-3 rounded-full bg-white shadow-[0_0_12px_#ffd700]" />
                  {/* Hanging Glowing Gold String Line */}
                  <svg width="6" height="320" className="overflow-visible block">
                    <line
                      x1="3"
                      y1="0"
                      x2="3"
                      y2="320"
                      stroke="#ffd700"
                      strokeWidth="2.4"
                      strokeDasharray="5 2.5"
                      className="drop-shadow-[0_0_10px_rgba(255,215,0,0.9)]"
                    />
                  </svg>
                </div>

                <span
                  style={{ fontFamily: 'var(--font-cursive), cursive' }}
                  className="inline-block px-6 py-3 overflow-visible text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-wide bg-gradient-to-r from-[#ffd700] via-[#ff9a9e] to-[#fecfef] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,105,180,0.8)] leading-tight select-none"
                >
                  Birthday
                </span>
              </motion.div>
            </div>

            {/* 3. "Shalini" Majestic Name Reveal on Centre of Screen (Starts after Happy Birthday both settle) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.4, y: 35, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 6.2, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative mt-2 sm:mt-4 flex flex-col items-center justify-center text-center w-full overflow-visible"
            >
              {/* Premium Crown & Stars Badge */}
              <div className="flex items-center justify-center gap-3 sm:gap-6 mb-1 overflow-visible max-w-full">
                <Crown className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-amber-300 fill-amber-300/30 drop-shadow-[0_0_15px_#f59e0b] animate-bounce shrink-0" />
                <span
                  style={{ fontFamily: 'var(--font-cursive), cursive' }}
                  className="inline-block px-8 sm:px-12 py-3 sm:py-5 overflow-visible text-6xl sm:text-8xl md:text-9xl font-normal bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_45px_rgba(255,215,0,0.95)] leading-normal tracking-wide select-none"
                >
                  Shalini
                </span>
                <Stars className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-amber-300 animate-pulse drop-shadow-[0_0_15px_#f59e0b] shrink-0" />
              </div>

              {/* Friendship & Celebration Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 7.2, duration: 0.9 }}
                className="text-base sm:text-xl md:text-2xl font-light text-amber-100/95 tracking-widest drop-shadow-md max-w-lg mt-1"
              >
                Wishing you boundless joy, success, and brilliant adventures ahead!
              </motion.p>
            </motion.div>

            {/* ----------------------------------------------------------------- */}
            {/* 4. BUTTERY SMOOTH CORNER CELEBRATION GIFS (Appears after 7s of wish) */}
            {/* ----------------------------------------------------------------- */}
            {/* Top-Left Corner GIF: Excited Happy Birthday */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3, x: -40, y: -40, rotate: -15, filter: 'blur(8px)' }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: [0, -6, 0],
                rotate: [-4, -2, -4],
                filter: 'blur(0px)',
              }}
              transition={{
                delay: 7.0,
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                y: { duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 8.2 },
                rotate: { duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 8.2 },
              }}
              className="fixed top-4 left-4 sm:top-8 sm:left-8 z-35 pointer-events-none"
            >
              <div className="relative rounded-2xl border border-amber-400/40 bg-black/50 p-1.5 sm:p-2 backdrop-blur-md shadow-[0_0_25px_rgba(245,158,11,0.4)]">
                <img
                  src="/images/Excited Happy Birthday GIF.gif"
                  alt="Excited Happy Birthday"
                  className="h-24 w-24 sm:h-36 sm:w-36 md:h-44 md:w-44 rounded-xl object-cover"
                />
              </div>
            </motion.div>

            {/* Top-Right Corner GIF: Happy Birthday Party */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3, x: 40, y: -40, rotate: 15, filter: 'blur(8px)' }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: [0, -7, 0],
                rotate: [4, 2, 4],
                filter: 'blur(0px)',
              }}
              transition={{
                delay: 7.3,
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 8.5 },
                rotate: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 8.5 },
              }}
              className="fixed top-4 right-4 sm:top-8 sm:right-8 z-35 pointer-events-none"
            >
              <div className="relative rounded-2xl border border-pink-400/40 bg-black/50 p-1.5 sm:p-2 backdrop-blur-md shadow-[0_0_25px_rgba(244,63,94,0.4)]">
                <img
                  src="/images/Happy Birthday Party GIF.gif"
                  alt="Happy Birthday Party"
                  className="h-24 w-24 sm:h-36 sm:w-36 md:h-44 md:w-44 rounded-xl object-cover"
                />
              </div>
            </motion.div>

            {/* Bottom-Left Corner GIF: Happy Birthday Bday MOODMAN */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3, x: -40, y: 40, rotate: -12, filter: 'blur(8px)' }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: [0, -6, 0],
                rotate: [-3, -1, -3],
                filter: 'blur(0px)',
              }}
              transition={{
                delay: 7.6,
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                y: { duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 8.8 },
                rotate: { duration: 4.0, repeat: Infinity, ease: 'easeInOut', delay: 8.8 },
              }}
              className="fixed bottom-36 left-3 sm:bottom-44 sm:left-6 md:bottom-52 md:left-8 z-35 pointer-events-none"
            >
              <div className="relative rounded-2xl border border-amber-300/40 bg-black/50 p-1.5 sm:p-2 backdrop-blur-md shadow-[0_0_25px_rgba(251,191,36,0.4)]">
                <img
                  src="/images/Happy Birthday Bday GIF by MOODMAN.gif"
                  alt="Happy Birthday Moodman"
                  className="h-20 w-20 sm:h-28 sm:w-28 md:h-36 md:w-36 rounded-xl object-cover"
                />
              </div>
            </motion.div>

            {/* Bottom-Right Corner GIF: Happy Birthday Party by Unscreen */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3, x: 40, y: 40, rotate: 12, filter: 'blur(8px)' }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: [0, -7, 0],
                rotate: [3, 1, 3],
                filter: 'blur(0px)',
              }}
              transition={{
                delay: 7.8,
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                y: { duration: 3.7, repeat: Infinity, ease: 'easeInOut', delay: 9.0 },
                rotate: { duration: 4.3, repeat: Infinity, ease: 'easeInOut', delay: 9.0 },
              }}
              className="fixed bottom-36 right-3 sm:bottom-44 sm:right-6 md:bottom-52 md:right-8 z-35 pointer-events-none"
            >
              <div className="relative rounded-2xl border border-purple-400/40 bg-black/50 p-1.5 sm:p-2 backdrop-blur-md shadow-[0_0_25px_rgba(192,132,252,0.4)]">
                <img
                  src="/images/Happy Birthday Party GIF by Unscreen.gif"
                  alt="Happy Birthday Party Unscreen"
                  className="h-20 w-20 sm:h-28 sm:w-28 md:h-36 md:w-36 rounded-xl object-cover"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
