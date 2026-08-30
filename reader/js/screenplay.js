import { fetchText } from './base.js';
import { parseBookReadme } from './catalog.js';
import { screenplayTurns } from './screenplay-format.js';
import { parseRoute, readHash, go } from './router.js';

const SCREENPLAY_LABELS = new Set(['screenplay', 'screen play', 'script', 'teleplay']);
const state = {
  slug: '',
  isScreenplay: false,
  turns: [],
  roles: [],
  role: '',
  mask: false,
  loadToken: 0,
};

function $(id) {
  return document.getElementById(id);
}

function storagePrefix() {
  return window.__IMPRINT?.storagePrefix || 'bookself';
}

function storageKey(slug) {
  return `${storagePrefix()}:screenplay-rehearsal:${slug}`;
}

function screenplayFormat(meta) {
  const raw = String(meta?.formatLabel || meta?.format || '').trim().toLowerCase();
  return SCREENPLAY_LABELS.has(raw);
}

function installStyles() {
  if (document.querySelector('link[data-screenplay-reader]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('../css/screenplay.css?v=r1', import.meta.url).href;
  link.dataset.screenplayReader = 'true';
  document.head.appendChild(link);
}

function installHeaderButton() {
  if ($('screenplayRehearseBtn')) return true;
  const header = document.querySelector('.header-right');
  const settings = $('settingsBtn');
  if (!header || !settings) return false;
  const button = document.createElement('button');
  button.id = 'screenplayRehearseBtn';
  button.type = 'button';
  button.className = 'header-btn screenplay-rehearse-btn';
  button.hidden = true;
  button.title = 'Rehearse lines';
  button.setAttribute('aria-label', 'Rehearse lines');
  button.innerHTML = '<span class="screenplay-rehearse-label">Lines</span>';
  settings.insertAdjacentElement('beforebegin', button);
  button.addEventListener('click', () => {
    if (!state.isScreenplay) return;
    settings.click();
    window.setTimeout(() => {
      $('screenplayRehearsalTools')?.scrollIntoView({ block: 'nearest' });
      $('screenplayRoleSelect')?.focus({ preventScroll: true });
    }, 30);
  });
  return true;
}

function rehearsalMarkup() {
  return `
    <section class="screenplay-rehearsal-tools" id="screenplayRehearsalTools" hidden aria-labelledby="screenplayRehearsalTitle">
      <div class="screenplay-rehearsal-head">
        <div>
          <p class="experience-eyebrow">Performance</p>
          <h4 id="screenplayRehearsalTitle">Rehearse a role</h4>
          <p>Choose a character, hide their dialogue, then move cue by cue. This stays in your browser.</p>
        </div>
      </div>
      <label class="screenplay-role-field" for="screenplayRoleSelect">
        Role
        <select id="screenplayRoleSelect"><option value="">Choose a role…</option></select>
      </label>
      <div class="screenplay-rehearsal-actions">
        <button id="screenplayMaskBtn" type="button" aria-pressed="false">Hide my lines</button>
        <button id="screenplayPrevLine" type="button">Previous cue</button>
        <button id="screenplayNextLine" type="button">Next cue</button>
      </div>
      <p class="screenplay-rehearsal-status" id="screenplayRehearsalStatus">Choose a role to begin.</p>
      <p class="screenplay-rehearsal-hint">Masked lines keep their exact layout. Tap a hidden line to reveal it without shifting the page.</p>
    </section>`;
}

function installSettingsTools() {
  if ($('screenplayRehearsalTools')) return true;
  const section = document.querySelector('#readerExperience .experience-section');
  if (!section) return false;
  const anchor = $('readerPresentationTools') || section.querySelector('.experience-control-first');
  if (anchor) anchor.insertAdjacentHTML('afterend', rehearsalMarkup());
  else section.insertAdjacentHTML('beforeend', rehearsalMarkup());

  $('screenplayRoleSelect')?.addEventListener('change', (event) => {
    state.role = event.target.value;
    saveState();
    applyRehearsalState();
  });
  $('screenplayMaskBtn')?.addEventListener('click', () => {
    if (!state.role) return;
    state.mask = !state.mask;
    saveState();
    applyRehearsalState();
  });
  $('screenplayPrevLine')?.addEventListener('click', () => jumpRoleTurn(-1));
  $('screenplayNextLine')?.addEventListener('click', () => jumpRoleTurn(1));
  return true;
}

function loadState(slug) {
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey(slug)) || '{}');
    return {
      role: typeof raw.role === 'string' ? raw.role : '',
      mask: raw.mask === true,
    };
  } catch {
    return { role: '', mask: false };
  }
}

