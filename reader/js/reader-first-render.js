const FONTS = new Set(['book', 'literary', 'warm', 'classic', 'modern', 'clear', 'humanist', 'system']);
const DEFAULTS = Object.freeze({
  fontSize: 18,
  font: 'book',
  fontWeight: 400,
  tracking: 0,
  leading: 1.55,
  measure: 'balanced',
  align: 'justify',
  paragraph: 'normal',
  indent: 'none',
  mode: 'paged',
  hyphens: 'auto',
});

const FONT_FAMILIES = Object.freeze({
  book: '"Source Serif 4"',
  literary: '"Literata"',
  warm: '"Lora"',
  classic: 'Georgia',
  modern: '"IBM Plex Sans"',
  clear: '"Atkinson Hyperlegible"',
  humanist: '"Trebuchet MS"',
  system: 'system-ui',
});

const ASSET_SETTLE_DEADLINE_MS = 1800;
const FRAME_SETTLE_DEADLINE_MS = 160;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function normalizeFirstRenderPrefs(raw = {}) {
  return {
    fontSize: Math.round(clamp(Number(raw.fontSize) || DEFAULTS.fontSize, 14, 32)),
    font: FONTS.has(raw.font) ? raw.font : DEFAULTS.font,
    fontWeight: [400, 500, 600].includes(Number(raw.fontWeight)) ? Number(raw.fontWeight) : DEFAULTS.fontWeight,
    tracking: Number(clamp(Number(raw.tracking) || 0, -0.02, 0.08).toFixed(2)),
    leading: Number(clamp(Number(raw.leading) || DEFAULTS.leading, 1.3, 2).toFixed(2)),
    measure: ['narrow', 'balanced', 'wide'].includes(raw.measure) ? raw.measure : DEFAULTS.measure,
    align: ['left', 'justify'].includes(raw.align) ? raw.align : DEFAULTS.align,
    paragraph: ['compact', 'normal', 'airy'].includes(raw.paragraph) ? raw.paragraph : DEFAULTS.paragraph,
    indent: ['none', 'gentle', 'classic'].includes(raw.indent) ? raw.indent : DEFAULTS.indent,
    mode: ['paged', 'scroll'].includes(raw.mode) ? raw.mode : DEFAULTS.mode,
    hyphens: ['auto', 'off'].includes(raw.hyphens) ? raw.hyphens : DEFAULTS.hyphens,
  };
}

