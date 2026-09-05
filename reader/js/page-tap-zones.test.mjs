import assert from 'node:assert/strict';
import { coarseTapZones, pageTapIntent } from './page-tap-zones.js';

let assertions = 0;
const equal = (actual, expected, message) => {
  assertions += 1;
  assert.equal(actual, expected, message);
};
const deepEqual = (actual, expected, message) => {
  assertions += 1;
  assert.deepEqual(actual, expected, message);
};

// Coarse-pointer reading keeps deliberate page-turn zones at the physical edges
// while preserving the center/control band and a safety buffer around it.
equal(pageTapIntent(0, 100, { coarse: true }), 'prev');
equal(pageTapIntent(20, 100, { coarse: true }), 'prev');
equal(pageTapIntent(21, 100, { coarse: true }), 'pass');
equal(pageTapIntent(34, 100, { coarse: true }), 'pass');
equal(pageTapIntent(50, 100, { coarse: true }), 'pass');
equal(pageTapIntent(66, 100, { coarse: true }), 'pass');
equal(pageTapIntent(71, 100, { coarse: true }), 'pass');
equal(pageTapIntent(72, 100, { coarse: true }), 'next');
equal(pageTapIntent(100, 100, { coarse: true }), 'next');

// Fine-pointer behavior retains the existing physical-edge calculation.
equal(pageTapIntent(61, 1000), 'prev');
equal(pageTapIntent(62, 1000), 'prev');
equal(pageTapIntent(500, 1000), 'pass');
equal(pageTapIntent(868, 1000), 'next');
equal(pageTapIntent(939, 1000), 'next');

equal(pageTapIntent(-1, 100, { coarse: true }), 'pass');
equal(pageTapIntent(101, 100, { coarse: true }), 'pass');
equal(pageTapIntent(50, 0, { coarse: true }), 'pass');

deepEqual(coarseTapZones(1000), { previousEnd: 200, nextStart: 720 });
deepEqual(coarseTapZones(-100), { previousEnd: 0, nextStart: 0 });

console.log(`page tap zones ok (${assertions} assertions)`);
