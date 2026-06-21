// Procedural sound effects using Web Audio API — no audio files needed
let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  // Resume if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function playFlap() {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain); gain.connect(ac.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ac.currentTime + 0.08);
    gain.gain.setValueAtTime(0.18, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.1);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.1);
  } catch(e) {}
}

export function playPoint() {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain); gain.connect(ac.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(660, ac.currentTime);
    osc.frequency.setValueAtTime(880, ac.currentTime + 0.06);
    gain.gain.setValueAtTime(0.12, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.14);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.14);
  } catch(e) {}
}

export function playBossHit() {
  try {
    const ac = getCtx(); const t = ac.currentTime;
    const bufSize = Math.floor(ac.sampleRate * 0.12);
    const buf = ac.createBuffer(1, bufSize, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource(); src.buffer = buf;
    const filter = ac.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = 900; filter.Q.value = 0.8;
    const gain = ac.createGain();
    src.connect(filter); filter.connect(gain); gain.connect(ac.destination);
    gain.gain.setValueAtTime(0.35, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    src.start(t);
    const osc = ac.createOscillator(); const og = ac.createGain();
    osc.connect(og); og.connect(ac.destination);
    osc.frequency.setValueAtTime(180, t); osc.frequency.exponentialRampToValueAtTime(55, t + 0.1);
    og.gain.setValueAtTime(0.28, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.start(t); osc.stop(t + 0.1);
  } catch(e) {}
}

export function playPlayerHurt() {
  try {
    const ac = getCtx(); const t = ac.currentTime;
    const osc = ac.createOscillator(); const gain = ac.createGain();
    osc.connect(gain); gain.connect(ac.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(480, t); osc.frequency.exponentialRampToValueAtTime(110, t + 0.2);
    gain.gain.setValueAtTime(0.22, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.start(t); osc.stop(t + 0.22);
  } catch(e) {}
}

export function playBossDefeated() {
  try {
    const ac = getCtx(); const t = ac.currentTime;
    [523, 659, 784].forEach((freq, i) => {
      const osc = ac.createOscillator(); const gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type = 'square'; osc.frequency.value = freq;
      const s = t + i * 0.11;
      gain.gain.setValueAtTime(0.15, s); gain.gain.exponentialRampToValueAtTime(0.001, s + 0.2);
      osc.start(s); osc.stop(s + 0.2);
    });
  } catch(e) {}
}

export function playVictory() {
  try {
    const ac = getCtx(); const t = ac.currentTime;
    [262, 330, 392, 523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ac.createOscillator(); const gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type = 'square'; osc.frequency.value = freq;
      const s = t + i * 0.13;
      const dur = i === 6 ? 0.55 : 0.22;
      gain.gain.setValueAtTime(0.13, s); gain.gain.exponentialRampToValueAtTime(0.001, s + dur);
      osc.start(s); osc.stop(s + dur);
    });
  } catch(e) {}
}

export function playDeath() {
  try {
    const ac = getCtx();
    // Noise burst
    const bufSize = ac.sampleRate * 0.3;
    const buf = ac.createBuffer(1, bufSize, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource();
    src.buffer = buf;
    const gain = ac.createGain();
    src.connect(gain); gain.connect(ac.destination);
    gain.gain.setValueAtTime(0.3, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.3);
    src.start(ac.currentTime);
    // Descending tone underneath
    const osc = ac.createOscillator();
    const og = ac.createGain();
    osc.connect(og); og.connect(ac.destination);
    osc.frequency.setValueAtTime(400, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ac.currentTime + 0.35);
    og.gain.setValueAtTime(0.2, ac.currentTime);
    og.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.35);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.35);
  } catch(e) {}
}
