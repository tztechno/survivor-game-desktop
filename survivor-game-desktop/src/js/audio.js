// Web Audio API Synthesizer Sound System
class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmGain = null;
    this.sfxGain = null;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.isBgmPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master BGM gain
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);

      // Master SFX gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.bgmGain && this.sfxGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.12, now);
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, now);
    }
    return this.isMuted;
  }

  // SFX: Magic Laser / Missile
  playLaser() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  // SFX: Enemy Hit
  playHit() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  // SFX: EXP Gem Pickup
  playGem() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      const f = freqs[Math.floor(Math.random() * freqs.length)];
      osc.frequency.setValueAtTime(f, now);
      osc.frequency.exponentialRampToValueAtTime(f * 1.5, now + 0.1);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  // SFX: Explosion
  playExplosion() {
    if (this.isMuted || !this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.25);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start();
    } catch (e) {}
  }

  // SFX: Level Up Fanfare
  playLevelUp() {
    if (this.isMuted || !this.ctx) return;
    try {
      const notes = [440, 554.37, 659.25, 880]; // A major
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.22, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch (e) {}
  }

  // SFX: Thunder Smite
  playThunder() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  // SFX: Player Hurt
  playHurt() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(60, now + 0.15);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  // SFX: Game Over
  playGameOver() {
    if (this.isMuted || !this.ctx) return;
    this.stopBGM();
    try {
      const notes = [330, 293.66, 261.63, 196]; // Descending
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.18;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch (e) {}
  }

  // Synthwave BGM Loop
  startBGM() {
    if (this.isBgmPlaying) return;
    this.init();
    this.isBgmPlaying = true;
    this.bgmStep = 0;

    // Cyberpunk Bassline Progression: Am -> F -> C -> G
    const bassChords = [
      [110, 164.81, 220],    // A2, E3, A3
      [87.31, 130.81, 174.61],// F2, C3, F3
      [130.81, 196, 261.63], // C3, G3, C4
      [98, 146.83, 196]      // G2, D3, G3
    ];

    const leadNotes = [
      440, 523.25, 659.25, 523.25, 440, 659.25, 783.99, 659.25,
      349.23, 440, 523.25, 440, 349.23, 523.25, 659.25, 523.25,
      523.25, 659.25, 783.99, 659.25, 523.25, 783.99, 880, 783.99,
      392, 493.88, 587.33, 493.88, 392, 587.33, 659.25, 493.88
    ];

    const stepInterval = 135; // ~111 BPM 16th notes

    this.bgmTimer = setInterval(() => {
      if (this.isMuted || !this.ctx || this.ctx.state === 'suspended') return;

      const chordIdx = Math.floor((this.bgmStep % 32) / 8);
      const chord = bassChords[chordIdx];
      const now = this.ctx.currentTime;

      // Bass Pulse on every 8th note
      if (this.bgmStep % 2 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(chord[0], now);
        
        bassGain.gain.setValueAtTime(0.08, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        bassOsc.connect(bassGain);
        bassGain.connect(this.bgmGain);

        bassOsc.start(now);
        bassOsc.stop(now + 0.12);
      }

      // Synth Arpeggio Lead
      const leadNote = leadNotes[this.bgmStep % leadNotes.length];
      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      leadOsc.type = 'triangle';
      leadOsc.frequency.setValueAtTime(leadNote, now);

      leadGain.gain.setValueAtTime(0.06, now);
      leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      leadOsc.connect(leadGain);
      leadGain.connect(this.bgmGain);

      leadOsc.start(now);
      leadOsc.stop(now + 0.1);

      this.bgmStep++;
    }, stepInterval);
  }

  stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

const audio = new AudioManager();
