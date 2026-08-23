const DEFAULTS = Object.freeze({
  fontSize: 18,
  font: 'book',
  leading: 1.55,
  measure: 'balanced',
  align: 'justify',
  paragraph: 'normal',
});

let prefs = { ...DEFAULTS };
let repaginateTimer = null;

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
  return {
    fontSize: Math.round(clamp(Number(raw.fontSize) || DEFAULTS.fontSize, 14, 30)),
    font,
    leading: Number(clamp(Number(raw.leading) || DEFAULTS.leading, 1.35, 1.9).toFixed(2)),
    measure,
    align,
    paragraph,
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
  setPressed('[data-reader-font-value]', prefs.font, 'data-reader-font-value');
  setPressed('[data-reader-measure-value]', prefs.measure, 'data-reader-measure-value');
  setPressed('[data-reader-align-value]', prefs.align, 'data-reader-align-value');
  setPressed('[data-reader-paragraph-value]', prefs.paragraph, 'data-reader-paragraph-value');
}

function applyPrefs({ save = true, repaginate = true } = {}) {
  prefs = normalize(prefs);
  const root = document.documentElement;
  root.dataset.readerFont = prefs.font;
  root.dataset.readerMeasure = prefs.measure;
  root.dataset.readerAlign = prefs.align;
  root.dataset.readerParagraph = prefs.paragraph;
  root.style.setProperty('--reader-font-size', `${prefs.fontSize}px`);
  root.style.setProperty('--reader-leading', String(prefs.leading));
  updateUi();
  if (save) savePrefs();
  if (repaginate) scheduleRepaginate();
}

function preset(name) {
  if (name === 'comfort') {
    prefs = {
      fontSize: 20,
      font: 'clear',
      leading: 1.7,
      measure: 'narrow',
      align: 'left',
      paragraph: 'airy',
    };
  } else if (name === 'large') {
    prefs = {
      fontSize: 24,
      font: 'clear',
      leading: 1.8,
      measure: 'narrow',
      align: 'left',
      paragraph: 'airy',
    };
  } else {
    prefs = { ...DEFAULTS };
  }
  applyPrefs();
}

function markup() {
  return `
    <div class="reader-experience" id="readerExperience">
      <section class="experience-section" aria-labelledby="experienceTypographyTitle">
        <div class="experience-section-head">
          <div>
            <p class="experience-eyebrow">Typography</p>
            <h4 id="experienceTypographyTitle">Make the page yours</h4>
          </div>
          <button class="experience-reset" id="readerReset" type="button">Reset</button>
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
          <div class="experience-choice-row" role="group" aria-label="Text alignment">
            <button class="experience-choice" type="button" data-reader-align-value="left" aria-pressed="false">Ragged right</button>
            <button class="experience-choice" type="button" data-reader-align-value="justify" aria-pressed="false">Justified</button>
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
  document.getElementById('readerReset')?.addEventListener('click', () => preset('book'));

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
    const li = document.createElement('li');
    li.dataset.experienceHelp = 'true';
    li.innerHTML = '<kbd>+</kbd> <kbd>−</kbd> text size';
    help.appendChild(li);
  }

  updateUi();
}

function nudgeSize(delta) {
  const next = clamp(prefs.fontSize + delta, 14, 30);
  if (next === prefs.fontSize) return;
  prefs.fontSize = next;
  applyPrefs();
}

function bindKeyboard() {
  document.addEventListener('keydown', (event) => {
    if (event.target.matches('input, textarea, select, [contenteditable="true"]')) return;
    if (document.body.dataset.stage !== 'read') return;
    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      nudgeSize(1);
    } else if (event.key === '-') {
      event.preventDefault();
      nudgeSize(-1);
    }
  });
}

function initialize() {
  prefs = loadPrefs();
  applyPrefs({ save: true, repaginate: false });
  enhanceSettings();
  bindKeyboard();
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
