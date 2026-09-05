'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// ----------------------------------------------------
// 1. INDIVIDUAL CANDLE WITH FLICKERING FLAME
// ----------------------------------------------------
interface CandleProps {
  position: [number, number, number];
  isLit: boolean;
}

function Candle({ position, isLit }: CandleProps) {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (isLit && flameRef.current && lightRef.current) {
      const t = performance.now() * 0.012 + position[0] * 5;
      const flicker = Math.sin(t) * 0.12 + Math.cos(t * 1.7) * 0.08;
      flameRef.current.scale.set(1 + flicker * 0.5, 1 + flicker, 1 + flicker * 0.5);
      lightRef.current.intensity = 1.6 + flicker * 0.8;
    }
  });

  return (
    <group position={position}>
      {/* Candle Body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.8, 16]} />
        <meshStandardMaterial color="#fff1f2" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Golden Stripe Detail */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.062, 0.062, 0.2, 16]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Wick */}
      <mesh position={[0, 0.84, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.08, 8]} />
        <meshBasicMaterial color="#18181b" />
      </mesh>

      {/* Flame & Glowing Point Light */}
      {isLit && (
        <group position={[0, 0.96, 0]}>
          <mesh ref={flameRef}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color="#ffedd5" />
          </mesh>
          <mesh scale={[1.4, 2.0, 1.4]} position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.65} />
          </mesh>
          <pointLight
            ref={lightRef}
            color="#fb923c"
            intensity={1.8}
            distance={4}
            decay={2}
          />
        </group>
      )}
    </group>
  );
}

// ----------------------------------------------------
// 2. STRAWBERRY TOPPING
// ----------------------------------------------------
function Strawberry({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.12, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[0.18, 0.35, 16]} />
        <meshStandardMaterial color="#e11d48" roughness={0.25} metalness={0.1} />
      </mesh>
      {/* Green Calyx Leaves */}
      <mesh position={[0, 0.28, 0]} rotation={[-Math.PI, 0, 0]}>
        <coneGeometry args={[0.16, 0.06, 6]} />
        <meshStandardMaterial color="#15803d" roughness={0.6} />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------
// 3. MULTI-TIER LUXURY 3D BIRTHDAY CAKE
// ----------------------------------------------------
function CakeGeometry({ isLit }: { isLit: boolean }) {
  const cakeGroup = useRef<THREE.Group>(null);

  // Subtle continuous turntable rotation
  useFrame(() => {
    if (cakeGroup.current) {
      cakeGroup.current.rotation.y = performance.now() * 0.00015;
    }
  });

  // Generate decorative icing pearls around rims
  const tier1Pearls = useMemo(() => {
    const items = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * 2.85;
      const z = Math.sin(angle) * 2.85;
      items.push([x, 0.65, z] as [number, number, number]);
    }
    return items;
  }, []);

  const tier2Pearls = useMemo(() => {
    const items = [];
    const count = 20;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * 2.05;
      const z = Math.sin(angle) * 2.05;
      items.push([x, 1.75, z] as [number, number, number]);
    }
    return items;
  }, []);

  const topStrawberries = useMemo(() => {
    const items = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * 1.0;
      const z = Math.sin(angle) * 1.0;
      items.push([x, 2.7, z] as [number, number, number]);
    }
    return items;
  }, []);

  return (
    <group ref={cakeGroup} position={[0, -0.8, 0]}>
      {/* ---------------------------------------------------- */}
      {/* PEDESTAL CAKE STAND                                  */}
      {/* ---------------------------------------------------- */}
      <mesh position={[0, -0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.12, 64]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1.2, 1.8, 0.5, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.78, 0]}>
        <cylinderGeometry args={[2.2, 2.2, 0.08, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.8} />
      </mesh>

      {/* ---------------------------------------------------- */}
      {/* TIER 1 (BOTTOM) - Velvet Rose Pink                   */}
      {/* ---------------------------------------------------- */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.8, 2.8, 1.1, 64]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.35} metalness={0.05} />
      </mesh>
      {/* Tier 1 Frosting Top Ring */}
      <mesh position={[0, 1.01, 0]}>
        <cylinderGeometry args={[2.82, 2.82, 0.08, 64]} />
        <meshStandardMaterial color="#fff1f2" roughness={0.25} metalness={0.05} />
      </mesh>
      {/* Tier 1 Base Pearls */}
      {tier1Pearls.map((pos, idx) => (
        <mesh key={`t1-pearl-${idx}`} position={pos}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.6} />
        </mesh>
      ))}

      {/* ---------------------------------------------------- */}
      {/* TIER 2 (MIDDLE) - Strawberry Cream with Ganache Drip */}
      {/* ---------------------------------------------------- */}
      <mesh position={[0, 1.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.0, 2.0, 1.0, 64]} />
        <meshStandardMaterial color="#fda4af" roughness={0.3} metalness={0.05} />
      </mesh>
      {/* Tier 2 Top Frosting */}
      <mesh position={[0, 2.06, 0]}>
        <cylinderGeometry args={[2.02, 2.02, 0.08, 64]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.05} />
      </mesh>
      {/* Tier 2 Pearls */}
      {tier2Pearls.map((pos, idx) => (
        <mesh key={`t2-pearl-${idx}`} position={pos}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#ffe4e6" roughness={0.2} metalness={0.4} />
        </mesh>
      ))}

      {/* ---------------------------------------------------- */}
      {/* TIER 3 (TOP) - Pure Vanilla White Glaze              */}
      {/* ---------------------------------------------------- */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.3, 0.8, 64]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.05} />
      </mesh>
      {/* Tier 3 Golden Glaze Trim */}
      <mesh position={[0, 2.91, 0]}>
        <cylinderGeometry args={[1.32, 1.32, 0.06, 64]} />
        <meshStandardMaterial color="#fb7185" roughness={0.25} metalness={0.2} />
      </mesh>

      {/* Strawberries on Top Tier Rim */}
      {topStrawberries.map((pos, idx) => (
        <Strawberry key={`straw-${idx}`} position={pos} scale={0.9} />
      ))}

      {/* ---------------------------------------------------- */}
      {/* CANDLES ON TOP TIER                                  */}
      {/* ---------------------------------------------------- */}
      <Candle position={[0, 2.95, 0]} isLit={isLit} />
      <Candle position={[0.48, 2.95, 0.35]} isLit={isLit} />
      <Candle position={[-0.48, 2.95, 0.35]} isLit={isLit} />
      <Candle position={[0.35, 2.95, -0.42]} isLit={isLit} />
      <Candle position={[-0.35, 2.95, -0.42]} isLit={isLit} />
    </group>
  );
}

