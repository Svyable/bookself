import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const experience = await readFile(new URL('../reader/js/experience.js', import.meta.url), 'utf8');
const readerHtml = await readFile(new URL('../reader/index.html', import.meta.url), 'utf8');

assert.match(
  experience,
  /document\.addEventListener\('DOMContentLoaded', \(\) => waitForImprint\(\), \{ once: true \}\)/,
  'reading settings should begin initialization at DOM ready',
);

assert.doesNotMatch(
  experience,
  /window\.addEventListener\('load', \(\) => waitForImprint\(\)/,
  'reading settings must not wait for the full window load event',
);

assert.match(
  experience,
  /readerFontSize'[\s\S]*addEventListener\('input'/,
  'text-size control should have an input handler',
);
assert.match(
  experience,
  /data-reader-font-value'[\s\S]*addEventListener\('click'/,
  'typeface choices should have click handlers',
);
assert.match(
  experience,
  /data-reader-measure-value'[\s\S]*addEventListener\('click'/,
  'line-width choices should have click handlers',
);

assert.match(
  readerHtml,
  /js\/experience\.js\?v=r3/,
  'Reader should request the early-initialization experience revision',
);

console.log('settings initialization tests ok');
