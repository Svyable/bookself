import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../reader/js/base.js', import.meta.url), 'utf8');

assert.match(
  source,
  /window\.addEventListener\('load', begin, \{ once: true \}\)/,
  'nonessential Reader enhancements should wait until the core page load completes',
);
assert.match(
  source,
  /requestIdleCallback\(loadDeferredEnhancements, \{ timeout: 2000 \}\)/,
  'deferred enhancements should prefer browser idle time',
);
assert.doesNotMatch(
  source,
  /queueMicrotask\(\(\) => \{\s*import\('\.\/semantic-progress\.js'\)/,
  'enhancement imports must not compete with the critical startup path',
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
