import React from 'react';
import ButterflyCanvas from '@/components/dom/background/ButterflyCanvas';
import HeroSection from '@/components/dom/hero/HeroSection';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0d0c1d]">
      {/* Phase 1: Ambient 2D Butterfly Background Engine */}
      <ButterflyCanvas />

      {/* Phase 2: Hero Section & Storyline Entry Orchestration */}
      <HeroSection />

      {/* Placeholder Anchor for Phase 3 (Memory Reels) */}
      <section id="reels" className="relative z-10 min-h-[50vh] w-full" />

      {/* Placeholder Anchor for Phase 4 (3D Wish Cards) */}
      <section id="wishes" className="relative z-10 min-h-[50vh] w-full" />
    </main>
  );
}
