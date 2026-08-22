/** Hash routes: #/  #/b/<slug>/  #/b/<slug>/<chapter>/<offset> */

export function parseHash(hash = window.location.hash) {
  const raw = (hash || '#/').replace(/^#/, '');
  const parts = raw.split('/').filter(Boolean);
  if (parts[0] !== 'b' || !parts[1]) {
    return { view: 'binder', slug: null, chapter: null, offset: 0 };
  }
  const slug = parts[1];
  const chapter = parts[2] || null;
  const offset = parts[3] ? Math.max(0, parseInt(parts[3], 10) || 0) : 0;
  if (!chapter) return { view: 'cover', slug, chapter: null, offset: 0 };
  return { view: 'read', slug, chapter, offset };
}

export function binderHash() {
  return '#/';
}

export function coverHash(slug) {
  return `#/b/${encodeURIComponent(slug)}/`;
}

export function readHash(slug, chapter, offset = 0) {
  return `#/b/${encodeURIComponent(slug)}/${encodeURIComponent(chapter)}/${Math.max(0, offset | 0)}`;
}

function withHash(hash) {
  return hash.startsWith('#') ? hash : `#${hash}`;
}

export function go(hash, { replace = false } = {}) {
  const next = withHash(hash);
  if (window.location.hash === next || (next === '#/' && window.location.hash === '')) {
    return;
  }
  if (replace) {
    const url = `${window.location.pathname}${window.location.search}${next}`;
    history.replaceState(null, '', url);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    return;
  }
  window.location.hash = next.slice(1);
}
