import { fetchText, fileUrl } from './base.js';
import { migrateReaderPersonalization } from './presentation.js';

export const DEFAULT_IMPRINT = {
  role: 'instance',
  name: 'Bookself',
  shortName: 'Bookself',
  description: 'A Git-native bookshelf for Markdown books.',
  kicker: 'Written in Markdown · Read like a book',
  lede: 'Books live in this repository. The reader and publishing desk are shared Bookself software.',
  credit: '',
  creditHref: '',
  writeHref: '../desk/',
  writeLabel: 'Publishing desk',
  forkHref: '',
  forkLabel: '',
  homeLabel: 'Books',
  storagePrefix: 'bookself',
  readerStyles: [],
  steps: [
    { n: '1', title: 'Start', body: 'Copy books/_TEMPLATE to books/your-title' },
    { n: '2', title: 'Write', body: 'Keep the manuscript in plain Markdown' },
    { n: '3', title: 'Preview', body: 'Use the reader before publishing' },
    { n: '4', title: 'Publish', body: 'Promote finished work from a private binder to a public shelf' },
  ],
  github: { owner: '', repo: '' },
};

function inferGithubFromLocation() {
  const host = String(location.hostname || '').toLowerCase();
  if (!host.endsWith('.github.io')) return { owner: '', repo: '' };

  const owner = host.slice(0, -'.github.io'.length);
  const firstPath = location.pathname.split('/').filter(Boolean)[0] || '';
  const repo = firstPath || `${owner}.github.io`;
  return owner && repo ? { owner, repo } : { owner: '', repo: '' };
}

function resolveGithub(value = {}) {
  const configured = {
    owner: String(value.owner || '').trim(),
    repo: String(value.repo || '').trim(),
  };
  const inferred = inferGithubFromLocation();
  const wantsAuto = configured.owner === 'auto' || configured.repo === 'auto';

  if (wantsAuto) return inferred;
  if (configured.owner && configured.repo) return configured;
  return inferred;
}

