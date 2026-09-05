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

  /**
   * Play celebration fanfare on cake reveal
   */
  public playCelebrationFanfare() {
    this.playSound('cake-reveal', 0.95, () => {
      audioSynth.playCelebrationFanfare();
    });
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
}

export const soundFx = new SoundEffectsManager();

