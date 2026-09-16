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
    if (path.split('/').includes('..')) continue;
    if (!/\.css$/i.test(path)) continue;
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

function stylesheetReady(link, window) {
  if (link.sheet) return Promise.resolve();
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    link.addEventListener('load', finish, { once: true });
    link.addEventListener('error', finish, { once: true });
    window.setTimeout(finish, 5000);
  });
}

async function preloadReaderStyles(imprint, { window, document }) {
  const styles = normalizeReaderStyles(imprint?.readerStyles);
  if (!styles.length) return;
  const links = [];
  for (const path of styles) {
    let link = document.querySelector(`link[data-bookself-instance-style="${CSS.escape(path)}"]`);
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
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
  });
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
  if (document.fonts?.load) {
    const family = FONT_FAMILIES[prefs.font] || FONT_FAMILIES.book;
    try {
      await document.fonts.load(`${prefs.fontSize}px ${family}`);
    } catch {
      // A local/system fallback remains usable if a web font cannot load.
    }
  }
  await twoFrames(window);
}

export async function prepareReaderFirstRender({
  window = globalThis.window,
  document = globalThis.document,
} = {}) {
  if (!window || !document?.documentElement) return null;
  if (document.documentElement.dataset.readerFirstRenderReady === 'true') {
    return window.__BOOKSELF_READER_FIRST_RENDER_PREFS || null;
  }

  const guard = guardRedundantStartupResize({ window, document });
  const imprint = await resolveImprint(window);
  const prefix = String(imprint?.storagePrefix || window.__IMPRINT?.storagePrefix || 'bookself');
  await preloadReaderStyles(imprint, { window, document });
  const prefs = applyFirstRenderPrefs(loadStoredPrefs(window, prefix), document);
  window.__BOOKSELF_READER_FIRST_RENDER_PREFS = prefs;
  await settleSelectedFont(prefs, { window, document });
  document.documentElement.dataset.readerFirstRenderReady = 'true';
  guard.arm();
  return prefs;
}
