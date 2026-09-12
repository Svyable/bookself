/* Progressive enhancement for the Shelf/library surface.
   Core reading, routing, and catalog behavior remains owned by app.js. */

const LIBRARY_VIEW_KEY = `${window.__IMPRINT?.storagePrefix || 'bookself'}:library-view`;
const LIBRARY_VIEWS = new Set(['covers', 'spines']);

let compactShelfFingerprint = '';
let compactShelfSyncQueued = false;
let shelfGesture = null;
let suppressShelfClickUntil = 0;

function $(id) {
  return document.getElementById(id);
}

function libraryStage() {
  return document.body.dataset.stage === 'library';
}

function loadLibraryView() {
  try {
    const stored = localStorage.getItem(LIBRARY_VIEW_KEY);
    return LIBRARY_VIEWS.has(stored) ? stored : 'covers';
  } catch {
    return 'covers';
  }
}

function saveLibraryView(view) {
  try {
    localStorage.setItem(LIBRARY_VIEW_KEY, view);
  } catch {
    // View persistence is a convenience, never a dependency for opening books.
  }
}

function injectCompactShelfStyles() {
  if ($('compactShelfStyles')) return;
  const style = document.createElement('style');
  style.id = 'compactShelfStyles';
  style.textContent = `
body[data-stage="library"] .library-bar {
  grid-template-columns: minmax(12rem, 1fr) auto auto;
}

body[data-stage="library"] .library-view-control {
  display: inline-flex;
  align-items: center;
  gap: .16rem;
  padding: .18rem;
  border: 1px solid var(--shelf-hairline, var(--border));
  border-radius: 12px;
  background: color-mix(in srgb, var(--bg-secondary) 68%, transparent);
}

body[data-stage="library"] .library-view-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .38rem;
  min-height: 2.48rem;
  padding: .35rem .68rem;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-ui);
  font-size: .82rem;
  cursor: pointer;
}

body[data-stage="library"] .library-view-button svg {
  width: .96rem;
  height: .96rem;
  flex: none;
}

body[data-stage="library"] .library-view-button:hover,
body[data-stage="library"] .library-view-button:focus-visible {
  color: var(--text-primary);
  background: color-mix(in srgb, var(--bg-elevated) 78%, transparent);
  outline: none;
}

body[data-stage="library"] .library-view-button[aria-pressed="true"] {
  color: var(--text-primary);
  background: var(--bg-elevated);
  box-shadow: 0 2px 10px color-mix(in srgb, var(--shadow) 26%, transparent), inset 0 0 0 1px color-mix(in srgb, var(--accent) 24%, var(--border));
}

body[data-stage="library"][data-library-view="spines"] #stacks,
body[data-stage="library"][data-library-view="spines"] #shelf {
  display: none !important;
}

body[data-stage="library"][data-library-view="spines"] .library-bar > .setting-pills {
  display: none;
}

body[data-stage="library"] .compact-shelf {
  width: var(--shelf-shell, min(92rem, calc(100vw - 2rem)));
  margin: clamp(1rem, 2vw, 1.5rem) auto 0;
}

body[data-stage="library"] .compact-shelf[hidden] {
  display: none;
}

body[data-stage="library"] .compact-shelf-guide {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin: 0 0 .58rem;
  color: var(--text-muted);
  font-family: var(--font-ui);
  font-size: .76rem;
  letter-spacing: .035em;
}

body[data-stage="library"] .compact-shelf-guide strong {
  color: var(--text-secondary);
  font-size: .72rem;
  letter-spacing: .16em;
  text-transform: uppercase;
}

body[data-stage="library"] .compact-shelf-grid {
  --compact-row: 196px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 30px);
  grid-auto-rows: var(--compact-row);
  column-gap: 3px;
  row-gap: 18px;
  align-items: end;
  justify-content: start;
  min-height: var(--compact-row);
  padding: 9px 10px 21px;
  border: 1px solid color-mix(in srgb, var(--border) 76%, transparent);
  border-radius: 16px;
  overflow: hidden;
  background:
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent calc(var(--compact-row) - 3px),
      color-mix(in srgb, var(--text-primary) 8%, var(--border)) calc(var(--compact-row) - 3px),
      color-mix(in srgb, var(--text-primary) 8%, var(--border)) var(--compact-row),
      color-mix(in srgb, var(--shadow) 32%, transparent) var(--compact-row),
      transparent calc(var(--compact-row) + 18px)
    ),
    linear-gradient(180deg, color-mix(in srgb, var(--bg-secondary) 70%, transparent), color-mix(in srgb, var(--bg-primary) 86%, transparent));
  box-shadow: inset 0 16px 28px color-mix(in srgb, var(--shadow) 10%, transparent);
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
}

body[data-stage="library"] .compact-spine {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: end;
  width: var(--spine-width, 26px);
  height: var(--spine-height, 164px);
  min-width: 20px;
  max-width: 30px;
  justify-self: center;
  padding: 7px 3px 8px;
  border: 1px solid color-mix(in srgb, var(--spine-cloth, #67584a) 76%, black);
  border-bottom-width: 3px;
  border-radius: 4px 4px 2px 2px;
  overflow: hidden;
  background:
    linear-gradient(90deg, rgba(255,255,255,.11), transparent 18%, transparent 75%, rgba(0,0,0,.16)),
    var(--spine-cloth, #67584a);
  color: rgba(255,255,255,.88);
  box-shadow: 1px 2px 4px rgba(0,0,0,.22), inset 1px 0 rgba(255,255,255,.08);
  text-decoration: none;
  transform-origin: 50% 100%;
  transition: transform 120ms ease, filter 120ms ease, box-shadow 120ms ease;
  -webkit-tap-highlight-color: transparent;
}

body[data-stage="library"] .compact-spine::before,
body[data-stage="library"] .compact-spine::after {
  content: "";
  position: absolute;
  left: 3px;
  right: 3px;
  height: 1px;
  background: rgba(255,255,255,.24);
  box-shadow: 0 1px rgba(0,0,0,.14);
}

body[data-stage="library"] .compact-spine::before { top: 6px; }
body[data-stage="library"] .compact-spine::after { bottom: 7px; }

body[data-stage="library"] .compact-spine-title {
  display: block;
  max-height: calc(100% - 18px);
  overflow: hidden;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: var(--font-ui);
  font-size: .63rem;
  font-weight: 650;
  line-height: 1;
  letter-spacing: .015em;
  text-shadow: 0 1px 2px rgba(0,0,0,.55);
  pointer-events: none;
}

body[data-stage="library"] .compact-spine:hover,
body[data-stage="library"] .compact-spine:focus-visible {
  z-index: 2;
  filter: brightness(1.08) saturate(1.04);
  transform: translateY(-4px) scale(1.06);
  box-shadow: 2px 7px 14px rgba(0,0,0,.32), inset 1px 0 rgba(255,255,255,.12);
  outline: none;
}

body[data-stage="library"] .compact-spine:focus-visible {
  box-shadow: 0 0 0 2px var(--accent), 2px 7px 14px rgba(0,0,0,.32);
}

body[data-stage="library"] .compact-spine.is-loupe-target {
  z-index: 4;
  filter: brightness(1.16) saturate(1.08);
  transform: translateY(-7px) scale(1.18);
  box-shadow: 3px 10px 20px rgba(0,0,0,.38), 0 0 0 1px color-mix(in srgb, var(--accent) 65%, white);
}

body[data-stage="library"] .library-spine-loupe {
  position: fixed;
  z-index: 80;
  left: 0;
  top: 0;
  width: min(21rem, calc(100vw - 24px));
  min-height: 64px;
  padding: .72rem .9rem .68rem;
  border: 1px solid color-mix(in srgb, white 22%, var(--border));
  border-radius: 20px;
  background: color-mix(in srgb, var(--bg-elevated) 72%, transparent);
  color: var(--text-primary);
  box-shadow: 0 18px 46px rgba(0,0,0,.36), inset 0 1px rgba(255,255,255,.12);
  -webkit-backdrop-filter: blur(22px) saturate(1.35);
  backdrop-filter: blur(22px) saturate(1.35);
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, calc(-100% - 26px)) scale(.92);
  transform-origin: 50% 100%;
  transition: opacity 90ms ease, transform 120ms ease;
}

body[data-stage="library"] .library-spine-loupe.visible {
  opacity: 1;
  transform: translate(-50%, calc(-100% - 26px)) scale(1);
}

body[data-stage="library"] .library-spine-loupe-title {
  display: block;
  font-family: var(--font-display);
  font-size: 1.12rem;
  font-weight: 600;
  line-height: 1.14;
  text-wrap: balance;
}

body[data-stage="library"] .library-spine-loupe-meta {
  display: block;
  margin-top: .22rem;
  color: var(--text-muted);
  font-family: var(--font-ui);
  font-size: .76rem;
  line-height: 1.25;
}

@media (max-width: 760px) {
  body[data-stage="library"] .library-bar {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  body[data-stage="library"] .library-search-control {
    grid-column: 1 / -1;
  }

  body[data-stage="library"] .library-bar > .setting-pills {
    justify-self: start;
  }

  body[data-stage="library"] .library-view-control {
    justify-self: end;
  }

  body[data-stage="library"] .library-view-label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  body[data-stage="library"] .library-view-button {
    width: 2.48rem;
    padding: .35rem;
  }

  body[data-stage="library"] .compact-shelf-grid {
    --compact-row: 184px;
    grid-template-columns: repeat(auto-fill, 27px);
    column-gap: 2px;
    padding-left: 7px;
    padding-right: 7px;
  }

  body[data-stage="library"] .compact-shelf-guide span:last-child {
    font-size: .7rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  body[data-stage="library"] .compact-spine,
  body[data-stage="library"] .library-spine-loupe {
    transition: none;
  }
}

@media (forced-colors: active) {
  body[data-stage="library"] .compact-spine,
  body[data-stage="library"] .library-view-control,
  body[data-stage="library"] .library-spine-loupe {
    border: 1px solid CanvasText;
  }
}
`;
  document.head.appendChild(style);
}

