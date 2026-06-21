// Procedural techno music — Web Audio API, no files needed

let ac = null;
let master = null;
let playing = false;
let beat = 0;
let nextTime = 0;
let timer = null;

const BPM = 128;
const STEP = 60 / (BPM * 4); // 16th note duration

const BASS_NOTES = [55, 0, 55, 0, 65, 0, 0, 73, 55, 0, 55, 0, 49, 0, 58, 0];
const ARP_NOTES  = [0, 0, 0, 0, 110, 0, 130, 0, 0, 0, 0, 0, 98, 0, 117, 0];

function ctx() {
  if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
  if (ac.state === 'suspended') ac.resume();
  return ac;
}

function out() {
  if (!master) {
    master = ctx().createGain();
    master.gain.value = 0.38;
    master.connect(ctx().destination);
  }
  return master;
}

function kick(t) {
  const a = ctx();
  const o = a.createOscillator(), g = a.createGain();
  o.connect(g); g.connect(out());
  o.frequency.setValueAtTime(160, t);
  o.frequency.exponentialRampToValueAtTime(0.01, t + 0.38);
  g.gain.setValueAtTime(1.0, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
  o.start(t); o.stop(t + 0.38);
}

function snare(t) {
  const a = ctx();
  const sz = Math.floor(a.sampleRate * 0.14);
  const buf = a.createBuffer(1, sz, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource(); src.buffer = buf;
  const f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1200;
  const g = a.createGain();
  src.connect(f); f.connect(g); g.connect(out());
  g.gain.setValueAtTime(0.45, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
  src.start(t);
}

function hihat(t, vol) {
  const a = ctx();
  const sz = Math.floor(a.sampleRate * 0.04);
  const buf = a.createBuffer(1, sz, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < sz; i++) d[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource(); src.buffer = buf;
  const f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 9000;
  const g = a.createGain();
  src.connect(f); f.connect(g); g.connect(out());
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
  src.start(t);
}

function bass(t, step) {
  const freq = BASS_NOTES[step % 16];
  if (!freq) return;
  const a = ctx();
  const o = a.createOscillator(), f = a.createBiquadFilter(), g = a.createGain();
  o.type = 'sawtooth'; o.frequency.value = freq;
  f.type = 'lowpass'; f.frequency.value = 350; f.Q.value = 6;
  o.connect(f); f.connect(g); g.connect(out());
  const dur = STEP * 0.85;
  g.gain.setValueAtTime(0.55, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.start(t); o.stop(t + dur);
}

function arp(t, step) {
  const freq = ARP_NOTES[step % 16];
  if (!freq) return;
  const a = ctx();
  const o = a.createOscillator(), g = a.createGain();
  o.type = 'square'; o.frequency.value = freq;
  o.connect(g); g.connect(out());
  const dur = STEP * 0.6;
  g.gain.setValueAtTime(0.09, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.start(t); o.stop(t + dur);
}

function schedule() {
  while (nextTime < ctx().currentTime + 0.12) {
    const s = beat % 16;
    if (s % 4 === 0)             kick(nextTime);
    if (s === 4 || s === 12)     snare(nextTime);
    if (s % 2 === 0)             hihat(nextTime, 0.18);
    if (s === 8)                 hihat(nextTime, 0.28);
    bass(nextTime, s);
    arp(nextTime, s);
    nextTime += STEP;
    beat++;
  }
  if (playing) timer = setTimeout(schedule, 22);
}

export function startMusic() {
  if (playing) return;
  playing = true;
  beat = 0;
  nextTime = ctx().currentTime + 0.05;
  schedule();
}

export function stopMusic() {
  playing = false;
  if (timer) clearTimeout(timer);
  timer = null;
}

export function setMusicVol(v) {
  out().gain.value = v;
}