function normalizeReaderStyles(value) {
  if (!Array.isArray(value)) return [];
  const styles = [];
  const seen = new Set();
  for (const raw of value) {
    if (styles.length >= 8) break;
    if (typeof raw !== 'string') continue;
    const path = raw.trim().replace(/^\.\/+/, '');
    if (!path || path.startsWith('/') || path.startsWith('//')) continue;
    if (/^[a-z][a-z0-9+.-]*:/i.test(path)) continue;
    if (path.split(/[/?#]/).includes('..')) continue;
    if (!/\.css(?:\?[^#]*)?$/i.test(path)) continue;
    if (seen.has(path)) continue;
    seen.add(path);
    styles.push(path);
  }
  return styles;
}

async function resolveImprint(window) {
  if (window.__IMPRINT) return window.__IMPRINT;
  try {
    const response = await window.fetch(new URL('../../imprint.json', import.meta.url), { cache: 'default' });
    if (response.ok) return await response.json();
  } catch {
    // The canonical imprint loader will report/fallback later.
  }
  return {};
}

function after(window, ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function stylesheetReady(link, window) {
  if (link.sheet) return Promise.resolve();
  return Promise.race([
    new Promise((resolve) => {
      link.addEventListener('load', resolve, { once: true });
      link.addEventListener('error', resolve, { once: true });
    }),
    after(window, ASSET_SETTLE_DEADLINE_MS),
  ]);
}

async function preloadReaderStyles(imprint, { window, document }) {
  const styles = normalizeReaderStyles(imprint?.readerStyles);
  if (!styles.length) return;
  const links = [];
  for (const path of styles) {
    let link = [...document.querySelectorAll('link[data-bookself-instance-style]')]
      .find((node) => node.dataset.bookselfInstanceStyle === path);
    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = new URL(`../../${path}`, import.meta.url).href;
      link.dataset.bookselfInstanceStyle = path;
      link.dataset.readerFirstRenderStyle = 'true';
      document.head.appendChild(link);
    }
    links.push(link);
  }
  await Promise.all(links.map((link) => stylesheetReady(link, window)));
}

function loadStoredPrefs(window, prefix) {
  try {
    const stored = window.localStorage?.getItem(`${prefix}:reader-experience`);
    if (stored) return normalizeFirstRenderPrefs(JSON.parse(stored));
  } catch {
    // Fall through to the legacy preference bridge.
  }

  try {
    const legacy = JSON.parse(window.localStorage?.getItem(`${prefix}:prefs`) || '{}');
    return normalizeFirstRenderPrefs({
      fontSize: legacy.fontSize,
      leading: legacy.lineHeight,
      font: legacy.fontFamily === 'sans' ? 'modern' : 'book',
    });
  } catch {
    return { ...DEFAULTS };
  }
}

export function applyFirstRenderPrefs(prefs, document = globalThis.document) {
  const next = normalizeFirstRenderPrefs(prefs);
  const root = document?.documentElement;
  if (!root) return next;

  root.dataset.readerFont = next.font;
  root.dataset.readerMeasure = next.measure;
  root.dataset.readerAlign = next.align;
  root.dataset.readerParagraph = next.paragraph;
  root.dataset.readerIndent = next.indent;
  root.dataset.readerMode = next.mode;
  root.dataset.readerHyphens = next.hyphens;
  root.dataset.readerPrefsPrimed = 'true';
  root.style.setProperty('--reader-font-size', `${next.fontSize}px`);
  root.style.setProperty('--reader-leading', String(next.leading));
  root.style.setProperty('--reader-font-weight', String(next.fontWeight));
  root.style.setProperty('--reader-tracking', `${next.tracking}em`);
  return next;
}

function twoFrames(window) {
  const frames = new Promise((resolve) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
  });
  // Parser/defer module evaluation can precede the browser's first render
  // opportunity. Prefer two real frames when they are available, but never let
  // startup depend on requestAnimationFrame being serviced before app.js runs.
  return Promise.race([
    frames,
    after(window, FRAME_SETTLE_DEADLINE_MS),
  ]);
}

function installContentsGeometry({ window, document }) {
  const root = document.documentElement;
  const header = document.getElementById('readerChrome');
  if (!root || !header || root.dataset.readerContentsGeometry === 'true') return;
  root.dataset.readerContentsGeometry = 'true';

  const sync = () => {
    const height = Math.max(0, Math.ceil(header.getBoundingClientRect().height));
    root.style.setProperty('--reader-toc-top', `${height}px`);
  };

  sync();
  if ('ResizeObserver' in window) {
    const observer = new window.ResizeObserver(sync);
    observer.observe(header);
    window.__BOOKSELF_CONTENTS_GEOMETRY_OBSERVER = observer;
  }
  window.addEventListener('orientationchange', sync, { passive: true });
  window.visualViewport?.addEventListener('resize', sync, { passive: true });
}

function geometrySignature(window, document) {
  const root = document.documentElement;
  return [
    Math.round(window.visualViewport?.width || window.innerWidth || 0),
    Math.round(window.visualViewport?.height || window.innerHeight || 0),
    root.dataset.readerMode || '',
    root.dataset.readerFont || '',
    root.dataset.readerMeasure || '',
    root.dataset.readerAlign || '',
    root.dataset.readerParagraph || '',
    root.dataset.readerIndent || '',
    root.dataset.readerHyphens || '',
    root.style.getPropertyValue('--reader-font-size'),
    root.style.getPropertyValue('--reader-leading'),
    root.style.getPropertyValue('--reader-font-weight'),
    root.style.getPropertyValue('--reader-tracking'),
  ].join('|');
}

function guardRedundantStartupResize({ window, document }) {
  let active = true;
  let baseline = '';
  let timer = 0;

  const cleanup = () => {
    if (!active) return;
    active = false;
    window.clearTimeout(timer);
    window.removeEventListener('resize', onResize, true);
  };

  const onResize = (event) => {
    if (!active || document.documentElement.dataset.readerFirstRenderReady !== 'true') return;
    if (event.isTrusted) {
      cleanup();
      return;
    }
    const next = geometrySignature(window, document);
    if (baseline && next === baseline) {
      event.stopImmediatePropagation();
      return;
    }
    cleanup();
  };

  window.addEventListener('resize', onResize, true);
  timer = window.setTimeout(cleanup, 4500);
  return {
    arm() {
      baseline = geometrySignature(window, document);
      window.addEventListener('load', () => {
        timer = window.setTimeout(cleanup, 700);
      }, { once: true });
    },
  };
}

async function settleSelectedFont(prefs, { window, document }) {
  if (!document.fonts?.load) return;
  const family = FONT_FAMILIES[prefs.font] || FONT_FAMILIES.book;
  try {
    await Promise.race([
      document.fonts.load(`${prefs.fontSize}px ${family}`),
      after(window, ASSET_SETTLE_DEADLINE_MS),
    ]);
  } catch {
    // A local/system fallback remains usable if a web font cannot load.
  }
}

export async function prepareReaderFirstRender({
  window = globalThis.window,
  document = globalThis.document,
} = {}) {
  if (!window || !document?.documentElement) return null;
  if (document.documentElement.dataset.readerFirstRenderReady === 'true') {
    return window.__BOOKSELF_READER_FIRST_RENDER_PREFS || null;
  }

  installContentsGeometry({ window, document });
  const guard = guardRedundantStartupResize({ window, document });
  const imprint = await resolveImprint(window);
  const prefix = String(imprint?.storagePrefix || window.__IMPRINT?.storagePrefix || 'bookself');
  const prefs = applyFirstRenderPrefs(loadStoredPrefs(window, prefix), document);
  window.__BOOKSELF_READER_FIRST_RENDER_PREFS = prefs;

  await Promise.all([
    preloadReaderStyles(imprint, { window, document }),
    settleSelectedFont(prefs, { window, document }),
  ]);
  await twoFrames(window);

  document.documentElement.dataset.readerFirstRenderReady = 'true';
  guard.arm();
  return prefs;
}
