/**
 * Manages an authentic, loud standard emergency alert "BEEP BEEP!" looping sound
 * using the browser's native Web Audio API with hardware compression and loudness maximizing.
 * 
 * Loops continuously until stopEmergencySoundLoop() is called (e.g. when worker Accepts or Rejects).
 */

let loopIntervalId: ReturnType<typeof setInterval> | null = null;
let activeAudioCtx: AudioContext | null = null;
let activeMasterGain: GainNode | null = null;

const getOrCreateAudioContext = (): AudioContext | null => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!activeAudioCtx || activeAudioCtx.state === 'closed') {
      activeAudioCtx = new AudioContextClass();
    }

    if (activeAudioCtx.state === 'suspended') {
      activeAudioCtx.resume().catch(() => {});
    }

    return activeAudioCtx;
  } catch {
    return null;
  }
};

/**
 * Plays one burst of the loud standard alert [BEEP - BEEP] ... [BEEP - BEEP]
 */
export const playEmergencySound = () => {
  try {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return;

    // Hardware dynamics compressor to push maximum perceived volume cleanly without digital clipping
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-6, ctx.currentTime);
    compressor.knee.setValueAtTime(3, ctx.currentTime);
    compressor.ratio.setValueAtTime(16, ctx.currentTime);
    compressor.attack.setValueAtTime(0.002, ctx.currentTime);
    compressor.release.setValueAtTime(0.05, ctx.currentTime);
    compressor.connect(ctx.destination);

    // Master volume gain (boosted loud for maximum presence)
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.95, ctx.currentTime);
    masterGain.connect(compressor);
    activeMasterGain = masterGain;

    // Low-pass filter to keep the square wave punchy, loud, and authoritative without harsh high hiss
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, ctx.currentTime);
    filter.connect(masterGain);

    /**
     * Plays a single loud standard alert beep (1050 Hz standard emergency alert tone)
     */
    const playStandardBeep = (startTime: number, duration: number, freq = 1050) => {
      const now = startTime;

      const beepGain = ctx.createGain();
      beepGain.gain.setValueAtTime(0.0001, now);
      // Snappy 3ms attack
      beepGain.gain.linearRampToValueAtTime(0.95, now + 0.003);
      beepGain.gain.setValueAtTime(0.95, now + duration - 0.005);
      // Clean 5ms release
      beepGain.gain.linearRampToValueAtTime(0.0001, now + duration);

      // Primary tone: Standard digital alert square wave
      const osc1 = ctx.createOscillator();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(freq, now);

      // Secondary tone: Sine wave for thick core
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq, now);

      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.4, now);
      osc2.connect(osc2Gain);

      osc1.connect(beepGain);
      osc2Gain.connect(beepGain);
      beepGain.connect(filter);

      osc1.start(now);
      osc2.start(now);

      osc1.stop(now + duration);
      osc2.stop(now + duration);
    };

    const start = ctx.currentTime + 0.02;

    // Standard high-priority emergency alert cadence:
    // [BEEP - BEEP] ... [BEEP - BEEP] (1050 Hz standard alert tone)
    playStandardBeep(start, 0.12, 1050);
    playStandardBeep(start + 0.20, 0.12, 1050);

    playStandardBeep(start + 0.44, 0.12, 1050);
    playStandardBeep(start + 0.64, 0.18, 1050);

  } catch (err) {
    console.warn('Web Audio emergency alert could not play:', err);
  }
};

/**
 * Starts continuous, persistent looping of the loud emergency alert sound.
 * Keeps repeating until stopEmergencySoundLoop() is called.
 */
export const startEmergencySoundLoop = () => {
  // If already looping, don't create duplicate intervals
  if (loopIntervalId !== null) return;

  // Play immediately
  playEmergencySound();

  // Loop every 1.15 seconds (giving 0.35s pause between alert bursts)
  loopIntervalId = setInterval(() => {
    playEmergencySound();
  }, 1150);
};

/**
 * Instantly silences and terminates the looping emergency alert sound.
 * Called when the worker clicks Accept or Reject, or dismisses the alert.
 */
export const stopEmergencySoundLoop = () => {
  if (loopIntervalId !== null) {
    clearInterval(loopIntervalId);
    loopIntervalId = null;
  }

  // Instantly cut off any currently ringing audio buffer
  if (activeMasterGain && activeAudioCtx) {
    try {
      activeMasterGain.gain.setValueAtTime(0.0001, activeAudioCtx.currentTime);
    } catch {
      // ignore
    }
  }
};