function viewIcon(view) {
  if (view === 'spines') {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 4v15M8 6v13M12 3v16M16 5v14M20 4v15M2 20h20"/></svg>';
  }
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="7" height="8" rx="1"/><rect x="14" y="3" width="7" height="8" rx="1"/><rect x="3" y="15" width="7" height="6" rx="1"/><rect x="14" y="15" width="7" height="6" rx="1"/></svg>';
}

function setLibraryView(view, { persist = true } = {}) {
  const next = LIBRARY_VIEWS.has(view) ? view : 'covers';
  document.body.dataset.libraryView = next;
  document.querySelectorAll('[data-library-view-option]').forEach((button) => {
    const selected = button.dataset.libraryViewOption === next;
    button.setAttribute('aria-pressed', String(selected));
    button.classList.toggle('active', selected);
  });
  const compact = $('compactShelf');
  if (compact) compact.hidden = next !== 'spines' || compact.querySelectorAll('.compact-spine').length === 0;
  if (persist) saveLibraryView(next);
}

function installViewControl() {
  const bar = document.querySelector('.library-bar');
  if (!bar || bar.querySelector('.library-view-control')) return;

  const group = document.createElement('div');
  group.className = 'library-view-control';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'Library view');

  for (const [view, label] of [['covers', 'Covers'], ['spines', 'Shelf']]) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'library-view-button';
    button.dataset.libraryViewOption = view;
    button.title = `${label} view`;
    button.setAttribute('aria-label', `${label} view`);
    button.innerHTML = `${viewIcon(view)}<span class="library-view-label">${label}</span>`;
    button.addEventListener('click', () => setLibraryView(view));
    group.appendChild(button);
  }

  bar.appendChild(group);
  setLibraryView(loadLibraryView(), { persist: false });
}

