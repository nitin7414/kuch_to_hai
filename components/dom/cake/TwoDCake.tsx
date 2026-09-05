'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TwoDCakeProps {
  isCandleLit: boolean;
  onCandleClick?: () => void;
}

export default function TwoDCake({ isCandleLit, onCandleClick }: TwoDCakeProps) {
  // 5 Candles positioned evenly across the single layer cake top
  const candles = [
    { id: 1, x: 110, y: 165, height: 42 },
    { id: 2, x: 155, y: 158, height: 48 },
    { id: 3, x: 200, y: 152, height: 54 }, // Center tall candle
    { id: 4, x: 245, y: 158, height: 48 },
    { id: 5, x: 290, y: 165, height: 42 },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center select-none pointer-events-auto">
      {/* Dynamic Warm Candle Lighting Glow */}
      {isCandleLit && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="pointer-events-none absolute -top-12 h-80 w-80 md:h-96 md:w-96 rounded-full bg-radial from-amber-400/45 via-orange-500/25 to-transparent blur-3xl animate-pulse"
        />
      )}

      {/* Main Single-Layer Realistic Cake SVG */}
      <svg
        width="400"
        height="360"
        viewBox="0 0 400 360"
        className="overflow-visible w-[310px] sm:w-[370px] md:w-[420px] h-auto drop-shadow-[0_25px_45px_rgba(0,0,0,0.65)]"
      >
        <defs>
          {/* Shadow Filter */}
          <filter id="cake-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000000" floodOpacity="0.5" />
          </filter>

          {/* Stand Plate Gradient */}
          <linearGradient id="standGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f4f4f5" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          {/* Realistic Brown Cake Sponge Gradient */}
          <linearGradient id="brownSpongeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8c532b" />
            <stop offset="25%" stopColor="#78411d" />
            <stop offset="70%" stopColor="#5c2e11" />
            <stop offset="100%" stopColor="#431f08" />
          </linearGradient>

          {/* Sponge Texture Gradient */}
          <linearGradient id="spongeSideHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#431f08" />
            <stop offset="20%" stopColor="#8c532b" />
            <stop offset="50%" stopColor="#a36336" />
            <stop offset="80%" stopColor="#78411d" />
            <stop offset="100%" stopColor="#3b1a05" />
          </linearGradient>

          {/* Cream Top Frosting Gradient */}
          <linearGradient id="topCreamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#fff1f2" />
            <stop offset="100%" stopColor="#ffe4e6" />
          </linearGradient>

          {/* Strawberry Drip / Ganache Gradient */}
          <linearGradient id="creamDripGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="75%" stopColor="#fecdd3" />
            <stop offset="100%" stopColor="#fda4af" />
          </linearGradient>

          {/* Gold Trim Gradient */}
          <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Candle Flame Gradient */}
          <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="75%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Candle Stripe Gradient */}
          <linearGradient id="candleBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#fff1f2" />
            <stop offset="100%" stopColor="#fed7aa" />
          </linearGradient>
        </defs>

        {/* ---------------------------------------------------- */}
        {/* 1. PEDESTAL CAKE STAND                               */}
        {/* ---------------------------------------------------- */}
        <g id="cake-stand">
          {/* Soft Shadow Under Stand */}
          <ellipse cx="200" cy="335" rx="150" ry="16" fill="rgba(0,0,0,0.55)" filter="blur(8px)" />
          {/* Pedestal Foot */}
          <ellipse cx="200" cy="325" rx="95" ry="12" fill="url(#standGrad)" stroke="#cbd5e1" strokeWidth="1.5" />
          <path d="M 180 325 L 188 285 L 212 285 L 220 325 Z" fill="url(#standGrad)" />
          {/* Main Cake Plate */}
          <ellipse cx="200" cy="285" rx="175" ry="20" fill="url(#standGrad)" stroke="#e2e8f0" strokeWidth="2" />
          <ellipse cx="200" cy="282" rx="168" ry="16" fill="#ffffff" />
        </g>

        {/* ---------------------------------------------------- */}
        {/* 2. REALISTIC SINGLE-LAYER BROWN CAKE                 */}
        {/* ---------------------------------------------------- */}
        <g id="single-layer-cake">
          {/* Main Brown Sponge Cylinder Body */}
          <path
            d="M 60 195 L 60 265 C 60 292 340 292 340 265 L 340 195 Z"
            fill="url(#spongeSideHighlight)"
            filter="url(#cake-shadow)"
          />

          {/* Realistic Sponge Texture & Dark Chocolate Crumbs */}
          {Array.from({ length: 14 }).map((_, i) => {
            const cx = 80 + i * 18.5;
            const cy = 268 + Math.sin((i / 13) * Math.PI) * 9;
            return (
              <g key={`crumb-${i}`}>
                <circle cx={cx} cy={cy} r="2.5" fill="#3b1a05" opacity="0.6" />
                <circle cx={cx + 4} cy={cy - 12} r="1.5" fill="#5c2e11" opacity="0.7" />
              </g>
            );
          })}

          {/* Lush White & Strawberry Cream Drips along the Rim */}
          <path
            d="M 60 200 
               C 70 225, 80 225, 90 200 
               C 100 238, 115 238, 125 200 
               C 135 220, 145 220, 155 200 
               C 165 245, 185 245, 195 200 
               C 205 225, 215 225, 225 200 
               C 235 242, 255 242, 265 200 
               C 275 220, 285 220, 295 200 
               C 305 235, 320 235, 330 200 
               C 335 215, 338 215, 340 200 
               L 340 195 L 60 195 Z"
            fill="url(#creamDripGrad)"
            opacity="0.96"
          />

          {/* Frosting Pearls around the Base */}
          {Array.from({ length: 16 }).map((_, i) => {
            const cx = 72 + i * 17;
            const cy = 270 + Math.sin((i / 15) * Math.PI) * 11;
            return (
              <circle
                key={`pearl-${i}`}
                cx={cx}
                cy={cy}
                r="4.5"
                fill="#ffffff"
                stroke="#fda4af"
                strokeWidth="1"
              />
            );
          })}

          {/* Gold Decorative Waves on Brown Sponge */}
          <path
            d="M 65 235 Q 110 255 155 235 Q 200 255 245 235 Q 290 255 335 235"
            fill="none"
            stroke="url(#goldTrim)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Single Cake Top Surface (Rich White Glaze with Rose Tone) */}
          <ellipse
            cx="200"
            cy="195"
            rx="140"
            ry="25"
            fill="url(#topCreamGrad)"
            stroke="#fecdd3"
            strokeWidth="2"
          />

          {/* Fresh Ripe Strawberries on Top Rim */}
          {[
            { cx: 95, cy: 195, scale: 0.95 },
            { cx: 135, cy: 206, scale: 1.0 },
            { cx: 175, cy: 212, scale: 1.05 },
            { cx: 225, cy: 212, scale: 1.05 },
            { cx: 265, cy: 206, scale: 1.0 },
            { cx: 305, cy: 195, scale: 0.95 },
          ].map((s, idx) => (
            <g key={`strawberry-${idx}`} transform={`scale(${s.scale})`} style={{ transformOrigin: `${s.cx}px ${s.cy}px` }}>
              {/* Strawberry Body */}
              <path
                d={`M ${s.cx - 8} ${s.cy} C ${s.cx - 9} ${s.cy - 16}, ${s.cx + 9} ${s.cy - 16}, ${s.cx + 8} ${s.cy} C ${s.cx + 5} ${s.cy + 9}, ${s.cx - 5} ${s.cy + 9}, ${s.cx - 8} ${s.cy} Z`}
                fill="#e11d48"
                stroke="#be123c"
                strokeWidth="1"
              />
              {/* Green Calyx Leaves */}
              <path
                d={`M ${s.cx - 5} ${s.cy - 13} L ${s.cx} ${s.cy - 19} L ${s.cx + 5} ${s.cy - 13} L ${s.cx + 9} ${s.cy - 15} L ${s.cx + 3} ${s.cy - 10} L ${s.cx - 3} ${s.cy - 10} L ${s.cx - 9} ${s.cy - 15} Z`}
                fill="#16a34a"
              />
              {/* Golden Strawberry Seeds */}
              <circle cx={s.cx - 3} cy={s.cy - 4} r="1" fill="#fef08a" />
              <circle cx={s.cx + 3} cy={s.cy - 2} r="1" fill="#fef08a" />
              <circle cx={s.cx} cy={s.cy + 4} r="1" fill="#fef08a" />
            </g>
          ))}
        </g>

        {/* ---------------------------------------------------- */}
        {/* 3. CANDLES & ANIMATED FLAMES (Interactive 5 Candles) */}
        {/* ---------------------------------------------------- */}
        <g id="candles" onClick={onCandleClick} className="cursor-pointer">
          {candles.map((c) => {
            const candleTopY = c.y - c.height;
            return (
              <g key={`candle-${c.id}`}>
                {/* Candle Shadow */}
                <ellipse cx={c.x} cy={c.y} rx="5" ry="2" fill="rgba(0,0,0,0.3)" />

                {/* Candle Body */}
                <rect
                  x={c.x - 3.5}
                  y={candleTopY}
                  width="7"
                  height={c.height}
                  rx="2.5"
                  fill="url(#candleBodyGrad)"
                  stroke="#fda4af"
                  strokeWidth="0.8"
                />

                {/* Golden & Rose Spiral Stripes */}
                <line x1={c.x - 3.5} y1={candleTopY + 10} x2={c.x + 3.5} y2={candleTopY + 15} stroke="#f43f5e" strokeWidth="2.2" />
                <line x1={c.x - 3.5} y1={candleTopY + 22} x2={c.x + 3.5} y2={candleTopY + 27} stroke="#fbbf24" strokeWidth="2.2" />
                <line x1={c.x - 3.5} y1={candleTopY + 34} x2={c.x + 3.5} y2={candleTopY + 39} stroke="#f43f5e" strokeWidth="2.2" />

                {/* Wick */}
                <line x1={c.x} y1={candleTopY} x2={c.x} y2={candleTopY - 7} stroke="#27272a" strokeWidth="1.6" strokeLinecap="round" />

                {/* Animated Candle Flame (when lit) */}
                {isCandleLit && (
                  <g>
                    {/* Outer Flame Glow Halo */}
                    <circle cx={c.x} cy={candleTopY - 16} r="14" fill="#fbbf24" opacity="0.35" filter="blur(5px)" />

                    {/* Animated Dancing Flame */}
                    <motion.path
                      d={`M ${c.x} ${candleTopY - 7} Q ${c.x - 6} ${candleTopY - 16}, ${c.x} ${candleTopY - 28} Q ${c.x + 6} ${candleTopY - 16}, ${c.x} ${candleTopY - 7} Z`}
                      fill="url(#flameGrad)"
                      animate={{
                        scale: [1, 1.18, 0.94, 1.12],
                        y: [0, -2, 0.6, 0],
                        skewX: [-2.5, 3.5, -2],
                      }}
                      transition={{
                        duration: 0.35 + (c.id % 3) * 0.08,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      style={{ transformOrigin: `${c.x}px ${candleTopY - 7}px` }}
                    />

                    {/* Inner Core Flame */}
                    <motion.ellipse
                      cx={c.x}
                      cy={candleTopY - 12}
                      rx="2.2"
                      ry="4.5"
                      fill="#ffffff"
                      animate={{ opacity: [0.95, 1, 0.85] }}
                      transition={{ duration: 0.2, repeat: Infinity }}
                    />
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
