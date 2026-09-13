import {
  SOUNDSCAPE_SCENES,
  DEFAULT_SCENE,
  DEFAULT_VOLUME,
  VOLUME_MIN,
  VOLUME_MAX,
  normalizeScene,
  normalizeVolume,
  parseSoundscapePreferences,
  soundscapeState,
} from './soundscape-model.js';

const SOUNDSCAPE_CSS = 'css/soundscape.css?v=r1';

const noiseCache = new Map();
let prefs = parseSoundscapePreferences(null);

function storagePrefix() {
  return window.__IMPRINT?.storagePrefix || 'bookself';
}

function storageKey() {
  return `${storagePrefix()}:reader-soundscape`;
}

function loadPreferences() {
  try {
    const raw = localStorage.getItem(storageKey());
    if (raw == null) return parseSoundscapePreferences(null);
    return parseSoundscapePreferences(raw);
  } catch {
    return parseSoundscapePreferences(null);
  }
}

function savePreferences() {
  try {
    localStorage.setItem(storageKey(), JSON.stringify({
      scene: prefs.scene,
      volume: prefs.volume,
    }));
  } catch {
    // Soundscape still works for the session when storage is unavailable.
  }
}

function installDocumentStyles() {
  if (document.querySelector(`link[href="${SOUNDSCAPE_CSS}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = SOUNDSCAPE_CSS;
  document.head.appendChild(link);
}

class SoundscapeEngine {
  constructor() {
    const ContextClass = window.AudioContext || window.webkitAudioContext;
    this.supported = !!ContextClass;
    this.ContextClass = ContextClass;
    this.ctx = null;
    this.master = null;
    this.nodes = [];
    this.timers = [];
    this.volume = DEFAULT_VOLUME;
  }

  ensureContext() {
    if (this.ctx) return;
    if (!this.supported) return;
    this.ctx = new this.ContextClass();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);
  }

  async activate(scene, volume) {
    this.ensureContext();
    if (!this.ctx || !this.supported) return false;
    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        return false;
      }
    }
    this.stop();
    this.volume = normalizeVolume(volume) ?? DEFAULT_VOLUME;
    const sceneId = normalizeScene(scene) || 'off';
    if (sceneId !== 'off') this.build(sceneId);
    this.applyVolume(this.volume, 180);
    return true;
  }

  setVolume(volume) {
    this.volume = normalizeVolume(volume) ?? DEFAULT_VOLUME;
    if (this.nodes.length) this.applyVolume(this.volume, 120);
  }

  applyVolume(volume, rampMs = 0) {
    if (!this.master) return;
    const ceiling = this.nodes.length ? this.sceneCeiling : 0;
    const target = ceiling * (volume / VOLUME_MAX);
    const now = this.ctx.currentTime;
    const gain = this.master.gain;
    gain.cancelScheduledValues(now);
    if (rampMs > 0) {
      gain.setValueAtTime(gain.value, now);
      gain.linearRampToValueAtTime(target, now + rampMs / 1000);
    } else {
      gain.setValueAtTime(target, now);
    }
  }

  stop() {
    for (const timer of this.timers) {
      clearInterval(timer);
      clearTimeout(timer);
    }
    this.timers.length = 0;
    for (const node of this.nodes) {
      try {
        if (typeof node.stop === 'function' && !Number.isNaN(node.stopTime)) node.stop();
      } catch {
        // Nodes that already stopped are safe to release.
      }
      try {
        node.disconnect();
      } catch {
        // Already disconnected nodes are safe to ignore.
      }
    }
    this.nodes.length = 0;
    this.sceneCeiling = 0;
  }

  node(builder) {
    const built = builder(this.ctx);
    if (built) this.nodes.push(built);
  }

  buffer(type) {
    if (!this.ctx) return null;
    if (noiseCache.has(type)) return noiseCache.get(type);
    const length = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastBrown = 0;
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    let b5 = 0;
    let b6 = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      let sample = white;
      if (type === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        sample = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      } else if (type === 'brown') {
        lastBrown = (lastBrown + 0.02 * white) / 1.02;
        sample = lastBrown * 3.5;
      }
      data[i] = sample;
    }
    noiseCache.set(type, buffer);
    return buffer;
  }

  loopNoise(ctx, { type = 'white', filter = 'lowpass', frequency = 1200, q = 0.8, gain = 0.12 } = {}) {
    const source = ctx.createBufferSource();
    source.buffer = this.buffer(type);
    source.loop = true;
    const filterNode = ctx.createBiquadFilter();
    filterNode.type = filter;
    filterNode.frequency.value = frequency;
    filterNode.Q.value = q;
    const gainNode = ctx.createGain();
    gainNode.gain.value = gain;
    source.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(this.master);
    source.start();
    return source;
  }

  loopTone(ctx, { frequency = 440, type = 'sine', gain = 0.02 } = {}) {
    const source = ctx.createOscillator();
    source.type = type;
    source.frequency.value = frequency;
    const gainNode = ctx.createGain();
    gainNode.gain.value = gain;
    source.connect(gainNode);
    gainNode.connect(this.master);
    source.start();
    return source;
  }

  crackleScheduler(ctx, { minDelay = 140, maxDelay = 700, gain = 0.045 } = {}) {
    const schedule = () => {
      if (!this.nodes.length) return;
      const source = ctx.createBufferSource();
      source.buffer = this.buffer('white');
      const band = ctx.createBiquadFilter();
      band.type = 'bandpass';
      band.frequency.value = 900 + Math.random() * 2600;
      band.Q.value = 0.8;
      const gainNode = ctx.createGain();
      const now = ctx.currentTime;
      const peak = gain * (0.4 + Math.random() * 0.6);
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.exponentialRampToValueAtTime(peak, now + 0.004);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.06 + Math.random() * 0.12);
      source.connect(band);
      band.connect(gainNode);
      gainNode.connect(this.master);
      source.start(now, Math.random() * 1.2, 0.25);
      source.stop(now + 0.3);
      const delay = minDelay + Math.random() * (maxDelay - minDelay);
      this.timers.push(setTimeout(schedule, delay));
    };
    this.timers.push(setTimeout(schedule, 300));
  }

  cricketScheduler(ctx, { gain = 0.014 } = {}) {
    const chirp = () => {
      if (!this.nodes.length) return;
      const now = ctx.currentTime;
      const chirps = 3 + Math.floor(Math.random() * 4);
      for (let i = 0; i < chirps; i += 1) {
        const source = ctx.createOscillator();
        source.type = 'sine';
        const base = 4100 + Math.random() * 700;
        source.frequency.setValueAtTime(base, now + i * 0.09);
        source.frequency.exponentialRampToValueAtTime(base * 0.94, now + i * 0.09 + 0.06);
        const envelope = ctx.createGain();
        const start = now + i * 0.09;
        envelope.gain.setValueAtTime(0.0001, start);
        envelope.gain.exponentialRampToValueAtTime(gain, start + 0.012);
        envelope.gain.exponentialRampToValueAtTime(0.0001, start + 0.07);
        source.connect(envelope);
        envelope.connect(this.master);
        source.start(start);
        source.stop(start + 0.12);
      }
      const delay = 600 + Math.random() * 1400;
      this.timers.push(setTimeout(chirp, delay));
    };
    this.timers.push(setTimeout(chirp, 900));
  }

  build(scene) {
    const ctx = this.ctx;
    this.sceneCeiling = 1;
    if (scene === 'rain') {
      this.sceneCeiling = 0.34;
      this.node((at) => this.loopNoise(at, { type: 'white', filter: 'lowpass', frequency: 2100, q: 0.6, gain: 0.2 }));
      this.node((at) => this.loopNoise(at, { type: 'white', filter: 'highpass', frequency: 5200, q: 0.7, gain: 0.035 }));
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.07;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.5;
      lfo.connect(lfoGain);
      lfoGain.connect(this.master.gain);
      lfo.start();
      this.nodes.push(lfo);
    } else if (scene === 'fire') {
      this.sceneCeiling = 0.32;
      this.node((at) => this.loopNoise(at, { type: 'brown', filter: 'lowpass', frequency: 620, q: 0.5, gain: 0.3 }));
      this.node((at) => this.loopNoise(at, { type: 'white', filter: 'bandpass', frequency: 1400, q: 0.4, gain: 0.02 }));
      this.crackleScheduler(ctx, {});
    } else if (scene === 'waves') {
      this.sceneCeiling = 0.36;
      this.node((at) => this.loopNoise(at, { type: 'pink', filter: 'lowpass', frequency: 780, q: 0.6, gain: 0.26 }));
      this.node((at) => this.loopNoise(at, { type: 'white', filter: 'highpass', frequency: 1600, q: 0.5, gain: 0.02 }));
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.11;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.45;
      lfo.connect(lfoGain);
      lfoGain.connect(this.master.gain);
      lfo.start();
      this.nodes.push(lfo);
    } else if (scene === 'wind') {
      this.sceneCeiling = 0.16;
      const filterNode = ctx.createBiquadFilter();
      filterNode.type = 'bandpass';
      filterNode.frequency.value = 420;
      filterNode.Q.value = 0.8;
      const source = ctx.createBufferSource();
      source.buffer = this.buffer('pink');
      source.loop = true;
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.4;
      source.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(this.master);
      source.start();
      this.nodes.push(source);
      const sweep = ctx.createOscillator();
      sweep.frequency.value = 0.05;
      const sweepGain = ctx.createGain();
      sweepGain.gain.value = 540;
      const base = ctx.createConstantSource();
      base.offset.value = 620;
      base.connect(sweepGain);
      sweep.connect(sweepGain);
      sweepGain.connect(filterNode.frequency);
      base.start();
      sweep.start();
      this.nodes.push(sweep, base);
    } else if (scene === 'night') {
      this.sceneCeiling = 0.2;
      this.node((at) => this.loopNoise(at, { type: 'pink', filter: 'lowpass', frequency: 480, q: 0.7, gain: 0.12 }));
      this.cricketScheduler(ctx, {});
    }
  }
}

const engine = new SoundscapeEngine();

function panelMarkup() {
  const state = soundscapeState({ scene: prefs.scene, volume: prefs.volume, supported: engine.supported });
  return `
    <section class="soundscape-panel" id="readerSoundscape" aria-labelledby="readerSoundscapeTitle">
      <div class="soundscape-head">
        <p class="soundscape-eyebrow">Reading sound</p>
        <h4 id="readerSoundscapeTitle">Add a room tone</h4>
      </div>
      <p class="soundscape-lede">Synthesized ambience, generated in your browser. Pairs with the fireside atmosphere; chooses real sound, no streams.</p>
      <div class="soundscape-options" role="group" aria-label="Ambient soundscape">
        ${SOUNDSCAPE_SCENES.map((scene) => {
          const model = soundscapeButtonModel(scene.id, { active: state.scene === scene.id, supported: engine.supported });
          return `
            <button type="button" class="soundscape-option" data-soundscape-scene="${scene.id}" aria-pressed="${model.pressed}" ${model.disabled ? 'disabled' : ''}>
              <span class="soundscape-orb" aria-hidden="true" data-orb="${scene.id}"></span>
              <span class="soundscape-copy"><strong>${scene.name}</strong><small>${scene.note}</small></span>
            </button>`;
        }).join('')}
      </div>
      <div class="soundscape-volume-row">
        <label for="soundscapeVolume">Volume</label>
        <input id="soundscapeVolume" type="range" min="${VOLUME_MIN}" max="${VOLUME_MAX}" value="${state.volume}" ${engine.supported ? '' : 'disabled'}>
        <span class="soundscape-volume-value" id="soundscapeVolumeValue">${state.volume}%</span>
      </div>
      <p class="soundscape-hint" id="soundscapeHint" ${engine.supported ? 'hidden' : ''}>Audio needs a tap in this browser. Pick a scene to begin.</p>
    </section>`;
}

function installPanel() {
  const card = document.querySelector('#settingsPanel .settings-card');
  if (!card || document.getElementById('readerSoundscape')) return;

  const atmosphere = document.querySelector('#readerAtmosphere');
  if (atmosphere) {
    atmosphere.insertAdjacentHTML('afterend', panelMarkup());
  } else {
    const rows = [...card.querySelectorAll('.setting-row')];
    const paperRow = rows.find((row) => row.querySelector(':scope > span')?.textContent?.trim().toLowerCase().includes('paper'));
    if (paperRow) paperRow.insertAdjacentHTML('beforebegin', panelMarkup());
    else card.append(panelMarkup());
  }
  bindPanel();
  syncPanelUi();
}

function bindPanel() {
  document.querySelectorAll('[data-soundscape-scene]').forEach((button) => {
    button.addEventListener('click', () => {
      const scene = normalizeScene(button.dataset.soundscapeScene) || 'off';
      selectScene(scene, { persist: true });
    });
  });
  const volume = document.getElementById('soundscapeVolume');
  if (volume) {
    volume.addEventListener('input', () => {
      const value = normalizeVolume(volume.value) ?? DEFAULT_VOLUME;
      setVolume(value, { persist: true });
    });
  }
}

function syncPanelUi() {
  const state = soundscapeState({ scene: prefs.scene, volume: prefs.volume, supported: engine.supported });
  document.querySelectorAll('[data-soundscape-scene]').forEach((button) => {
    const selected = button.dataset.soundscapeScene === state.scene;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  const volume = document.getElementById('soundscapeVolume');
  const value = document.getElementById('soundscapeVolumeValue');
  if (volume && value) {
    volume.value = String(state.volume);
    value.textContent = `${state.volume}%`;
  }
  const hint = document.getElementById('soundscapeHint');
  if (hint && engine.supported) hint.hidden = true;
}

function selectScene(scene, { persist = false } = {}) {
  prefs = { ...prefs, scene: normalizeScene(scene) || 'off' };
  if (prefs.scene !== 'off') {
    window.setTimeout(() => {
      engine.activate(prefs.scene, prefs.volume);
    }, 0);
  } else {
    engine.stop();
  }
  if (persist && prefs.scene !== 'off') savePreferences();
  if (persist && prefs.scene === 'off') {
    engine.stop();
    savePreferences();
  }
  syncPanelUi();
}

function setVolume(volume, { persist = false } = {}) {
  prefs = { ...prefs, volume: normalizeVolume(volume) ?? DEFAULT_VOLUME };
  engine.setVolume(prefs.volume);
  if (persist) savePreferences();
  syncPanelUi();
}

function resumeAfterGesture() {
  if (prefs.scene !== 'off' && !engine.nodes.length) {
    engine.activate(prefs.scene, prefs.volume);
  }
}

function suspendWhenHidden() {
  const toggle = () => {
    if (document.hidden) {
      if (engine.ctx?.state === 'running') engine.ctx.suspend().catch(() => {});
    } else {
      if (prefs.scene !== 'off') engine.activate(prefs.scene, prefs.volume);
    }
  };
  document.addEventListener('visibilitychange', toggle);
}

installDocumentStyles();
prefs = loadPreferences();
installPanel();
document.addEventListener('pointerdown', resumeAfterGesture, { once: false, capture: true });
suspendWhenHidden();
if (engine.supported) engine.ensureContext();