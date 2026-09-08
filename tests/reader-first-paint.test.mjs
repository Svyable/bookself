import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../reader/js/app.js', import.meta.url), 'utf8');
const base = await readFile(new URL('../reader/js/base.js', import.meta.url), 'utf8');

assert.doesNotMatch(
  base,
  /createStartupCatalogPrimer|primeInitialCatalog|startupCatalogPrimer/,
  'base bootstrap must not speculatively acquire the whole catalog',
);

assert.match(
  app,
  /let catalogReady = null;/,
  'catalog acquisition should be lazy',
);
assert.match(
  app,
  /if \(routeNeedsCatalog\(route\)\) await ensureCatalog\(\);/,
  'only routes that need the library should await catalog acquisition',
);
assert.match(
  app,
  /runCatalogPrimer\(slugs, loadCatalogMeta, 6\)/,
  'catalog metadata should load with bounded concurrency',
);

const metaStart = app.indexOf('async function loadCatalogMeta');
const metaEnd = app.indexOf('function enrichCatalogCovers', metaStart);
assert.ok(metaStart >= 0 && metaEnd > metaStart, 'catalog metadata loader should be present');
assert.doesNotMatch(
  app.slice(metaStart, metaEnd),
  /firstExisting|catalogCoverCandidates/,
  'cover discovery must not block publication metadata',
);
assert.match(
  app,
  /window\.requestIdleCallback\(start, \{ timeout: 750 \}\)/,
  'cover enrichment should begin after first-paint work gets priority',
);

assert.match(
  app,
  /scheduleServiceWorkerRegistration\(routeQueue\.idle\(\)\);/,
  'service-worker work should wait for the initial route to become interactive',
);
assert.match(
  app,
  /window\.requestIdleCallback\(register, \{ timeout: 2500 \}\)/,
  'service-worker registration should prefer browser idle time',
);
assert.doesNotMatch(
  app,
  /requestRoute\(\);\s*\n\s*if \('serviceWorker' in navigator\)/,
  'service-worker registration must not start immediately after route dispatch',
);

console.log('reader first-paint boundary tests ok');
