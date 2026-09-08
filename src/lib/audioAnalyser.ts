'use client';

/**
 * Audio Analyser Utility using Web Audio API
 * Provides real-time, smoothed audio amplitude (0.0 - 1.0)
 * for driving speech-reactive UI animations.
 */

type AudioLevelListener = (level: number) => void;

class AudioAnalyserService {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaElementAudioSourceNode | MediaStreamAudioSourceNode | null = null;
  private animFrameId: number | null = null;
  private listeners: Set<AudioLevelListener> = new Set();
  private currentLevel: number = 0;
  private sourceMap = new WeakMap<HTMLAudioElement, MediaElementAudioSourceNode>();

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Subscribe to smoothed audio level updates (0.0 to 1.0)
   */
  public subscribe(listener: AudioLevelListener): () => void {
    this.listeners.add(listener);
    // Immediately emit current level
    listener(this.currentLevel);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(level: number) {
    this.currentLevel = level;
    this.listeners.forEach((listener) => {
      try {
        listener(level);
      } catch (err) {
        console.error('[AudioAnalyser] Listener error:', err);
      }
    });
  }

  /**
   * Attach analyser to an HTMLAudioElement (e.g. Sarvam TTS playback)
   */
  public attachAudioElement(audioEl: HTMLAudioElement) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      this.stop();

      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      let elementSource = this.sourceMap.get(audioEl);
      if (!elementSource) {
        elementSource = ctx.createMediaElementSource(audioEl);
        this.sourceMap.set(audioEl, elementSource);
      }

      this.sourceNode = elementSource;
      this.sourceNode.connect(this.analyser);
      this.analyser.connect(ctx.destination);

      this.startLoop();
    } catch (err) {
      console.warn('[AudioAnalyser] Failed to attach audio element:', err);
    }
  }

  /**
   * Attach analyser to a MediaStream (e.g. user microphone stream)
   */
  public attachMediaStream(stream: MediaStream) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      this.stop();

      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.75;

      const streamSource = ctx.createMediaStreamSource(stream);
      this.sourceNode = streamSource;
      streamSource.connect(this.analyser);
      // NOTE: Do not connect microphone stream to ctx.destination to avoid echo feedback loop!

      this.startLoop();
    } catch (err) {
      console.warn('[AudioAnalyser] Failed to attach media stream:', err);
    }
  }

  /**
   * Stop analysis loop and reset audio level
   */
  public stop() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.notifyListeners(0);
  }

  private startLoop() {
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    let smoothedValue = 0;

    const tick = () => {
      if (!this.analyser) return;

      this.analyser.getByteFrequencyData(dataArray);

      // Compute average amplitude over active speech frequencies (approx 100Hz - 4000Hz)
      let sum = 0;
      const count = Math.min(dataArray.length, 48);
      for (let i = 2; i < count; i++) {
        sum += dataArray[i];
      }
      const rawAverage = sum / (count - 2);
      const normalized = Math.min(1, Math.max(0, rawAverage / 128));

      // Apply exponential moving average for ultra-smooth transitions (no visual jitter)
      const smoothingFactor = normalized > smoothedValue ? 0.35 : 0.18;
      smoothedValue += (normalized - smoothedValue) * smoothingFactor;

      const rounded = Math.round(smoothedValue * 1000) / 1000;
      this.notifyListeners(rounded);

      this.animFrameId = requestAnimationFrame(tick);
    };

    this.animFrameId = requestAnimationFrame(tick);
  }
}

export const audioAnalyser = new AudioAnalyserService();
