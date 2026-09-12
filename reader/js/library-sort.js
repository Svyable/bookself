import {
  normalizeLibrarySort,
  sortByLastRead,
  volumeSlug,
} from './library-sort-model.js';

let lastReadActive = false;
let sortFrame = 0;
let restoreComplete = false;

function $(id) {
  return document.getElementById(id);
}

function libraryStage() {
  return document.body.dataset.stage === 'library';
}

function storagePrefix() {
  return window.__IMPRINT?.storagePrefix || 'bookself';
}

function sortPreferenceKey() {
  return `${storagePrefix()}:library-sort`;
}

function loadSortPreference() {
  try {
    return normalizeLibrarySort(localStorage.getItem(sortPreferenceKey()));
  } catch {
    return 'title';
  }
}

function saveSortPreference(mode) {
  try {
    localStorage.setItem(sortPreferenceKey(), normalizeLibrarySort(mode));
  } catch {
    // Preference persistence is optional; sorting itself must remain usable.
  }
}

function progressSavedAt(slug) {
  if (!slug) return 0;
  try {
    const progress = JSON.parse(localStorage.getItem(`${storagePrefix()}:${slug}:progress`) || 'null');
    return Number(progress?.savedAt) || 0;
  } catch {
    return 0;
  }
}

function volumeTitle(volume) {
  return volume.querySelector('.volume-title')?.textContent?.trim() || 'Publication';
}

function currentVolumes() {
  return [...document.querySelectorAll('#stacks .volume, #shelf .volume')];
}

function syncControls() {
  document.querySelectorAll('.library-bar [data-sort]').forEach((button) => {
    if (lastReadActive) button.classList.remove('active');
    button.setAttribute('aria-pressed', String(!lastReadActive && button.classList.contains('active')));
  });
  const lastRead = document.querySelector('[data-library-sort="last-read"]');
  if (lastRead) {
    lastRead.classList.toggle('active', lastReadActive);
    lastRead.setAttribute('aria-pressed', String(lastReadActive));
  }
}

function applyLastReadSort() {
  sortFrame = 0;
  if (!lastReadActive || !libraryStage()) return;
  const shelf = $('shelf');
  const stacks = $('stacks');
  if (!shelf || !stacks) return;

  const rows = currentVolumes().map((volume) => {
    const slug = volumeSlug(volume.getAttribute('href') || '');
    return {
      volume,
      title: volumeTitle(volume),
      lastReadAt: progressSavedAt(slug),
    };
  });
  if (!rows.length) return;

  const sorted = sortByLastRead(rows);
  const current = [...shelf.querySelectorAll(':scope > .volume')];
  const alreadyFlat = !stacks.querySelector('.volume') && current.length === sorted.length;
  const alreadyOrdered = alreadyFlat && current.every((volume, index) => volume === sorted[index].volume);
  if (alreadyOrdered) return;

  const fragment = document.createDocumentFragment();
  sorted.forEach(({ volume }) => fragment.appendChild(volume));
  stacks.replaceChildren();
  shelf.replaceChildren(fragment);
}

function scheduleLastReadSort() {
  if (!lastReadActive || sortFrame) return;
  sortFrame = requestAnimationFrame(applyLastReadSort);
}

function activateLastRead({ persist = true } = {}) {
  lastReadActive = true;
  restoreComplete = true;
  if (persist) saveSortPreference('last-read');
  syncControls();
  scheduleLastReadSort();
}

function deactivateLastRead(mode = null) {
  lastReadActive = false;
  restoreComplete = true;
  if (mode) saveSortPreference(mode);
  syncControls();
}

function restoreSortPreference() {
  if (restoreComplete || !currentVolumes().length) return;
  const mode = loadSortPreference();
  if (mode === 'last-read') {
    activateLastRead({ persist: false });
    return;
  }
  if (mode === 'updated') {
    const updated = document.querySelector('.library-bar [data-sort="recent"]');
    if (!updated) return;
    restoreComplete = true;
    updated.click();
    return;
  }
  restoreComplete = true;
  syncControls();
}

function installSortControl() {
  const group = document.querySelector('.library-bar .setting-pills');
  if (!group || group.querySelector('[data-library-sort="last-read"]')) return;

  group.setAttribute('aria-label', 'Sort publications');
  const recent = group.querySelector('[data-sort="recent"]');
  if (recent) {
    recent.textContent = 'Updated';
    recent.title = 'Sort by publication update date';
    recent.setAttribute('aria-label', 'Sort by publication update date');
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'pill';
  button.dataset.librarySort = 'last-read';
  button.textContent = 'Last Read';
  button.title = 'Sort by your most recently read books';
  button.setAttribute('aria-label', 'Sort by your most recently read books');
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => activateLastRead());
  group.appendChild(button);

  group.addEventListener('click', (event) => {
    const core = event.target.closest('[data-sort]');
    if (!core) return;
    const mode = core.dataset.sort === 'recent' ? 'updated' : 'title';
    deactivateLastRead(mode);
  });
}

function installObserver() {
  const library = $('libraryView');
  if (!library) return;
  const observer = new MutationObserver(() => {
    restoreSortPreference();
    if (!lastReadActive) return;
    syncControls();
    scheduleLastReadSort();
  });
  observer.observe(library, { childList: true, subtree: true });
}

function initialize() {
  installSortControl();
  installObserver();
  restoreSortPreference();
  syncControls();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
  initialize();
}
