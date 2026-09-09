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
  'network-with-cache-deadline',
  'publication Markdown should retain its resilient network deadline behavior',
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
  /const CACHE = 'obb-shell-v105';/,
  'cache generation must rotate when changing shell coherence semantics',
);

console.log('reader cache coherence tests ok');
