import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const reader = await readFile(new URL('../reader/index.html', import.meta.url), 'utf8');
const loader = await readFile(new URL('../reader/js/app-loader.js', import.meta.url), 'utf8');
const compatibilityReader = await readFile(new URL('../shelf/reader/index.html', import.meta.url), 'utf8');

const loaderVersion = reader.match(/js\/app-loader\.js\?v=([^"']+)/)?.[1];
assert.ok(loaderVersion, 'Reader should version its startup-gate module URL');
assert.match(
  loader,
  /await import\('\.\/app\.js'\)/,
  'startup gate should evaluate the canonical app only after first-render preparation',
);
assert.match(
  compatibilityReader,
  /window\.location\.replace\(target\)/,
  'legacy shelf/reader path should redirect to the canonical Reader rather than preload a second app generation',
);
assert.doesNotMatch(
  compatibilityReader,
  /reader\/js\/(?:app|app-loader)\.js/,
  'compatibility redirect must not load its own Reader application bundle',
);

console.log(`reader startup-gate asset contract ok (${loaderVersion})`);
