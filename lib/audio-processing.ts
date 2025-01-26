export class AudioProcessor {
  private context: AudioContext;
  private source: MediaElementAudioSourceNode | null = null;
  private analyser: AnalyserNode;
  private filters: BiquadFilterNode[];

  constructor() {
    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();
    this.filters = [
      this.context.createBiquadFilter(), // Low
      this.context.createBiquadFilter(), // Mid
      this.context.createBiquadFilter(), // High
    ];
    
    // Configure filters
    this.filters[0].type = 'lowshelf';
    this.filters[1].type = 'peaking';
    this.filters[2].type = 'highshelf';
    
    // Connect filters in series
    this.filters.reduce((prev, curr) => {
      prev.connect(curr);
      return curr;
    });
    
    // Connect last filter to analyser
    this.filters[this.filters.length - 1].connect(this.analyser);
    this.analyser.connect(this.context.destination);
  }

  async setMood(moodValue: number) {
    // Transform mood value (0-100) to audio parameters
    const bassGain = moodValue < 50 ? 3 : -3;
    const trebleGain = moodValue > 50 ? 4 : -4;
    const tempo = 1 + (moodValue - 50) / 100; // 0.5x to 1.5x

    this.filters[0].gain.value = bassGain;
    this.filters[2].gain.value = trebleGain;
    
    if (this.source) {
      // @ts-ignore - playbackRate is available on audio elements
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
}
