import { fetchText } from './base.js';
import { parseBookReadme } from './catalog.js';
import { blocksFromMarkdown } from './markdown.js';
import { parseRoute, readHash } from './router.js';

const DEFAULTS = Object.freeze({
  fontSize: 18,
  font: 'book',
  leading: 1.55,
  measure: 'balanced',
  align: 'justify',
  paragraph: 'normal',
  mode: 'paged',
  hyphens: 'auto',
});

let prefs = { ...DEFAULTS };
let repaginateTimer = null;
let scrollRaf = null;
let scrollSyncTimer = null;
let ignoreNextRouteSync = false;
let programmaticScroll = false;

const scrollState = {
  slug: null,
  title: '',
  blocks: [],
  tops: [],
  loading: null,
  activeIndex: -1,
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function storagePrefix() {
  return window.__IMPRINT?.storagePrefix || 'obb';
}

function experienceKey() {
  return `${storagePrefix()}:reader-experience`;
}

function legacyPrefs() {
  try {
    return JSON.parse(localStorage.getItem(`${storagePrefix()}:prefs`) || '{}');
  } catch {
    return {};
  }
}

function normalize(raw = {}) {
  const font = ['book', 'classic', 'modern', 'clear'].includes(raw.font) ? raw.font : DEFAULTS.font;
  const measure = ['narrow', 'balanced', 'wide'].includes(raw.measure) ? raw.measure : DEFAULTS.measure;
  const align = ['left', 'justify'].includes(raw.align) ? raw.align : DEFAULTS.align;
  const paragraph = ['compact', 'normal', 'airy'].includes(raw.paragraph) ? raw.paragraph : DEFAULTS.paragraph;
  const mode = ['paged', 'scroll'].includes(raw.mode) ? raw.mode : DEFAULTS.mode;
  const hyphens = ['auto', 'off'].includes(raw.hyphens) ? raw.hyphens : DEFAULTS.hyphens;
  return {
    fontSize: Math.round(clamp(Number(raw.fontSize) || DEFAULTS.fontSize, 14, 30)),
    font,
    leading: Number(clamp(Number(raw.leading) || DEFAULTS.leading, 1.35, 1.9).toFixed(2)),
    measure,
    align,
    paragraph,
    mode,
    hyphens,
  };
}

function loadPrefs() {
  try {
    const stored = localStorage.getItem(experienceKey());
    if (stored) return normalize(JSON.parse(stored));
  } catch {
    // Fall through to legacy migration.
  }
  const legacy = legacyPrefs();
  return normalize({
    fontSize: legacy.fontSize,
    leading: legacy.lineHeight,
    font: legacy.fontFamily === 'sans' ? 'modern' : 'book',
  });
}

function savePrefs() {
  try {
    localStorage.setItem(experienceKey(), JSON.stringify(prefs));
  } catch {
    // Reading still works when storage is unavailable.
  }
}

function scheduleRepaginate() {
  clearTimeout(repaginateTimer);
  repaginateTimer = window.setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 130);
}

