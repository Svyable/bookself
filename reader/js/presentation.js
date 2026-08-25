import { fetchText } from './base.js';

export const READER_PRESENTATION_VERSION = 1;

const THEMES = new Set([
  'light', 'linen', 'porcelain', 'sage', 'lavender', 'ivory', 'sepia', 'rose', 'sand',
  'dark', 'slate', 'midnight', 'forest', 'ember', 'deep-sea', 'aubergine',
  'contrast', 'contrast-dark',
]);
const WARMTHS = new Set(['off', 'soft', 'golden']);
const FONTS = new Set(['book', 'literary', 'warm', 'classic', 'modern', 'clear', 'humanist', 'system']);
const MEASURES = new Set(['narrow', 'balanced', 'wide']);
const ALIGNS = new Set(['left', 'justify']);
const PARAGRAPHS = new Set(['compact', 'normal', 'airy']);
const INDENTS = new Set(['none', 'gentle', 'classic']);
const MODES = new Set(['paged', 'scroll']);
const HYPHENS = new Set(['auto', 'off']);
const WEIGHTS = new Set([400, 500, 600]);

const cache = new Map();

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function finite(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function pick(set, value) {
  return set.has(value) ? value : undefined;
}

export function normalizeReaderPresentation(raw = {}) {
  const appearanceRaw = raw && typeof raw.appearance === 'object' ? raw.appearance : {};
  const typographyRaw = raw && typeof raw.typography === 'object' ? raw.typography : {};
  const fontSize = finite(typographyRaw.fontSize);
  const tracking = finite(typographyRaw.tracking);
  const leading = finite(typographyRaw.leading);
  const fontWeight = finite(typographyRaw.fontWeight);

  const appearance = {
    theme: pick(THEMES, appearanceRaw.theme),
    warmth: pick(WARMTHS, appearanceRaw.warmth),
  };
  const typography = {
    fontSize: fontSize == null ? undefined : Math.round(clamp(fontSize, 14, 32)),
    font: pick(FONTS, typographyRaw.font),
    fontWeight: WEIGHTS.has(fontWeight) ? fontWeight : undefined,
    tracking: tracking == null ? undefined : Number(clamp(tracking, -0.02, 0.08).toFixed(2)),
    leading: leading == null ? undefined : Number(clamp(leading, 1.3, 2).toFixed(2)),
    measure: pick(MEASURES, typographyRaw.measure),
    align: pick(ALIGNS, typographyRaw.align),
    paragraph: pick(PARAGRAPHS, typographyRaw.paragraph),
    indent: pick(INDENTS, typographyRaw.indent),
    mode: pick(MODES, typographyRaw.mode),
    hyphens: pick(HYPHENS, typographyRaw.hyphens),
  };

  return {
    version: READER_PRESENTATION_VERSION,
    appearance: Object.fromEntries(Object.entries(appearance).filter(([, value]) => value !== undefined)),
    typography: Object.fromEntries(Object.entries(typography).filter(([, value]) => value !== undefined)),
  };
}

export async function loadBookPresentation(slug) {
  const clean = String(slug || '').trim();
  if (!clean) return normalizeReaderPresentation();
  if (cache.has(clean)) return cache.get(clean);

  const loading = (async () => {
    try {
      const raw = JSON.parse(await fetchText(`books/${clean}/reader.json`));
      return normalizeReaderPresentation(raw);
    } catch {
      return normalizeReaderPresentation();
    }
  })();
  cache.set(clean, loading);
  return loading;
}

function storagePrefix() {
  return (typeof window !== 'undefined' && window.__IMPRINT?.storagePrefix) || 'obb';
}

function stateKey() {
  return `${storagePrefix()}:reader-personalization:v1`;
}

function migrationKey() {
  return `${storagePrefix()}:reader-personalization:migrated-v1`;
}

function storage() {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

function readState() {
  const store = storage();
  if (!store) return { appearance: false, typography: false };
  try {
    const raw = JSON.parse(store.getItem(stateKey()) || '{}');
    return { appearance: raw.appearance === true, typography: raw.typography === true };
  } catch {
    return { appearance: false, typography: false };
  }
}

function writeState(next) {
  const store = storage();
  if (!store) return;
  try {
    store.setItem(stateKey(), JSON.stringify({
      appearance: next.appearance === true,
      typography: next.typography === true,
    }));
  } catch {
    // Reader personalization remains session-local when storage is unavailable.
  }
}

export function migrateReaderPersonalization() {
  const store = storage();
  if (!store) return readState();
  try {
    if (store.getItem(migrationKey())) return readState();
    const current = readState();
    const legacyPrefs = store.getItem(`${storagePrefix()}:prefs`);
    const legacyExperience = store.getItem(`${storagePrefix()}:reader-experience`);
    const migrated = {
      appearance: current.appearance || !!legacyPrefs,
      typography: current.typography || !!legacyExperience,
    };
    writeState(migrated);
    store.setItem(migrationKey(), '1');
    return migrated;
  } catch {
    return readState();
  }
}

export function readerPersonalized(area) {
  if (!['appearance', 'typography'].includes(area)) return false;
  return readState()[area];
}

export function markReaderPersonalized(area) {
  if (!['appearance', 'typography'].includes(area)) return;
  const state = readState();
  state[area] = true;
  writeState(state);
}

export function clearReaderPersonalization(area) {
  if (!['appearance', 'typography'].includes(area)) return;
  const state = readState();
  state[area] = false;
  writeState(state);
}

export function readerPersonalizationState() {
  return readState();
}
