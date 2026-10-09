// Shinobi-inspired Cinematic Web Audio API Synthesizer & Multi-Phase Anime Soundtrack Engine
// Phase 1 (DRAFT): Mysterious Ninja Strategy Background Music (Tense, suspenseful, subtle Japanese percussion, deep bass pulses, soft cinematic strings, gradual buildup)
// Transition (1 -> 2): 2-Second Epic Cinematic Transition Impact (Deep bass hit, powerful energy burst, dramatic rising whoosh -> heavy impact)
// Phase 2 (BATTLE): Epic Anime Battle Background Music (Powerful Taiko drums, intense cinematic strings, energetic Japanese percussion, dramatic bass, heroic rising tension)
// Character Reveal SFX: 1-Second Powerful Anime Character Reveal (Sharp cinematic impact, fast energy burst, metallic ninja whoosh, deep bass hit + resonance)

export type MusicMode = 'OFF' | 'DRAFT' | 'BATTLE';

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public musicEnabled: boolean = true;
  private currentMusicMode: MusicMode = 'OFF';
  private musicIntervalId: number | null = null;
  private musicStep: number = 0;

  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
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

  public stopMusic() {
    this.currentMusicMode = 'OFF';
    if (this.musicIntervalId) {
      window.clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
  }

  // ============================================================================
  // MULTI-PHASE ANIME NINJA / CINEMATIC BATTLE BACKGROUND MUSIC
  // ============================================================================
  public setMusicMode(mode: MusicMode) {
    if (this.currentMusicMode === mode && this.musicIntervalId !== null) {
      return;
    }

    this.currentMusicMode = mode;
    if (this.musicIntervalId) {
      window.clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }

    if (!this.musicEnabled || mode === 'OFF') {
      return;
    }

    this.musicStep = 0;

    if (mode === 'DRAFT') {
      // ========================================================================
      // [PHASE 1 — CARD SELECTION]
      // "Epic mysterious ninja strategy background music, tense and suspenseful
      // atmosphere, subtle Japanese-inspired percussion, deep bass pulses,
      // soft cinematic strings, gradual buildup, seamless game loop."
      // ========================================================================
      const kotoMysteryNotes = [
        146.83, 0, 155.56, 196.0, 220.0, 0, 196.0, 155.56,
        146.83, 196.0, 220.0, 0, 261.63, 220.0, 196.0, 155.56,
      ];
      const cinematicStringPad = [
        146.83, 146.83, 146.83, 146.83, 155.56, 155.56, 155.56, 155.56,
        196.0, 196.0, 196.0, 196.0, 146.83, 146.83, 146.83, 146.83,
      ];
      const deepBassPulses = [
        73.42, 0, 73.42, 0, 77.78, 0, 77.78, 0,
        98.0, 0, 87.31, 0, 73.42, 0, 73.42, 0,
      ];

      this.musicIntervalId = window.setInterval(() => {
        if (!this.musicEnabled || this.currentMusicMode !== 'DRAFT') return;
        const ctx = this.getContext();
        if (!ctx) return;

        const step = this.musicStep % 16;
        // Gradual tension buildup factor (0.85 -> 1.15 across loop)
        const buildup = 0.85 + Math.min(0.3, (this.musicStep % 32) * 0.01);

        // 1. Deep mysterious bass pulse on even steps
        const bassFreq = deepBassPulses[step];
        if (bassFreq > 0) {
          this.playDeepBassPulse(ctx, bassFreq, 0.065 * buildup, 0.72);
        }

        // 2. Soft cinematic strings pad every 4 steps
        if (step % 4 === 0) {
          const padRoot = cinematicStringPad[step];
          this.playSoftCinematicStrings(ctx, [padRoot, padRoot * 1.5], 0.028 * buildup, 1.55);
        }

        // 3. Subtle Japanese Koto/Shamisen strategy motif
        const kotoFreq = kotoMysteryNotes[step];
        if (kotoFreq > 0) {
          this.playShamisenPluck(ctx, kotoFreq, 0.036 * buildup);
        }

        // 4. Subtle Japanese percussion (soft Taiko heartbeat + wooden hyoshigi tick)
        if (step === 0 || step === 8) {
          this.playSoftTaikoPulse(ctx, 78, 0.075 * buildup);
        } else if (step === 6 || step === 14) {
          this.playSubtleJapanesePercussion(ctx, 0.025 * buildup);
        }

        this.musicStep++;
      }, 390);
    } else if (mode === 'BATTLE') {
      // ========================================================================
      // [PHASE 2 — SQUAD SHOWCASE & BATTLE CLASH]
      // "Epic anime battle background music, powerful drums, intense cinematic
      // strings, energetic Japanese-inspired percussion, dramatic bass,
      // rising tension and heroic atmosphere, seamless game loop."
      // ========================================================================
      const heroicShamisenLead = [
        146.83, 146.83, 174.61, 196.0, 220.0, 220.0, 261.63, 220.0,
        293.66, 293.66, 261.63, 220.0, 196.0, 220.0, 174.61, 155.56,
      ];
      const intenseStringsStab = [
        293.66, 0, 293.66, 349.23, 440.0, 0, 523.25, 440.0,
        587.33, 0, 523.25, 440.0, 392.0, 440.0, 349.23, 311.13,
      ];
      const dramaticBassRoots = [
        73.42, 73.42, 87.31, 98.0, 110.0, 110.0, 130.81, 110.0,
        73.42, 73.42, 65.41, 73.42, 98.0, 87.31, 77.78, 73.42,
      ];

      this.musicIntervalId = window.setInterval(() => {
        if (!this.musicEnabled || this.currentMusicMode !== 'BATTLE') return;
        const ctx = this.getContext();
        if (!ctx) return;

        const step = this.musicStep % 16;

        // 1. Dramatic driving bass line
        const bassFreq = dramaticBassRoots[step];
        if (step % 2 === 0) {
          this.playDeepBassPulse(ctx, bassFreq, 0.11, 0.42);
        }

        // 2. Intense cinematic strings stabs & sustained heroic harmony
        const stringFreq = intenseStringsStab[step];
        if (stringFreq > 0) {
          this.playIntenseCinematicStringStab(ctx, stringFreq, 0.055, 0.34);
        }
        if (step % 4 === 0) {
          this.playSoftCinematicStrings(ctx, [146.83, 220.0, 293.66], 0.042, 0.85);
        }

        // 3. Energetic Shamisen ostinato
        const shamisenFreq = heroicShamisenLead[step];
        this.playShamisenPluck(ctx, shamisenFreq, 0.068);

        // 4. Powerful Taiko War Drums & Japanese Percussion
        if (step % 4 === 0) {
          this.playSoftTaikoPulse(ctx, 112, 0.16);
        } else if (step % 2 === 0) {
          this.playSoftTaikoPulse(ctx, 86, 0.11);
        } else if (step === 3 || step === 7 || step === 11 || step === 15) {
          this.playSubtleJapanesePercussion(ctx, 0.055);
          this.playSoftTaikoPulse(ctx, 132, 0.085);
        }

        this.musicStep++;
      }, 210);
    }
  }

  public toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled) {
      if (this.musicIntervalId) {
        window.clearInterval(this.musicIntervalId);
        this.musicIntervalId = null;
      }
    } else if (this.currentMusicMode !== 'OFF') {
      const target = this.currentMusicMode;
      this.currentMusicMode = 'OFF';
      this.setMusicMode(target);
    }
    return this.musicEnabled;
  }

  // ============================================================================
  // SYNTHESIS BUILDING BLOCKS FOR MUSIC
  // ============================================================================
  private playDeepBassPulse(ctx: AudioContext, freq: number, volume: number, duration: number) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(175, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  private playSoftCinematicStrings(
    ctx: AudioContext,
    freqs: number[],
    volume: number,
    duration: number
  ) {
    const now = ctx.currentTime;
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      // Slight detune for lush orchestral string ensemble feel
      osc.frequency.setValueAtTime(freq * (idx % 2 === 0 ? 1.003 : 0.997), now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(680, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(volume, now + duration * 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.03);
    });
  }

  private playIntenseCinematicStringStab(
    ctx: AudioContext,
    freq: number,
    volume: number,
    duration: number
  ) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.8, now);
    filter.Q.setValueAtTime(1.2, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  private playSubtleJapanesePercussion(ctx: AudioContext, volume: number) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(310, now + 0.045);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.055);
  }

  private playShamisenPluck(ctx: AudioContext, freq: number, volume: number) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 4.2, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.15, now + 0.21);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.24);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  private playSoftTaikoPulse(ctx: AudioContext, startFreq: number, volume: number) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(36, now + 0.19);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.21);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  // ============================================================================
  // SPECIAL CINEMATIC TRANSITION & CHARACTER REVEAL SOUND EFFECTS
  // ============================================================================

  /**
   * [TRANSITION FROM PHASE 1 TO PHASE 2 — 2.0 SECONDS]
   * "Epic cinematic transition impact, deep bass hit, powerful energy burst,
   * dramatic rising whoosh followed by a heavy impact, anime battle reveal
   * transition, intense and exciting, short 2-second sound effect, no vocals."
   */
  public playPhaseTransitionImpact() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Dramatic Rising Energy Whoosh (0.0s -> 0.85s)
    const bufferSize = Math.floor(ctx.sampleRate * 1.95);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const whooshFilter = ctx.createBiquadFilter();
    whooshFilter.type = 'bandpass';
    whooshFilter.Q.setValueAtTime(2.2, now);
    whooshFilter.frequency.setValueAtTime(140, now);
    whooshFilter.frequency.exponentialRampToValueAtTime(1850, now + 0.82);
    whooshFilter.frequency.exponentialRampToValueAtTime(180, now + 1.9);

    const whooshGain = ctx.createGain();
    whooshGain.gain.setValueAtTime(0.01, now);
    whooshGain.gain.linearRampToValueAtTime(0.24, now + 0.78);
    whooshGain.gain.exponentialRampToValueAtTime(0.001, now + 1.92);

    noise.connect(whooshFilter);
    whooshFilter.connect(whooshGain);
    whooshGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 1.95);

    // 2. Rising Synth Riser Sweep (0.0s -> 0.82s)
    const riserOsc = ctx.createOscillator();
    const riserGain = ctx.createGain();
    riserOsc.type = 'sawtooth';
    riserOsc.frequency.setValueAtTime(85, now);
    riserOsc.frequency.exponentialRampToValueAtTime(587.33, now + 0.82);

    riserGain.gain.setValueAtTime(0.01, now);
    riserGain.gain.linearRampToValueAtTime(0.14, now + 0.78);
    riserGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    riserOsc.connect(riserGain);
    riserGain.connect(ctx.destination);
    riserOsc.start(now);
    riserOsc.stop(now + 0.92);

    // 3. Heavy Cinematic Sub-Bass Impact Slam at 0.80s -> 1.95s
    const impactTime = now + 0.8;
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(135, impactTime);
    subOsc.frequency.exponentialRampToValueAtTime(28, impactTime + 1.1);

    subGain.gain.setValueAtTime(0.32, impactTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, impactTime + 1.15);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(impactTime);
    subOsc.stop(impactTime + 1.18);

    // 4. Powerful Anime Brass/Chord Energy Burst at 0.82s -> 1.95s
    const burstChord = [146.83, 220.0, 293.66, 440.0];
    burstChord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, impactTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, impactTime);
      filter.frequency.exponentialRampToValueAtTime(260, impactTime + 1.1);

      gain.gain.setValueAtTime(0.09, impactTime);
      gain.gain.exponentialRampToValueAtTime(0.001, impactTime + 1.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(impactTime);
      osc.stop(impactTime + 1.15);
    });
  }

  /**
   * [CHARACTER REVEAL SOUND EFFECT — 1.0 SECOND]
   * "Powerful anime character reveal sound effect, sharp cinematic impact,
   * fast energy burst, metallic ninja-style whoosh, deep bass hit followed by
   * a short dramatic resonance, exciting and prestigious character introduction,
   * 1 second, no music, no voice."
   * Played once per fighter reveal over Phase 2 music with balanced volume.
   */
  public playCharacterReveal() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Fast Metallic Ninja-Style Whoosh (0.0s -> 0.28s)
    const bufferSize = Math.floor(ctx.sampleRate * 0.35);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whoosh = ctx.createBufferSource();
    whoosh.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3.5, now);
    filter.frequency.setValueAtTime(650, now);
    filter.frequency.exponentialRampToValueAtTime(2600, now + 0.14);
    filter.frequency.exponentialRampToValueAtTime(480, now + 0.32);

    const whooshGain = ctx.createGain();
    whooshGain.gain.setValueAtTime(0.13, now);
    whooshGain.gain.exponentialRampToValueAtTime(0.001, now + 0.33);

    whoosh.connect(filter);
    filter.connect(whooshGain);
    whooshGain.connect(ctx.destination);
    whoosh.start(now);
    whoosh.stop(now + 0.34);

    // 2. Sharp Deep Bass Hit (0.04s -> 0.65s)
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(125, now + 0.04);
    bassOsc.frequency.exponentialRampToValueAtTime(36, now + 0.58);

    bassGain.gain.setValueAtTime(0.2, now + 0.04);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.62);

    bassOsc.connect(bassGain);
    bassGain.connect(ctx.destination);
    bassOsc.start(now + 0.04);
    bassOsc.stop(now + 0.65);

    // 3. Prestigious Metallic Resonance Chime (0.06s -> 0.95s)
    const resonanceNotes = [587.33, 880.0];
    resonanceNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + 0.06 + idx * 0.04);

      gain.gain.setValueAtTime(0.085, now + 0.06 + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.92);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + 0.06 + idx * 0.04);
      osc.stop(now + 0.95);
    });
  }

  // ============================================================================
  // TACTICAL SHINOBI SOUND EFFECTS (SFX)
  // ============================================================================

  // 1. Ninja Hand Seal (Katon / Kuchiyose crisp wooden clack + chakra chime)
  public playHandSeal() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.09);
    osc2.frequency.exponentialRampToValueAtTime(1320, now + 0.22);
    gain2.gain.setValueAtTime(0.11, now + 0.09);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.09);
    osc2.stop(now + 0.25);
  }

  // 2. Spinning Shuriken Toss Sound (Metallic rapid whirr for Round 1 lottery)
  public playShurikenSpin() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    for (let i = 0; i < 6; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const startTime = now + i * 0.16;
      osc.frequency.setValueAtTime(1400 + i * 180, startTime);
      osc.frequency.exponentialRampToValueAtTime(650, startTime + 0.12);

      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.13);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.14);
    }
  }

  // 3. Warm Shamisen & Taiko Accent when selecting a card
  public playSelect() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.playSoftTaikoPulse(ctx, 95, 0.12);
    this.playShamisenPluck(ctx, 293.66, 0.07);
    this.playShamisenPluck(ctx, 440.0, 0.05);
  }

  // 4. Chidori / Lightning Chakra Surge for Legendary SSS & SS Cards!
  public playLegendaryLightning() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const t = now + i * 0.055;
      osc.frequency.setValueAtTime(1900 + Math.random() * 1200, t);
      osc.frequency.exponentialRampToValueAtTime(620, t + 0.05);

      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.055);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    }
  }

  // 5. Chakra Flame Burst & Summoning Jutsu Whoosh when flipping the Mystery Card
  public playFlameFlip(isHighTier: boolean) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.45;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(420, now);
    filter.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
    filter.frequency.exponentialRampToValueAtTime(280, now + 0.45);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    whiteNoise.start(now);
    whiteNoise.stop(now + 0.45);

    const notes = isHighTier ? [440, 523.25, 659.25, 880, 1046.5] : [329.63, 293.66, 246.94];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isHighTier ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + 0.12 + idx * 0.055);

      gain.gain.setValueAtTime(0.095, now + 0.12 + idx * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12 + idx * 0.055 + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + 0.12 + idx * 0.055);
      osc.stop(now + 0.12 + idx * 0.055 + 0.3);
    });
  }

  // 6. Card Dock Transfer Whoosh
  public playCardDockTransfer() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(760, now + 0.16);

    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  // 7. Deep Japanese Taiko War Drum Heartbeat for Battle Suspense
  public playClash() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(115, now);
    osc.frequency.exponentialRampToValueAtTime(36, now + 0.32);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.36);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(92, now + 0.18);
    osc2.frequency.exponentialRampToValueAtTime(32, now + 0.42);

    gain2.gain.setValueAtTime(0.12, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.18);
    osc2.stop(now + 0.46);
  }

  // 8. Final Victory / Defeat Shinobi Fanfare
  public playVictory(isWin: boolean) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const chord = isWin
      ? [440, 523.25, 659.25, 880, 1174.66]
      : [392.0, 349.23, 293.66, 220.0];

    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.085);

      gain.gain.setValueAtTime(0.15, now + i * 0.085);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.085 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.085);
      osc.stop(now + i * 0.085 + 0.47);
    });
  }
}

export const soundEngine = new SoundEngine();
