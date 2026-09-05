/**
 * Sound Effects Manager with user provided MP3 audio files & procedural fallback
 */

import { audioSynth } from './audioSynthesizer';

class SoundEffectsManager {
  private audioCache: { [key: string]: HTMLAudioElement } = {};

  constructor() {
    if (typeof window !== 'undefined') {
      this.preloadAudio();
    }
  }

  private preloadAudio() {
    const sounds = {
      'rope-break': '/audio/Rope-Break.mp3',
      'snap-break': '/audio/snap-break.mp3',
      'bubble-pop': '/audio/bubble-pop.mp3',
      'slide-transition': '/audio/slide-transition.mp3',
      'matchstick': '/audio/matchstick.mp3',
      'cake-reveal': '/audio/cake-reveal.mp3',
      'candle-blow': '/audio/candle-blow.mp3',
      'rope-tighten': '/audio/rope-tighten.mp3',
    };

    Object.entries(sounds).forEach(([key, src]) => {
      try {
        const audio = new Audio();
        audio.src = src;
        audio.preload = 'auto';
        this.audioCache[key] = audio;
      } catch {
        // Fallback handled
      }
    });
  }

  private playSound(key: string, volume: number = 0.9, fallbackFn?: () => void) {
    try {
      let audio = this.audioCache[key];
      if (!audio) {
        audio = new Audio(`/audio/${key}.mp3`);
        this.audioCache[key] = audio;
      }

      // Clone or reset to allow overlapping sounds
      const soundClone = audio.cloneNode() as HTMLAudioElement;
      soundClone.volume = Math.min(1, Math.max(0.05, volume));
      const playPromise = soundClone.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          fallbackFn?.();
        });
      }
    } catch {
      fallbackFn?.();
    }
  }

  /**
   * Play Rope Tighten & Tension SFX
   */
  public playRopeTighten(intensity: number = 0.8) {
    this.playSound('rope-tighten', Math.min(1, intensity), () => {
      audioSynth.playRopeStretch(intensity);
    });
  }

  /**
   * Play tension resistance & twang when rope refuses to pull on 1st attempt
   */
  public playTensionResist() {
    this.playSound('rope-tighten', 0.85, () => {
      audioSynth.playTensionResist();
    });
  }

  /**
   * Play bubble pop when speech bubble appears
   */
  public playBubblePop() {
    this.playSound('bubble-pop', 0.8, () => {
      audioSynth.playBubblePop();
    });
  }

  /**
   * Play dramatic rope break / violent snap
   */
  public playDramaticRopeBreak() {
    this.playSound('Rope-Break', 1.0, () => {
      this.playSound('snap-break', 1.0, () => {
        audioSynth.playDramaticRopeBreak();
      });
    });
  }

  /**
   * Play screen slide down transition sound
   */
  public playSlideTransition() {
    this.playSound('slide-transition', 0.9, () => {
      audioSynth.playDodgeWhoosh('right');
    });
  }

  /**
   * Play matchstick strike / ignition sound
   */
  public playMatchstickStrike() {
    this.playSound('matchstick', 1.0, () => {
      audioSynth.playCandleLight();
    });
  }

  /**
   * Play dramatic slipping whoosh / dodge sound when rope slips away
   */
  public playDodgeWhoosh(direction: 'left' | 'right' = 'right') {
    this.playSound('slide-transition', 0.5, () => {
      audioSynth.playDodgeWhoosh(direction);
    });
  }

  private cakeRevealAudio: HTMLAudioElement | null = null;

  /**
   * Play celebration fanfare on cake / photo reveal (cake-reveal.mp3)
   */
  public playCelebrationFanfare() {
    try {
      this.stopCelebrationFanfare();
      this.cakeRevealAudio = new Audio('/audio/cake-reveal.mp3');
      this.cakeRevealAudio.volume = 0.95;
      const playPromise = this.cakeRevealAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          audioSynth.playCelebrationFanfare();
        });
      }
    } catch {
      audioSynth.playCelebrationFanfare();
    }
  }

  /**
   * Stop cake-reveal sound immediately (e.g., when the photo view finishes)
   */
  public stopCelebrationFanfare() {
    if (this.cakeRevealAudio) {
      try {
        this.cakeRevealAudio.pause();
        this.cakeRevealAudio.currentTime = 0;
      } catch {
        // safe
      }
      this.cakeRevealAudio = null;
    }
  }

  /**
   * Play candle blow out sound
   */
  public playCandleBlow() {
    this.playSound('candle-blow', 0.9, () => {
      audioSynth.playCandleBlow();
    });
  }

  /**
   * Play candle ignition flame sound
   */
  public playCandleLight() {
    this.playMatchstickStrike();
  }

  /**
   * Play dramatic tension clock tick (countdown 5 to 1)
   */
  public playDramaticClockTick(countRemaining: number = 5) {
    audioSynth.playDramaticClockTick(countRemaining);
  }

  /**
   * Play complete pull release
   */
  public playRopeRelease() {
    this.playDramaticRopeBreak();
  }

  /**
   * Play Firework Rocket Launch Whoosh
   */
  public playFireworkRocketLaunch() {
    audioSynth.playFireworkRocketLaunch();
  }

  /**
   * Play Firework Explosion Boom
   */
  public playFireworkExplosion(size: 'small' | 'medium' | 'large' = 'medium') {
    audioSynth.playFireworkExplosion(size);
  }

  /**
   * Play Firework Crackling / Crackers Sizzle
   */
  public playFireworkCrackle(count: number = 18) {
    audioSynth.playFireworkCrackle(count);
  }

  /**
   * Play Firework Golden Willow Shimmer
   */
  public playFireworkWillowShimmer() {
    audioSynth.playFireworkWillowShimmer();
  }

  private bgMusic: HTMLAudioElement | null = null;
  private isMusicPlaying: boolean = false;

  private wishMusic: HTMLAudioElement | null = null;
  private isWishMusicPlaying: boolean = false;

  /**
   * Play soothing Happy Birthday background music (twisterium-happy-birthday-482411.mp3)
   * Plays continuously in loop with soothing, gentle volume during cake reveal.
   */
  public playBackgroundMusic(volume: number = 0.35) {
    if (typeof window === 'undefined') return;
    if (this.isMusicPlaying && this.bgMusic) return;

    try {
      if (!this.bgMusic) {
        this.bgMusic = new Audio('/audio/twisterium-happy-birthday-482411.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.preload = 'auto';
      }
      this.bgMusic.volume = Math.min(1, Math.max(0.05, volume));
      const playPromise = this.bgMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isMusicPlaying = true;
          })
          .catch(() => {
            // Handled gracefully if browser policy requires user gesture
          });
      }
    } catch {
      // Fallback
    }
  }

  public stopBackgroundMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.isMusicPlaying = false;
    }
  }

  /**
   * Play dedicated Piano Wish background music (/audio/tunetank-piano-logo-484286.mp3)
   * when Happy Birthday text begins to appear.
   * Replaces any existing background music cleanly.
   */
  public playWishMusic(volume: number = 0.45) {
    if (typeof window === 'undefined') return;

    // Stop previous background music
    this.stopBackgroundMusic();

    try {
      if (!this.wishMusic) {
        this.wishMusic = new Audio('/audio/tunetank-piano-logo-484286.mp3');
        this.wishMusic.loop = true;
        this.wishMusic.preload = 'auto';
      }
      this.wishMusic.volume = Math.min(1, Math.max(0.05, volume));
      const playPromise = this.wishMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isWishMusicPlaying = true;
          })
          .catch(() => {
            // Handled gracefully if browser policy requires user gesture
          });
      }
    } catch {
      // Fallback
    }
  }

  public stopWishMusic() {
    if (this.wishMusic) {
      this.wishMusic.pause();
      this.isWishMusicPlaying = false;
    }
  }
}

export const soundFx = new SoundEffectsManager();

