import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { controlLabel } from './app-shell-polish.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(HERE, '../css/app-shell-polish.css'), 'utf8');
const runtime = readFileSync(resolve(HERE, './viewport-stability-runtime.js'), 'utf8');
const loader = readFileSync(resolve(HERE, './app-shell-polish.js'), 'utf8');

let assertions = 0;
const check = (condition, message) => {
  assert.ok(condition, message);
  assertions += 1;
};

check(controlLabel(null) === '', 'missing controls have no label');
check(
  controlLabel({
    getAttribute(name) {
      return name === 'aria-label' ? 'Reading settings' : '';
    },
    textContent: 'fallback',
  }) === 'Reading settings',
  'aria-label wins for tooltips'
);
check(loader.includes("const STYLE_HREF = 'css/app-shell-polish.css?v=r1'"), 'loader owns one versioned app-shell stylesheet');
check(loader.includes("document.documentElement.dataset.readerAppShell = 'ready'"), 'loader exposes a stable ready marker');
check(runtime.includes("import('./app-shell-polish.js').catch"), 'viewport runtime loads polish opportunistically');

check(css.includes('--app-shell-glass:'), 'shared material token exists');
check(css.includes('.header-left::before'), 'header status island is styled');
check(css.includes('.header-right::before'), 'header action island is styled');
check(css.includes('.reader-context::before'), 'reader context island is styled');
check(css.includes('[data-reader-label]::after'), 'fine-pointer tooltips are styled');
check(css.includes('body[data-stage="read"] .page-nav .nav-center'), 'reading dock is styled');
check(css.includes('.progress-bar-container[data-reader-seekable="true"]::before'), 'semantic timeline is styled');
check(css.includes('body[data-stage="library"] .library-bar'), 'library discovery surface is styled');
check(css.includes('body[data-stage="library"] .continue-card'), 'resume surface is styled');
check(css.includes('body[data-stage="cover"] .cover-dock'), 'cover action surface is styled');
check(css.includes('#settingsPanel .settings-card'), 'settings tray shares app-shell material');
check(css.includes('.toc-overlay'), 'contents overlay shares app-shell material');
check(css.includes('.search-card'), 'search overlay shares app-shell material');
check(css.includes('@media (pointer: coarse)'), 'touch feedback has an explicit contract');
check(css.includes('@media (max-width: 700px)'), 'phone material has an explicit contract');
check(css.includes('@media (prefers-reduced-transparency: reduce)'), 'reduced transparency has a fallback');
check(css.includes('@media (forced-colors: active)'), 'forced colors has a fallback');
check(css.includes('@media (prefers-reduced-motion: reduce)'), 'reduced motion has a fallback');

for (const forbidden of [
  '.page-inner',
  '.page-surface',
  '.pages-wrapper',
  '.scroll-reader',
  '--reader-page-pad',
  '--reader-font-size',
  '--reader-leading',
]) {
  check(!css.includes(forbidden), `paint-only polish must not target ${forbidden}`);
}

for (const forbidden of [
  'paginate(',
  'saveProgress(',
  'location.hash',
  'history.pushState',
  'history.replaceState',
]) {
  check(!loader.includes(forbidden), `loader must not own reader behavior: ${forbidden}`);
}

console.log(`app shell polish contract ok (${assertions} assertions)`);
