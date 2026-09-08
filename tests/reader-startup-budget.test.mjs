import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../reader/js/base.js', import.meta.url), 'utf8');
const deferredStart = source.indexOf('function loadDeferredEnhancements');
assert.ok(deferredStart > 0, 'Reader should define a deferred enhancement block');
const eagerSource = source.slice(0, deferredStart);
const deferredSource = source.slice(deferredStart);

assert.match(
  eagerSource,
  /import\('\.\/accessibility-surfaces\.js'\)/,
  'accessibility surfaces should stay eager',
);
assert.match(
  eagerSource,
  /import\('\.\/direct-route-preview\.js'\)/,
  'direct-route first-paint helper should stay eager',
);
assert.doesNotMatch(
  eagerSource,
  /semantic-progress\.js|native-share\.js|read-aloud\.js|reading-session\.js/,
  'nonessential enhancement imports must not compete with the critical startup path',
);
assert.match(
  deferredSource,
  /window\.addEventListener\('load', begin, \{ once: true \}\)/,
  'nonessential Reader enhancements should wait until the core page load completes',
);
assert.match(
  deferredSource,
  /requestIdleCallback\(loadDeferredEnhancements, \{ timeout: 2000 \}\)/,
  'deferred enhancements should prefer browser idle time',
);
assert.match(
  source,
  /fetch\(url, \{ method: 'HEAD', cache: 'no-cache' \}\)/,
  'existence probes should use HEAD instead of downloading media bodies',
);
assert.match(
  source,
  /Promise\.all\(relativePaths\.map/,
  'cover candidates should be probed in parallel rather than serially',
);

console.log('reader startup budget tests ok');
