import assert from 'node:assert/strict';
import { normalizeReaderTheme, nextReaderTheme } from './storage.js';

assert.equal(normalizeReaderTheme('dark'), 'dark');
assert.equal(normalizeReaderTheme('light'), 'light');
assert.equal(normalizeReaderTheme('sepia'), 'sepia');
assert.equal(normalizeReaderTheme('PARCHMENT'), 'dark');
assert.equal(nextReaderTheme('dark'), 'light');
assert.equal(nextReaderTheme('sepia'), 'dark');

console.log('storage tests ok');
