import { fetchText, firstExisting } from './base.js';
import {
  parsePortalCatalog,
  parseBookReadme,
  parseFrontMatterMeta,
  clothColor,
} from './catalog.js';
import { blocksFromMarkdown } from './markdown.js';
import { paginateBlocks, pageIndexForOffset } from './paginate.js';
import {
  loadPrefs,
  savePrefs,
  loadProgress,
  saveProgress,
  loadBookmarks,
  saveBookmarks,
  loadStats,
  saveStats,
} from './storage.js';
import { parseHash, binderHash, coverHash, readHash, go } from './router.js';

const app = {
  prefs: loadPrefs(),
  catalog: [],
  books: new Map(),
  slug: null,
  book: null,
  pages: [],
  pageIndex: 0,
  isMobile: window.innerWidth <= 780,
  sessionBook: null,
  statsTimer: null,
  touchStartX: null,
  toastTimer: null,
};

function $(id) {
  return document.getElementById(id);
}

function applyPrefs() {
  document.documentElement.setAttribute('data-theme', app.prefs.theme);
  document.documentElement.style.setProperty('--base-font-size', `${app.prefs.fontSize}px`);
  $('nightLightOverlay').classList.toggle('active', !!app.prefs.nightLight);
  $('nightLightBtn')?.classList.toggle('active', !!app.prefs.nightLight);
  $('viewModeBtn').textContent = app.prefs.viewMode === 'spread' ? 'Single' : 'Spread';
}

function spreadOn() {
  return !app.isMobile && app.prefs.viewMode === 'spread';
}

async function loadCatalog() {
  const md = await fetchText('README.md');
  const slugs = parsePortalCatalog(md);
  const entries = [];
  for (const slug of slugs) {
    try {
      const hub = await fetchText(`books/${slug}/README.md`);
      const meta = parseBookReadme(hub, slug);
      if (meta.published) entries.push(meta);
    } catch (err) {
      console.warn('Skip catalog slug', slug, err);
    }
  }
  app.catalog = entries;
  return entries;
}

async function loadBook(slug) {
  if (app.books.has(slug)) return app.books.get(slug);
  const hub = await fetchText(`books/${slug}/README.md`);
  const meta = parseBookReadme(hub, slug);
  let fm = { title: meta.title, subtitle: '', year: '' };
  const chapters = await Promise.all(
    meta.contents.map(async (c) => {
      const markdown = await fetchText(`books/${slug}/${c.file}`);
      return { ...c, markdown };
    })
  );
  const front = chapters.find((c) => c.id === 'front-matter');
  if (front) fm = { ...fm, ...parseFrontMatterMeta(front.markdown) };
  const cover = await firstExisting(
    ['cover.png', 'cover.jpg', 'cover.webp', 'cover.jpeg'].map(
      (name) => `books/${slug}/media/${name}`
    )
  );
  const book = { ...meta, title: fm.title || meta.title, subtitle: fm.subtitle, year: fm.year, cover, chapters };
  app.books.set(slug, book);
  return book;
}

function sizeMeasure() {
  const sample = $('pageLeft');
  const box = $('pageMeasure');
  const host = $('pagesWrapper');
  const w = spreadOn() ? Math.floor((host.clientWidth - 10) / 2) : host.clientWidth;
  const h = host.clientHeight;
  box.style.width = `${Math.max(w, 200)}px`;
  box.style.height = `${Math.max(h, 240)}px`;
  if (sample) {
    const cs = getComputedStyle(sample);
    box.style.padding = cs.padding;
    box.style.fontFamily = cs.fontFamily;
  }
}

function rebuildPages() {
  if (!app.book) return;
  sizeMeasure();
  const box = $('pageMeasureInner');
  const pages = [];
  for (const ch of app.book.chapters) {
    const blocks = blocksFromMarkdown(ch.markdown, app.book.slug);
    pages.push(...paginateBlocks(ch.id, blocks, box));
  }
  app.pages = pages;
}

function chapterOfPage(i) {
  return app.pages[i]?.chapter || app.book?.contents[0]?.id || '';
}

function currentOffset() {
  return app.pages[app.pageIndex]?.start || 0;
}

