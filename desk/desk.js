import { parseBookReadme, parsePortalCatalog } from '../reader/js/catalog.js';

const state = {
  owner: '',
  repo: '',
  branch: 'main',
  books: [],
  filter: 'all',
  query: '',
};

const $ = (id) => document.getElementById(id);

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function parseRepo(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const github = raw.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
  const pair = github ? `${github[1]}/${github[2]}` : raw.replace(/^https?:\/\//i, '');
  const match = pair.match(/^([^/\s]+)\/([^/\s]+)$/);
  if (!match) return null;
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/i, ''),
  };
}

function repoKey() {
  return `${state.owner}/${state.repo}`;
}

function githubUrl(path = '') {
  return `https://github.com/${state.owner}/${state.repo}${path}`;
}

function apiUrl(path = '') {
  return `https://api.github.com/repos/${state.owner}/${state.repo}${path}`;
}

function rawUrl(path) {
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  return `https://raw.githubusercontent.com/${state.owner}/${state.repo}/${state.branch}/${encodedPath}`;
}

function pagesBase() {
  const userPagesRepo = `${state.owner}.github.io`.toLowerCase();
  if (state.repo.toLowerCase() === userPagesRepo) {
    return `https://${state.owner}.github.io/`;
  }
  return `https://${state.owner}.github.io/${state.repo}/`;
}

