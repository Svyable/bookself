import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const reader = await readFile(new URL('../reader/index.html', import.meta.url), 'utf8');
const demo = await readFile(new URL('../shelf/reader/index.html', import.meta.url), 'utf8');

const readerVersion = reader.match(/js\/app\.js\?v=([^"']+)/)?.[1];
const preloadVersion = demo.match(/reader\/js\/app\.js\?v=([^"']+)/)?.[1];

assert.ok(readerVersion, 'Reader should version its app module URL');
assert.ok(preloadVersion, 'embedded Shelf should version its app module preload');
assert.equal(
  preloadVersion,
  readerVersion,
  'embedded Shelf preload must match the Reader app module version',
);

console.log(`reader asset version parity ok (${readerVersion})`);
