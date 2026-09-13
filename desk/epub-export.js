import { parseManuscriptChecklist, markdownToKdpHtml } from './kdp-export.js';

const encoder = new TextEncoder();
const branchCache = new Map();
let crcTable = null;

function escapeXml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'book';
}

function cleanMetadataValue(value = '') {
  return String(value)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\\\|/g, '|')
    .replace(/`/g, '')
    .trim();
}

export function parsePublicationMetadata(markdown = '') {
  const rows = {};
  const rowRe = /^\|\s*\*\*([^*]+)\*\*\s*\|\s*(.*?)\s*\|\s*$/gm;
  let match;
  while ((match = rowRe.exec(markdown))) rows[match[1].trim().toLowerCase()] = cleanMetadataValue(match[2]);
  return {
    authors: rows.authors || '',
    language: rows.language || 'English',
    isbn: rows.isbn || '',
    publisher: rows.publisher || '',
  };
}

function languageCode(value = '') {
  const language = String(value).trim().toLowerCase();
  const common = {
    english: 'en', french: 'fr', german: 'de', italian: 'it', spanish: 'es', portuguese: 'pt',
    japanese: 'ja', chinese: 'zh', korean: 'ko', arabic: 'ar', hebrew: 'he', hindi: 'hi',
  };
  if (common[language]) return common[language];
  if (/^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i.test(language)) return language;
  return 'en';
}

const EPUB_IMAGE_TYPES = Object.freeze({
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  bmp: 'image/bmp',
  svg: 'image/svg+xml',
});

function collectImageSources(markdown = '') {
  const sources = [];
  const imageRe = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let match;
  while ((match = imageRe.exec(markdown))) sources.push(match[1]);
  return sources;
}

export function resolveBookPath(baseFile, target) {
  const raw = String(target || '').replaceAll('\\', '/').split(/[?#]/, 1)[0];
  if (!raw || raw.startsWith('/') || /^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith('//')) {
    throw new Error(`EPUB export only supports book-local images: ${target}`);
  }
  const base = String(baseFile || '').replaceAll('\\', '/').split('/');
  base.pop();
  const normalized = [];
  for (const part of base.concat(raw.split('/'))) {
    if (!part || part === '.') continue;
    if (part === '..') {
      if (!normalized.length) throw new Error(`Image path escapes the book folder: ${target}`);
      normalized.pop();
    } else normalized.push(part);
  }
  return normalized.join('/');
}

function mediaTypeForPath(path) {
  const extension = String(path).toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] || '';
  const mediaType = EPUB_IMAGE_TYPES[extension];
  if (!mediaType) throw new Error(`Unsupported EPUB image type: ${path}`);
  return { extension, mediaType };
}

export function planEpubImages(chapters = []) {
  const bySource = new Map();
  const plannedChapters = chapters.map((chapter) => {
    const imageMap = {};
    for (const source of collectImageSources(chapter.markdown)) {
      const sourcePath = resolveBookPath(chapter.file, source);
      let asset = bySource.get(sourcePath);
      if (!asset) {
        const { extension, mediaType } = mediaTypeForPath(sourcePath);
        const basename = sourcePath.split('/').pop().replace(/\.[^.]+$/, '');
        const number = String(bySource.size + 1).padStart(3, '0');
        asset = {
          sourcePath,
          href: `assets/${number}-${slugify(basename)}.${extension === 'jpeg' ? 'jpg' : extension}`,
          mediaType,
        };
        bySource.set(sourcePath, asset);
      }
      imageMap[source] = asset.href;
    }
    return { ...chapter, imageMap };
  });
  return { chapters: plannedChapters, assets: [...bySource.values()] };
}

function markdownToEpubXhtml(markdown, imageMap = {}) {
  let html = markdownToKdpHtml(markdown);
  html = html.replaceAll('<hr>', '<hr />');
  html = html.replace(/<img src="([^"]+)" alt="([^"]*)">/g, (_, src, alt) => {
    const mapped = imageMap[src] || src;
    return `<img src="${escapeXml(mapped)}" alt="${alt}" />`;
  });
  return html;
}

function identifierFor(title, metadata = {}) {
  const isbn = String(metadata.isbn || '').replace(/[^0-9Xx]/g, '').toUpperCase();
  if (isbn.length === 10 || isbn.length === 13) return `urn:isbn:${isbn}`;
  return `urn:bookself:${slugify(title || 'untitled')}`;
}

function xhtmlDocument({ title, body, language }) {
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${escapeXml(language)}" lang="${escapeXml(language)}">
<head>
  <meta charset="utf-8" />
  <title>${escapeXml(title)}</title>
  <link rel="stylesheet" type="text/css" href="styles/book.css" />
</head>
<body>
${body}
</body>
</html>`;
}

