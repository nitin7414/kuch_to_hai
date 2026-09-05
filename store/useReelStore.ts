import { create } from 'zustand';

interface ReelState {
  activeReelIndex: number;
  isReelSectionActive: boolean;
  isReelAudioMuted: boolean;
  likedReelIds: string[];
  setActiveReelIndex: (index: number) => void;
  setIsReelSectionActive: (active: boolean) => void;
  toggleReelAudioMute: () => void;
  toggleLikeReel: (id: string) => void;
}

export const useReelStore = create<ReelState>((set) => ({
  activeReelIndex: 0,
  isReelSectionActive: false,
  isReelAudioMuted: false,
  likedReelIds: [],

  setActiveReelIndex: (index) => set({ activeReelIndex: index }),
  setIsReelSectionActive: (active) => set({ isReelSectionActive: active }),
  toggleReelAudioMute: () =>
    set((state) => ({ isReelAudioMuted: !state.isReelAudioMuted })),
  toggleLikeReel: (id) =>
    set((state) => ({
      likedReelIds: state.likedReelIds.includes(id)
        ? state.likedReelIds.filter((item) => item !== id)
        : [...state.likedReelIds, id],
    })),
}));
