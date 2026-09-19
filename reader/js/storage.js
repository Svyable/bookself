function prefix() {
  return (typeof window !== 'undefined' && window.__IMPRINT?.storagePrefix) || 'bookself';
}

function prefsKey() {
  return `${prefix()}:prefs`;
}

function bookKey(slug, name) {
  return `${prefix()}:${slug}:${name}`;
}

function systemTheme() {
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function normalizeReaderTheme(theme) {
  const value = String(theme || '').trim().toLowerCase();
  if (value === 'light' || value === 'sepia') return 'light';
  return 'dark';
}

export function nextReaderTheme(theme) {
  return normalizeReaderTheme(theme) === 'dark' ? 'light' : 'dark';
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function readingAppearanceDefaults(theme = 'dark') {
  return {
    theme: normalizeReaderTheme(theme),
    fontSize: 18,
    lineHeight: '1.55',
    fontFamily: 'serif',
    nightLight: false,
  };
}

export function resetReadingAppearancePrefs(prefs = {}, theme = systemTheme()) {
  const defaults = readingAppearanceDefaults(theme);
  return {
    ...prefs,
    theme: normalizeReaderTheme(prefs.theme ?? theme),
    fontSize: defaults.fontSize,
    lineHeight: defaults.lineHeight,
    fontFamily: defaults.fontFamily,
    nightLight: defaults.nightLight,
  };
}

export function loadPrefs() {
  const defaults = {
    ...readingAppearanceDefaults(systemTheme()),
    viewMode: 'spread',
    focus: false,
    lastSlug: null,
    seenHint: false,
  };
  try {
    const stored = JSON.parse(localStorage.getItem(prefsKey()) || '{}');
    return {
      ...defaults,
      ...stored,
      theme: normalizeReaderTheme(stored.theme ?? defaults.theme),
    };
  } catch {
    return defaults;
  }
}

export function savePrefs(prefs) {
  return writeStorage(prefsKey(), JSON.stringify(prefs));
}

export function loadProgress(slug) {
  try {
    return JSON.parse(localStorage.getItem(bookKey(slug, 'progress')) || 'null');
  } catch {
    return null;
  }
}

export function saveProgress(slug, data) {
  return writeStorage(
    bookKey(slug, 'progress'),
    JSON.stringify({ ...data, savedAt: Date.now() })
  );
}

export function loadBookmarks(slug) {
  try {
    return JSON.parse(localStorage.getItem(bookKey(slug, 'bookmarks')) || '[]');
  } catch {
    return [];
  }
}

export function saveBookmarks(slug, bookmarks) {
  return writeStorage(bookKey(slug, 'bookmarks'), JSON.stringify(bookmarks));
}

export function normalizeStats(stats = {}) {
  const chapters = Array.isArray(stats.chapters) ? stats.chapters : [];
  const legacyMinutes = Math.max(0, Math.floor(Number(stats.minutes) || 0));
  const active = Number(stats.activeSeconds);
  const hasActiveSeconds = Number.isFinite(active) && active >= 0;
  const activeSeconds = hasActiveSeconds ? Math.floor(active) : null;
  const normalized = {
    ...stats,
    minutes: hasActiveSeconds ? Math.floor(activeSeconds / 60) : legacyMinutes,
    chapters,
  };
  if (hasActiveSeconds) normalized.activeSeconds = activeSeconds;
  else delete normalized.activeSeconds;
  return normalized;
}

export function loadStats(slug) {
  try {
    return normalizeStats({
      minutes: 0,
      chapters: [],
      ...JSON.parse(localStorage.getItem(bookKey(slug, 'stats')) || '{}'),
    });
  } catch {
    return { minutes: 0, chapters: [] };
  }
}

export function saveStats(slug, stats) {
  return writeStorage(bookKey(slug, 'stats'), JSON.stringify(normalizeStats(stats)));
}