export function normalizeReaderStyles(value) {
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

function applyReaderStyles(styles) {
  document.querySelectorAll('link[data-bookself-instance-style]').forEach((node) => node.remove());
  for (const path of normalizeReaderStyles(styles)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fileUrl(path);
    link.dataset.bookselfInstanceStyle = path;
    document.head.appendChild(link);
  }
}

function installShelfNavigation(imprint) {
  const headerLeft = document.querySelector('.header-left');
  const logo = document.getElementById('logoBtn');
  if (!headerLeft || !logo) return;

  let shelf = document.getElementById('shelfHomeBtn');
  if (!shelf) {
    shelf = document.createElement('button');
    shelf.id = 'shelfHomeBtn';
    shelf.type = 'button';
    shelf.className = 'reader-shelf-home';
    shelf.addEventListener('click', () => {
      if (location.hash === '#/' || location.hash === '') return;
      location.hash = '#/';
    });
    logo.insertAdjacentElement('afterend', shelf);
  }

  const role = String(imprint.role || 'instance').toLowerCase();
  shelf.textContent = role === 'binder' ? 'Back to Binder' : 'Back to Shelf';
  shelf.title = shelf.textContent;
  shelf.setAttribute('aria-label', shelf.textContent);

  if (!document.getElementById('readerShelfHomeStyle')) {
    const style = document.createElement('style');
    style.id = 'readerShelfHomeStyle';
    style.textContent = `
      .reader-shelf-home {
        appearance: none;
        border: 0;
        border-left: 1px solid var(--border);
        margin-left: .2rem;
        padding: .25rem 0 .25rem .75rem;
        background: transparent;
        color: var(--text-secondary);
        cursor: pointer;
        font: 600 .76rem/1.2 var(--font-accent);
        letter-spacing: .02em;
      }
      .reader-shelf-home:hover,
      .reader-shelf-home:focus-visible { color: var(--accent); }
      body[data-stage="binder"] .reader-shelf-home { visibility: hidden; }
      @media (max-width: 560px) {
        .reader-shelf-home { font-size: .7rem; padding-left: .55rem; }
      }
    `;
    document.head.appendChild(style);
  }
}

function emptyLibraryText(role) {
  if (role === 'binder') {
    return 'No manuscripts yet. Start one from a blank template in books/, keep it Drafting, and preview it here before release.';
  }
  if (role === 'shelf') {
    return 'No released publications yet. Keep drafts in the private Binder, then release a committed snapshot to this public Shelf when it is ready.';
  }
  if (role === 'platform') {
    return 'No platform examples are listed yet. Add published specimen content under books/ to demonstrate Bookself without using a private Binder.';
  }
  return 'No publications are listed yet.';
}

export async function loadImprint() {
  try {
    const data = JSON.parse(await fetchText('imprint.json'));
    return {
      ...DEFAULT_IMPRINT,
      ...data,
      github: resolveGithub(data.github || {}),
      readerStyles: normalizeReaderStyles(data.readerStyles),
      steps: Array.isArray(data.steps) ? data.steps : DEFAULT_IMPRINT.steps,
    };
  } catch {
    return { ...DEFAULT_IMPRINT, github: inferGithubFromLocation() };
  }
}

export function applyImprint(imprint) {
  window.__IMPRINT = imprint;
  migrateReaderPersonalization();
  document.title = imprint.name;
  document.documentElement.dataset.bookselfRole = imprint.role || 'instance';
  applyReaderStyles(imprint.readerStyles);
  installShelfNavigation(imprint);

  const apple = document.querySelector('meta[name="apple-mobile-web-app-title"]');
  if (apple) apple.setAttribute('content', imprint.shortName);
  const desc = document.querySelector('meta[name="description"]');
  if (desc && imprint.description) desc.setAttribute('content', imprint.description);
  const h1 = document.querySelector('.binder-hero h1');
  if (h1) h1.textContent = imprint.name;
  const kicker = document.querySelector('.binder-kicker');
  if (kicker) kicker.textContent = imprint.kicker;
  const lede = document.querySelector('.binder-lede');
  if (lede) {
    lede.textContent = imprint.lede;
    if (imprint.credit && imprint.creditHref) {
      lede.append(' ');
      const a = document.createElement('a');
      a.href = imprint.creditHref;
      a.textContent = imprint.credit;
      lede.appendChild(a);
      lede.append('.');
    }
  }
  const write = document.getElementById('writeLink');
  if (write) {
    if (imprint.writeHref && imprint.writeLabel) {
      write.hidden = false;
      write.href = imprint.writeHref;
      write.textContent = imprint.writeLabel;
    } else {
      write.hidden = true;
    }
  }
  const fork = document.getElementById('forkLink');
  if (fork) {
    if (imprint.forkHref && imprint.forkLabel) {
      fork.hidden = false;
      fork.href = imprint.forkHref;
      fork.textContent = imprint.forkLabel;
    } else {
      fork.hidden = true;
    }
  }
  const emptyShelf = document.getElementById('emptyShelf');
  if (emptyShelf) emptyShelf.textContent = emptyLibraryText(imprint.role);
  const home = document.getElementById('homeFromEnd');
  if (home) home.textContent = imprint.homeLabel;
  const logo = document.getElementById('logoBtn');
  if (logo) {
    logo.title = imprint.name;
    logo.setAttribute('aria-label', imprint.name);
  }
  const steps = document.getElementById('howSteps');
  if (steps) {
    const list = imprint.steps;
    if (!list || !list.length) {
      steps.hidden = true;
      steps.innerHTML = '';
    } else {
      steps.hidden = false;
      steps.innerHTML = list.map((s) => (
        `<li><span class="how-n">${esc(s.n || '')}</span><strong>${esc(s.title || '')}</strong> ${esc(s.body || '')}</li>`
      )).join('');
    }
  }
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function imprintName() {
  return window.__IMPRINT?.name || DEFAULT_IMPRINT.name;
}

export function imprintGithub() {
  const configured = window.__IMPRINT?.github;
  if (configured?.owner && configured?.repo) return configured;
  return inferGithubFromLocation();
}

export function storagePrefix() {
  return window.__IMPRINT?.storagePrefix || DEFAULT_IMPRINT.storagePrefix;
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  import('./presentation-runtime.js').catch((error) => {
    console.warn('Reader presentation defaults could not be loaded', error);
  });
}
