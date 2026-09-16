import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const gui = await readFile(new URL('../reader/js/gui.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../reader/css/first-render.css', import.meta.url), 'utf8');

assert.match(
  gui,
  /id: 'tocOverlay'[^\n]*modal: false/,
  'Contents must be declared as non-modal navigation in the shared GUI model',
);
assert.doesNotMatch(
  gui,
  /id: 'tocOverlay'[^\n]*initial: 'tocSearch'/,
  'opening Contents must not auto-focus chapter search and summon a mobile keyboard',
);
assert.match(
  gui,
  /overlay\.setAttribute\('role', 'navigation'\)/,
  'Contents should expose navigation semantics rather than dialog semantics',
);
assert.match(
  gui,
  /overlay\.setAttribute\('aria-modal', 'false'\)/,
  'Contents must explicitly remain non-modal',
);
assert.match(
  gui,
  /syncBackgroundIsolation\(Boolean\(topModalId\)\)/,
  'background isolation must depend only on a real modal, never Contents',
);
assert.match(
  gui,
  /classList\.toggle\('gui-overlay-open', modalOpen\)/,
  'generic modal layout state must not be applied just because Contents is open',
);
assert.match(
  gui,
  /if \(!isModal\(config\)\) return;/,
  'non-modal navigation must not receive modal focus transfer',
);
assert.match(
  gui,
  /if \(!isModal\(config\) \|\| event\.key !== 'Tab'\) return;/,
  'Contents must not trap Tab like a dialog',
);
assert.match(
  css,
  /height: calc\(100dvh - var\(--reader-toc-top, 0px\)\)/,
  'Contents must fit the remaining visual Reader viewport below the header',
);
assert.match(
  css,
  /width: 100% !important/,
  'compact Contents must use the available mobile width',
);
assert.match(
  css,
  /#tocList[\s\S]*overflow: auto/,
  'long mobile tables of contents need their own scroll region',
);

console.log('reader Contents navigation tests ok');
