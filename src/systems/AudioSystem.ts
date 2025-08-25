export class AudioManager {
  private context: AudioContext;
  private sounds: Map<string, AudioBuffer> = new Map();
  private masterVolume: number = 0.5;

  constructor() {
    try {
      console.log('Creating AudioContext...');
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('AudioContext created, state:', this.context.state);
      this.createSounds();
      console.log('Audio sounds created');
    } catch (error) {
      console.error('Error creating AudioManager:', error);
      throw error;
    }
  }

  private createSounds(): void {
    this.sounds.set('fire', this.createFireSound());
    this.sounds.set('explosion', this.createExplosionSound());
    this.sounds.set('engine', this.createEngineSound());
  }

  private createFireSound(): AudioBuffer {
    const sampleRate = this.context.sampleRate;
    const duration = 0.15;
    const buffer = this.context.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const decay = Math.exp(-t * 8);
      const noise = (Math.random() * 2 - 1) * 0.3;
      const tone = Math.sin(2 * Math.PI * (800 - t * 400) * t);
      data[i] = (noise + tone) * decay * 0.7;
    }

    return buffer;
  }

  private createExplosionSound(): AudioBuffer {
    const sampleRate = this.context.sampleRate;
    const duration = 0.8;
    const buffer = this.context.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const decay = Math.exp(-t * 3);
      const noise = (Math.random() * 2 - 1) * 0.8;
      const rumble = Math.sin(2 * Math.PI * 60 * t) * 0.3;
      data[i] = (noise + rumble) * decay;
    }

    return buffer;
  }

  private createEngineSound(): AudioBuffer {
    const sampleRate = this.context.sampleRate;
    const duration = 1.0;
    const buffer = this.context.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const base = Math.sin(2 * Math.PI * 120 * t) * 0.4;
      const harmonic = Math.sin(2 * Math.PI * 240 * t) * 0.2;
      const noise = (Math.random() * 2 - 1) * 0.1;
      data[i] = (base + harmonic + noise) * 0.3;
    }

    return buffer;
  }

  playSound(soundName: string, volume: number = 1.0, loop: boolean = false): AudioBufferSourceNode | null {
    if (this.context.state === 'suspended') {
      this.context.resume();
    }

    const buffer = this.sounds.get(soundName);
    if (!buffer) return null;

    const source = this.context.createBufferSource();
    const gainNode = this.context.createGain();

    source.buffer = buffer;
    source.loop = loop;
    gainNode.gain.value = volume * this.masterVolume;

    source.connect(gainNode);
    gainNode.connect(this.context.destination);

    source.start();
    return source;
  }

  stopSound(source: AudioBufferSourceNode): void {
    try {
      source.stop();
    } catch (e) {
      // Source may already be stopped
    }
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  getMasterVolume(): number {
    return this.masterVolume;
  }
}