function saveState() {
  if (!state.slug) return;
  try {
    localStorage.setItem(storageKey(state.slug), JSON.stringify({ role: state.role, mask: state.mask }));
  } catch {
    // Rehearsal still works for the current session when storage is unavailable.
  }
}

function uniqueRoles(turns) {
  const roles = [];
  const seen = new Set();
  for (const turn of turns) {
    const role = String(turn.character || '').trim();
    if (!role || seen.has(role)) continue;
    seen.add(role);
    roles.push(role);
  }
  return roles.sort((a, b) => a.localeCompare(b));
}

function syncRoleSelect() {
  const select = $('screenplayRoleSelect');
  if (!select) return;
  const selected = state.roles.includes(state.role) ? state.role : '';
  select.innerHTML = '<option value="">Choose a role…</option>' + state.roles
    .map((role) => `<option value="${role.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')}">${role.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</option>`)
    .join('');
  select.value = selected;
  if (!selected && state.role) {
    state.role = '';
    state.mask = false;
    saveState();
  }
}

function roleTurns() {
  return state.role ? state.turns.filter((turn) => turn.character === state.role) : [];
}

function currentTurnIndex(turns) {
  const route = parseRoute();
  if (!turns.length) return -1;
  let previous = -1;
  for (let i = 0; i < turns.length; i += 1) {
    const turn = turns[i];
    const sameChapter = turn.chapter === route.chapter;
    if (sameChapter && route.offset >= turn.start && route.offset <= turn.end) return i;
    if (sameChapter && turn.start <= route.offset) previous = i;
    if (turn.chapterIndex < state.turns.find((item) => item.chapter === route.chapter)?.chapterIndex) previous = i;
  }
  return previous;
}

function updateStatus() {
  const status = $('screenplayRehearsalStatus');
  const mask = $('screenplayMaskBtn');
  const previous = $('screenplayPrevLine');
  const next = $('screenplayNextLine');
  const turns = roleTurns();
  if (mask) {
    mask.disabled = !state.role;
    mask.setAttribute('aria-pressed', String(state.mask && !!state.role));
    mask.textContent = state.mask ? 'Show my lines' : 'Hide my lines';
  }
  if (previous) previous.disabled = turns.length === 0;
  if (next) next.disabled = turns.length === 0;
  if (!status) return;
  if (!state.role) {
    status.textContent = state.roles.length ? `${state.roles.length} speaking role${state.roles.length === 1 ? '' : 's'} found.` : 'No speaking roles found.';
    return;
  }
  const scenes = new Set(turns.map((turn) => turn.scene).filter(Boolean));
  status.textContent = `${state.role} · ${turns.length} cue${turns.length === 1 ? '' : 's'}${scenes.size ? ` · ${scenes.size} scene${scenes.size === 1 ? '' : 's'}` : ''}`;
}

function applyRoleClasses(root = document) {
  const role = state.role;
  root.querySelectorAll?.('.screenplay-dialogue-block').forEach((block) => {
    const mine = !!role && block.dataset.screenplayCharacter === role;
    block.classList.toggle('is-rehearsal-role', mine);
    if (!mine || !state.mask) block.classList.remove('is-line-revealed');
  });
}

function applyRehearsalState() {
  document.body.classList.toggle('screenplay-mask-lines', state.isScreenplay && state.mask && !!state.role);
  applyRoleClasses();
  syncRoleSelect();
  updateStatus();
}

function clearScreenplayUi() {
  state.isScreenplay = false;
  state.turns = [];
  state.roles = [];
  state.role = '';
  state.mask = false;
  document.body.classList.remove('screenplay-mask-lines');
  document.body.classList.remove('publication-format-screenplay');
  const button = $('screenplayRehearseBtn');
  const tools = $('screenplayRehearsalTools');
  if (button) button.hidden = true;
  if (tools) tools.hidden = true;
  applyRoleClasses();
}

