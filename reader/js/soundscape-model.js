export const SOUNDSCAPE_SCENES = Object.freeze([
  { id: 'off', name: 'Silence', note: 'True quiet' },
  { id: 'rain', name: 'Rain', note: 'Steady window rain' },
  { id: 'fire', name: 'Hearth', note: 'Crackling fire' },
  { id: 'waves', name: 'Shores', note: 'Slow ocean swell' },
  { id: 'wind', name: 'Breeze', note: 'Soft night wind' },
  { id: 'night', name: 'Night', note: 'Late summer crickets' },
]);

export const DEFAULT_SCENE = 'off';
export const DEFAULT_VOLUME = 55;
export const VOLUME_MIN = 0;
export const VOLUME_MAX = 100;
export const STORAGE_VERSION = 1;

const SCENE_IDS = new Set(SOUNDSCAPE_SCENES.map((scene) => scene.id));

export function normalizeScene(value) {
  return SCENE_IDS.has(value) ? value : null;
}

export function normalizeVolume(value) {
  if (value == null || value === '') return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.round(Math.min(VOLUME_MAX, Math.max(VOLUME_MIN, number)));
}

export function parseSoundscapePreferences(raw = null) {
  let source = raw;
  if (typeof raw === 'string') {
    try {
      source = JSON.parse(raw);
    } catch {
      source = null;
    }
  }
  const object = source && typeof source === 'object' ? source : {};
  return {
    scene: normalizeScene(object.scene) || DEFAULT_SCENE,
    volume: normalizeVolume(object.volume) ?? DEFAULT_VOLUME,
  };
}

export function soundscapeState({ scene = DEFAULT_SCENE, volume = DEFAULT_VOLUME, supported = true } = {}) {
  const normalizedScene = normalizeScene(scene) || DEFAULT_SCENE;
  const normalizedVolume = normalizeVolume(volume) ?? DEFAULT_VOLUME;
  const active = normalizedScene !== 'off' && !!supported;
  return {
    scene: normalizedScene,
    volume: normalizedVolume,
    supported: !!supported,
    active,
    label: SCENE_IDS.has(normalizedScene)
      ? SOUNDSCAPE_SCENES.find((item) => item.id === normalizedScene).name
      : 'Silence',
  };
}

export function soundscapeButtonModel(scene, { active = false, supported = true } = {}) {
  const definition = SOUNDSCAPE_SCENES.find((item) => item.id === scene);
  if (!definition) return null;
  return {
    id: definition.id,
    label: definition.name,
    note: definition.note,
    pressed: !!active,
    disabled: !supported,
  };
}

export function soundscapePreferencePayload({ scene, volume }) {
  return { version: STORAGE_VERSION, scene, volume };
}