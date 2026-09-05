'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Timer, Camera, Check, Smile } from 'lucide-react';
import TwoDCake from '@/components/dom/cake/TwoDCake';
import CandleButterflyCanvas from '@/components/dom/background/CandleButterflyCanvas';
import CinematicFireworks from '@/components/dom/fireworks/CinematicFireworks';
import { soundFx } from '@/utils/soundEffects';

interface CakeRevealSectionProps {
  onReplay?: () => void;
}

type RevealState =
  | 'match_ready'
  | 'match_ignited'
  | 'countdown'
  | 'confirm_blown'
  | 'photo_revealed'
  | 'fireworks';

export default function CakeRevealSection({ onReplay }: CakeRevealSectionProps) {
  const [revealState, setRevealState] = useState<RevealState>('match_ready');
  const [isCurtainComplete, setIsCurtainComplete] = useState<boolean>(false);
  const [isMatchIgnited, setIsMatchIgnited] = useState<boolean>(false);
  const [isCandleLit, setIsCandleLit] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [hasBlown, setHasBlown] = useState<boolean>(false);
  const [matchSparks, setMatchSparks] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number }>>([]);
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; x: number; y: number; color: string; size: number; duration: number; delay: number }>>([]);

  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const confirmTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const photoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Play smooth curtain raising sound as it opens
    const curtainSoundTimer = setTimeout(() => {
      soundFx.playSlideTransition();
    }, 250);

    // Generate floating celebration confetti pieces
    const colors = ['#f43f5e', '#fb7185', '#ffffff', '#ffd1dc', '#facc15', '#fb923c'];
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 5 + Math.random() * 7,
      duration: 3 + Math.random() * 3,
      delay: Math.random() * 2,
    }));
    setConfettiPieces(pieces);

    return () => {
      clearTimeout(curtainSoundTimer);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
      if (photoHideTimeoutRef.current) clearTimeout(photoHideTimeoutRef.current);
    };
  }, []);

  // 1. Strike & Ignite Matchstick (Drag & Drop or Tap)
  const handleStrikeMatch = () => {
    if (isMatchIgnited) return;

    soundFx.playMatchstickStrike();
    soundFx.playBackgroundMusic(0.35); // Play soothing Happy Birthday song till the end!
    setIsMatchIgnited(true);
    setRevealState('match_ignited');

    // Generate spark burst
    const sparks = Array.from({ length: 16 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5);
      const speed = 35 + Math.random() * 65;
      return {
        id: i,
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      };
    });
    setMatchSparks(sparks);

    // Play bubble pop sound for "Shalini candle to jalao "
    setTimeout(() => {
      soundFx.playBubblePop();
    }, 600);
  };

  // Helper: Start 5-Second Dramatic Countdown Timer
  const startCountdownTimer = () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);

    setRevealState('countdown');
    soundFx.playBubblePop();
    setCountdown(5);
    soundFx.playDramaticClockTick(5);

    let currentCount = 5;
    countdownIntervalRef.current = setInterval(() => {
      currentCount -= 1;
      if (currentCount > 1) {
        // Play tick tick for 4, 3, 2
        setCountdown(currentCount);
        soundFx.playDramaticClockTick(currentCount);
      } else if (currentCount === 1) {
        // When timer goes to 1, stop the tick tick sound completely!
        setCountdown(1);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

        // After 2 seconds of the timer stopping on 1, ask "Pkka blow kiya na screen pe?🙄"
        confirmTimeoutRef.current = setTimeout(() => {
          soundFx.playBubblePop();
          setRevealState('confirm_blown');
        }, 2000);
      } else {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      }
    }, 1000);
  };

  // 2. Light Candles on Cake & Start Countdown
  const handleLightCandles = () => {
    if (isCandleLit) return;

    soundFx.playMatchstickStrike();
    setIsCandleLit(true);
    setHasBlown(false);

    setTimeout(() => {
      startCountdownTimer();
    }, 400);
  };

  // 3. User clicked: "Haan kr diya" -> Show photo for 3-4 seconds then disappear with transition
  const handleConfirmedBlown = () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);

    soundFx.playCandleBlow();
    setIsCandleLit(false);
    setHasBlown(true);
    setRevealState('photo_revealed');

    setTimeout(() => {
      soundFx.playCelebrationFanfare();
    }, 250);

    // Image appears, then disappears with transition after 3.5s!
    photoHideTimeoutRef.current = setTimeout(() => {
      soundFx.stopCelebrationFanfare();
      setRevealState('fireworks');
    }, 3500);
  };

  // 4. User clicked: "Nahi, kr deti hoo" -> Restart timer & loop until "Haan kr diya" is clicked
  const handleNotYetBlown = () => {
    startCountdownTimer();
  };

  if (revealState === 'fireworks') {
    return <CinematicFireworks />;
  }

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-between overflow-hidden bg-[#07050f] select-none">
      {/* ---------------------------------------------------- */}
      {/* 0. INSTANT CURTAIN DROP WITH STRING & THEATRICAL LIFT */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {!isCurtainComplete && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{
              y: ['-100%', '0%', '0%', '-108%'],
            }}
            transition={{
              duration: 3.2,
              times: [0, 0.22, 0.32, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={() => setIsCurtainComplete(true)}
            className="fixed inset-0 z-[100] pointer-events-none flex flex-col justify-end overflow-hidden select-none shadow-[0_35px_80px_rgba(0,0,0,0.95)]"
            style={{
              background: 'linear-gradient(180deg, #0e0208 0%, #1e0313 25%, #32051e 60%, #16020e 100%)',
              willChange: 'transform',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Theatrical Velvet Pleats & Drapery Shadow Texture */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, rgba(0,0,0,0.8) 0px, transparent 20px, rgba(255,255,255,0.06) 40px, rgba(0,0,0,0.85) 60px)',
              }}
            />

            {/* Ambient Spotlight Vignette on Curtain Surface */}
            <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/90 pointer-events-none" />

            {/* Cinematic Stage Light Leak Beam under rising curtain */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.85, 0] }}
              transition={{ duration: 3.2, times: [0, 0.32, 0.65, 1], ease: 'easeInOut' }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-16 w-full max-w-4xl bg-gradient-to-t from-amber-400/30 via-rose-500/15 to-transparent blur-xl pointer-events-none"
            />

            {/* Bottom Gold-Embroidered Stage Hem & Tassels */}
            <div className="relative z-10 w-full flex flex-col items-center">
              {/* Golden Ribbon Trim */}
              <div className="h-3 w-full bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-600 shadow-[0_0_25px_#f59e0b]" />

              {/* Gold Tassel Fringe Pattern */}
              <div
                className="h-7 w-full opacity-95 shadow-lg"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, #92400e 0px, #fde047 6px, #d97706 12px, #78350f 18px)',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* 1. SMOOTH ROOM LIGHTING TRANSITION                   */}
      {/* ---------------------------------------------------- */}
      {/* Background Deep Room Lighting Ambiance */}
      <motion.div
        animate={{
          opacity: isMatchIgnited ? 1 : 0,
        }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1a0818] via-[#240a1c] to-[#120410]"
      />

      {/* Warm Ambient Glow Balls expanding across the room */}
      <motion.div
        animate={{
          opacity: isMatchIgnited ? (isCandleLit || hasBlown ? 1 : 0.65) : 0,
          scale: isMatchIgnited ? 1 : 0.4,
        }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[550px] md:h-[850px] md:w-[850px] rounded-full bg-gradient-to-tr from-rose-600/30 via-pink-500/20 to-amber-500/25 blur-[160px]"
      />

      {/* ---------------------------------------------------- */}
      {/* 2. PROGRESSIVE 2D BUTTERFLIES IN BACKGROUND          */}
      {/* ---------------------------------------------------- */}
      <CandleButterflyCanvas isCandleLit={isCandleLit || hasBlown} />

      {/* Floating 2D Celebration Confetti */}
      {(isCandleLit || hasBlown) && (
        <div className="pointer-events-none absolute inset-0 z-15 overflow-hidden">
          {confettiPieces.map((c) => (
            <motion.div
              key={`confetti-${c.id}`}
              initial={{ y: -20, opacity: 0, x: `${c.x}vw` }}
              animate={{
                y: '105vh',
                opacity: [0, 1, 1, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: c.duration,
                repeat: Infinity,
                delay: c.delay,
                ease: 'linear',
              }}
              style={{
                position: 'absolute',
                width: c.size,
                height: c.size * 1.4,
                backgroundColor: c.color,
                borderRadius: '2px',
              }}
            />
          ))}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TOP DIALOGUE AREA                                    */}
      {/* ---------------------------------------------------- */}
      <div className="relative z-30 pt-6 sm:pt-8 flex flex-col items-center min-h-[90px]">
        <AnimatePresence mode="wait">
          {/* STAGE 1: "ye matchis ko uthaao shalini" */}
          {revealState === 'match_ready' && (
            <motion.div
              key="text-pickup"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
              className="text-center px-4"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-[0_2px_16px_rgba(251,191,36,0.6)] tracking-wide">
                ye matchis ko uthaao shalini
              </h2>
            </motion.div>
          )}

          {/* STAGE 2: "Shalini candle to jalao " */}
          {revealState === 'match_ignited' && (
            <motion.div
              key="text-candle"
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.3 } }}
              transition={{ duration: 0.45, ease: [0.175, 0.885, 0.32, 1.275] }}
              className="text-center px-4"
            >
              <div className="rounded-2xl border border-pink-400/70 bg-gradient-to-br from-[#2a0816]/95 via-[#4a0a22]/90 to-[#1e0510]/95 px-6 py-3 backdrop-blur-2xl shadow-[0_0_35px_rgba(244,63,94,0.6)]">
                <p className="text-base sm:text-xl md:text-2xl font-black text-white drop-shadow-sm flex items-center justify-center gap-2">
                  <span>Shalini candle to jalao </span>
                  <Flame className="h-5 w-5 text-amber-400 fill-amber-400 animate-pulse" />
                </p>
              </div>
            </motion.div>
          )}

          {/* STAGE 3: "Counting 1 hote hi blow krna candle ko" + 5s Dramatic Countdown */}
          {revealState === 'countdown' && (
            <motion.div
              key="text-countdown"
              initial={{ opacity: 0, scale: 0.85, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.3 } }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex flex-col items-center gap-3 text-center px-4"
            >
              {/* Dialogue Box */}
              <div className="rounded-2xl border-2 border-amber-400/80 bg-gradient-to-br from-[#2a0816]/95 via-[#4a0a22]/90 to-[#1e0510]/95 px-6 py-3.5 backdrop-blur-2xl shadow-[0_0_40px_rgba(245,158,11,0.55)]">
                <p className="text-base sm:text-lg md:text-xl font-black text-white drop-shadow-sm flex items-center justify-center gap-2">
                  <span>Counting 1 hote hi blow krna candle ko</span>
                  <Timer className="h-5 w-5 text-amber-300 animate-pulse" />
                </p>
              </div>

              {/* 5-Second Dramatic Countdown Clock Badge */}
              {countdown !== null && (
                <motion.div
                  key={`badge-${countdown}`}
                  initial={{ scale: 1.35, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className={`flex items-center gap-2 rounded-full border-2 px-6 py-1.5 shadow-[0_0_25px_rgba(245,158,11,0.8)] ${
                    countdown === 1
                      ? 'border-pink-300 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 animate-pulse'
                      : 'border-amber-300/80 bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-100">
                    {countdown === 1 ? '1 - BLOW CANDLES NOW! 💨' : `Countdown: ${countdown}s`}
                  </span>
                  <span className="text-lg sm:text-2xl font-black text-white drop-shadow-md">
                    {countdown}
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STAGE 4: "Pkka blow kiya na screen pe?🙄" with 2 options */}
          {revealState === 'confirm_blown' && (
            <motion.div
              key="text-confirm-blown"
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.3 } }}
              transition={{ duration: 0.45, ease: [0.175, 0.885, 0.32, 1.275] }}
              className="flex flex-col items-center gap-4 text-center px-4"
            >
              <div className="rounded-2xl border-2 border-pink-400/80 bg-gradient-to-br from-[#2a0816]/95 via-[#4a0a22]/90 to-[#1e0510]/95 px-7 py-4 backdrop-blur-2xl shadow-[0_0_40px_rgba(244,63,94,0.7)]">
                <p className="text-lg sm:text-2xl font-black text-white drop-shadow-md">
                  Pkka blow kiya na screen pe?🙄
                </p>
              </div>

              {/* 2 Options */}
              <div className="flex flex-wrap items-center justify-center gap-3.5">
                <button
                  onClick={handleConfirmedBlown}
                  className="flex items-center gap-2 rounded-full border-2 border-emerald-400/80 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 px-6 py-2.5 text-sm sm:text-base font-black text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(16,185,129,0.5)] cursor-pointer"
                >
                  <Check className="h-4 w-4 text-emerald-100" />
                  <span>Haan kr diya</span>
                </button>

                <button
                  onClick={handleNotYetBlown}
                  className="flex items-center gap-2 rounded-full border border-pink-400/60 bg-gradient-to-r from-rose-950/80 via-pink-950/70 to-rose-950/80 px-6 py-2.5 text-sm sm:text-base font-bold text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(244,63,94,0.4)] cursor-pointer"
                >
                  <Smile className="h-4 w-4 text-pink-200" />
                  <span>Nahi, kr deti hoo</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* STAGE 5: "Ye tumhari photo click ho gyi thi blow krte hue" (Visible during 3s photo reveal) */}
          {revealState === 'photo_revealed' && (
            <motion.div
              key="text-photo-caption"
              initial={{ opacity: 0, scale: 0.85, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -15, transition: { duration: 0.6 } }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-center px-4"
            >
              <div className="rounded-2xl border-2 border-pink-400/80 bg-gradient-to-br from-[#2a0816]/95 via-[#4a0a22]/90 to-[#1e0510]/95 px-7 py-3.5 backdrop-blur-2xl shadow-[0_0_40px_rgba(244,63,94,0.7)]">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-white drop-shadow-md flex items-center justify-center gap-2">
                  <span>Ye tumhari photo click ho gyi thi blow krte hue</span>
                  <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-pink-300 animate-bounce" />
                </h1>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. REALISTIC 2D SINGLE-LAYER CAKE / PHOTO MODAL      */}
      {/* ---------------------------------------------------- */}
      <div className="relative z-20 flex flex-1 items-center justify-center w-full my-auto px-4">
        <AnimatePresence mode="wait">
          {/* Photo Reveal Modal: Appears for 3 seconds then disappears with smooth transition */}
          {revealState === 'photo_revealed' ? (
            <motion.div
              key="photo-modal"
              initial={{ scale: 0.35, opacity: 0, rotate: -6 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 30, transition: { duration: 0.7, ease: 'easeInOut' } }}
              transition={{ duration: 0.75, ease: [0.175, 0.885, 0.32, 1.275] }}
              className="relative flex flex-col items-center"
            >
              {/* Polaroid Frame */}
              <div className="relative rounded-2xl bg-white p-3.5 sm:p-4 shadow-[0_20px_60px_rgba(0,0,0,0.85)] border-4 border-pink-300/80 max-w-[280px] sm:max-w-[340px] md:max-w-[380px]">
                <img
                  src="/images/image-blowing-funny.jpg"
                  alt="Shalini blowing candle funny moment"
                  className="w-full h-auto rounded-xl object-cover shadow-inner"
                />
              </div>
            </motion.div>
          ) : (
            /* The Realistic Single-Layer Brown Base Cake */
            <motion.div
              key="cake-view"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{
                opacity: isMatchIgnited ? 1 : 0,
                scale: isMatchIgnited ? 1 : 0.7,
                y: isMatchIgnited ? 0 : 35,
              }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center"
            >
              <TwoDCake isCandleLit={isCandleLit} onCandleClick={handleLightCandles} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------------------------------------------------- */}
        {/* MATCHSTICK (100% Stable, Continuous, Never Blinks)   */}
        {/* ---------------------------------------------------- */}
        {!isCandleLit && !hasBlown && (
          <motion.div
            drag
            dragSnapToOrigin={false}
            dragElastic={0.15}
            onDragEnd={() => {
              if (!isMatchIgnited) {
                handleStrikeMatch();
              } else {
                handleLightCandles();
              }
            }}
            onClick={() => {
              if (!isMatchIgnited) {
                handleStrikeMatch();
              } else {
                handleLightCandles();
              }
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={
              isMatchIgnited
                ? {
                    x: [0, 45, 20],
                    y: [0, -60, -45],
                    rotate: [-12, -4, -8],
                    transition: { duration: 0.7, ease: 'easeOut' },
                  }
                : {
                    y: [0, -7, 0],
                    rotate: [-6, -2, -6],
                    transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
                  }
            }
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 1.05 }}
            className="absolute z-40 flex cursor-grab active:cursor-grabbing flex-col items-center select-none touch-none"
          >
            {/* Animated Flame on Matchstick when ignited */}
            {isMatchIgnited && (
              <div className="relative -mb-2 z-30 flex flex-col items-center">
                {/* Dynamic Flame Glow */}
                <div className="absolute -top-4 h-20 w-20 rounded-full bg-radial from-amber-400/80 via-orange-500/30 to-transparent blur-lg animate-pulse" />

                {/* Flame Body */}
                <motion.div
                  animate={{
                    scale: [1, 1.25, 0.95, 1.15],
                    rotate: [-3, 4, -3, 2],
                    skewX: [-3, 4, -2],
                  }}
                  transition={{ duration: 0.22, repeat: Infinity }}
                  className="relative flex flex-col items-center"
                >
                  {/* Inner Core Flame */}
                  <div className="h-7 w-2.5 rounded-full bg-gradient-to-t from-orange-600 via-amber-300 to-yellow-100 shadow-[0_0_15px_#f59e0b]" />
                  {/* Outer Glow */}
                  <div className="absolute -top-0.5 h-8.5 w-4.5 rounded-full bg-gradient-to-t from-red-500/70 via-amber-400/60 to-transparent blur-[1.5px]" />
                </motion.div>

                {/* Sparks */}
                {matchSparks.map((spark) => (
                  <motion.div
                    key={spark.id}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: spark.vx * 0.35,
                      y: spark.vy * 0.35 + 15,
                      opacity: 0,
                      scale: 0.2,
                    }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="absolute top-1 h-1 w-1 rounded-full bg-yellow-200 shadow-[0_0_6px_#fef08a]"
                  />
                ))}
              </div>
            )}

            {/* Matchstick Tip (Small Red Sulfur Head - No borders) */}
            <div
              className={`relative z-20 h-4.5 w-3 rounded-t-full rounded-b-xs ${
                isMatchIgnited
                  ? 'bg-gradient-to-b from-amber-300 via-orange-600 to-red-700 shadow-[0_0_12px_#f97316]'
                  : 'bg-gradient-to-b from-red-600 via-rose-700 to-red-800'
              }`}
            />

            {/* Matchstick Small Wooden Stem (No borders) */}
            <div className="relative z-10 -mt-0.5 h-16 w-2 rounded-b-xs bg-gradient-to-b from-[#e8caa4] via-[#dfb78c] to-[#c89865] shadow-[0_2px_8px_rgba(0,0,0,0.5)]" />
          </motion.div>
        )}
      </div>
    </div>
  );
}
