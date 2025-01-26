export class AudioProcessor {
  private context: AudioContext;
  private source: MediaElementAudioSourceNode | null = null;
  private analyser: AnalyserNode;
  private filters: BiquadFilterNode[];
  private compressor: DynamicsCompressorNode;
  private delay: DelayNode;
  private reverb: ConvolverNode;

  constructor() {
    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();
    this.compressor = this.context.createDynamicsCompressor();
    this.delay = this.context.createDelay(5.0);
    this.reverb = this.context.createConvolver();

    // Configure analyser
    this.analyser.fftSize = 2048;
    
    // Create multiple filters for different frequency bands
    this.filters = [
      this.context.createBiquadFilter(), // Sub-bass (20-60 Hz)
      this.context.createBiquadFilter(), // Bass (60-250 Hz)
      this.context.createBiquadFilter(), // Low Mids (250-500 Hz)
      this.context.createBiquadFilter(), // Mids (500-2000 Hz)
      this.context.createBiquadFilter(), // High Mids (2-4 kHz)
      this.context.createBiquadFilter(), // Presence (4-6 kHz)
      this.context.createBiquadFilter(), // Brilliance (6-20 kHz)
    ];

    // Configure filters
    this.configureFilters();
    
    // Create audio processing chain
    this.createAudioChain();
  }

  private configureFilters() {
    const frequencies = [40, 150, 375, 1000, 3000, 5000, 10000];
    
    this.filters.forEach((filter, index) => {
      filter.type = index === 0 ? 'lowshelf' 
                 : index === this.filters.length - 1 ? 'highshelf' 
                 : 'peaking';
      filter.frequency.value = frequencies[index];
      filter.Q.value = 1;
    });
  }

  private createAudioChain() {
    // Connect filters in series
    this.filters.reduce((prev, curr) => {
      prev.connect(curr);
      return curr;
    });

    // Connect last filter to effects chain
    const lastFilter = this.filters[this.filters.length - 1];
    lastFilter.connect(this.compressor);
    this.compressor.connect(this.delay);
    this.delay.connect(this.reverb);
    this.reverb.connect(this.analyser);
    this.analyser.connect(this.context.destination);
  }

  async setMood(moodValue: number) {
    // Transform mood value (0-100) to audio parameters
    const intensity = moodValue / 100;
    
    // EQ Adjustments based on mood
    if (moodValue < 50) {
      // Chill mood: Enhance bass, reduce highs
      this.filters[0].gain.value = 3 + (intensity * 2); // Sub-bass
      this.filters[1].gain.value = 2 + (intensity * 2); // Bass
      this.filters[5].gain.value = -2 * (1 - intensity); // Presence
      this.filters[6].gain.value = -3 * (1 - intensity); // Brilliance
    } else {
      // Energetic mood: Boost highs, tighten bass
      this.filters[0].gain.value = -1 * intensity; // Sub-bass
      this.filters[1].gain.value = 1 * intensity; // Bass
      this.filters[5].gain.value = 3 * intensity; // Presence
      this.filters[6].gain.value = 4 * intensity; // Brilliance
    }

    // Compressor settings
    this.compressor.threshold.value = moodValue < 50 ? -30 : -15;
    this.compressor.ratio.value = moodValue < 50 ? 3 : 6;
    this.compressor.attack.value = moodValue < 50 ? 0.1 : 0.01;
    this.compressor.release.value = moodValue < 50 ? 0.3 : 0.1;

    // Delay and reverb settings
    this.delay.delayTime.value = moodValue < 50 ? 0.3 : 0.1;
    
    if (this.source?.playbackRate) {
      const tempo = 1 + ((moodValue - 50) / 100) * 0.3; // Max 30% tempo change
      this.source.playbackRate.value = tempo;
    }
  }

  attachToElement(element: HTMLMediaElement) {
    this.source = this.context.createMediaElementSource(element);
    this.source.connect(this.filters[0]);
  }

  getAnalyserNode() {
    return this.analyser;
  }

  async createReverbImpulse(duration: number = 2, decay: number = 2) {
    const sampleRate = this.context.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.context.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        channelData[i] = ((Math.random() * 2) - 1) * Math.pow(1 - t / duration, decay);
      }
    }
    
    this.reverb.buffer = impulse;
  }

  getFrequencyData() {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}