function installSearchControl() {
  const bar = document.querySelector('.library-bar');
  const input = $('librarySearch');
  if (!bar || !input || input.closest('.library-search-control')) return;

  bar.setAttribute('role', 'search');
  bar.setAttribute('aria-label', 'Shelf controls');
  input.setAttribute('aria-label', 'Search the shelf');
  input.setAttribute('enterkeyhint', 'search');

  const control = document.createElement('div');
  control.className = 'library-search-control';

  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.classList.add('library-search-icon');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('fill', 'none');
  icon.setAttribute('stroke', 'currentColor');
  icon.setAttribute('stroke-width', '2');
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = '<circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.2-3.2"></path>';

  const key = document.createElement('kbd');
  key.className = 'library-search-key';
  key.textContent = '/';
  key.setAttribute('aria-hidden', 'true');

  input.replaceWith(control);
  control.append(icon, input, key);

  const sort = bar.querySelector('.setting-pills');
  if (sort) {
    sort.setAttribute('role', 'group');
    sort.setAttribute('aria-label', 'Sort publications');
  }
}

function installShelfStatus() {
  const bar = document.querySelector('.library-bar');
  if (!bar || $('shelfStatus')) return;
  const status = document.createElement('p');
  status.id = 'shelfStatus';
  status.className = 'shelf-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  bar.insertAdjacentElement('afterend', status);
}