export function buildEpubFiles({ title, author, chapters, assets = {}, metadata = {}, modified = new Date().toISOString() }) {
  const safeTitle = title || 'Untitled';
  const language = languageCode(metadata.language);
  const identifier = identifierFor(safeTitle, metadata);
  const cleanModified = String(modified).replace(/\.\d{3}Z$/, 'Z');
  const files = {
    mimetype: 'application/epub+zip',
    'META-INF/container.xml': `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml" />
  </rootfiles>
</container>`,
    'EPUB/styles/book.css': `body { font-family: serif; line-height: 1.5; margin: 5%; }
h1 { page-break-before: always; break-before: page; }
h2, h3, h4, h5, h6 { break-after: avoid; }
p { margin: 0 0 1em; }
blockquote { margin: 1em 1.5em; }
pre { white-space: pre-wrap; overflow-wrap: anywhere; }
img { max-width: 100%; height: auto; }
.title-page { text-align: center; margin-top: 30%; }
`,
  };

  const navItems = [];
  const manifestItems = [
    '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav" />',
    '<item id="title-page" href="title.xhtml" media-type="application/xhtml+xml" />',
    '<item id="style" href="styles/book.css" media-type="text/css" />',
  ];
  const spineItems = ['<itemref idref="title-page" />'];

  files['EPUB/title.xhtml'] = xhtmlDocument({
    title: safeTitle,
    language,
    body: `<section class="title-page" epub:type="titlepage"><h1>${escapeXml(safeTitle)}</h1>${author ? `<p>${escapeXml(author)}</p>` : ''}</section>`,
  });

  chapters.forEach((chapter, index) => {
    const number = String(index + 1).padStart(3, '0');
    const filename = `chapter-${number}.xhtml`;
    const id = `chapter-${number}`;
    navItems.push(`<li><a href="${filename}">${escapeXml(chapter.title)}</a></li>`);
    manifestItems.push(`<item id="${id}" href="${filename}" media-type="application/xhtml+xml" />`);
    spineItems.push(`<itemref idref="${id}" />`);
    files[`EPUB/${filename}`] = xhtmlDocument({
      title: chapter.title,
      language,
      body: `<section epub:type="chapter"><h1>${escapeXml(chapter.title)}</h1>\n${markdownToEpubXhtml(chapter.markdown, chapter.imageMap || {})}</section>`,
    });
  });

  Object.entries(assets).forEach(([href, asset], index) => {
    const id = `image-${String(index + 1).padStart(3, '0')}`;
    manifestItems.push(`<item id="${id}" href="${escapeXml(href)}" media-type="${escapeXml(asset.mediaType)}" />`);
    files[`EPUB/${href}`] = asset.data;
  });

  files['EPUB/nav.xhtml'] = xhtmlDocument({
    title: 'Contents',
    language,
    body: `<nav epub:type="toc" id="toc"><h1>Contents</h1><ol>${navItems.join('')}</ol></nav>`,
  });

  const publisher = metadata.publisher ? `\n    <dc:publisher>${escapeXml(metadata.publisher)}</dc:publisher>` : '';
  files['EPUB/package.opf'] = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="book-id">${escapeXml(identifier)}</dc:identifier>
    <dc:title>${escapeXml(safeTitle)}</dc:title>
    ${author ? `<dc:creator>${escapeXml(author)}</dc:creator>` : ''}
    <dc:language>${escapeXml(language)}</dc:language>${publisher}
    <meta property="dcterms:modified">${escapeXml(cleanModified)}</meta>
  </metadata>
  <manifest>
    ${manifestItems.join('\n    ')}
  </manifest>
  <spine>
    ${spineItems.join('\n    ')}
  </spine>
</package>`;

  return files;
}

function getCrcTable() {
  if (crcTable) return crcTable;
  crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    crcTable[n] = c >>> 0;
  }
  return crcTable;
}

function crc32(bytes) {
  const table = getCrcTable();
  let crc = 0xffffffff;
  for (const byte of bytes) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function push16(out, value) {
  out.push(value & 0xff, (value >>> 8) & 0xff);
}

function push32(out, value) {
  out.push(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff);
}

function dosStamp(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  return {
    time: ((date.getHours() & 31) << 11) | ((date.getMinutes() & 63) << 5) | ((Math.floor(date.getSeconds() / 2)) & 31),
    date: (((year - 1980) & 127) << 9) | (((date.getMonth() + 1) & 15) << 5) | (date.getDate() & 31),
  };
}

function toBytes(value) {
  if (value instanceof Uint8Array) return value;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  return encoder.encode(String(value));
}

function concatBytes(chunks, totalLength) {
  const out = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

export function zipStore(files, stamp = new Date()) {
  const localChunks = [];
  const centralChunks = [];
  let localLength = 0;
  let centralLength = 0;
  const { time, date } = dosStamp(stamp);

  for (const [rawName, value] of Object.entries(files)) {
    const name = rawName.replace(/^\/+/, '');
    if (!name || name.split('/').includes('..')) throw new Error(`Unsafe archive path: ${name}`);
    const filename = encoder.encode(name);
    const data = toBytes(value);
    const crc = crc32(data);
    const offset = localLength;

    const localHeader = [];
    push32(localHeader, 0x04034b50);
    push16(localHeader, 20);
    push16(localHeader, 0x0800);
    push16(localHeader, 0);
    push16(localHeader, time);
    push16(localHeader, date);
    push32(localHeader, crc);
    push32(localHeader, data.length);
    push32(localHeader, data.length);
    push16(localHeader, filename.length);
    push16(localHeader, 0);
    const localHeaderBytes = Uint8Array.from(localHeader);
    localChunks.push(localHeaderBytes, filename, data);
    localLength += localHeaderBytes.length + filename.length + data.length;

    const centralHeader = [];
    push32(centralHeader, 0x02014b50);
    push16(centralHeader, 20);
    push16(centralHeader, 20);
    push16(centralHeader, 0x0800);
    push16(centralHeader, 0);
    push16(centralHeader, time);
    push16(centralHeader, date);
    push32(centralHeader, crc);
    push32(centralHeader, data.length);
    push32(centralHeader, data.length);
    push16(centralHeader, filename.length);
    push16(centralHeader, 0);
    push16(centralHeader, 0);
    push16(centralHeader, 0);
    push16(centralHeader, 0);
    push32(centralHeader, 0);
    push32(centralHeader, offset);
    const centralHeaderBytes = Uint8Array.from(centralHeader);
    centralChunks.push(centralHeaderBytes, filename);
    centralLength += centralHeaderBytes.length + filename.length;
  }

  const end = [];
  const count = Object.keys(files).length;
  push32(end, 0x06054b50);
  push16(end, 0);
  push16(end, 0);
  push16(end, count);
  push16(end, count);
  push32(end, centralLength);
  push32(end, localLength);
  push16(end, 0);
  const endBytes = Uint8Array.from(end);
  return concatBytes([...localChunks, ...centralChunks, endBytes], localLength + centralLength + endBytes.length);
}

export function buildEpubArchive(input, stamp = new Date()) {
  return zipStore(buildEpubFiles(input), stamp);
}

function parseRepo(value = '') {
  const raw = String(value).trim();
  const github = raw.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
  const pair = github ? `${github[1]}/${github[2]}` : raw.replace(/^https?:\/\//i, '');
  const match = pair.match(/^([^/\s]+)\/([^/\s]+)$/);
  return match ? { owner: match[1], repo: match[2].replace(/\.git$/i, '') } : null;
}

function currentWorkspace() {
  const params = new URLSearchParams(location.search);
  const remote = parseRepo(params.get('repo') || '');
  if (remote) return { remote: true, ...remote };
  return { remote: false };
}

async function remoteBranch(repo) {
  const key = `${repo.owner}/${repo.repo}`;
  if (branchCache.has(key)) return branchCache.get(key);
  const response = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!response.ok) throw new Error('Could not read repository metadata');
  const meta = await response.json();
  const branch = meta.default_branch || 'main';
  branchCache.set(key, branch);
  return branch;
}

async function readResource(path) {
  const workspace = currentWorkspace();
  if (!workspace.remote) {
    const response = await fetch(new URL(`../${path}`, location.href), { cache: 'no-store' });
    if (!response.ok) throw new Error(`Could not read ${path}`);
    return response;
  }

  const repoInput = document.getElementById('repoInput');
  const repo = parseRepo(repoInput?.value || '') || workspace;
  const branch = await remoteBranch(repo);
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  const response = await fetch(`https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${branch}/${encodedPath}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Could not read ${path}`);
  return response;
}

async function readText(path) {
  return (await readResource(path)).text();
}

async function readBytes(path) {
  return new Uint8Array(await (await readResource(path)).arrayBuffer());
}

function downloadBlob(filename, value, type) {
  const blob = new Blob([value], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function exportEpub(card, trigger) {
  const previous = trigger.textContent;
  trigger.textContent = 'Packaging…';
  trigger.setAttribute('aria-busy', 'true');
  try {
    const slug = card.dataset.slug;
    const title = card.querySelector('.book-title')?.textContent?.trim() || slug;
    const cardAuthor = card.querySelector('.book-authors')?.textContent?.trim() || '';
    const hub = await readText(`books/${slug}/README.md`);
    const entries = parseManuscriptChecklist(hub);
    if (!entries.length) throw new Error('No manuscript checklist entries found in this book hub.');
    const metadata = parsePublicationMetadata(hub);
    const author = cardAuthor === 'Author not set' ? metadata.authors : cardAuthor;
    const chapters = await Promise.all(entries.map(async (entry) => ({
      title: entry.title,
      file: entry.file,
      markdown: await readText(`books/${slug}/${entry.file}`),
    })));
    const plan = planEpubImages(chapters);
    const assets = {};
    await Promise.all(plan.assets.map(async (asset) => {
      assets[asset.href] = {
        mediaType: asset.mediaType,
        data: await readBytes(`books/${slug}/${asset.sourcePath}`),
      };
    }));
    const archive = buildEpubArchive({ title, author, metadata, chapters: plan.chapters, assets });
    downloadBlob(`${slugify(title)}-kindle.epub`, archive, 'application/epub+zip');
    trigger.textContent = 'Downloaded';
    setTimeout(() => { trigger.textContent = previous; }, 1600);
  } catch (error) {
    console.error('EPUB export failed', error);
    trigger.textContent = 'Export failed';
    trigger.title = error?.message || 'Could not export this manuscript.';
    setTimeout(() => { trigger.textContent = previous; }, 2200);
  } finally {
    trigger.removeAttribute('aria-busy');
  }
}

function bindEpubExport() {
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('.export-epub-action');
    if (!trigger) return;
    event.preventDefault();
    const card = trigger.closest('.book-card');
    if (card) exportEpub(card, trigger);
  });
}

if (typeof document !== 'undefined') bindEpubExport();
