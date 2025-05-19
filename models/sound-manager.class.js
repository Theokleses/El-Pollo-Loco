class SoundManager {
  constructor() {
    this.audioPool = [];
    this.isMuted = localStorage.getItem("isMuted") === "true";
    this.preloadAudio();
  }

  /**
   * Loads and initializes a predefined list of audio files.
   * The audio files are preloaded with specific volume levels
   * and stored in the `audioPool` for later playback.
   */
  preloadAudio() {
    const soundConfigs = [
      { key: 'bottle-splash', file: 'bottle-splash.mp3', volume: 0.3 },
      { key: 'chicken-dead', file: 'chicken.mp3', volume: 0.2 },
      { key: 'endboss-dead', file: 'endboss.mp3', volume: 0.5 },
      { key: 'win', file: 'win.mp3', volume: 1.0 },
      { key: 'lose', file: 'lose.mp3', volume: 1.0 },
      { key: 'hurt', file: 'hurt.mp3', volume: 0.3 },
      { key: 'walking', file: 'running.mp3', volume: 0.4 }
    ];

    soundConfigs.forEach(config => {
      const audio = new Audio(`audio/${config.file}`);
      audio.volume = config.volume;
      audio.preload = 'auto';
      this.audioPool.push({ key: config.key, audio });
    });
  }

  /**
   * Plays a sound from the `audioPool` based on the given key,
   * if the sound is currently paused. Optionally allows overriding the mute state.
   */
  playSound(key, isMuted = null) {
    const muteState = isMuted !== null ? isMuted : this.isMuted;
    const availableSound = this.audioPool.find(s => s.key === key && s.audio.paused);
    
    if (availableSound) {
      try {
        availableSound.audio.muted = muteState;
        availableSound.audio.currentTime = 0;
        availableSound.audio.play().catch(e => console.warn(`Sound ${key} play interrupted:`, e));
        return availableSound;
      } catch (e) {
        console.error(`Sound ${key} error:`, e);
      }
    }
    return null;
  }
}