function syncSortSemantics() {
  document.querySelectorAll('.library-bar [data-sort]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
  });
}

function syncPublisherSemantics() {
  const filters = $('pubFilters');
  if (!filters) return;
  filters.setAttribute('role', 'group');
  filters.setAttribute('aria-label', 'Filter by publisher');
  const buttons = [...filters.querySelectorAll('button')];
  buttons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
  });

  // "All + one publisher" is not a useful filter choice; keep the shelf quieter.
  if (buttons.length > 0 && buttons.length <= 2 && buttons[0]?.textContent?.trim() === 'All') {
    filters.hidden = true;
  }
}

function sourceVolumes() {
  return [...document.querySelectorAll('#stacks .volume, #shelf .volume')];
}

function syncVolumes() {
  const volumes = sourceVolumes();

  volumes.forEach((volume, index) => {
    volume.style.setProperty('--volume-index', String(index));
    const title = volume.querySelector('.volume-title')?.textContent?.trim() || 'Publication';
    const author = volume.querySelector('.volume-author')?.textContent?.trim() || '';
    const publisher = volume.querySelector('.volume-imprint')?.textContent?.trim() || '';
    const detail = [title, author && `by ${author}`, publisher].filter(Boolean).join(', ');
    volume.setAttribute('aria-label', volume.classList.contains('is-reading') ? `Continue ${detail}` : `Open ${detail}`);
  });

  return volumes.length;
}

function spineMetric(title, minimum, range) {
  let hash = 2166136261;
  for (const char of String(title)) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return minimum + (Math.abs(hash) % range);
}

