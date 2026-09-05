import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  interiorStyleHref,
  prefersHighContrast,
} from './book-interior.js';

let assertions = 0;
const equal = (...args) => {
  assertions += 1;
  assert.equal(...args);
};
const match = (...args) => {
  assertions += 1;
  assert.match(...args);
};
const doesNotMatch = (...args) => {
  assertions += 1;
  assert.doesNotMatch(...args);
};

equal(interiorStyleHref(), 'css/book-interior.css?v=r1');
equal(prefersHighContrast(() => ({ matches: true })), true);
equal(prefersHighContrast(() => ({ matches: false })), false);
equal(prefersHighContrast(() => { throw new Error('unsupported'); }), false);

const source = fs.readFileSync(new URL('./book-interior.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/book-interior.css', import.meta.url), 'utf8');
const runtime = fs.readFileSync(new URL('./viewport-stability-runtime.js', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

match(source, /STYLE_HREF = 'css\/book-interior\.css\?v=r1'/);
match(source, /dataset\.bookInterior = 'true'/);
match(source, /link\.addEventListener\('error'/);
match(source, /window\.setTimeout\(\(\) => finish\(!!link\.sheet\), 900\)/);

match(css, /\.page-surface\.left \.page-running/);
match(css, /\.page-surface\.right \.page-running/);
match(css, /\.page-inner\.chapter-open > h1:first-child::before/);
match(css, /p:first-of-type::first-line/);
match(css, /blockquote::before/);
match(css, /figcaption::before/);
match(css, /\[data-reader-mode="scroll"\] \.scroll-reader/);
match(css, /@media \(max-width: 700px\)/);
match(css, /@media \(prefers-contrast: more\)/);
match(css, /@media \(forced-colors: active\)/);
match(css, /@media print/);

doesNotMatch(css, /--reader-page-(?:top|bottom|pad|inline|radius)\s*:/);
doesNotMatch(css, /--reader-stage-(?:inline|block)\s*:/);
doesNotMatch(css, /\.page-inner\s*\{[^}]*?(?:width|max-width|padding|margin-inline)/s);
doesNotMatch(css, /\.pages-wrapper\.active\s*\{[^}]*?(?:width|height|max-height)/s);

match(runtime, /import\('\.\/book-interior\.js'\)\.catch/);
match(runtime, /Book-interior polish could not be loaded/);
match(sw, /\.\/css\/book-interior\.css/);
match(sw, /\.\/js\/book-interior\.js/);
match(sw, /obb-shell-v104/);

console.log(`Premium book interior: ${assertions}/25 assertions passed`);