function setPressed(selector, value, attr) {
  document.querySelectorAll(selector).forEach((button) => {
    const active = button.getAttribute(attr) === value;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function updateUi() {
  const size = document.getElementById('readerFontSize');
  const sizeOut = document.getElementById('readerFontSizeValue');
  const leading = document.getElementById('readerLeading');
  const leadingOut = document.getElementById('readerLeadingValue');
  if (size) size.value = String(prefs.fontSize);
  if (sizeOut) sizeOut.textContent = `${prefs.fontSize}px`;
  if (leading) leading.value = String(prefs.leading);
  if (leadingOut) leadingOut.textContent = prefs.leading.toFixed(2);
  setPressed('[data-reader-mode-value]', prefs.mode, 'data-reader-mode-value');
  setPressed('[data-reader-font-value]', prefs.font, 'data-reader-font-value');
  setPressed('[data-reader-measure-value]', prefs.measure, 'data-reader-measure-value');
  setPressed('[data-reader-align-value]', prefs.align, 'data-reader-align-value');
  setPressed('[data-reader-paragraph-value]', prefs.paragraph, 'data-reader-paragraph-value');
  setPressed('[data-reader-hyphens-value]', prefs.hyphens, 'data-reader-hyphens-value');
}

function applyPrefs({ save = true, repaginate = true } = {}) {
  prefs = normalize(prefs);
  const root = document.documentElement;
  const modeChanged = root.dataset.readerMode !== prefs.mode;
  root.dataset.readerFont = prefs.font;
  root.dataset.readerMeasure = prefs.measure;
  root.dataset.readerAlign = prefs.align;
  root.dataset.readerParagraph = prefs.paragraph;
  root.dataset.readerMode = prefs.mode;
  root.dataset.readerHyphens = prefs.hyphens;
  root.style.setProperty('--reader-font-size', `${prefs.fontSize}px`);
  root.style.setProperty('--reader-leading', String(prefs.leading));
  updateUi();
  if (save) savePrefs();
  if (repaginate) scheduleRepaginate();
  refreshScrollMetrics();
  syncReaderMode({ followRoute: modeChanged || !scrollState.blocks.length });
}

function preset(name) {
  const mode = prefs.mode;
  const hyphens = prefs.hyphens;
  if (name === 'comfort') {
    prefs = {
      fontSize: 20,
      font: 'clear',
      leading: 1.7,
      measure: 'narrow',
      align: 'left',
      paragraph: 'airy',
      mode,
      hyphens: 'off',
    };
  } else if (name === 'large') {
    prefs = {
      fontSize: 24,
      font: 'clear',
      leading: 1.8,
      measure: 'narrow',
      align: 'left',
      paragraph: 'airy',
      mode,
      hyphens: 'off',
    };
  } else {
    prefs = { ...DEFAULTS, mode, hyphens };
  }
  applyPrefs();
}

function resetExperience() {
  prefs = { ...DEFAULTS };
  applyPrefs();
}

function markup() {
  return `
    <div class="reader-experience" id="readerExperience">
      <section class="experience-section" aria-labelledby="experienceTypographyTitle">
        <div class="experience-section-head">
          <div>
            <p class="experience-eyebrow">Reading</p>
            <h4 id="experienceTypographyTitle">Make the page yours</h4>
          </div>
          <button class="experience-reset" id="readerReset" type="button">Reset all</button>
        </div>

        <div class="experience-control experience-control-first">
          <div class="experience-label-row"><span>Reading mode</span><span>Turn pages or flow</span></div>
          <div class="experience-choice-row experience-mode-row" role="group" aria-label="Reading mode">
            <button class="experience-choice experience-mode" type="button" data-reader-mode-value="paged" aria-pressed="false">
              <strong>Pages</strong><small>Single or spread</small>
            </button>
            <button class="experience-choice experience-mode" type="button" data-reader-mode-value="scroll" aria-pressed="false">
              <strong>Scroll</strong><small>Continuous reading</small>
            </button>
          </div>
        </div>

        <div class="experience-preview" aria-label="Reading settings preview">
          <p>Good reading disappears into the story. Tune the page until the words feel effortless.</p>
        </div>

        <div class="experience-control">
          <div class="experience-label-row">
            <label for="readerFontSize">Text size</label>
            <output id="readerFontSizeValue" for="readerFontSize">18px</output>
          </div>
          <input class="experience-range" id="readerFontSize" type="range" min="14" max="30" step="1" value="18">
          <div class="experience-range-scale" aria-hidden="true"><span>A</span><span>A</span></div>
        </div>

        <div class="experience-control">
          <div class="experience-label-row"><span>Typeface</span><span>4 choices</span></div>
          <div class="experience-fonts" role="group" aria-label="Typeface">
            <button class="experience-font" type="button" data-reader-font-value="book" aria-pressed="false"><strong>Aa</strong><small>Book</small></button>
            <button class="experience-font" type="button" data-reader-font-value="classic" aria-pressed="false"><strong>Aa</strong><small>Classic</small></button>
            <button class="experience-font" type="button" data-reader-font-value="modern" aria-pressed="false"><strong>Aa</strong><small>Modern</small></button>
            <button class="experience-font" type="button" data-reader-font-value="clear" aria-pressed="false"><strong>Aa</strong><small>Clear</small></button>
          </div>
        </div>

        <div class="experience-control">
          <div class="experience-label-row">
            <label for="readerLeading">Line spacing</label>
            <output id="readerLeadingValue" for="readerLeading">1.55</output>
          </div>
          <input class="experience-range" id="readerLeading" type="range" min="1.35" max="1.9" step="0.05" value="1.55">
        </div>

        <div class="experience-divider"></div>

        <div class="experience-control">
          <div class="experience-label-row"><span>Line width</span><span>Reading measure</span></div>
          <div class="experience-choice-row" role="group" aria-label="Reading line width">
            <button class="experience-choice" type="button" data-reader-measure-value="narrow" aria-pressed="false">Narrow</button>
            <button class="experience-choice" type="button" data-reader-measure-value="balanced" aria-pressed="false">Balanced</button>
            <button class="experience-choice" type="button" data-reader-measure-value="wide" aria-pressed="false">Wide</button>
          </div>
        </div>

        <div class="experience-control">
          <div class="experience-label-row"><span>Alignment</span><span>Choose your rhythm</span></div>
          <div class="experience-choice-row experience-mode-row" role="group" aria-label="Text alignment">
            <button class="experience-choice" type="button" data-reader-align-value="left" aria-pressed="false">Ragged right</button>
            <button class="experience-choice" type="button" data-reader-align-value="justify" aria-pressed="false">Justified</button>
          </div>
        </div>

        <div class="experience-control">
          <div class="experience-label-row"><span>Hyphenation</span><span>Long-word breaks</span></div>
          <div class="experience-choice-row experience-mode-row" role="group" aria-label="Hyphenation">
            <button class="experience-choice" type="button" data-reader-hyphens-value="auto" aria-pressed="false">Automatic</button>
            <button class="experience-choice" type="button" data-reader-hyphens-value="off" aria-pressed="false">Off</button>
          </div>
        </div>

        <div class="experience-control">
          <div class="experience-label-row"><span>Paragraph rhythm</span><span>Space between thoughts</span></div>
          <div class="experience-choice-row" role="group" aria-label="Paragraph spacing">
            <button class="experience-choice" type="button" data-reader-paragraph-value="compact" aria-pressed="false">Compact</button>
            <button class="experience-choice" type="button" data-reader-paragraph-value="normal" aria-pressed="false">Normal</button>
            <button class="experience-choice" type="button" data-reader-paragraph-value="airy" aria-pressed="false">Airy</button>
          </div>
        </div>

        <div class="experience-divider"></div>
        <div class="experience-control">
          <div class="experience-label-row"><span>Quick starts</span><span>Fine-tune anything after</span></div>
          <div class="experience-presets" role="group" aria-label="Reading presets">
            <button class="experience-preset" type="button" data-reader-preset="book">Book<small>Classic page</small></button>
            <button class="experience-preset" type="button" data-reader-preset="comfort">Comfort<small>Clear + airy</small></button>
            <button class="experience-preset" type="button" data-reader-preset="large">Large print<small>24px + clear</small></button>
          </div>
        </div>
      </section>
    </div>`;
}

function enhanceSettings() {
  const panel = document.getElementById('settingsPanel');
  const card = panel?.querySelector('.settings-card');
  if (!card || document.getElementById('readerExperience')) return;

  card.classList.add('experience-card');
  const title = card.querySelector('h3');
  if (title) title.textContent = 'Reading experience';
  const intro = document.createElement('p');
  intro.className = 'experience-intro';
  intro.textContent = 'Your choices stay on this device. Change the page, not the book.';
  title?.insertAdjacentElement('afterend', intro);
  intro.insertAdjacentHTML('afterend', markup());

  card.querySelectorAll('.setting-row').forEach((row) => {
    const label = row.querySelector('span')?.textContent?.trim();
    if (['Size', 'Typeface', 'Line height'].includes(label)) row.classList.add('experience-legacy-hidden');
  });

  const paperRow = [...card.querySelectorAll('.setting-row')].find((row) => row.querySelector('span')?.textContent?.trim() === 'Paper');
  if (paperRow) {
    const subhead = document.createElement('p');
    subhead.className = 'experience-subhead';
    subhead.textContent = 'Atmosphere';
    paperRow.insertAdjacentElement('beforebegin', subhead);
  }

  const actions = card.querySelector('.setting-actions');
  if (actions) {
    const subhead = document.createElement('p');
    subhead.className = 'experience-subhead';
    subhead.textContent = 'Tools';
    actions.insertAdjacentElement('beforebegin', subhead);
  }

  const settingsButton = document.getElementById('settingsBtn');
  settingsButton?.setAttribute('title', 'Reading experience');
  settingsButton?.setAttribute('aria-label', 'Reading experience');

  document.getElementById('readerFontSize')?.addEventListener('input', (event) => {
    prefs.fontSize = Number(event.target.value);
    applyPrefs();
  });
  document.getElementById('readerLeading')?.addEventListener('input', (event) => {
    prefs.leading = Number(event.target.value);
    applyPrefs();
  });
  document.getElementById('readerReset')?.addEventListener('click', resetExperience);

  document.querySelectorAll('[data-reader-mode-value]').forEach((button) => {
    button.addEventListener('click', () => {
      prefs.mode = button.dataset.readerModeValue;
      applyPrefs();
    });
  });
  document.querySelectorAll('[data-reader-font-value]').forEach((button) => {
    button.addEventListener('click', () => {
      prefs.font = button.dataset.readerFontValue;
      applyPrefs();
    });
  });
  document.querySelectorAll('[data-reader-measure-value]').forEach((button) => {
    button.addEventListener('click', () => {
      prefs.measure = button.dataset.readerMeasureValue;
      applyPrefs();
    });
  });
  document.querySelectorAll('[data-reader-align-value]').forEach((button) => {
    button.addEventListener('click', () => {
      prefs.align = button.dataset.readerAlignValue;
      applyPrefs();
    });
  });
  document.querySelectorAll('[data-reader-hyphens-value]').forEach((button) => {
    button.addEventListener('click', () => {
      prefs.hyphens = button.dataset.readerHyphensValue;
      applyPrefs();
    });
  });
  document.querySelectorAll('[data-reader-paragraph-value]').forEach((button) => {
    button.addEventListener('click', () => {
      prefs.paragraph = button.dataset.readerParagraphValue;
      applyPrefs();
    });
  });
  document.querySelectorAll('[data-reader-preset]').forEach((button) => {
    button.addEventListener('click', () => preset(button.dataset.readerPreset));
  });

  const help = document.querySelector('.help-keys');
  if (help && !help.querySelector('[data-experience-help]')) {
    const sizeLi = document.createElement('li');
    sizeLi.dataset.experienceHelp = 'true';
    sizeLi.innerHTML = '<kbd>+</kbd> <kbd>−</kbd> text size';
    help.appendChild(sizeLi);
    const modeLi = document.createElement('li');
    modeLi.dataset.experienceHelp = 'true';
    modeLi.innerHTML = '<kbd>v</kbd> pages / scroll';
    help.appendChild(modeLi);
  }

  updateUi();
}

function ensureScrollReader() {
  let reader = document.getElementById('scrollReader');
  if (reader) return reader;
  const stage = document.getElementById('bookStage');
  if (!stage) return null;

  reader = document.createElement('div');
  reader.id = 'scrollReader';
  reader.className = 'scroll-reader';
  reader.hidden = true;
  reader.tabIndex = 0;
  reader.setAttribute('role', 'region');
  reader.setAttribute('aria-label', 'Continuous reading view');
  reader.innerHTML = '<div class="scroll-document" id="scrollDocument"></div>';
  stage.appendChild(reader);

  reader.addEventListener('scroll', onScroll, { passive: true });
  reader.addEventListener('touchstart', (event) => event.stopPropagation());
  reader.addEventListener('touchend', (event) => event.stopPropagation());
  return reader;
}

async function loadScrollBook(slug) {
  const hub = await fetchText(`books/${slug}/README.md`);
  const meta = parseBookReadme(hub, slug);
  const chapters = await Promise.all(meta.contents.map(async (chapter) => {
    try {
      const markdown = await fetchText(`books/${slug}/${chapter.file}`);
      return { ...chapter, markdown };
    } catch {
      return {
        ...chapter,
        markdown: `# ${chapter.title}\n\nThis chapter file is missing from the repository.\n`,
      };
    }
  }));
  return { ...meta, chapters };
}

function relativeTop(element, ancestor) {
  let top = 0;
  let node = element;
  while (node && node !== ancestor) {
    top += node.offsetTop || 0;
    node = node.offsetParent;
  }
  return top;
}

function refreshScrollMetrics() {
  const reader = document.getElementById('scrollReader');
  if (!reader || !scrollState.blocks.length) return;
  requestAnimationFrame(() => {
    scrollState.tops = scrollState.blocks.map((block) => relativeTop(block.el, reader));
  });
}

async function buildScrollBook(slug) {
  const reader = ensureScrollReader();
  const doc = document.getElementById('scrollDocument');
  if (!reader || !doc || !slug) return;

  if (scrollState.slug === slug && scrollState.blocks.length) {
    refreshScrollMetrics();
    return;
  }
  if (scrollState.loading) {
    await scrollState.loading;
    if (scrollState.slug === slug) return;
  }

  scrollState.loading = (async () => {
    reader.setAttribute('aria-busy', 'true');
    doc.innerHTML = '<p class="scroll-loading">Preparing continuous view…</p>';
    const book = await loadScrollBook(slug);
    scrollState.slug = slug;
    scrollState.title = book.title || slug;
    scrollState.blocks = [];
    scrollState.tops = [];
    scrollState.activeIndex = -1;
    doc.innerHTML = '';

    for (const chapter of book.chapters) {
      const section = document.createElement('section');
      section.className = 'scroll-chapter';
      section.dataset.chapter = chapter.id;
      section.setAttribute('aria-label', chapter.title);

      const blocks = blocksFromMarkdown(chapter.markdown, slug);
      blocks.forEach((block) => {
        const wrap = document.createElement('div');
        wrap.className = 'scroll-block';
        wrap.dataset.chapter = chapter.id;
        wrap.dataset.offset = String(block.start);
        wrap.innerHTML = block.html;
        section.appendChild(wrap);
        scrollState.blocks.push({
          el: wrap,
          chapter: chapter.id,
          title: chapter.title,
          start: block.start,
        });
      });
      doc.appendChild(section);
    }

    reader.removeAttribute('aria-busy');
    refreshScrollMetrics();
  })();

  try {
    await scrollState.loading;
  } finally {
    scrollState.loading = null;
  }
}

function nearestBlockIndex(route) {
  const sameChapter = scrollState.blocks
    .map((block, index) => ({ block, index }))
    .filter(({ block }) => block.chapter === route.chapter);
  if (!sameChapter.length) return 0;
  let best = sameChapter[0];
  for (const candidate of sameChapter) {
    if (candidate.block.start <= route.offset) best = candidate;
    else break;
  }
  return best.index;
}

function scrollToRoute(route) {
  const reader = document.getElementById('scrollReader');
  if (!reader || !scrollState.blocks.length || route.view !== 'read') return;
  const index = nearestBlockIndex(route);
  const top = scrollState.tops[index] ?? relativeTop(scrollState.blocks[index].el, reader);
  programmaticScroll = true;
  reader.scrollTo({ top: Math.max(0, top - 24), behavior: 'auto' });
  window.setTimeout(() => {
    programmaticScroll = false;
    updateScrollPosition();
  }, 30);
}

function routeUrl(block) {
  const hash = readHash(scrollState.slug, block.chapter, block.start);
  const q = new URLSearchParams();
  q.set('b', scrollState.slug);
  q.set('c', block.chapter);
  if (block.start) q.set('o', String(block.start));
  return `${window.location.pathname}?${q.toString()}${hash}`;
}

function overlaysOpen() {
  return !!document.querySelector(
    '.toc-overlay.active, .stats-overlay.active, .search-overlay.active'
  );
}

function syncPagedStateFromScroll() {
  clearTimeout(scrollSyncTimer);
  scrollSyncTimer = window.setTimeout(() => {
    if (prefs.mode !== 'scroll' || overlaysOpen()) return;
    ignoreNextRouteSync = true;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }, 260);
}

function updateScrollPosition() {
  const reader = document.getElementById('scrollReader');
  if (!reader || prefs.mode !== 'scroll' || !scrollState.blocks.length) return;

  if (!scrollState.tops.length) refreshScrollMetrics();
  const probe = reader.scrollTop + Math.min(reader.clientHeight * 0.3, 220);
  const tops = scrollState.tops;
  let lo = 0;
  let hi = tops.length - 1;
  let index = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if ((tops[mid] ?? 0) <= probe) {
      index = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  const block = scrollState.blocks[index];
  scrollState.activeIndex = index;

  const maxScroll = Math.max(1, reader.scrollHeight - reader.clientHeight);
  const pct = Math.round(clamp(reader.scrollTop / maxScroll, 0, 1) * 100);
  const progress = document.getElementById('progressBarFill');
  const progressText = document.getElementById('progressPercent');
  const currentChapter = document.getElementById('currentChapter');
  if (progress) progress.style.width = `${pct}%`;
  if (progressText) progressText.textContent = `${pct}%`;
  if (currentChapter) currentChapter.textContent = block.title || '—';

  const nextUrl = routeUrl(block);
  const here = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (nextUrl !== here && !programmaticScroll) {
    history.replaceState(null, '', nextUrl);
    syncPagedStateFromScroll();
  }
}

function onScroll() {
  if (scrollRaf) return;
  scrollRaf = requestAnimationFrame(() => {
    scrollRaf = null;
    updateScrollPosition();
  });
}

async function syncReaderMode({ followRoute = true } = {}) {
  const reader = ensureScrollReader();
  if (!reader) return;
  const route = parseRoute();
  const active = prefs.mode === 'scroll' && document.body.dataset.stage === 'read' && route.view === 'read';
  reader.hidden = !active;
  if (!active) return;

  try {
    await buildScrollBook(route.slug);
    reader.hidden = false;
    if (followRoute) scrollToRoute(route);
  } catch (error) {
    console.error('Could not prepare continuous reading view', error);
    reader.hidden = false;
    const doc = document.getElementById('scrollDocument');
    if (doc) doc.innerHTML = '<p class="scroll-loading">Continuous view could not be prepared. Switch back to Pages to keep reading.</p>';
  }
}

function handleRouteChange() {
  if (ignoreNextRouteSync) {
    ignoreNextRouteSync = false;
    return;
  }
  syncReaderMode({ followRoute: true });
}

function nudgeSize(delta) {
  const next = clamp(prefs.fontSize + delta, 14, 30);
  if (next === prefs.fontSize) return;
  prefs.fontSize = next;
  applyPrefs();
}

function toggleMode() {
  prefs.mode = prefs.mode === 'paged' ? 'scroll' : 'paged';
  applyPrefs();
}

function scrollByReadingStep(direction) {
  const reader = document.getElementById('scrollReader');
  if (!reader) return;
  reader.scrollBy({
    top: direction * Math.max(160, reader.clientHeight * 0.78),
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  });
}

function bindKeyboard() {
  document.addEventListener('keydown', (event) => {
    if (event.target.matches('input, textarea, select, [contenteditable="true"]')) return;
    if (document.body.dataset.stage !== 'read') return;

    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      nudgeSize(1);
      return;
    }
    if (event.key === '-') {
      event.preventDefault();
      nudgeSize(-1);
      return;
    }
    if (event.key === 'v' || event.key === 'V') {
      event.preventDefault();
      toggleMode();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (prefs.mode !== 'scroll' || document.body.dataset.stage !== 'read') return;
    if (event.target.matches('input, textarea, select, [contenteditable="true"]')) return;

    if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      event.stopImmediatePropagation();
      scrollByReadingStep(-1);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
      event.preventDefault();
      event.stopImmediatePropagation();
      scrollByReadingStep(1);
    }
  }, true);
}

function bindRoutesAndViewport() {
  window.addEventListener('hashchange', handleRouteChange);
  window.addEventListener('popstate', handleRouteChange);
  window.addEventListener('resize', () => {
    refreshScrollMetrics();
  });

  const stageObserver = new MutationObserver(() => syncReaderMode({ followRoute: true }));
  stageObserver.observe(document.body, { attributes: true, attributeFilter: ['data-stage'] });
}

function loadEnhancementStyles() {
  if (document.querySelector('link[data-reader-experience-scroll]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('../css/experience-scroll.css', import.meta.url).href;
  link.dataset.readerExperienceScroll = 'true';
  document.head.appendChild(link);
}

function initialize() {
  loadEnhancementStyles();
  prefs = loadPrefs();
  applyPrefs({ save: true, repaginate: false });
  enhanceSettings();
  ensureScrollReader();
  bindKeyboard();
  bindRoutesAndViewport();
  syncReaderMode({ followRoute: true });
}

function waitForImprint(attempt = 0) {
  if (window.__IMPRINT || attempt >= 20) {
    initialize();
    return;
  }
  window.setTimeout(() => waitForImprint(attempt + 1), 50);
}

if (document.readyState === 'complete') waitForImprint();
else window.addEventListener('load', () => waitForImprint(), { once: true });
