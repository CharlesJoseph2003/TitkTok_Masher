export class AudioProcessor {
  private context: AudioContext;
  private source: MediaElementAudioSourceNode | null = null;
  private audioElement: HTMLMediaElement | null = null;
  private delay: DelayNode;
  private analyser: AnalyserNode;
  private filters: BiquadFilterNode[];

  constructor() {
    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();
    this.delay = this.context.createDelay();
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
    
    // Connect last filter to delay, then to analyser
    this.filters[this.filters.length - 1].connect(this.delay);
    this.delay.connect(this.analyser);
    this.analyser.connect(this.context.destination);
  }

  async setMood(moodValue: number) {
    // Transform mood value (0-100) to audio parameters
    const bassGain = moodValue < 50 ? 3 : -3;
    const trebleGain = moodValue > 50 ? 4 : -4;

    this.filters[0].gain.value = bassGain;
    this.filters[2].gain.value = trebleGain;
    
    // Set delay time based on mood
    this.delay.delayTime.value = moodValue < 50 ? 0.3 : 0.1;
    
    // Apply tempo changes to the audio element directly
    if (this.audioElement) {
      const tempo = 1 + ((moodValue - 50) / 100) * 0.3; // Max 30% tempo change
      this.audioElement.playbackRate = tempo;
    }
  }

  attachToElement(element: HTMLMediaElement) {
    this.audioElement = element;
    this.source = this.context.createMediaElementSource(element);
    this.source.connect(this.filters[0]);
  }

  getAnalyserNode() {
    return this.analyser;
  }
}