async function api(path = '') {
  const response = await fetch(apiUrl(path), {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!response.ok) {
    const error = new Error(`GitHub returned ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

async function rawText(path) {
  const response = await fetch(rawUrl(path), { cache: 'no-store' });
  if (!response.ok) throw new Error(`Could not read ${path}`);
  return response.text();
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

function parseChecklist(markdown) {
  const entries = [];
  const re = /^- \[([ xX])\] \[([^\]]+)\]\((manuscript\/[^)\s]+)\)/gm;
  let match;
  while ((match = re.exec(markdown))) {
    entries.push({
      checked: match[1].toLowerCase() === 'x',
      title: match[2].trim(),
      file: match[3].replace(/^\.\//, ''),
    });
  }
  return entries;
}

function parseChapterCell(value) {
  const match = String(value || '').match(/(\d+)\s+of\s+(\d+)/i);
  return match ? { drafted: Number(match[1]), total: Number(match[2]) } : null;
}

function manuscriptChapters(checklist) {
  return checklist.filter((entry) => /(?:^|\/)ch\d+/i.test(entry.file) || /^ch(?:apter)?\s*\d+/i.test(entry.title));
}

function isPlaceholderBook(meta, markdown) {
  return meta.title === 'Your Book Title'
    || /@your-github-username/i.test(meta.authors)
    || /Start a book:\s*copy this folder/i.test(markdown);
}

function analyzeBook(meta, markdown, cataloged, checklist) {
  const issues = [];
  const chapters = manuscriptChapters(checklist);
  const draftedChapters = chapters.filter((entry) => entry.checked).length;
  const allChecklistDone = checklist.length > 0 && checklist.every((entry) => entry.checked);
  const chapterCell = parseChapterCell(meta.chaptersCell);
  const placeholder = isPlaceholderBook(meta, markdown);

  if (!meta.title || meta.title === meta.slug || meta.title === 'Your Book Title') {
    issues.push({ severity: 'severe', message: 'Replace the placeholder book title.' });
  }
  if (!meta.authors || /@your-github-username/i.test(meta.authors)) {
    issues.push({ severity: 'severe', message: 'Add the real author or authors.' });
  }
  if (!meta.status) {
    issues.push({ severity: 'severe', message: 'Add a Status row to the book README.' });
  }
  if (!checklist.length) {
    issues.push({ severity: 'severe', message: 'Add manuscript files to the Contents checklist.' });
  }
  if (placeholder) {
    issues.push({ severity: 'warn', message: 'Template setup text is still present.' });
  }

  if (chapterCell && (chapterCell.total !== chapters.length || chapterCell.drafted !== draftedChapters)) {
    issues.push({
      severity: 'warn',
      message: `Chapters says “${meta.chaptersCell}”, but the checklist currently shows ${draftedChapters} of ${chapters.length} drafted.`,
    });
  }

  if (meta.published && !cataloged) {
    issues.push({ severity: 'severe', message: 'Status is Published, but the root README does not catalog this book.' });
  }
  if (!meta.published && cataloged) {
    issues.push({ severity: 'severe', message: `The root README catalogs this book, but Status is “${meta.status || 'blank'}”.` });
  }
  if (meta.published && !allChecklistDone) {
    issues.push({ severity: 'warn', message: 'This published book still has unchecked Contents items.' });
  }

  const blockingIssues = issues.filter((issue) => issue.severity === 'severe');
  const ready = !meta.published
    && !cataloged
    && allChecklistDone
    && !placeholder
    && blockingIssues.length === 0;

  let nextStep = '';
  if (meta.published && cataloged) {
    nextStep = 'Published cleanly. Revise the Markdown normally; no version bump is required.';
  } else if (meta.published && !cataloged) {
    nextStep = 'Complete publishing by adding this book to the root README catalog.';
  } else if (!meta.published && cataloged) {
    nextStep = 'Fix the publication mismatch: publish the book or remove its root catalog row.';
  } else if (ready) {
    nextStep = 'Ready for editorial review. Publish with Status → Published and a root README catalog row in the same change.';
  } else if (placeholder) {
    nextStep = 'Finish the book setup: replace template metadata and confirm the manuscript structure.';
  } else if (checklist.length && !allChecklistDone) {
    const remaining = checklist.filter((entry) => !entry.checked).length;
    nextStep = `Keep drafting. ${remaining} Contents item${remaining === 1 ? '' : 's'} remain unchecked.`;
  } else {
    nextStep = 'Review the manuscript hub and resolve the readiness items below.';
  }

  return {
    issues,
    ready,
    checklist,
    chapterCount: chapters.length,
    draftedChapters,
    allChecklistDone,
    nextStep,
  };
}

async function loadBook(directory, catalogSlugs) {
  const slug = directory.name;
  try {
    const markdown = await rawText(`books/${slug}/README.md`);
    const meta = parseBookReadme(markdown, slug);
    const checklist = parseChecklist(markdown);
    const cataloged = catalogSlugs.includes(slug);
    const analysis = analyzeBook(meta, markdown, cataloged, checklist);
    return { ...meta, ...analysis, cataloged, unreadable: false };
  } catch (error) {
    return {
      slug,
      title: slug,
      status: 'Unreadable',
      authors: '',
      tags: [],
      checklist: [],
      chapterCount: 0,
      draftedChapters: 0,
      allChecklistDone: false,
      cataloged: catalogSlugs.includes(slug),
      ready: false,
      unreadable: true,
      nextStep: 'Open the book folder and repair or add its README hub.',
      issues: [{ severity: 'severe', message: 'The desk could not read books/<slug>/README.md.' }],
    };
  }
}

function statusState(book) {
  if (book.published && book.cataloged) return 'published';
  if (book.ready) return 'ready';
  if (/proof/i.test(book.status)) return 'proof';
  return 'drafting';
}

function statusLabel(book) {
  if (book.published && book.cataloged) return 'Published';
  if (book.ready) return 'Ready';
  return book.status || 'Drafting';
}

function chapterProgress(book) {
  if (!book.chapterCount) return 0;
  return Math.round((book.draftedChapters / book.chapterCount) * 100);
}

function bookMeta(book) {
  const items = [];
  if (book.series) items.push(`Series: ${book.series}`);
  if (book.publisher) items.push(`Publisher: ${book.publisher}`);
  if (book.edition) items.push(`Edition: ${book.edition}`);
  if (book.tags?.length) items.push(`Tags: ${book.tags.join(', ')}`);
  return items;
}

function chapterEditUrl(book, chapter) {
  return githubUrl(`/edit/${encodeURIComponent(state.branch)}/books/${encodeURIComponent(book.slug)}/${chapter.file.split('/').map(encodeURIComponent).join('/')}`);
}

function renderChapters(card, book) {
  const list = card.querySelector('.chapter-list');
  const summary = card.querySelector('.chapter-summary');
  summary.textContent = `${book.checklist.filter((entry) => entry.checked).length}/${book.checklist.length} complete`;

  if (!book.checklist.length) {
    list.innerHTML = '<li class="chapter-item"><span class="chapter-title">No Contents checklist found.</span></li>';
    return;
  }

  list.innerHTML = book.checklist.map((chapter) => `
    <li class="chapter-item ${chapter.checked ? 'done' : ''}">
      <span class="chapter-state" aria-hidden="true">${chapter.checked ? '✓' : ''}</span>
      <span class="chapter-title">${escapeHtml(chapter.title)}<small class="chapter-file">${escapeHtml(chapter.file)}</small></span>
      <a class="chapter-edit" href="${chapterEditUrl(book, chapter)}" target="_blank" rel="noopener">Edit</a>
    </li>`).join('');
}

function renderBook(book) {
  const template = $('bookCardTemplate');
  const card = template.content.firstElementChild.cloneNode(true);
  card.dataset.slug = book.slug;
  card.dataset.state = statusState(book);
  card.dataset.issues = String(book.issues.length);
  card.dataset.search = `${book.title} ${book.authors} ${book.status} ${(book.tags || []).join(' ')}`.toLowerCase();

  const chip = card.querySelector('.status-chip');
  chip.textContent = statusLabel(book);
  chip.dataset.state = statusState(book);

  const health = card.querySelector('.health-chip');
  if (book.issues.length) {
    health.hidden = false;
    health.textContent = `${book.issues.length} issue${book.issues.length === 1 ? '' : 's'}`;
  }

  card.querySelector('.book-title').textContent = book.title;
  card.querySelector('.book-authors').textContent = book.authors || 'Author not set';
  card.querySelector('.completion-value').textContent = `${book.draftedChapters}/${book.chapterCount}`;
  card.querySelector('.progress-track span').style.width = `${chapterProgress(book)}%`;
  card.querySelector('.book-next-step').innerHTML = `<strong>Next:</strong> ${escapeHtml(book.nextStep)}`;

  const issueList = card.querySelector('.issue-list');
  issueList.innerHTML = book.issues.map((issue) => `<li class="${issue.severity === 'severe' ? 'severe' : ''}">${escapeHtml(issue.message)}</li>`).join('');

  const meta = bookMeta(book);
  card.querySelector('.book-meta').innerHTML = meta.map((item) => `<span>${escapeHtml(item)}</span>`).join('');

  card.querySelector('.preview-action').href = `${pagesBase()}reader/#/b/${encodeURIComponent(book.slug)}/`;
  card.querySelector('.edit-action').href = githubUrl(`/edit/${encodeURIComponent(state.branch)}/books/${encodeURIComponent(book.slug)}/README.md`);
  card.querySelector('.folder-action').href = githubUrl(`/tree/${encodeURIComponent(state.branch)}/books/${encodeURIComponent(book.slug)}`);
  card.querySelector('.history-action').href = githubUrl(`/commits/${encodeURIComponent(state.branch)}/books/${encodeURIComponent(book.slug)}/README.md`);

  renderChapters(card, book);
  return card;
}

function matchesFilter(book) {
  if (state.filter === 'all') return true;
  if (state.filter === 'published') return book.published && book.cataloged;
  if (state.filter === 'ready') return book.ready;
  if (state.filter === 'issues') return book.issues.length > 0;
  if (state.filter === 'drafting') return !book.published && !book.ready;
  return true;
}

function renderBooks() {
  const list = $('manuscriptList');
  const query = state.query.trim().toLowerCase();
  const visible = state.books.filter((book) => {
    const search = `${book.title} ${book.authors} ${book.status} ${(book.tags || []).join(' ')}`.toLowerCase();
    return matchesFilter(book) && (!query || search.includes(query));
  });

  list.replaceChildren(...visible.map(renderBook));
  $('deskEmpty').hidden = visible.length > 0;
}

function renderSummary() {
  $('summaryBooks').textContent = String(state.books.length);
  $('summaryPublished').textContent = String(state.books.filter((book) => book.published && book.cataloged).length);
  $('summaryReady').textContent = String(state.books.filter((book) => book.ready).length);
  $('summaryIssues').textContent = String(state.books.filter((book) => book.issues.length > 0).length);
}

function configureRepoLinks(meta) {
  const branch = encodeURIComponent(state.branch);
  $('repoName').textContent = repoKey();
  $('repoDescription').textContent = meta.description || 'Git-native books and publishing workflow.';
  $('repoBranch').textContent = state.branch;
  $('repoLink').href = meta.html_url || githubUrl();
  $('readerLink').href = `${pagesBase()}reader/`;
  $('startBookLink').href = githubUrl(`/tree/${branch}/books/_TEMPLATE`);
  $('authorGuideLink').href = 'https://github.com/Svyable/bookself/blob/main/docs/author-guide.md';
  $('rootEditLink').href = githubUrl(`/edit/${branch}/README.md`);
}

function showLoading(message = 'Reading repository metadata and manuscript hubs.') {
  const status = $('deskStatus');
  status.hidden = false;
  status.classList.remove('error');
  status.innerHTML = `
    <div class="status-spinner" aria-hidden="true"></div>
    <div><strong>Opening the publishing desk…</strong><span>${escapeHtml(message)}</span></div>`;
}

function showError(error) {
  const status = $('deskStatus');
  status.hidden = false;
  status.classList.add('error');
  const privateHint = error?.status === 404
    ? 'This repository may be private or may not exist. The web desk deliberately does not request a GitHub token; use GitHub directly for private binders.'
    : 'GitHub could not be reached. Check the repository name or try again after the API rate limit resets.';
  status.innerHTML = `<div><strong>Could not open ${escapeHtml(repoKey())}.</strong><span>${escapeHtml(privateHint)}</span></div>`;
  ['repoOverview', 'summaryGrid', 'deskControls'].forEach((id) => { $(id).hidden = true; });
  $('manuscriptList').replaceChildren();
}

async function loadWorkspace(repo) {
  state.owner = repo.owner;
  state.repo = repo.repo;
  state.books = [];
  state.query = '';
  state.filter = 'all';
  $('bookSearch').value = '';
  document.querySelectorAll('[data-filter]').forEach((button) => {
    const active = button.dataset.filter === 'all';
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  $('repoInput').value = repoKey();
  showLoading();

  try {
    const meta = await api();
    state.branch = meta.default_branch || 'main';
    const [directories, portalMarkdown] = await Promise.all([
      api(`/contents/books?ref=${encodeURIComponent(state.branch)}`),
      rawText('README.md').catch(() => ''),
    ]);

    const catalogSlugs = parsePortalCatalog(portalMarkdown || '');
    const bookDirectories = directories.filter((item) => item.type === 'dir' && item.name !== '_TEMPLATE');

    showLoading(`Reading ${bookDirectories.length} manuscript hub${bookDirectories.length === 1 ? '' : 's'}…`);
    state.books = await mapLimit(bookDirectories, 6, (directory) => loadBook(directory, catalogSlugs));
    state.books.sort((a, b) => a.title.localeCompare(b.title));

    configureRepoLinks(meta);
    renderSummary();
    renderBooks();
    $('repoOverview').hidden = false;
    $('summaryGrid').hidden = false;
    $('deskControls').hidden = false;
    $('deskStatus').hidden = true;

    document.title = `Publishing Desk · ${repoKey()}`;
    const params = new URLSearchParams(location.search);
    params.set('repo', repoKey());
    history.replaceState(null, '', `${location.pathname}?${params.toString()}`);
  } catch (error) {
    console.error('Publishing Desk could not load repository', error);
    showError(error);
  }
}

async function defaultRepo() {
  const params = new URLSearchParams(location.search);
  const fromQuery = parseRepo(params.get('repo'));
  if (fromQuery) return fromQuery;

  try {
    const response = await fetch('../imprint.json', { cache: 'no-store' });
    if (response.ok) {
      const imprint = await response.json();
      if (imprint.github?.owner && imprint.github?.repo) {
        return { owner: imprint.github.owner, repo: imprint.github.repo };
      }
    }
  } catch {
    // Fall back to the source repository below.
  }
  return { owner: 'Svyable', repo: 'bookself' };
}

function bindUi() {
  $('repoForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const repo = parseRepo($('repoInput').value);
    if (!repo) {
      $('repoInput').focus();
      $('repoInput').setCustomValidity('Use owner/repository or a GitHub repository URL.');
      $('repoInput').reportValidity();
      return;
    }
    $('repoInput').setCustomValidity('');
    loadWorkspace(repo);
  });

  $('repoInput').addEventListener('input', () => $('repoInput').setCustomValidity(''));

  $('bookSearch').addEventListener('input', (event) => {
    state.query = event.target.value;
    renderBooks();
  });

  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      state.filter = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      renderBooks();
    });
  });
}

bindUi();
loadWorkspace(await defaultRepo());
