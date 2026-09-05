import { create } from 'zustand';
import { ExperiencePhase, PerformanceTier } from '../types/experience';

interface AppState {
  // Navigation & Phases
  currentPhase: ExperiencePhase;
  setCurrentPhase: (phase: ExperiencePhase) => void;

  // 3D Wish Cards State
  activeWishId: string | null;
  openedWishIds: string[];
  setActiveWishId: (id: string | null) => void;
  markWishAsOpened: (id: string) => void;

  // Audio State
  isAudioMuted: boolean;
  isMusicPlaying: boolean;
  masterVolume: number;
  toggleMute: () => void;
  setIsMusicPlaying: (playing: boolean) => void;
  setMasterVolume: (volume: number) => void;

  // System & Performance
  performanceTier: PerformanceTier;
  setPerformanceTier: (tier: PerformanceTier) => void;
  isExperienceLoaded: boolean;
  loadingProgress: number;
  setLoadingProgress: (progress: number) => void;
  setExperienceLoaded: (loaded: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPhase: 'intro',
  setCurrentPhase: (phase) => set({ currentPhase: phase }),

  activeWishId: null,
  openedWishIds: [],
  setActiveWishId: (id) => set({ activeWishId: id }),
  markWishAsOpened: (id) =>
    set((state) => ({
      openedWishIds: state.openedWishIds.includes(id)
        ? state.openedWishIds
        : [...state.openedWishIds, id],
    })),

  isAudioMuted: false,
  isMusicPlaying: false,
  masterVolume: 0.75,
  toggleMute: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
  setIsMusicPlaying: (playing) => set({ isMusicPlaying: playing }),
  setMasterVolume: (volume) => set({ masterVolume: volume }),

  performanceTier: 'high',
  setPerformanceTier: (tier) => set({ performanceTier: tier }),
  isExperienceLoaded: false,
  loadingProgress: 0,
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  setExperienceLoaded: (loaded) => set({ isExperienceLoaded: loaded }),
}));