async function loadCurrentScript() {
  const route = parseRoute();
  const slug = route.slug || '';
  const token = ++state.loadToken;
  if (!slug) {
    state.slug = '';
    clearScreenplayUi();
    return;
  }

  if (slug === state.slug && state.isScreenplay) {
    applyRehearsalState();
    return;
  }

  try {
    const hub = await fetchText(`books/${slug}/README.md`);
    const meta = parseBookReadme(hub, slug);
    if (token !== state.loadToken) return;
    if (!screenplayFormat(meta)) {
      state.slug = slug;
      clearScreenplayUi();
      return;
    }

    const chapters = await Promise.all(meta.contents.map(async (chapter, chapterIndex) => {
      try {
        const markdown = await fetchText(`books/${slug}/${chapter.file}`);
        return screenplayTurns(markdown, chapter.id, chapterIndex);
      } catch {
        return [];
      }
    }));
    if (token !== state.loadToken) return;

    state.slug = slug;
    state.isScreenplay = true;
    state.turns = chapters.flat();
    state.roles = uniqueRoles(state.turns);
    const saved = loadState(slug);
    state.role = state.roles.includes(saved.role) ? saved.role : '';
    state.mask = saved.mask && !!state.role;
    document.body.classList.add('publication-format-screenplay');
    const button = $('screenplayRehearseBtn');
    const tools = $('screenplayRehearsalTools');
    if (button) button.hidden = false;
    if (tools) tools.hidden = false;
    applyRehearsalState();
  } catch {
    state.slug = slug;
    clearScreenplayUi();
  }
}

function jumpRoleTurn(direction) {
  const turns = roleTurns();
  if (!turns.length) return;
  const current = currentTurnIndex(turns);
  let index;
  if (direction > 0) index = current < 0 ? 0 : Math.min(turns.length - 1, current + 1);
  else index = current < 0 ? turns.length - 1 : Math.max(0, current - 1);
  const target = turns[index];
  if (!target) return;
  $('settingsClose')?.click();
  go(readHash(state.slug, target.chapter, target.start));
}

function bindReveal() {
  $('bookStage')?.addEventListener('click', (event) => {
    if (!state.isScreenplay || !state.mask || !state.role) return;
    const block = event.target.closest?.('.screenplay-dialogue-block.is-rehearsal-role');
    if (!block) return;
    block.classList.toggle('is-line-revealed');
  });
}

function bindKeyboard() {
  document.addEventListener('keydown', (event) => {
    if (!state.isScreenplay || event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.target.closest?.('input, textarea, select, button, [contenteditable="true"]')) return;
    if (event.key.toLowerCase() !== 'r') return;
    event.preventDefault();
    $('screenplayRehearseBtn')?.click();
  }, true);
}

function syncHelp() {
  const help = document.querySelector('.help-keys');
  if (!help) return;
  let row = help.querySelector('[data-screenplay-help]');
  if (!state.isScreenplay) {
    row?.remove();
    return;
  }
  if (!row) {
    row = document.createElement('li');
    row.dataset.screenplayHelp = 'true';
    row.innerHTML = '<kbd>r</kbd> rehearse lines';
    help.appendChild(row);
  }
}

function observePaint() {
  const stage = $('bookStage');
  if (!stage) return;
  const observer = new MutationObserver((records) => {
    if (!state.isScreenplay) return;
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) applyRoleClasses(node);
      }
    }
  });
  observer.observe(stage, { childList: true, subtree: true });
}

function scheduleSync() {
  window.setTimeout(async () => {
    installHeaderButton();
    installSettingsTools();
    await loadCurrentScript();
    syncHelp();
  }, 0);
}

function initialize() {
  installStyles();
  installHeaderButton();
  installSettingsTools();
  bindReveal();
  bindKeyboard();
  observePaint();
  scheduleSync();
  window.addEventListener('hashchange', scheduleSync);
  window.addEventListener('popstate', scheduleSync);

  const observer = new MutationObserver(() => {
    installHeaderButton();
    installSettingsTools();
    syncHelp();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
else initialize();