function compactSnapshots() {
  return sourceVolumes()
    .map((volume) => {
      const title = volume.querySelector('.volume-title')?.textContent?.trim() || 'Publication';
      const author = volume.querySelector('.volume-author')?.textContent?.trim() || '';
      const publisher = volume.querySelector('.volume-imprint')?.textContent?.trim() || '';
      return {
        title,
        author,
        publisher,
        href: volume.getAttribute('href') || '#',
        cloth: volume.style.getPropertyValue('--cloth') || '#67584a',
        reading: volume.classList.contains('is-reading'),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
}

function compactShelfElement() {
  let section = $('compactShelf');
  if (section) return section;

  section = document.createElement('section');
  section.id = 'compactShelf';
  section.className = 'compact-shelf';
  section.setAttribute('aria-label', 'Alphabetical bookshelf');
  section.innerHTML = `
    <div class="compact-shelf-guide">
      <strong>A–Z</strong>
      <span>Tap a spine · press and slide to browse titles</span>
    </div>
    <div class="compact-shelf-grid" id="compactShelfGrid"></div>`;

  const anchor = $('stacks');
  if (anchor) anchor.insertAdjacentElement('afterend', section);
  return section;
}

function loupeElement() {
  let loupe = $('librarySpineLoupe');
  if (loupe) return loupe;
  loupe = document.createElement('div');
  loupe.id = 'librarySpineLoupe';
  loupe.className = 'library-spine-loupe';
  loupe.setAttribute('aria-hidden', 'true');
  loupe.innerHTML = '<span class="library-spine-loupe-title"></span><span class="library-spine-loupe-meta"></span>';
  document.body.appendChild(loupe);
  return loupe;
}

function buildCompactShelf() {
  const snapshots = compactSnapshots();
  const fingerprint = snapshots
    .map((book) => `${book.href}\u0000${book.title}\u0000${book.author}\u0000${book.reading ? '1' : '0'}`)
    .join('\u0001');
  const section = compactShelfElement();
  const grid = $('compactShelfGrid');
  if (!grid) return;

  if (fingerprint !== compactShelfFingerprint) {
    compactShelfFingerprint = fingerprint;
    grid.innerHTML = '';
    for (const book of snapshots) {
      const spine = document.createElement('a');
      spine.className = 'compact-spine';
      spine.href = book.href;
      spine.dataset.title = book.title;
      spine.dataset.author = book.author;
      spine.dataset.publisher = book.publisher;
      spine.style.setProperty('--spine-cloth', book.cloth);
      spine.style.setProperty('--spine-height', `${spineMetric(book.title, 138, 43)}px`);
      spine.style.setProperty('--spine-width', `${spineMetric(`${book.title}:${book.author}`, 22, 8)}px`);
      spine.setAttribute('aria-label', `${book.reading ? 'Continue' : 'Open'} ${[book.title, book.author && `by ${book.author}`].filter(Boolean).join(', ')}`);
      spine.title = [book.title, book.author].filter(Boolean).join(' — ');

      const label = document.createElement('span');
      label.className = 'compact-spine-title';
      label.textContent = book.title;
      spine.appendChild(label);
      grid.appendChild(spine);
    }
  }

  section.hidden = document.body.dataset.libraryView !== 'spines' || snapshots.length === 0;
}

function queueCompactShelfSync() {
  if (compactShelfSyncQueued) return;
  compactShelfSyncQueued = true;
  requestAnimationFrame(() => {
    compactShelfSyncQueued = false;
    buildCompactShelf();
  });
}

function clearLoupeTarget() {
  document.querySelector('.compact-spine.is-loupe-target')?.classList.remove('is-loupe-target');
}

function spineAtPoint(x, y) {
  return document.elementFromPoint(x, y)?.closest?.('.compact-spine') || null;
}

function positionLoupe(x, y, spine) {
  if (!spine) return;
  clearLoupeTarget();
  spine.classList.add('is-loupe-target');
  const loupe = loupeElement();
  loupe.querySelector('.library-spine-loupe-title').textContent = spine.dataset.title || 'Publication';
  loupe.querySelector('.library-spine-loupe-meta').textContent = [spine.dataset.author, spine.dataset.publisher].filter(Boolean).join(' · ');
  const half = Math.min(168, Math.max(120, window.innerWidth * .28));
  const left = Math.max(half + 8, Math.min(window.innerWidth - half - 8, x));
  const top = Math.max(92, y);
  loupe.style.left = `${left}px`;
  loupe.style.top = `${top}px`;
  loupe.classList.add('visible');
}

function endShelfGesture({ suppressClick = false } = {}) {
  if (shelfGesture?.timer) clearTimeout(shelfGesture.timer);
  if (suppressClick) suppressShelfClickUntil = performance.now() + 520;
  shelfGesture = null;
  clearLoupeTarget();
  $('librarySpineLoupe')?.classList.remove('visible');
}

function activateShelfGesture(event) {
  if (!shelfGesture || shelfGesture.pointerId !== event.pointerId) return;
  shelfGesture.active = true;
  positionLoupe(event.clientX, event.clientY, spineAtPoint(event.clientX, event.clientY) || shelfGesture.spine);
}

function installShelfGesture() {
  const section = compactShelfElement();
  const grid = $('compactShelfGrid');
  if (!grid || grid.dataset.gestureReady === 'true') return;
  grid.dataset.gestureReady = 'true';
  loupeElement();

  grid.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || document.body.dataset.libraryView !== 'spines') return;
    const spine = event.target.closest('.compact-spine');
    if (!spine) return;
    endShelfGesture();
    shelfGesture = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      spine,
      x: event.clientX,
      y: event.clientY,
      active: false,
      timer: window.setTimeout(() => activateShelfGesture(event), 260),
    };
    spine.setPointerCapture?.(event.pointerId);
  });

  grid.addEventListener('pointermove', (event) => {
    if (!shelfGesture || shelfGesture.pointerId !== event.pointerId) return;
    const dx = event.clientX - shelfGesture.x;
    const dy = event.clientY - shelfGesture.y;

    if (!shelfGesture.active) {
      if (Math.abs(dy) > 16 && Math.abs(dy) > Math.abs(dx) * 1.15) {
        endShelfGesture();
        return;
      }
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
        if (shelfGesture.timer) clearTimeout(shelfGesture.timer);
        shelfGesture.active = true;
      }
    }

    if (shelfGesture.active) {
      event.preventDefault();
      positionLoupe(event.clientX, event.clientY, spineAtPoint(event.clientX, event.clientY) || shelfGesture.spine);
    }
  });

  grid.addEventListener('pointerup', (event) => {
    if (!shelfGesture || shelfGesture.pointerId !== event.pointerId) return;
    const wasActive = shelfGesture.active;
    endShelfGesture({ suppressClick: wasActive });
  });

  grid.addEventListener('pointercancel', () => endShelfGesture());
  grid.addEventListener('lostpointercapture', () => {
    if (shelfGesture?.active) endShelfGesture({ suppressClick: true });
  });

  grid.addEventListener('click', (event) => {
    if (performance.now() < suppressShelfClickUntil) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  section.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') endShelfGesture();
  });
}

