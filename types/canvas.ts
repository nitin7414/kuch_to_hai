export interface CardPhysicsState {
  rotationX: number;
  rotationY: number;
  isHovered: boolean;
  isFlipped: boolean;
  isOpen: boolean;
}

export interface ButterflyParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  angle: number;
  flapSpeed: number;
  flapPhase: number;
  color: string;
  opacity: number;
  targetX?: number;
  targetY?: number;
}

export interface CanvasQualitySettings {
  dpr: number;
  enablePostProcessing: boolean;
  enableShadows: boolean;
  particleCount: number;
}
