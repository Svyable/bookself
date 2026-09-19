import assert from 'node:assert/strict';
import { migrateStorageNamespaces, normalizeReaderStyles } from './imprint.js';

assert.deepEqual(normalizeReaderStyles(undefined), []);
assert.deepEqual(normalizeReaderStyles('styles/reader.css'), []);

assert.deepEqual(
  normalizeReaderStyles([
    'styles/reader.css',
    './themes/serif.css',
    'styles/reader.css',
    '  assets/large-print.CSS  ',
  ]),
  ['styles/reader.css', 'themes/serif.css', 'assets/large-print.CSS']
);

assert.deepEqual(
  normalizeReaderStyles([
    '../reader/css/style.css',
    '/absolute.css',
    'https://example.com/theme.css',
    '//example.com/theme.css',
    'javascript:theme.css',
    'styles/theme.js',
    '',
    null,
  ]),
  []
);

assert.equal(
  normalizeReaderStyles(Array.from({ length: 12 }, (_, i) => `styles/${i}.css`)).length,
  8
);

const values = new Map([
  ['obb:demo:notes', '[{"id":"old"}]'],
  ['bookself:demo:progress', '{"chapter":"one"}'],
  ['custom:demo:progress', '{"chapter":"canonical"}'],
]);
const store = {
  get length() { return values.size; },
  key(index) { return [...values.keys()][index] ?? null; },
  getItem(key) { return values.has(key) ? values.get(key) : null; },
  setItem(key, value) { values.set(key, String(value)); },
};
assert.equal(migrateStorageNamespaces(store, 'custom'), 1);
assert.equal(values.get('custom:demo:notes'), '[{"id":"old"}]');
assert.equal(values.get('custom:demo:progress'), '{"chapter":"canonical"}');
assert.equal(migrateStorageNamespaces(store, 'bookself'), 1);
assert.equal(values.get('bookself:demo:notes'), '[{"id":"old"}]');

console.log('imprint tests ok');
