import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const reader = await readFile(new URL('../reader/index.html', import.meta.url), 'utf8');
const demo = await readFile(new URL('../shelf/reader/index.html', import.meta.url), 'utf8');

const readerVersion = reader.match(/js\/app\.js\?v=([^"']+)/)?.[1];

assert.ok(readerVersion, 'Reader should version its app module URL');
assert.match(demo, /window\.location\.replace\(target\)/i, 'embedded Shelf should redirect to the shared Reader');
assert.match(demo, /\.\.\/\.\.\/reader\//i, 'embedded Shelf should preserve query and hash data through the shared Reader redirect');
assert.ok(!demo.includes('https://svyable.github.io/shelf/reader/'), 'embedded Shelf must not depend on a personal Shelf');

console.log(`reader asset version and redirect contract ok (${readerVersion})`);
