import { fetchText, firstExisting } from './base.js';
import { parseBookReadme, parseFrontMatterMeta } from './catalog.js';
import { parseRoute } from './router.js';
import { bookAsEpub, downloadEpub } from './epub.js';

const $ = (id) => document.getElementById(id);
let exporting = false;

function toast(message) {
  const out = $('toast');
  if (!out) return;
  out.textContent = message;
  out.hidden = false;
  window.setTimeout(() => {
    if (out.textContent === message) out.hidden = true;
  }, 2200);
}

async function loadRouteBook() {
  const route = parseRoute();
  if (!route.slug) throw new Error('Open a publication first');
  const hub = await fetchText(`books/${route.slug}/README.md`);
  const meta = parseBookReadme(hub, route.slug);
  const chapters = await Promise.all(meta.contents.map(async (chapter) => ({
    ...chapter,
    markdown: await fetchText(`books/${route.slug}/${chapter.file}`),
  })));
  let front = {};
  const frontMatter = chapters.find((chapter) => chapter.id === 'front-matter');
  if (frontMatter) front = parseFrontMatterMeta(frontMatter.markdown);
  const cover = await firstExisting(
    ['cover.png', 'cover.jpg', 'cover.webp', 'cover.jpeg'].map((name) => `books/${route.slug}/media/${name}`)
  );
  return {
    ...meta,
    title: front.title || meta.title,
    subtitle: front.subtitle || '',
    year: front.year || '',
    cover,
    chapters,
  };
}

async function exportCurrentBook(button) {
  if (exporting) return;
  exporting = true;
  const old = button.textContent;
  button.disabled = true;
  button.textContent = 'Building EPUB…';
  try {
    const book = await loadRouteBook();
    const bytes = await bookAsEpub(book);
    downloadEpub(`${book.slug}.epub`, bytes);
    toast('EPUB saved');
  } catch (error) {
    console.error(error);
    toast(error?.message || 'Could not export EPUB');
  } finally {
    exporting = false;
    button.disabled = false;
    button.textContent = old;
  }
}

function install() {
  if ($('downloadEpub')) return;
  const htmlButton = $('downloadHtml');
  if (!htmlButton) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.id = 'downloadEpub';
  button.className = htmlButton.className || 'ghost-btn';
  button.textContent = 'Download EPUB';
  button.title = 'Export a self-contained EPUB 3 ebook';
  htmlButton.insertAdjacentElement('afterend', button);
  button.addEventListener('click', () => exportCurrentBook(button));
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
}
