'use client';

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowDown, RotateCcw, Zap, PartyPopper } from 'lucide-react';
import { soundFx } from '@/utils/soundEffects';
import CakeRevealSection from '@/components/dom/cake/CakeRevealSection';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  color: string;
}

export default function HeroSection() {
  // Round 1 (normal pull/break) vs Round 2 (dodge / slipping away mode)
  const [isDodgeRound, setIsDodgeRound] = useState<boolean>(false);
  const [dodgeStep, setDodgeStep] = useState<number>(0); // 0 = idle, 1 = right, 2 = left, 3 = caught/ready to break
  const [dodgeMessage, setDodgeMessage] = useState<string>('');

  // Pull state: 0 = untouched, 1 = first attempt made (bubble shown), 2 = breaking/broken
  const [pullCount, setPullCount] = useState<number>(0);
  const [isBreaking, setIsBreaking] = useState<boolean>(false);
  const [isBroken, setIsBroken] = useState<boolean>(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState<boolean>(false);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Screen slide down & 3D cake reveal transition state
  const [isScreenSlidingDown, setIsScreenSlidingDown] = useState<boolean>(false);
  const [showCakeReveal, setShowCakeReveal] = useState<boolean>(false);

  // Real-time draggable pull physics
  const rawPullY = useMotionValue(0);
  const smoothPullY = useSpring(rawPullY, { stiffness: 450, damping: 24, mass: 0.5 });
  const threadEndY = useTransform(smoothPullY, (val) => 250 + val);

  const startYRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const hasPulledRef = useRef<boolean>(false);
  const lastSoundTime = useRef<number>(0);
  const isInteractingRef = useRef<boolean>(false);

  // Generate pure white and sparkling pink/red snap particles
  const spawnBreakParticles = () => {
    const colors = ['#ffffff', '#ffffff', '#fff1f2', '#fecdd3', '#f43f5e', '#fb7185'];
    const newParticles: Particle[] = [];
    for (let i = 0; i < 32; i++) {
      const angle = (Math.PI * 2 * i) / 32 + (Math.random() - 0.5) * 0.5;
      const speed = 70 + Math.random() * 180;
      newParticles.push({
        id: i,
        x: (Math.random() - 0.5) * 16,
        y: (Math.random() - 0.5) * 16,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + (Math.random() * 50 - 20),
        size: 2.5 + Math.random() * 4,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setParticles(newParticles);
  };

  // ----------------------------------------------------
  // ROUND 1 & FINAL BREAK PULL SEQUENCE
  // ----------------------------------------------------
  const triggerNormalPull = () => {
    if (isBreaking || isBroken || isInteractingRef.current) return;
    isInteractingRef.current = true;

    if (pullCount === 0) {
      // FIRST PULL: Spring back & show speech bubble
      soundFx.playTensionResist();
      rawPullY.set(0);

      setTimeout(() => {
        setPullCount(1);
        setShowSpeechBubble(true);

        setTimeout(() => {
          soundFx.playBubblePop();
          isInteractingRef.current = false;
        }, 250);
      }, 350);
    } else {
      // SECOND PULL: Thread snaps and falls!
      triggerBreakDown();
    }
  };

  const triggerBreakDown = () => {
    setIsBreaking(true);
    setShowSpeechBubble(false);
    soundFx.playDramaticRopeBreak();
    spawnBreakParticles();

    // Screen jolt
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);

    // If breaking in Round 2 (after "Ohhh Nice! Ab taakat lagao Shalini!"),
    // slide the entire screen down with sound, leading to dark screen & matchstick!
    if (isDodgeRound) {
      setTimeout(() => {
        soundFx.playSlideTransition();
        setIsScreenSlidingDown(true);

        // Slide down lasts 1.1s -> then reveal dark atmosphere & matchstick
        setTimeout(() => {
          setShowCakeReveal(true);
          isInteractingRef.current = false;
        }, 1100);
      }, 500);
    } else {
      // Round 1 break: show first broken message
      setTimeout(() => {
        setIsBroken(true);
        setIsBreaking(false);
        isInteractingRef.current = false;
        rawPullY.set(0);
      }, 1200);
    }
  };

  // ----------------------------------------------------
  // ROUND 2: PLAYFUL DODGE / SLIPPING AWAY SEQUENCE
  // ----------------------------------------------------
  const handleDodgeAttempt = () => {
    if (isBreaking || isBroken || isInteractingRef.current) return;
    isInteractingRef.current = true;

    if (dodgeStep === 0) {
      // 1. Flexible whip curve slips away to the RIGHT
      setDodgeStep(1);
      soundFx.playDodgeWhoosh('right');
      setDodgeMessage('Tum soch rhi hogi, kitna dusht hai ye😒');
      setShowSpeechBubble(true);
      setTimeout(() => {
        isInteractingRef.current = false;
      }, 400);
    } else if (dodgeStep === 1) {
      // 2. Flexible whip curve slips away to the LEFT
      setDodgeStep(2);
      soundFx.playDodgeWhoosh('left');
      setDodgeMessage('Is baar ummid hai ho jayega 😂');
      setShowSpeechBubble(true);
      setTimeout(() => {
        isInteractingRef.current = false;
      }, 400);
    } else if (dodgeStep === 2) {
      // 3. Dynamic S-curve flex & caught!
      setDodgeStep(3);
      soundFx.playDodgeWhoosh('right');
      setDodgeMessage('Ohhh Nice! Ab taakat lagao Shalini! 😤💪');
      setShowSpeechBubble(true);
      setTimeout(() => {
        isInteractingRef.current = false;
      }, 500);
    } else {
      // 4. Fully pulled after dodging -> breaks & slides down to 3D Cake!
      triggerBreakDown();
    }
  };

  // General pull trigger router
  const handlePullAction = () => {
    if (isDodgeRound) {
      handleDodgeAttempt();
    } else {
      triggerNormalPull();
    }
  };

  // Real-time Pointer Pull Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isBreaking || isBroken) return;
    if (isDodgeRound && dodgeStep < 3) {
      handleDodgeAttempt();
      return;
    }

    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    startYRef.current = e.clientY;
    isDraggingRef.current = true;
    hasPulledRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || isBreaking || isBroken) return;
    const deltaY = Math.max(0, e.clientY - startYRef.current);
    const clampedY = Math.min(65, deltaY);
    rawPullY.set(clampedY);

    if (deltaY > 15) {
      hasPulledRef.current = true;
      const now = performance.now();
      if (now - lastSoundTime.current > 180) {
        soundFx.playRopeTighten(Math.min(1.0, deltaY / 50));
        lastSoundTime.current = now;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // safe fallback
    }

    const currentPull = rawPullY.get();
    if (currentPull > 20 || !hasPulledRef.current) {
      handlePullAction();
    } else {
      rawPullY.set(0);
    }
  };

  // Reset handler after first break -> triggers ROUND 2 (Slipping Dodge mode)
  const handleStartDodgeRound = () => {
    setIsDodgeRound(true);
    setDodgeStep(0);
    setPullCount(0);
    setIsBreaking(false);
    setIsBroken(false);
    setShowSpeechBubble(true);
    setDodgeMessage('Hehe ab pakad ke dikhao Shalini 😜💨');
    soundFx.playBubblePop();
    rawPullY.set(0);
    setParticles([]);
  };

  // Full reset back to Round 1 from start
  const handleFullReset = () => {
    setIsDodgeRound(false);
    setDodgeStep(0);
    setPullCount(0);
    setIsBreaking(false);
    setIsBroken(false);
    setShowSpeechBubble(false);
    setIsScreenSlidingDown(false);
    setShowCakeReveal(false);
    rawPullY.set(0);
    setParticles([]);
  };

  // ----------------------------------------------------
  // DYNAMIC FLEXIBLE BEZIER STRING PATHS
  // ----------------------------------------------------
  const idleFloatingPaths = [
    'M 100 0 C 94 85, 90 170, 86 250',
    'M 100 0 C 98 85, 95 170, 93 250',
    'M 100 0 C 106 85, 110 170, 114 250',
    'M 100 0 C 102 85, 105 170, 107 250',
    'M 100 0 C 94 85, 90 170, 86 250',
  ];

  const dodgeRightPath = 'M 100 0 C 122 75, 155 160, 175 240';
  const dodgeLeftPath = 'M 100 0 C 78 75, 45 160, 25 240';
  const dodgeZigzagPath = 'M 100 0 C 125 80, 75 165, 100 250';

  const getTipOffset = () => {
    if (!isDodgeRound) return { x: 0, y: 0 };
    if (dodgeStep === 1) return { x: 75, y: -10 };
    if (dodgeStep === 2) return { x: -75, y: -10 };
    return { x: 0, y: 0 };
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0d0a18] select-none">
      {/* 3D Drone Cake Layer - Smoothly reveals behind the curtain with zero hitch */}
      <div
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ${
          showCakeReveal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {showCakeReveal && <CakeRevealSection />}
      </div>

      {/* Hero Interactive Pull Section (Foreground layer that slides down smoothly) */}
      <motion.section
        id="intro"
        initial={false}
        animate={{
          y: isScreenSlidingDown ? '110vh' : '0vh',
          opacity: isScreenSlidingDown ? 0 : 1,
        }}
        transition={{
          duration: 1.1,
          ease: [0.32, 0.72, 0, 1], // Cinematic smooth deceleration slide down
        }}
        className={`relative z-10 flex min-h-screen w-full flex-col items-center justify-start pt-6 overflow-hidden select-none ${
          showCakeReveal ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
      >
        {/* Screen Shake Wrapper */}
        <motion.div
          animate={
            screenShake
              ? {
                  x: [-6, 8, -6, 5, -3, 0],
                  y: [-4, 6, -5, 3, -2, 0],
                }
              : { x: 0, y: 0 }
          }
          transition={{ duration: 0.45 }}
          className="relative flex h-full w-full flex-col items-center justify-start"
        >
          {/* Ambient atmospheric lighting - Romantic Pink / Ruby Red Glow */}
          <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[380px] md:h-[550px] md:w-[550px] rounded-full bg-gradient-to-tr from-rose-600/30 via-pink-500/25 to-red-600/25 blur-[140px]" />

          {/* ---------------------------------------------------- */}
          {/* CEILING PIN & FLEXIBLE FLOATING STRING ASSEMBLY      */}
          {/* ---------------------------------------------------- */}
          <div className="relative z-20 flex flex-col items-center">
            {/* Ceiling Mount Base Bar */}
            <div className="h-2 w-12 rounded-b-sm bg-gradient-to-r from-zinc-800 via-white/90 to-zinc-800 shadow-[0_2px_10px_rgba(255,255,255,0.4)] flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
            </div>

            {/* CASE 1: INTACT FLEXIBLE FLOATING STRING */}
            {!isBreaking && !isBroken && (
              <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="relative flex cursor-grab active:cursor-grabbing flex-col items-center select-none touch-none -mt-1"
              >
                {/* Wide SVG coordinate canvas */}
                <svg
                  width="200"
                  height="340"
                  viewBox="0 0 200 340"
                  className="overflow-visible block"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.9))' }}
                >
                  {/* Organic Flexible Bezier Path */}
                  {isDodgeRound ? (
                    <motion.path
                      initial={{ d: idleFloatingPaths[0] }}
                      animate={{
                        d:
                          dodgeStep === 1
                            ? dodgeRightPath
                            : dodgeStep === 2
                            ? dodgeLeftPath
                            : dodgeStep === 3
                            ? [dodgeZigzagPath, 'M 100 0 C 100 85, 100 170, 100 250']
                            : idleFloatingPaths,
                      }}
                      transition={
                        dodgeStep === 1 || dodgeStep === 2
                          ? { type: 'spring', stiffness: 380, damping: 13 }
                          : dodgeStep === 3
                          ? { duration: 0.8, ease: 'easeOut' }
                          : { duration: 4.8, repeat: Infinity, ease: 'easeInOut' }
                      }
                      stroke="#ffffff"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      fill="none"
                    />
                  ) : (
                    <motion.path
                      animate={
                        rawPullY.get() > 0
                          ? { d: `M 100 0 C 100 85, 100 170, 100 ${250 + rawPullY.get()}` }
                          : { d: idleFloatingPaths }
                      }
                      transition={
                        rawPullY.get() > 0
                          ? { duration: 0.1 }
                          : { duration: 5.2, repeat: Infinity, ease: 'easeInOut' }
                      }
                      stroke="#ffffff"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      fill="none"
                    />
                  )}

                  {/* Flexible Bottom Tip Dot */}
                  <motion.circle
                    cx="100"
                    cy="250"
                    initial={{ cx: 100, cy: 250 }}
                    animate={
                      isDodgeRound
                        ? dodgeStep === 1
                          ? { cx: 175, cy: 240 }
                          : dodgeStep === 2
                          ? { cx: 25, cy: 240 }
                          : dodgeStep === 3
                          ? { cx: 100, cy: 250 }
                          : { cx: [86, 93, 114, 107, 86], cy: [250, 250, 250, 250, 250] }
                        : rawPullY.get() > 0
                        ? { cx: 100, cy: 250 + rawPullY.get() }
                        : { cx: [86, 93, 114, 107, 86], cy: [250, 250, 250, 250, 250] }
                    }
                    transition={
                      isDodgeRound
                        ? dodgeStep === 1 || dodgeStep === 2
                          ? { type: 'spring', stiffness: 380, damping: 13 }
                          : dodgeStep === 3
                          ? { duration: 0.8 }
                          : { duration: 5.2, repeat: Infinity, ease: 'easeInOut' }
                        : rawPullY.get() > 0
                        ? { duration: 0.1 }
                        : { duration: 5.2, repeat: Infinity, ease: 'easeInOut' }
                    }
                    r="2.2"
                    fill="#ffffff"
                  />
                </svg>

                {/* Glowing Touch/Grab Target at string bottom */}
                <motion.div
                  animate={{
                    x: getTipOffset().x,
                    y: getTipOffset().y + (rawPullY.get() > 0 ? rawPullY.get() : 0),
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 14 }}
                  style={{ position: 'absolute', top: 235 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 blur-xs transition-all duration-300 hover:bg-white/35 active:scale-125"
                >
                  <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                </motion.div>
              </div>
            )}

            {/* CASE 2: BREAKING & BROKEN STATES */}
            {(isBreaking || isBroken) && (
              <div className="relative flex flex-col items-center -mt-1">
                {/* Top Stub (50px) with flexible dangling curved tail */}
                <svg
                  width="200"
                  height="65"
                  viewBox="0 0 200 65"
                  className="overflow-visible block"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.85))' }}
                >
                  <path
                    d="M 100 0 C 102 18, 98 35, 100 50"
                    stroke="#ffffff"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Micro frayed fiber strands at break tip */}
                  <g className="animate-pulse">
                    <line x1="100" y1="48" x2="96" y2="55" stroke="#ffffff" strokeWidth="1.2" />
                    <line x1="100" y1="48" x2="104" y2="54" stroke="#ffffff" strokeWidth="1.2" />
                  </g>
                </svg>

                {/* Sparkle Particles Burst at Break Point (y = 50px) */}
                {isBreaking && (
                  <div className="absolute top-[50px] left-1/2 -translate-x-1/2 pointer-events-none z-30">
                    {particles.map((p) => (
                      <motion.div
                        key={p.id}
                        initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                        animate={{
                          x: p.vx * 0.45,
                          y: p.vy * 0.45,
                          scale: 0,
                          opacity: 0,
                          rotate: p.rotation + 360,
                        }}
                        transition={{ duration: 0.85, ease: 'easeOut' }}
                        style={{
                          position: 'absolute',
                          width: p.size,
                          height: p.size,
                          borderRadius: '50%',
                          backgroundColor: p.color,
                          boxShadow: `0 0 8px ${p.color}`,
                        }}
                      />
                    ))}
                    {/* Central flash shockwave */}
                    <motion.div
                      initial={{ scale: 0.2, opacity: 1 }}
                      animate={{ scale: 3.5, opacity: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="h-8 w-8 -ml-4 -mt-4 rounded-full bg-white blur-xs"
                    />
                  </div>
                )}

                {/* Falling Lower Thread Segment */}
                {isBreaking && (
                  <motion.div
                    initial={{ y: 50, rotate: 0, opacity: 1 }}
                    animate={{
                      y: [50, 160, 480, 1300],
                      x: [0, 15, -25, 40],
                      rotate: [0, 18, 55, 110],
                      opacity: [1, 1, 0.9, 0],
                    }}
                    transition={{
                      duration: 1.05,
                      ease: [0.45, 0, 0.9, 0.2],
                    }}
                    style={{ position: 'absolute', top: 0 }}
                    className="pointer-events-none select-none"
                  >
                    <svg
                      width="200"
                      height="215"
                      viewBox="0 0 200 215"
                      className="overflow-visible"
                      style={{ filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.85))' }}
                    >
                      <path
                        d="M 100 0 C 115 65, 85 140, 100 200"
                        stroke="#ffffff"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <circle cx="100" cy="200" r="2" fill="#ffffff" />
                    </svg>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* ---------------------------------------------------- */}
          {/* ANIMATED SPEECH BUBBLE (Clean text, vibrant emojis)  */}
          {/* ---------------------------------------------------- */}
          <AnimatePresence>
            {showSpeechBubble && !isBreaking && !isBroken && (
              <motion.div
                key={isDodgeRound ? `dodge-bubble-${dodgeStep}` : 'normal-bubble'}
                initial={{ opacity: 0, scale: 0.4, y: 15 }}
                animate={{
                  opacity: 1,
                  scale: [0.4, 1.12, 1],
                  y: [15, -4, 0],
                }}
                exit={{
                  opacity: 0,
                  scale: 0.7,
                  y: -10,
                  transition: { duration: 0.25 },
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.175, 0.885, 0.32, 1.275],
                }}
                className="relative mt-8 z-30 flex flex-col items-center"
              >
                {/* Floating Container with Gentle Hover Bob */}
                <motion.div
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative flex flex-col items-center"
                >
                  {/* Comic Speech Bubble Pointer Tip */}
                  <div className="relative -mb-1 z-10">
                    <div className="w-0 h-0 border-x-8 border-x-transparent border-b-[10px] border-b-pink-400/90 rotate-180 drop-shadow-sm" />
                  </div>

                  {/* Main Pinkish/Reddish/White Frosted Glass Bubble Card */}
                  <div className="relative max-w-sm sm:max-w-md mx-4 rounded-2xl border-2 border-pink-400/90 bg-gradient-to-br from-[#2a0816]/95 via-[#4a0a22]/90 to-[#1e0510]/95 px-6 py-4.5 backdrop-blur-2xl shadow-[0_0_40px_rgba(244,63,94,0.6)] text-center">
                    {/* Subtle inner highlight */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/10 to-pink-200/20 pointer-events-none" />

                    {/* Header Tag */}
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-pink-300 fill-pink-300 animate-bounce" />
                      <span className="text-[11px] font-extrabold tracking-widest uppercase text-pink-200">
                        {isDodgeRound ? 'Slippery String Mode 🏃‍♀️💨' : 'Almost there!'}
                      </span>
                      <PartyPopper className="h-3.5 w-3.5 text-pink-300 animate-pulse" />
                    </div>

                    {/* Bubble Dialogue Message (Solid crisp text, natural vibrant emojis) */}
                    <p className="text-base sm:text-lg md:text-xl font-black tracking-wide text-white drop-shadow-sm">
                      {isDodgeRound
                        ? dodgeMessage || 'Hehe ab pakad ke dikhao Shalini 😜💨'
                        : '“Jor se khincho Shalini, taakat lagao” 💪💥'}
                    </p>

                    <p className="mt-2 text-xs sm:text-sm text-pink-200/95 font-medium">
                      {isDodgeRound
                        ? dodgeStep < 3
                          ? 'Try to catch and pull it again!'
                          : 'You got it! Pull down hard!'
                        : 'Pull once more with full power!'}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---------------------------------------------------- */}
          {/* INTERACTIVE PROMPT / RESET BUTTON (Clean & Crisp)    */}
          {/* ---------------------------------------------------- */}
          <div className="mt-8 z-20 flex flex-col items-center">
            <AnimatePresence mode="wait">
              {!isBroken ? (
                <motion.div
                  key={isDodgeRound ? `dodge-prompt-${dodgeStep}` : 'normal-prompt'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={handlePullAction}
                  className="flex cursor-pointer items-center gap-3 rounded-full border border-pink-400/60 bg-gradient-to-r from-rose-600/35 via-pink-600/35 to-red-600/35 px-6 py-3 backdrop-blur-md shadow-[0_0_30px_rgba(244,63,94,0.45)] transition-all duration-300 hover:scale-105 hover:border-pink-300 hover:shadow-[0_0_45px_rgba(244,63,94,0.7)] active:scale-95"
                >
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowDown className="h-4 w-4 text-pink-200" />
                  </motion.div>

                  <span className="text-sm sm:text-base font-extrabold tracking-wide text-white drop-shadow-xs">
                    {isDodgeRound
                      ? dodgeStep === 0
                        ? 'Ab khinch ke dikhao 😏'
                        : dodgeStep === 1
                        ? 'Right me bhaaga! Pakdo! 🏃‍♀️'
                        : dodgeStep === 2
                        ? 'Left me bhaaga! Idhar pakdo! 🏃‍♀️'
                        : 'Pakad liya! Ab khincho zor se! 💥'
                      : pullCount === 0
                      ? "Isko jor se khincho shalini (●'◡'●)"
                      : 'Taakat lagao! Pull again 💥'}
                  </span>

                  <Sparkles className="h-4 w-4 text-pink-200 animate-pulse" />
                </motion.div>
              ) : (
                <motion.div
                  key="prompt-broken"
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-col items-center gap-4 text-center"
                >
                  <div className="rounded-2xl border border-pink-400/50 bg-gradient-to-br from-[#2a0816]/90 via-[#3a081e]/85 to-[#1a040d]/90 px-6 py-4.5 backdrop-blur-md shadow-[0_0_35px_rgba(244,63,94,0.5)]">
                    <p className="text-base sm:text-lg font-black text-white drop-shadow-sm">
                      💥 Itna jor se nhi khinchna tha Shalini😂
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={handleStartDodgeRound}
                      className="flex items-center gap-2 rounded-full border border-pink-400/60 bg-gradient-to-r from-rose-600/35 via-pink-600/35 to-red-600/35 px-5 py-2.5 text-xs sm:text-sm font-bold text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-rose-600/50 hover:border-pink-300 active:scale-95 shadow-[0_0_25px_rgba(244,63,94,0.45)]"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-pink-200" />
                      <span>Phir se khinch leti hoo, mera kya hai 😏</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
