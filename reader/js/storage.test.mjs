import assert from 'node:assert/strict';
import {
  normalizeReaderTheme,
  saveBookmarks,
  savePrefs,
  saveProgress,
  saveStats,
} from './storage.js';

assert.equal(normalizeReaderTheme('sepia'), 'light');

globalThis.localStorage = {
  setItem() {
    throw new Error('storage disabled');
  },
};

assert.equal(savePrefs({ theme: 'dark' }), false);
assert.equal(saveProgress('demo', { chapter: 'ch1', offset: 0 }), false);
assert.equal(saveBookmarks('demo', []), false);
assert.equal(saveStats('demo', { minutes: 1, chapters: [] }), false);

delete globalThis.localStorage;
console.log('storage failure tests ok');
