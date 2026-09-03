const hubCache = new Map();
let catalogPromise = null;
let updateEpoch = 0;

function rootUrl(relativePath) {
  return new URL(`../${String(relativePath).replace(/^\/+/, '')}`, window.location.href).href;
}

export function parseCatalogSlugs(text) {
  const raw = String(text || '').trim();
  if (!raw) return [];

  try {
    const data = JSON.parse(raw);
    if (data?.version === 1 && Array.isArray(data.books)) {
      return [...new Set(data.books
        .map((slug) => String(slug || '').trim())
        .filter((slug) => /^[a-z0-9][a-z0-9-]*$/.test(slug) && slug !== '_TEMPLATE'))];
    }
  } catch {
    // Fall through to the legacy README parser.
  }

  const match = /^##\s+The books\s*$/im.exec(raw);
  const section = match
    ? raw.slice(match.index + match[0].length).split(/^##\s+/m, 1)[0]
    : raw;
  const slugs = [];
  const re = /\]\((?:\.\/)?books\/([a-z0-9][a-z0-9-]*)\/?\)/gi;
  let found;
  while ((found = re.exec(section))) {
    const slug = found[1].toLowerCase();
    if (slug !== '_template' && !slugs.includes(slug)) slugs.push(slug);
  }
  return slugs;
}

export function parsePublicationHub(markdown, slug = '') {
  const text = String(markdown || '');
  const title = text.match(/^#\s+(.+?)\s*$/m)?.[1]?.trim() || slug;
  const status = text.match(/\|\s*\*\*Status\*\*\s*\|\s*([^|\n]+)\|/i)?.[1]?.trim() || '';
  return { slug, title, published: status === 'Published' };
}

export function nextCandidateOrder(slugs, currentSlug) {
  const unique = [...new Set((slugs || []).filter(Boolean))];
  if (unique.length < 2) return [];
  const index = unique.indexOf(currentSlug);
  if (index < 0) return unique;
  const rotated = unique.slice(index + 1).concat(unique.slice(0, index));
  return rotated.filter((slug) => slug !== currentSlug);
}

function currentSlug() {
  const hash = String(window.location.hash || '');
  const match = hash.match(/^#\/b\/([a-z0-9][a-z0-9-]*)/i);
  if (match) return match[1].toLowerCase();
  const query = new URLSearchParams(window.location.search).get('b');
  return /^[a-z0-9][a-z0-9-]*$/i.test(query || '') ? query.toLowerCase() : '';
}

async function fetchText(url) {
  const response = await fetch(url, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Could not load ${url} (${response.status})`);
  return response.text();
}

async function loadCatalog() {
  if (!catalogPromise) {
    catalogPromise = (async () => {
      try {
        const manifest = await fetchText(rootUrl('catalog.json'));
        const slugs = parseCatalogSlugs(manifest);
        if (slugs.length) return slugs;
      } catch {
        // Legacy Bookself instances may not have catalog.json.
      }
      try {
        return parseCatalogSlugs(await fetchText(rootUrl('README.md')));
      } catch {
        return [];
      }
    })();
  }
  return catalogPromise;
}

async function loadHub(slug) {
  if (!hubCache.has(slug)) {
    hubCache.set(slug, fetchText(rootUrl(`books/${slug}/README.md`))
      .then((markdown) => parsePublicationHub(markdown, slug))
      .catch(() => ({ slug, title: slug, published: false })));
  }
  return hubCache.get(slug);
}

async function findNextPublished(current) {
  const slugs = await loadCatalog();
  for (const slug of nextCandidateOrder(slugs, current)) {
    const hub = await loadHub(slug);
    if (hub.published) return hub;
  }
  return null;
}

function ensureUi() {
  const host = document.querySelector('#backCover .cover-front');
  const reread = document.getElementById('rereadBtn');
  if (!host || !reread) return null;

  let block = document.getElementById('readNextBlock');
  if (!block) {
    block = document.createElement('div');
    block.id = 'readNextBlock';
    block.hidden = true;
    block.innerHTML = `
      <p class="cover-kicker">Next on the shelf</p>
      <button class="start-btn" id="readNextBtn" type="button"></button>
    `;
    host.insertBefore(block, reread);
    const button = block.querySelector('#readNextBtn');
    button?.addEventListener('click', () => {
      const slug = button.dataset.slug;
      if (!slug) return;
      window.location.hash = `#/b/${slug}/`;
    });
  }

  reread.classList.remove('start-btn');
  reread.classList.add('cover-text-btn');
  return block;
}

function hideUi() {
  const block = document.getElementById('readNextBlock');
  if (block) block.hidden = true;
}

async function updateUi() {
  const run = ++updateEpoch;
  if (document.body?.dataset.stage !== 'end') {
    hideUi();
    return;
  }
  const slug = currentSlug();
  if (!slug) {
    hideUi();
    return;
  }

  const block = ensureUi();
  const button = document.getElementById('readNextBtn');
  if (!block || !button) return;
  block.hidden = true;

  const next = await findNextPublished(slug);
  if (run !== updateEpoch || document.body?.dataset.stage !== 'end' || currentSlug() !== slug) return;
  if (!next) {
    block.hidden = true;
    return;
  }

  button.dataset.slug = next.slug;
  button.textContent = `Read next — ${next.title}`;
  button.setAttribute('aria-label', `Read next: ${next.title}`);
  block.hidden = false;
}

export function installReadNext() {
  if (typeof window === 'undefined' || typeof document === 'undefined' || !document.body) return;
  if (document.body.dataset.readNextInstalled === 'true') return;
  document.body.dataset.readNextInstalled = 'true';

  const observer = new MutationObserver(() => updateUi());
  observer.observe(document.body, { attributes: true, attributeFilter: ['data-stage'] });
  window.addEventListener('hashchange', updateUi);
  window.addEventListener('popstate', updateUi);
  updateUi();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installReadNext, { once: true });
  } else {
    installReadNext();
  }
}
