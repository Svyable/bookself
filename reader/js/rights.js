import { fetchDocument, firstExisting } from './base.js';
import { parseBookReadme } from './catalog.js';
import { parseRoute } from './router.js';

const $ = (id) => document.getElementById(id);

function defaultRights() {
  return {
    rights: 'All Rights Reserved',
    aiUse: 'AI training and generative use reserved',
  };
}

export function rightsSummary(meta = {}) {
  const fallback = defaultRights();
  return {
    rights: String(meta.rights || fallback.rights).trim(),
    aiUse: String(meta.aiUse || fallback.aiUse).trim(),
  };
}

async function loadRights(slug) {
  if (!slug) return { ...defaultRights(), url: null };
  let meta = defaultRights();
  try {
    const hub = await fetchDocument(`books/${slug}/README.md`);
    meta = rightsSummary(parseBookReadme(hub.text, slug));
  } catch {
    meta = defaultRights();
  }
  const url = await firstExisting([
    `books/${slug}/RIGHTS.md`,
    'RIGHTS.md',
  ]);
  return { ...meta, url };
}

async function paintRights() {
  const route = parseRoute();
  const slug = route?.slug || '';
  const notice = $('rightsNotice');
  const rightsLink = $('rightsLink');
  if (!notice || !rightsLink) return;

  if (!slug) {
    notice.hidden = true;
    rightsLink.hidden = true;
    rightsLink.removeAttribute('href');
    rightsLink.removeAttribute('title');
    return;
  }

  const meta = await loadRights(slug);
  notice.textContent = `${meta.rights} · ${meta.aiUse}`;
  notice.hidden = false;
  rightsLink.hidden = !meta.url;
  if (meta.url) rightsLink.href = meta.url;
  else rightsLink.removeAttribute('href');
  rightsLink.title = `${meta.rights}. ${meta.aiUse}.`;
}

function requestPaint() {
  queueMicrotask(() => paintRights().catch(() => {}));
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', requestPaint, { once: true });
  } else {
    requestPaint();
  }
  window.addEventListener('hashchange', requestPaint);
  window.addEventListener('popstate', requestPaint);
}