import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const runtime = await readFile(
  new URL('../reader/js/viewport-stability-runtime.js', import.meta.url),
  'utf8',
);

assert.match(
  runtime,
  /installCriticalReadingStyles/,
  'Reader startup should prime adaptive reading-surface CSS before pagination',
);
assert.match(
  runtime,
  /data-reader-navigation/,
  'critical startup should share the navigation stylesheet marker with navigation.js',
);
assert.match(
  runtime,
  /installFirstReadLayoutSettlement/,
  'Reader startup should repaginate once final geometry and preferences settle',
);
assert.match(
  runtime,
  /document\.fonts\?\.ready/,
  'font readiness should participate in the first stable pagination pass',
);
assert.match(
  runtime,
  /content: "Contents"/,
  'coarse tablet controls should identify the three-line navigation action as Contents',
);
assert.match(
  runtime,
  /aria-modal'\) !== 'false'/,
  'Contents should be treated as a navigation drawer rather than a blocking modal',
);
assert.match(
  runtime,
  /drawerObserver\.observe\(drawer, \{ attributes: true, attributeFilter: \['class'\] \}\)/,
  'Contents state observer must not observe the aria-modal attribute that it changes itself',
);
assert.doesNotMatch(
  runtime,
  /attributeFilter: \['class', 'aria-modal'\]/,
  'Contents drawer should not create an aria-modal mutation feedback loop',
);

console.log('reader first-layout contract tests ok');
