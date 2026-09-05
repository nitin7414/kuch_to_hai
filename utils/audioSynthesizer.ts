/**
 * Procedural Audio Synthesizer (Web Audio API)
 * High-fidelity organic rope strain & fiber tension acoustics
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Play realistic organic rope fiber stretch & creak sound
   * Simulates micro-fiber friction and taut braided cord strain
   */
  public playRopeStretch(intensity: number = 0.5) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = 0.28 + intensity * 0.15;

      // -----------------------------------------------------------
      // 1. Organic Fiber Granular Friction (Fiber-on-Fiber Creak)
      // -----------------------------------------------------------
      const sampleRate = ctx.sampleRate;
      const bufferLength = Math.floor(sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferLength, sampleRate);
      const data = buffer.getChannelData(0);

      // Procedural micro-fiber friction ticks
      let lastVal = 0;
      for (let i = 0; i < bufferLength; i++) {
        const progress = i / bufferLength;
        // Granular crackle bursts (creaking hemp fibers)
        const isCreakPulse = Math.random() < 0.18 + Math.sin(progress * Math.PI) * 0.22;
        const rawNoise = isCreakPulse ? (Math.random() * 2 - 1) * 0.85 : (Math.random() * 2 - 1) * 0.08;
        // Brown/pink filter smoothing to remove metallic harshness
        lastVal = (lastVal + 0.15 * rawNoise) / 1.15;
        data[i] = lastVal * (1 - Math.pow(progress, 1.8));
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Warm Woody/Hemp Resonant Filter (centered around 320Hz - 540Hz)
      const fiberFilter = ctx.createBiquadFilter();
      fiberFilter.type = 'bandpass';
      fiberFilter.frequency.setValueAtTime(320, now);
      fiberFilter.frequency.linearRampToValueAtTime(480 + intensity * 160, now + duration);
      fiberFilter.Q.setValueAtTime(2.2, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.22 * Math.min(1, intensity), now + 0.04);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noiseSource.connect(fiberFilter);
      fiberFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noiseSource.start(now);

      // -----------------------------------------------------------
      // 2. Taut Cord Body Resonance (Warm elastic tension tone)
      // -----------------------------------------------------------
      const cordOsc = ctx.createOscillator();
      const cordGain = ctx.createGain();
      const cordFilter = ctx.createBiquadFilter();

      // Pure warm sine/triangle wave - no harsh sawtooth
      cordOsc.type = 'triangle';
      cordOsc.frequency.setValueAtTime(110, now);
      // Pitch rises gently as tension builds
      cordOsc.frequency.exponentialRampToValueAtTime(175 + intensity * 60, now + duration * 0.85);

      cordFilter.type = 'lowpass';
      cordFilter.frequency.setValueAtTime(380, now);

      cordGain.gain.setValueAtTime(0.001, now);
      cordGain.gain.linearRampToValueAtTime(0.15 * Math.min(1, intensity), now + 0.03);
      cordGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      cordOsc.connect(cordFilter);
      cordFilter.connect(cordGain);
      cordGain.connect(ctx.destination);

      cordOsc.start(now);
      cordOsc.stop(now + duration);
    } catch {
      // Audio context policy fallback
    }
  }

  /**
   * Play speech bubble pop / sparkle chime when prompt bubble appears
   */
  public playBubblePop() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Cute bubble pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);

      // Sparkle overtone
      const sparkOsc = ctx.createOscillator();
      const sparkGain = ctx.createGain();
      sparkOsc.type = 'triangle';
      sparkOsc.frequency.setValueAtTime(1320, now + 0.04);
      sparkOsc.frequency.exponentialRampToValueAtTime(1760, now + 0.18);

      sparkGain.gain.setValueAtTime(0.12, now + 0.04);
      sparkGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      sparkOsc.connect(sparkGain);
      sparkGain.connect(ctx.destination);

      sparkOsc.start(now + 0.04);
      sparkOsc.stop(now + 0.26);
    } catch {
      // Audio context policy fallback
    }
  }

  /**
   * Play tension resistance when rope is pulled the 1st time and springs back
   */
  public playTensionResist() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      this.playRopeStretch(0.9);
      const now = ctx.currentTime;

      // Elastic twang recoil
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(190, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);

      gain.gain.setValueAtTime(0.18, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + 0.1);
      osc.stop(now + 0.4);
    } catch {
      // Audio context policy fallback
    }
  }

  /**
   * Play dramatic rope break, violent fracture, falling Doppler whoosh and impact crash
   */
  public playDramaticRopeBreak() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // -----------------------------------------------------------
      // 1. Violent High-Energy Whip/Cord Fracture Snap
      // -----------------------------------------------------------
      const snapLen = Math.floor(ctx.sampleRate * 0.12);
      const snapBuffer = ctx.createBuffer(1, snapLen, ctx.sampleRate);
      const snapData = snapBuffer.getChannelData(0);
      for (let i = 0; i < snapLen; i++) {
        const decay = 1 - i / snapLen;
        snapData[i] = (Math.random() * 2 - 1) * Math.pow(decay, 2.5);
      }
      const snapSource = ctx.createBufferSource();
      snapSource.buffer = snapBuffer;

      const snapFilter = ctx.createBiquadFilter();
      snapFilter.type = 'bandpass';
      snapFilter.frequency.setValueAtTime(1800, now);
      snapFilter.frequency.exponentialRampToValueAtTime(400, now + 0.12);
      snapFilter.Q.setValueAtTime(3.5, now);

      const snapGain = ctx.createGain();
      snapGain.gain.setValueAtTime(0.7, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      snapSource.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapSource.start(now);

      // -----------------------------------------------------------
      // 2. Heavy Tearing Hemp/Golden Fibers Rip
      // -----------------------------------------------------------
      const ripLen = Math.floor(ctx.sampleRate * 0.35);
      const ripBuffer = ctx.createBuffer(1, ripLen, ctx.sampleRate);
      const ripData = ripBuffer.getChannelData(0);
      for (let i = 0; i < ripLen; i++) {
        const isSpike = Math.random() < 0.45;
        ripData[i] = isSpike ? (Math.random() * 2 - 1) * (1 - i / ripLen) : 0;
      }
      const ripSource = ctx.createBufferSource();
      ripSource.buffer = ripBuffer;

      const ripFilter = ctx.createBiquadFilter();
      ripFilter.type = 'highpass';
      ripFilter.frequency.setValueAtTime(650, now);

      const ripGain = ctx.createGain();
      ripGain.gain.setValueAtTime(0.35, now);
      ripGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      ripSource.connect(ripFilter);
      ripFilter.connect(ripGain);
      ripGain.connect(ctx.destination);
      ripSource.start(now);

      // -----------------------------------------------------------
      // 3. Cinematic Sub-Bass Impact Boom / Shockwave
      // -----------------------------------------------------------
      const boomOsc = ctx.createOscillator();
      const boomGain = ctx.createGain();
      boomOsc.type = 'sine';
      boomOsc.frequency.setValueAtTime(120, now);
      boomOsc.frequency.exponentialRampToValueAtTime(28, now + 0.55);

      boomGain.gain.setValueAtTime(0.65, now);
      boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      boomOsc.connect(boomGain);
      boomGain.connect(ctx.destination);
      boomOsc.start(now);
      boomOsc.stop(now + 0.65);

      // -----------------------------------------------------------
      // 4. Dramatic Falling Whoosh / Doppler Descent
      // -----------------------------------------------------------
      const whooshLen = Math.floor(ctx.sampleRate * 0.7);
      const whooshBuffer = ctx.createBuffer(1, whooshLen, ctx.sampleRate);
      const whooshData = whooshBuffer.getChannelData(0);
      for (let i = 0; i < whooshLen; i++) {
        whooshData[i] = (Math.random() * 2 - 1);
      }
      const whooshSource = ctx.createBufferSource();
      whooshSource.buffer = whooshBuffer;

      const whooshFilter = ctx.createBiquadFilter();
      whooshFilter.type = 'bandpass';
      whooshFilter.frequency.setValueAtTime(1400, now + 0.05);
      whooshFilter.frequency.exponentialRampToValueAtTime(120, now + 0.65);
      whooshFilter.Q.setValueAtTime(4.0, now);

      const whooshGain = ctx.createGain();
      whooshGain.gain.setValueAtTime(0.001, now);
      whooshGain.gain.linearRampToValueAtTime(0.4, now + 0.15);
      whooshGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      whooshSource.connect(whooshFilter);
      whooshFilter.connect(whooshGain);
      whooshGain.connect(ctx.destination);
      whooshSource.start(now + 0.05);

      // -----------------------------------------------------------
      // 5. Golden Ring Ground Crash & Metal Ringing Tail
      // -----------------------------------------------------------
      const crashDelay = 0.45;
      const metalOsc1 = ctx.createOscillator();
      const metalOsc2 = ctx.createOscillator();
      const metalGain = ctx.createGain();

      metalOsc1.type = 'sine';
      metalOsc1.frequency.setValueAtTime(640, now + crashDelay);
      metalOsc1.frequency.exponentialRampToValueAtTime(220, now + crashDelay + 0.4);

      metalOsc2.type = 'triangle';
      metalOsc2.frequency.setValueAtTime(1180, now + crashDelay);
      metalOsc2.frequency.exponentialRampToValueAtTime(440, now + crashDelay + 0.35);

      metalGain.gain.setValueAtTime(0.001, now);
      metalGain.gain.setValueAtTime(0.35, now + crashDelay);
      metalGain.gain.exponentialRampToValueAtTime(0.001, now + crashDelay + 0.5);

      metalOsc1.connect(metalGain);
      metalOsc2.connect(metalGain);
      metalGain.connect(ctx.destination);

      metalOsc1.start(now + crashDelay);
      metalOsc1.stop(now + crashDelay + 0.55);
      metalOsc2.start(now + crashDelay);
      metalOsc2.stop(now + crashDelay + 0.55);
    } catch {
      // Audio context policy fallback
    }
  }

  /**
   * Play dramatic & playful slipping whoosh / dodge sound when rope slips away
   */
  public playDodgeWhoosh(direction: 'left' | 'right' = 'right') {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = 0.32;

      // 1. Fast aerodynamic whoosh noise sweep
      const whooshLen = Math.floor(ctx.sampleRate * duration);
      const whooshBuffer = ctx.createBuffer(1, whooshLen, ctx.sampleRate);
      const whooshData = whooshBuffer.getChannelData(0);
      for (let i = 0; i < whooshLen; i++) {
        const decay = Math.sin((i / whooshLen) * Math.PI);
        whooshData[i] = (Math.random() * 2 - 1) * decay;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = whooshBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      const startFreq = direction === 'right' ? 350 : 1200;
      const endFreq = direction === 'right' ? 1400 : 380;
      filter.frequency.setValueAtTime(startFreq, now);
      filter.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
      filter.Q.setValueAtTime(3.8, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.45, now + duration * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noiseSource.start(now);

      // 2. Playful comic whistle slide tone
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';

      const toneStart = direction === 'right' ? 280 : 650;
      const toneEnd = direction === 'right' ? 780 : 260;
      osc.frequency.setValueAtTime(toneStart, now);
      osc.frequency.exponentialRampToValueAtTime(toneEnd, now + duration);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.22, now + 0.05);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio context policy fallback
    }
  }

  /**
   * Play celebration fanfare & sparkling birthday chimes on cake reveal
   */
  public playCelebrationFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Celebratory chord progression frequencies (C major / A minor magical sparkle)
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.25);
      });

      // Shimmering chime overtones
      const sparkCount = 8;
      for (let i = 0; i < sparkCount; i++) {
        const sOsc = ctx.createOscillator();
        const sGain = ctx.createGain();
        sOsc.type = 'sine';
        sOsc.frequency.setValueAtTime(1200 + i * 220, now + 0.3 + i * 0.07);

        sGain.gain.setValueAtTime(0.001, now + 0.3 + i * 0.07);
        sGain.gain.linearRampToValueAtTime(0.08, now + 0.3 + i * 0.07 + 0.03);
        sGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3 + i * 0.07 + 0.6);

        sOsc.connect(sGain);
        sGain.connect(ctx.destination);
        sOsc.start(now + 0.3 + i * 0.07);
        sOsc.stop(now + 0.3 + i * 0.07 + 0.65);
      }
    } catch {
      // Audio context policy fallback
    }
  }

  /**
   * Play realistic candle blow out breath whoosh
   */
  public playCandleBlow() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = 0.65;

      const len = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i++) {
        const progress = i / len;
        const envelope = Math.sin(progress * Math.PI);
        data[i] = (Math.random() * 2 - 1) * Math.pow(envelope, 1.5);
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + duration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start(now);
    } catch {
      // Audio context policy fallback
    }
  }

  /**
   * Play full rope pull release & snap sound (trigger when rope is fully pulled)
   */
  public playRopeRelease() {
    this.playDramaticRopeBreak();
  }

  /**
   * Play candle ignition / match strike flame sound
   */
  public playCandleLight() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Soft white noise strike
      const bufferSize = ctx.sampleRate * 0.08;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(2200, now);
      noiseFilter.Q.setValueAtTime(3.0, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      whiteNoise.start(now);

      // Warm magical chime ignition
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(587.33, now + 0.02); // D5
      chimeOsc.frequency.exponentialRampToValueAtTime(880, now + 0.25); // A5

      chimeGain.gain.setValueAtTime(0.001, now);
      chimeGain.gain.linearRampToValueAtTime(0.2, now + 0.04);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);

      chimeOsc.start(now + 0.02);
      chimeOsc.stop(now + 0.55);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Play dramatic tension clock tick (countdown 5 to 1)
   */
  public playDramaticClockTick(countRemaining: number = 5) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Frequency rises with urgency as countdown nears 1
      const baseFreq = 800 + (5 - countRemaining) * 180;

      // Crisp mechanical clock strike
      const tickOsc = ctx.createOscillator();
      const tickGain = ctx.createGain();
      const tickFilter = ctx.createBiquadFilter();

      tickOsc.type = 'triangle';
      tickOsc.frequency.setValueAtTime(baseFreq, now);
      tickOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.04);

      tickFilter.type = 'bandpass';
      tickFilter.frequency.setValueAtTime(baseFreq * 1.5, now);
      tickFilter.Q.setValueAtTime(8.0, now);

      tickGain.gain.setValueAtTime(0.35, now);
      tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      tickOsc.connect(tickFilter);
      tickFilter.connect(tickGain);
      tickGain.connect(ctx.destination);

      tickOsc.start(now);
      tickOsc.stop(now + 0.08);

      // Low wooden body resonance
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(220 + (5 - countRemaining) * 30, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(80, now + 0.06);

      bodyGain.gain.setValueAtTime(0.28, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(ctx.destination);

      bodyOsc.start(now);
      bodyOsc.stop(now + 0.08);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Play realistic rocket ascent launch whoosh & whistle
   */
  public playFireworkRocketLaunch() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = 1.1 + Math.random() * 0.4;

      // 1. Rushing rocket thrust exhaust noise
      const bufferLength = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferLength, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferLength; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferLength);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(350, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(1400, now + duration * 0.85);
      noiseFilter.Q.setValueAtTime(2.5, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.linearRampToValueAtTime(0.18, now + 0.15);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);

      // 2. High-pitched whistling propellant whistle
      const whistleOsc = ctx.createOscillator();
      const whistleGain = ctx.createGain();

      whistleOsc.type = 'sine';
      whistleOsc.frequency.setValueAtTime(420 + Math.random() * 100, now);
      whistleOsc.frequency.exponentialRampToValueAtTime(1250 + Math.random() * 300, now + duration * 0.9);

      whistleGain.gain.setValueAtTime(0.001, now);
      whistleGain.gain.linearRampToValueAtTime(0.09, now + 0.12);
      whistleGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      whistleOsc.connect(whistleGain);
      whistleGain.connect(ctx.destination);

      whistleOsc.start(now);
      whistleOsc.stop(now + duration);
    } catch {
      // safe fallback
    }
  }

  /**
   * Play heavy cinematic shell burst boom (Deep sub-bass thump + explosive crack)
   */
  public playFireworkExplosion(size: 'small' | 'medium' | 'large' = 'medium') {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = size === 'large' ? 1.9 : size === 'medium' ? 1.4 : 0.9;
      const baseGain = size === 'large' ? 0.65 : size === 'medium' ? 0.45 : 0.3;

      // 1. Deep Sub-Bass Impact Thud (Chest-vibrating low boom)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(size === 'large' ? 75 : 95, now);
      subOsc.frequency.exponentialRampToValueAtTime(25, now + 0.35);

      subGain.gain.setValueAtTime(baseGain * 0.9, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);

      subOsc.start(now);
      subOsc.stop(now + duration);

      // 2. Explosive Gunpowder Burst Shockwave (Filtered noise)
      const bufferLength = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferLength, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferLength; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-3.5 * (i / bufferLength));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + duration * 0.7);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(baseGain * 0.8, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);
    } catch {
      // safe fallback
    }
  }

  /**
   * Play authentic fireworks dragon eggs / cracker string sizzle
   */
  public playFireworkCrackle(count: number = 18) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      for (let i = 0; i < count; i++) {
        const offset = Math.random() * 0.65;
        const popTime = now + offset;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        const freq = 1800 + Math.random() * 3200;
        osc.frequency.setValueAtTime(freq, popTime);
        osc.frequency.exponentialRampToValueAtTime(400, popTime + 0.025);

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1400, popTime);

        gain.gain.setValueAtTime(0.08 + Math.random() * 0.12, popTime);
        gain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.035);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(popTime);
        osc.stop(popTime + 0.04);
      }
    } catch {
      // safe fallback
    }
  }

  /**
   * Play glittering golden willow shimmer fallout
   */
  public playFireworkWillowShimmer() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      for (let i = 0; i < 8; i++) {
        const chimeTime = now + i * 0.08 + Math.random() * 0.04;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(2400 + Math.random() * 1600, chimeTime);

        gain.gain.setValueAtTime(0.03, chimeTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, chimeTime + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(chimeTime);
        osc.stop(chimeTime + 0.25);
      }
    } catch {
      // safe fallback
    }
  }
}

export const audioSynth = new AudioSynthesizer();
export const audioSynthesizer = audioSynth;

