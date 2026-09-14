import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const primer = await readFile(new URL('../reader/js/startup-publication-primer.js', import.meta.url), 'utf8');

assert.match(
  primer,
  /installDirectCoverFirstPaint/,
  'startup publication primer should install the direct-cover first-paint bridge',
);
assert.match(
  primer,
  /books\/\$\{encodeURIComponent\(route\.slug\)\}\/README\.md/,
  'direct-cover first paint should acquire only the publication README',
);
assert.doesNotMatch(
  primer.slice(primer.indexOf('async function installDirectCoverFirstPaint')),
  /manuscript\//,
  'direct-cover first paint must not fetch manuscript chapters',
);
assert.match(
  primer,
  /Opening full book…/,
  'the metadata-first cover should explain that the full Reader is still becoming interactive',
);

console.log('direct cover first-paint tests ok');