// ----------------------------------------------------
// 4. FLOATING 3D CONFETTI IN AIR
// ----------------------------------------------------
function FloatingConfetti() {
  const confettiList = useMemo(() => {
    const colors = ['#f43f5e', '#fb7185', '#ffffff', '#ffd1dc', '#facc15', '#fb923c'];
    return Array.from({ length: 65 }, (_, i) => ({
      id: i,
      pos: [
        (Math.random() - 0.5) * 14,
        Math.random() * 8 - 1,
        (Math.random() - 0.5) * 14,
      ] as [number, number, number],
      rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      speed: 0.5 + Math.random() * 1.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 0.08 + Math.random() * 0.12,
    }));
  }, []);

  return (
    <group>
      {confettiList.map((c) => (
        <Float key={c.id} speed={c.speed} rotationIntensity={2} floatIntensity={1.5}>
          <mesh position={c.pos} rotation={c.rot}>
            <planeGeometry args={[c.size, c.size * 1.4]} />
            <meshStandardMaterial color={c.color} side={THREE.DoubleSide} roughness={0.3} metalness={0.2} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// ----------------------------------------------------
// 5. DRONE ORBIT CAMERA RIG
// ----------------------------------------------------
function DroneCameraRig() {
  useFrame(({ camera }) => {
    const t = performance.now() * 0.0002; // Majestic steady drone orbit
    const radius = 9.8;
    const height = 6.8 + Math.sin(t * 2.2) * 0.6; // Gentle high-altitude drone float
    camera.position.x = Math.sin(t) * radius;
    camera.position.z = Math.cos(t) * radius;
    camera.position.y = height;
    camera.lookAt(0, 1.0, 0); // Drone precisely centered on cake
  });

  return null;
}

// ----------------------------------------------------
// 6. MAIN EXPORTED DRONE 3D CAKE CANVAS
// ----------------------------------------------------
interface DroneCakeCanvasProps {
  isCandleLit: boolean;
}

export default function DroneCakeCanvas({ isCandleLit }: DroneCakeCanvasProps) {
  return (
    <div className="relative h-full w-full select-none">
      <Canvas
        shadows="basic"
        className="h-full w-full cursor-grab active:cursor-grabbing"
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* Drone Camera with cinematic telephoto perspective */}
        <PerspectiveCamera makeDefault position={[0, 7.2, 10.2]} fov={38} />
        <DroneCameraRig />

        {/* Smooth Orbit controls for 360 interactive exploration */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.15} // Maintain elevated drone angle
          minPolarAngle={Math.PI / 8}
          minDistance={5}
          maxDistance={16}
        />

        {/* ---------------------------------------------------- */}
        {/* LIGHTING SETUP FOR DRONE VIEW                        */}
        {/* ---------------------------------------------------- */}
        <ambientLight intensity={0.9} />
        {/* Key Overhead Spotlight */}
        <spotLight
          position={[0, 14, 5]}
          angle={0.65}
          penumbra={0.8}
          intensity={3.2}
          color="#ffffff"
          castShadow
          shadow-mapSize={1024}
        />
        {/* Warm Golden Key Light */}
        <directionalLight position={[6, 8, 6]} intensity={1.6} color="#ffe4e6" />
        {/* Romantic Ruby Rim Light */}
        <directionalLight position={[-6, 7, -6]} intensity={1.8} color="#f43f5e" />
        {/* Soft fill light */}
        <pointLight position={[0, -0.5, 0]} intensity={1.4} color="#fda4af" distance={8} />

        {/* 3D Cake */}
        <CakeGeometry isLit={isCandleLit} />

        {/* Floating Confetti & Golden Sparkles */}
        <FloatingConfetti />
        <Sparkles count={80} scale={12} size={3.8} speed={0.4} color="#ffe4e6" />
        <Sparkles count={50} scale={8} size={4.2} speed={0.6} color="#fb7185" />
      </Canvas>
    </div>
  );
}