function persist() {
  if (!app.slug || !app.pages.length) return;
  saveProgress(app.slug, {
    chapter: chapterOfPage(app.pageIndex),
    offset: currentOffset(),
    pageIndex: app.pageIndex,
  });
  updateProgressUi();
}

function percentRead() {
  if (!app.pages.length) return 0;
  return Math.round((app.pageIndex / Math.max(app.pages.length - 1, 1)) * 100);
}

function updateProgressUi() {
  const pct = percentRead();
  $('progressBarFill').style.width = `${pct}%`;
  $('progressPercent').textContent = `${pct}%`;
  const ch = app.pages[app.pageIndex];
  const meta = app.book?.contents.find((c) => c.id === ch?.chapter);
  $('currentChapter').textContent = meta?.title || '—';
  const showTwo = spreadOn() && app.pageIndex < app.pages.length - 1;
  $('currentPage').textContent = showTwo
    ? `${app.pageIndex + 1}–${app.pageIndex + 2}`
    : `${app.pageIndex + 1}`;
  $('totalPages').textContent = String(app.pages.length);
  $('prevBtn').disabled = app.pageIndex <= 0;
  $('nextBtn').disabled = false;
  const marks = loadBookmarks(app.slug);
  const here = marks.some((m) => m.chapter === ch?.chapter && m.offset === ch?.start);
  $('bookmarkBtn').classList.toggle('active', here);
}

function isChapterOpen(html) {
  return /^\s*<h1[\s>]/i.test(html || '');
}

function fillPage(el, page, num, side, two) {
  const inner = el.querySelector('.page-inner');
  inner.innerHTML = page ? page.html : '';
  inner.classList.toggle('chapter-open', !!(page && isChapterOpen(page.html)));
  el.querySelector('.page-num').textContent = page ? String(num) : '';
  el.classList.toggle('left', two && side === 'left');
  el.classList.toggle('right', !two || side === 'right');
}

function paintPages() {
  const left = $('pageLeft');
  const right = $('pageRight');
  const two = spreadOn();
  const a = app.pages[app.pageIndex];
  const b = two ? app.pages[app.pageIndex + 1] : null;
  left.classList.add('active', 'turning');
  fillPage(left, a, app.pageIndex + 1, 'left', two);
  if (two && b) {
    right.classList.add('active', 'turning');
    fillPage(right, b, app.pageIndex + 2, 'right', two);
  } else {
    right.classList.remove('active');
    fillPage(right, null, 0, 'right', two);
  }
  setTimeout(() => {
    left.classList.remove('turning');
    right.classList.remove('turning');
  }, 280);
  updateProgressUi();
  fillToc(app.book);
  setTitle();
}

function showStage(name) {
  document.body.dataset.stage = name;
  $('binderView').hidden = name !== 'binder';
  $('coverPage').hidden = name !== 'cover';
  $('coverPage').classList.toggle('opened', name !== 'cover');
  $('pagesWrapper').classList.toggle('active', name === 'read');
  $('backCover').classList.toggle('show', name === 'end');
  $('pageNav').hidden = name !== 'read';
  $('readerChrome').classList.toggle('is-reading', name === 'read');
}

function setTitle() {
  const book = app.book;
  if (!book) {
    document.title = 'Open Book Binder';
    return;
  }
  const stage = document.body.dataset.stage;
  if (stage === 'read') {
    const meta = app.book.contents.find((c) => c.id === chapterOfPage(app.pageIndex));
    document.title = meta ? `${meta.title} — ${book.title}` : book.title;
    return;
  }
  document.title = book.title;
}

