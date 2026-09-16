import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const index = await readFile(new URL('../reader/index.html', import.meta.url), 'utf8');
const loader = await readFile(new URL('../reader/js/app-loader.js', import.meta.url), 'utf8');
const firstRender = await readFile(new URL('../reader/js/reader-first-render.js', import.meta.url), 'utf8');
const firstRenderCss = await readFile(new URL('../reader/css/first-render.css', import.meta.url), 'utf8');
const runtime = await readFile(new URL('../reader/js/viewport-stability-runtime.js', import.meta.url), 'utf8');

assert.match(
  index,
  /css\/first-render\.css\?v=r1[^>]*data-reader-critical="true"/,
  'final Reader typography geometry must be render-blocking before pagination',
);
assert.match(
  index,
  /js\/app-loader\.js\?v=r1/,
  'Reader should enter through the first-render startup gate',
);
assert.doesNotMatch(
  index,
  /<script type="module" src="js\/app\.js\?v=r4"><\/script>/,
  'canonical app.js must not start independently of first-render preparation',
);
assert.ok(
  loader.indexOf('await prepareReaderFirstRender()') < loader.indexOf("await import('./app.js')"),
  'saved experience must settle before the canonical application module is evaluated',
);
assert.match(
  firstRender,
  /localStorage\?\.getItem\(`\$\{prefix\}:reader-experience`\)/,
  'first render should use the same instance-scoped saved experience as the settings UI',
);
assert.match(
  firstRender,
  /root\.dataset\.readerPrefsPrimed = 'true'/,
  'first render should expose that saved experience was applied before pagination',
);
assert.match(
  firstRender,
  /document\.fonts\?\.load/,
  'the selected reading face must settle before the first visible page',
);
assert.match(
  firstRender,
  /root\.style\.setProperty\('--reader-font-weight'/,
  'weight must participate in first-page measurement',
);
assert.match(
  firstRender,
  /root\.style\.setProperty\('--reader-tracking'/,
  'tracking must participate in first-page measurement',
);
assert.match(
  firstRender,
  /readerFirstRenderReady = 'true'/,
  'startup must mark the final first-render geometry before app.js starts',
);
assert.match(
  firstRender,
  /event\.isTrusted/,
  'real viewport changes must remain eligible for normal repagination',
);
assert.match(
  firstRender,
  /event\.stopImmediatePropagation\(\)/,
  'redundant synthetic startup resize must not trigger a second first-page layout',
);
assert.match(
  firstRenderCss,
  /\[data-reader-font="literary"\] \.page-inner/,
  'all selectable reading faces must exist in critical CSS, not arrive after first paint',
);
assert.match(
  firstRenderCss,
  /font-weight: var\(--reader-font-weight\)/,
  'critical CSS must apply saved weight to measured page content',
);
assert.match(
  runtime,
  /installCriticalReadingStyles/,
  'adaptive reading-surface CSS remains part of the startup geometry contract',
);
assert.match(
  runtime,
  /content: "Contents"/,
  'coarse tablet controls should still identify the navigation action as Contents',
);

console.log('reader first-layout contract tests ok');
