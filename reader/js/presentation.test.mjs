import assert from 'node:assert/strict';
import {
  READER_PRESENTATION_OPTIONS,
  normalizeReaderPresentation,
  readerPersonalizationState,
  markReaderPersonalized,
  clearReaderPersonalization,
  migrateReaderPersonalization,
} from './presentation.js';

assert.ok(READER_PRESENTATION_OPTIONS.themes.includes('contrast-dark'));
assert.ok(READER_PRESENTATION_OPTIONS.fonts.includes('clear'));
assert.deepEqual(READER_PRESENTATION_OPTIONS.ranges.fontSize, { min: 14, max: 32, step: 1 });

const normalized = normalizeReaderPresentation({
  appearance: { theme: 'sepia', warmth: 'soft', ignored: true },
  typography: {
    fontSize: 40,
    font: 'literary',
    fontWeight: 500,
    tracking: 0.2,
    leading: 1.7,
    measure: 'narrow',
    align: 'left',
    paragraph: 'airy',
    indent: 'gentle',
    mode: 'scroll',
    hyphens: 'off',
  },
});
assert.deepEqual(normalized.appearance, { theme: 'sepia', warmth: 'soft' });
assert.deepEqual(normalized.typography, {
  fontSize: 32,
  font: 'literary',
  fontWeight: 500,
  tracking: 0.08,
  leading: 1.7,
  measure: 'narrow',
  align: 'left',
  paragraph: 'airy',
  indent: 'gentle',
  mode: 'scroll',
  hyphens: 'off',
});

const invalid = normalizeReaderPresentation({
  appearance: { theme: 'remote-theme', warmth: 'hot' },
  typography: {
    fontSize: null,
    leading: '',
    tracking: undefined,
    font: 'custom-font',
    fontWeight: 700,
    mode: 'flipbook',
  },
});
assert.deepEqual(invalid.appearance, {});
assert.deepEqual(invalid.typography, {});

class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

global.window = { __IMPRINT: { storagePrefix: 'test-bookself' } };
global.localStorage = new MemoryStorage();

migrateReaderPersonalization();
assert.deepEqual(readerPersonalizationState(), { appearance: false, typography: false });
markReaderPersonalized('typography');
assert.deepEqual(readerPersonalizationState(), { appearance: false, typography: true });
clearReaderPersonalization('typography');
assert.deepEqual(readerPersonalizationState(), { appearance: false, typography: false });

const migratedStorage = new MemoryStorage();
global.localStorage = migratedStorage;
migratedStorage.setItem('test-bookself:prefs', JSON.stringify({ theme: 'sepia' }));
migratedStorage.setItem('test-bookself:reader-experience', JSON.stringify({ font: 'clear' }));
migrateReaderPersonalization();
assert.deepEqual(readerPersonalizationState(), { appearance: true, typography: true });

console.log('presentation tests ok');
