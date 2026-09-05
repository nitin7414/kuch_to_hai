export type ExperiencePhase = 'intro' | 'reels' | 'wishes' | 'outro';

export type PerformanceTier = 'high' | 'medium' | 'low';

export interface WishCardData {
  id: string;
  recipientName: string;
  senderName: string;
  title: string;
  shortMessage: string;
  fullLetter: string;
  themeColor: string;
  secondaryColor: string;
  foilType: 'gold' | 'rose-gold' | 'silver' | 'holographic';
  textureUrl?: string;
  unlockedByDefault?: boolean;
}

export interface ReelData {
  id: string;
  title: string;
  caption: string;
  author: string;
  videoSrc: string;
  posterSrc: string;
  durationSeconds?: number;
  tags?: string[];
}

export interface AudioTrackConfig {
  id: string;
  title: string;
  src: string;
  volume: number;
  loop: boolean;
}

export interface SoundEffectTrigger {
  name: 'card-flip' | 'pop' | 'sparkle' | 'whoosh' | 'unlock';
  volume?: number;
}