function syncStatus() {
  const status = $('shelfStatus');
  const search = $('librarySearch');
  if (!status || !search) return;

  const query = search.value.trim();
  document.body.classList.toggle('shelf-searching', Boolean(query));

  const hits = $('libraryHits');
  const hitCount = hits && !hits.hidden ? hits.querySelectorAll('li').length : 0;
  const volumeCount = syncVolumes();

  if (query) {
    status.textContent = hitCount === 1
      ? `1 result for “${query}”`
      : `${hitCount} results for “${query}”`;
  } else {
    status.textContent = volumeCount === 1 ? '1 publication' : `${volumeCount} publications`;
  }
}

function syncLibraryUi() {
  syncSortSemantics();
  syncPublisherSemantics();
  syncStatus();
  queueCompactShelfSync();
}

function installLibraryKeyboard() {
  document.addEventListener('keydown', (event) => {
    if (!libraryStage() || event.defaultPrevented || event.metaKey && event.key.toLowerCase() !== 'k') return;

    const input = $('librarySearch');
    if (!input) return;
    const target = event.target;
    const typing = target instanceof HTMLInputElement
      || target instanceof HTMLTextAreaElement
      || target?.isContentEditable;

    if ((event.key === '/' && !typing) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')) {
      event.preventDefault();
      input.focus({ preventScroll: true });
      input.select();
      return;
    }

    if (event.key === 'Escape' && target === input) {
      if (input.value) {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        syncLibraryUi();
      } else {
        input.blur();
      }
    }
  }, true);
}

function installObservers() {
  const library = $('libraryView');
  if (!library) return;

  const observer = new MutationObserver(() => syncLibraryUi());
  observer.observe(library, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'hidden'],
  });

  $('librarySearch')?.addEventListener('input', () => {
    requestAnimationFrame(syncLibraryUi);
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('.library-bar [data-sort], #pubFilters button')) {
      requestAnimationFrame(syncLibraryUi);
    }
  });
}

function initialize() {
  if (document.documentElement.dataset.shelfGuiEnhanced === 'true') return;
  document.documentElement.dataset.shelfGuiEnhanced = 'true';
  injectCompactShelfStyles();
  installSearchControl();
  installViewControl();
  installShelfStatus();
  installShelfGesture();
  installLibraryKeyboard();
  installObservers();
  syncLibraryUi();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
  initialize();
}
