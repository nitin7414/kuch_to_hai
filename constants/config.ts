export const EXPERIENCE_CONFIG = {
  butterflies: {
    baseCountHighTier: 28,
    baseCountMediumTier: 16,
    baseCountLowTier: 8,
    maxSpeed: 1.2,
    colors: ['#FFD700', '#FFB6C1', '#E6E6FA', '#F0E68C', '#FFA07A'],
  },
  canvas3D: {
    cameraFov: 45,
    cameraPosition: [0, 0, 5] as [number, number, number],
    ambientLightIntensity: 0.8,
    directionalLightIntensity: 1.5,
    maxTiltAngle: 0.35,
  },
  videoReels: {
    inViewThreshold: 0.6,
    snapScrollDurationMs: 400,
  },
  audio: {
    defaultVolume: 0.7,
    fadeDurationMs: 800,
  },
} as const;