function fillCover(book, { draft }) {
  $('coverTitle').textContent = book.title;
  $('coverSubtitle').textContent = book.subtitle || '';
  $('coverAuthor').textContent = book.authors ? `by ${book.authors.replace(/@/g, '')}` : '';
  $('coverYear').textContent = book.year || '';
  $('draftBadge').hidden = !draft;
  const face = $('coverFront');
  face.style.setProperty('--cloth', clothColor(book.slug));
  if (book.cover) {
    face.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.55)), url("${book.cover}")`;
    face.classList.add('has-art');
  } else {
    face.style.backgroundImage = '';
    face.classList.remove('has-art');
  }
  $('backTitle').textContent = book.title;
  $('backAuthor').textContent = book.authors ? book.authors.replace(/@/g, '') : '';
  const prog = loadProgress(book.slug);
  const canContinue = !!(prog && book.contents.some((c) => c.id === prog.chapter));
  $('continueBtn').hidden = !canContinue;
  setTitle();
}

function fillToc(book) {
  if (!book) return;
  const list = $('tocList');
  const current = chapterOfPage(app.pageIndex);
  list.innerHTML = '';
  for (const c of book.contents) {
    const li = document.createElement('li');
    li.className = 'toc-item';
    const a = document.createElement('a');
    a.className = 'toc-link';
    if (c.id === current) a.classList.add('is-current');
    a.href = readHash(book.slug, c.id, 0);
    a.textContent = c.title;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      $('tocOverlay').classList.remove('active');
      go(readHash(book.slug, c.id, 0));
    });
    li.appendChild(a);
    list.appendChild(li);
  }
  const marks = loadBookmarks(book.slug);
  const box = $('tocMarks');
  const ul = $('bookmarkList');
  ul.innerHTML = '';
  box.hidden = marks.length === 0;
  for (const m of marks) {
    const meta = book.contents.find((c) => c.id === m.chapter);
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'toc-link';
    a.href = readHash(book.slug, m.chapter, m.offset);
    a.textContent = meta ? meta.title : m.chapter;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      $('tocOverlay').classList.remove('active');
      go(readHash(book.slug, m.chapter, m.offset));
    });
    li.appendChild(a);
    ul.appendChild(li);
  }
}

function renderShelf(entries) {
  const shelf = $('shelf');
  const empty = $('emptyShelf');
  shelf.innerHTML = '';
  empty.hidden = entries.length > 0;
  for (const book of entries) {
    const a = document.createElement('a');
    a.className = 'volume';
    a.href = coverHash(book.slug);
    a.style.setProperty('--cloth', clothColor(book.slug));
    const progress = loadProgress(book.slug);
    const last = app.prefs.lastSlug === book.slug;
    a.classList.toggle('is-reading', !!(progress || last));
    a.innerHTML = `
      <span class="volume-spine"></span>
      <span class="volume-cover">
        ${progress || last ? '<span class="reading-ribbon">Reading</span>' : ''}
        <span class="volume-title">${escapeHtml(book.title)}</span>
        <span class="volume-author">${escapeHtml((book.authors || '').replace(/@/g, ''))}</span>
      </span>`;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      go(coverHash(book.slug));
    });
    shelf.appendChild(a);
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function rememberBook(slug) {
  app.prefs.lastSlug = slug;
  savePrefs(app.prefs);
}

function setLoader(on) {
  $('loader').hidden = !on;
}

async function openCover(slug) {
  setLoader(true);
  try {
    const book = await loadBook(slug);
    app.slug = slug;
    app.book = book;
    rememberBook(slug);
    fillCover(book, { draft: !book.published });
    fillToc(book);
    showStage('cover');
  } finally {
    setLoader(false);
  }
}

async function openRead(slug, chapter, offset) {
  setLoader(true);
  try {
    const book = await loadBook(slug);
    app.slug = slug;
    app.book = book;
    rememberBook(slug);
    fillCover(book, { draft: !book.published });
    fillToc(book);
    showStage('read');
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    rebuildPages();
    const ch = chapter && book.contents.some((c) => c.id === chapter)
      ? chapter
      : book.contents[0]?.id;
    app.pageIndex = pageIndexForOffset(app.pages, ch, offset || 0);
    paintPages();
    persist();
    startSession();
    markChapter(ch);
  } finally {
    setLoader(false);
  }
}

function openEnd() {
  showStage('end');
}

function startSession() {
  if (app.sessionBook === app.slug) {
    renderStats();
    return;
  }
  app.sessionBook = app.slug;
  if (app.statsTimer) clearInterval(app.statsTimer);
  app.statsTimer = setInterval(() => tickStats(), 60000);
  renderStats();
}

function tickStats() {
  if (!app.slug) return;
  const stats = loadStats(app.slug);
  stats.minutes = (stats.minutes || 0) + 1;
  saveStats(app.slug, stats);
  renderStats();
}

function markChapter(id) {
  if (!app.slug || !id) return;
  const stats = loadStats(app.slug);
  if (!stats.chapters.includes(id)) stats.chapters.push(id);
  saveStats(app.slug, stats);
}

function renderStats() {
  if (!app.slug) return;
  const stats = loadStats(app.slug);
  const pct = percentRead();
  $('statsPercent').textContent = `${pct}%`;
  $('pagesRead').textContent = String(app.pageIndex + 1);
  $('chaptersRead').textContent = String((stats.chapters || []).length);
  const m = stats.minutes || 0;
  $('timeSpent').textContent = m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
  $('readingTime').textContent = $('timeSpent').textContent;
  $('statsCircle').style.setProperty('--pct', String(pct));
}

function turn(delta) {
  if (document.body.dataset.stage !== 'read') return;
  const step = spreadOn() ? 2 : 1;
  const next = app.pageIndex + delta * step;
  if (next >= app.pages.length) {
    persist();
    openEnd();
    go(readHash(app.slug, 'back-cover', 0));
    return;
  }
  if (next < 0) {
    go(coverHash(app.slug));
    return;
  }
  app.pageIndex = Math.min(next, app.pages.length - 1);
  paintPages();
  persist();
  markChapter(chapterOfPage(app.pageIndex));
  go(readHash(app.slug, chapterOfPage(app.pageIndex), currentOffset()), { replace: true });
}

async function onRoute() {
  const route = parseHash();
  $('tocOverlay').classList.remove('active');
  $('progressPanel').classList.remove('active');
  if (route.view === 'binder') {
    showStage('binder');
    app.slug = null;
    app.book = null;
    setTitle();
    renderShelf(app.catalog);
    return;
  }
  try {
    if (route.view === 'cover') {
      await openCover(route.slug);
      return;
    }
    if (route.chapter === 'back-cover') {
      const book = await loadBook(route.slug);
      app.slug = route.slug;
      app.book = book;
      fillCover(book, { draft: !book.published });
      openEnd();
      return;
    }
    if (
      app.book &&
      app.slug === route.slug &&
      app.pages.length &&
      document.body.dataset.stage === 'read'
    ) {
      const ch = route.chapter && app.book.contents.some((c) => c.id === route.chapter)
        ? route.chapter
        : app.book.contents[0]?.id;
      app.pageIndex = pageIndexForOffset(app.pages, ch, route.offset || 0);
      paintPages();
      persist();
      return;
    }
    await openRead(route.slug, route.chapter, route.offset);
  } catch (err) {
    console.error(err);
    $('shelfError').hidden = false;
    $('shelfError').textContent = err.message || 'Could not open that book.';
    setTitle();
    renderShelf(app.catalog);
    showStage('binder');
  }
}

function toast(message) {
  const el = $('toast');
  el.textContent = message;
  el.hidden = false;
  clearTimeout(app.toastTimer);
  app.toastTimer = setTimeout(() => {
    el.hidden = true;
  }, 1800);
}

function toggleBookmark() {
  if (!app.slug || !app.pages[app.pageIndex]) return;
  const ch = app.pages[app.pageIndex];
  const marks = loadBookmarks(app.slug);
  const idx = marks.findIndex((m) => m.chapter === ch.chapter && m.offset === ch.start);
  if (idx >= 0) {
    marks.splice(idx, 1);
    toast('Bookmark removed');
  } else {
    marks.push({ chapter: ch.chapter, offset: ch.start });
    toast('Bookmark added');
  }
  saveBookmarks(app.slug, marks);
  updateProgressUi();
  fillToc(app.book);
}

function bindUi() {
  $('logoBtn').addEventListener('click', () => go(binderHash()));
  $('startBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    const ch = app.book.contents[0]?.id;
    go(readHash(app.slug, ch, 0));
  });
  $('continueBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    const prog = loadProgress(app.slug);
    if (prog?.chapter) go(readHash(app.slug, prog.chapter, prog.offset || 0));
  });
  $('rereadBtn').addEventListener('click', () => go(coverHash(app.slug)));
  $('homeFromEnd').addEventListener('click', () => go(binderHash()));
  $('prevBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    turn(-1);
  });
  $('nextBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    turn(1);
  });
  $('viewModeBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    app.prefs.viewMode = app.prefs.viewMode === 'spread' ? 'single' : 'spread';
    savePrefs(app.prefs);
    applyPrefs();
    if (document.body.dataset.stage === 'read') {
      const ch = chapterOfPage(app.pageIndex);
      const off = currentOffset();
      rebuildPages();
      app.pageIndex = pageIndexForOffset(app.pages, ch, off);
      paintPages();
      persist();
    }
  });
  $('themeBtn').addEventListener('click', () => {
    app.prefs.theme = app.prefs.theme === 'dark' ? 'light' : 'dark';
    savePrefs(app.prefs);
    applyPrefs();
  });
  $('fontDecrease').addEventListener('click', () => bumpFont(-1));
  $('fontIncrease').addEventListener('click', () => bumpFont(1));
  $('nightLightBtn').addEventListener('click', () => {
    app.prefs.nightLight = !app.prefs.nightLight;
    savePrefs(app.prefs);
    applyPrefs();
  });
  $('bookmarkBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleBookmark();
  });
  $('progressBtn').addEventListener('click', () => {
    renderStats();
    $('progressPanel').classList.toggle('active');
  });
  $('statsClose').addEventListener('click', () => $('progressPanel').classList.remove('active'));
  $('tocBtn').addEventListener('click', () => $('tocOverlay').classList.toggle('active'));
  $('tocClose').addEventListener('click', () => $('tocOverlay').classList.remove('active'));
  $('tocSearch').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.toc-item').forEach((item) => {
      item.style.display = item.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
  $('pagesWrapper').addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return;
    const rect = $('pagesWrapper').getBoundingClientRect();
    const x = e.clientX - rect.left;
    turn(x < rect.width / 2 ? -1 : 1);
  });
  $('coverPage').addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    if (!$('continueBtn').hidden) $('continueBtn').click();
    else $('startBtn').click();
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    const stage = document.body.dataset.stage;
    if (e.key === 'Escape') {
      if ($('tocOverlay').classList.contains('active') || $('progressPanel').classList.contains('active')) {
        $('tocOverlay').classList.remove('active');
        $('progressPanel').classList.remove('active');
        return;
      }
      if (stage === 'read') go(coverHash(app.slug));
      else if (stage === 'cover' || stage === 'end') go(binderHash());
      return;
    }
    if (stage === 'cover' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      if (!$('continueBtn').hidden) $('continueBtn').click();
      else $('startBtn').click();
      return;
    }
    if (document.body.dataset.stage !== 'read') return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') turn(-1);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      turn(1);
    }
    if (e.key === 'b' || e.key === 'B') toggleBookmark();
  });

  document.addEventListener('touchstart', (e) => {
    app.touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (document.body.dataset.stage !== 'read') return;
    const dx = e.changedTouches[0].clientX - app.touchStartX;
    if (Math.abs(dx) > 50) turn(dx < 0 ? 1 : -1);
  }, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    app.isMobile = window.innerWidth <= 780;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (document.body.dataset.stage !== 'read' || !app.book) return;
      const ch = chapterOfPage(app.pageIndex);
      const off = currentOffset();
      rebuildPages();
      app.pageIndex = pageIndexForOffset(app.pages, ch, off);
      paintPages();
    }, 150);
  });
}

function bumpFont(delta) {
  app.prefs.fontSize = Math.max(14, Math.min(28, app.prefs.fontSize + delta));
  savePrefs(app.prefs);
  applyPrefs();
  if (document.body.dataset.stage === 'read' && app.book) {
    const ch = chapterOfPage(app.pageIndex);
    const off = currentOffset();
    rebuildPages();
    app.pageIndex = pageIndexForOffset(app.pages, ch, off);
    paintPages();
    persist();
  }
}

async function init() {
  applyPrefs();
  bindUi();
  try {
    await loadCatalog();
  } catch (err) {
    console.error(err);
    $('shelfError').hidden = false;
    $('shelfError').textContent =
      'Could not load the binder catalog. Serve the repository root (not file://) so Markdown can be fetched.';
  }
  window.addEventListener('hashchange', onRoute);
  await onRoute();
}

init();
