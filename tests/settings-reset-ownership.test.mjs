import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const themeControls = await readFile(new URL('../reader/js/theme-controls.js', import.meta.url), 'utf8');
const experience = await readFile(new URL('../reader/js/experience.js', import.meta.url), 'utf8');

assert.match(
  experience,
  /id=\"readerReset\"[^>]*>Reset all<\/button>/,
  'the richer Reader experience should expose the canonical reset action',
);

assert.match(
  themeControls,
  /getElementById\?\.\('readerReset'\)/,
  'settings cleanup should wait until the canonical reset exists',
);
assert.match(
  themeControls,
  /getElementById\?\.\('resetAppearanceBtn'\)\?\.remove\(\)/,
  'legacy reset should be removed once the canonical reset is available',
);
assert.match(
  themeControls,
  /getElementById\?\.\('appearanceResetHelp'\)\?\.remove\(\)/,
  'legacy reset help should be removed with the obsolete action',
);

console.log('settings reset ownership tests ok');
