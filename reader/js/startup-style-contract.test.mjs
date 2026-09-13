import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const imprint = readFileSync(new URL('./imprint.js', import.meta.url), 'utf8');
const sw = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

for (const href of [
  'css/reading-surface.css?v=r1',
  'css/reading-chrome.css?v=r1',
  'css/reading-content.css?v=r1',
  'css/navigation.css?v=r2',
  'css/interface-v2.css',
  'css/interface-v3.css?v=r5',
]) {
  assert.ok(index.includes(`href="${href}"`), `reader/index.html must load ${href}`);
}

assert.doesNotMatch(imprint, /await\s+coreReaderStylesReady/);
assert.match(imprint, /navigation\.css\?v=r2/);
assert.match(sw, /const CACHE = 'obb-shell-v109'/);
assert.match(sw, /'\.\/css\/interface-v2\.css'/);
assert.match(sw, /'\.\/css\/interface-v3\.css'/);

console.log('reader startup style contract ok');
