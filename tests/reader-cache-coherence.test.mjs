import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const policySource = await readFile(new URL('../reader/js/offline-fetch-policy.js', import.meta.url), 'utf8');
const pwaUpdate = await readFile(new URL('../reader/js/pwa-update.js', import.meta.url), 'utf8');
const serviceWorker = await readFile(new URL('../reader/sw.js', import.meta.url), 'utf8');

const sandbox = {};
sandbox.globalThis = sandbox;
vm.runInNewContext(policySource, sandbox);
const policy = sandbox.BookselfOfflineFetchPolicy;

assert.ok(policy, 'offline fetch policy should install into its scope');
assert.equal(
  policy.responsePlan('shell', true),
  'network-first',
  'cached Reader shell code must not outrank the network and create mixed module generations',
);
assert.equal(
  policy.responsePlan('external', true),
  'cache-then-network',
  'external font/CDN assets may still use stale-while-revalidate behavior',
);
assert.equal(
  policy.responsePlan('publication', true),
  'network-first',
  'cached publication content must be an offline fallback rather than outrank fresh manuscript text',
);

assert.doesNotMatch(
  pwaUpdate,
  /navigator\.serviceWorker\.register\(/,
  'PWA update UI must not register the service worker ahead of the Reader startup boundary',
);
assert.match(
  pwaUpdate,
  /navigator\.serviceWorker\.ready/,
  'PWA update UI should observe the registration owned by app.js',
);

assert.match(
  serviceWorker,
  /const CACHE_PREFIX = 'bookself-reader-shell-';/,
  'Bookself caches need a deployment-specific namespace on shared GitHub Pages origins',
);
assert.match(
  serviceWorker,
  /const CACHE = 'bookself-reader-shell-v110';/,
  'cache generation must rotate when first-render critical assets change',
);
assert.match(
  serviceWorker,
  /'\.\/css\/first-render\.css'/,
  'offline Reader shell must include the first-render geometry contract',
);
assert.match(
  serviceWorker,
  /'\.\/js\/app-loader\.js'/,
  'offline Reader shell must include the startup gate',
);
assert.match(
  serviceWorker,
  /'\.\/js\/reader-first-render\.js'/,
  'offline Reader shell must include saved-experience priming',
);
assert.match(
  serviceWorker,
  /key\.startsWith\(CACHE_PREFIX\) && key !== CACHE/,
  'activation must delete only older Bookself Reader caches, never sibling Desk or Shelf caches',
);

console.log('reader cache coherence tests ok');
