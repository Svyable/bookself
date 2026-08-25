import { renderMarkdown } from './markdown.js';
import { loadBookPresentation } from './presentation.js';
import { zipStore } from './archive.js';

export const EPUB_MIMETYPE = 'application/epub+zip';

const IMAGE_TYPES = Object.freeze({
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
});

const EXTENSIONS = Object.freeze({
  'image/gif': '.gif',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/svg+xml': '.svg',
  'image/webp': '.webp',
});

const LANGUAGE_NAMES = Object.freeze({
  english: 'en', spanish: 'es', french: 'fr', german: 'de', italian: 'it', portuguese: 'pt',
  dutch: 'nl', swedish: 'sv', norwegian: 'no', danish: 'da', finnish: 'fi', polish: 'pl',
  czech: 'cs', japanese: 'ja', korean: 'ko', chinese: 'zh', arabic: 'ar', hindi: 'hi',
});

function xml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function epubLanguage(value) {
  const raw = String(value || '').trim();
  if (/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/i.test(raw)) return raw;
  return LANGUAGE_NAMES[raw.toLowerCase()] || 'en';
}

export function epubModified(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  const safe = Number.isNaN(date.getTime()) ? new Date() : date;
  return safe.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function publicationIdentifier(book) {
  const isbn = String(book?.isbn || '').replace(/[^0-9X]/gi, '').toUpperCase();
  if (isbn.length === 10 || isbn.length === 13) return `urn:isbn:${isbn}`;
  const slug = String(book?.slug || 'publication').replace(/[^A-Za-z0-9._-]/g, '-');
  return `urn:bookself:${slug || 'publication'}`;
}

function genericFont(presentation) {
  const font = presentation?.typography?.font;
  return ['modern', 'clear', 'humanist', 'system'].includes(font) ? 'sans-serif' : 'serif';
}

function paragraphRules(presentation) {
  const type = presentation?.typography || {};
  const margin = type.paragraph === 'compact' ? '.45em' : type.paragraph === 'airy' ? '1.05em' : '.72em';
  const indent = type.indent === 'classic' ? '1.4em' : type.indent === 'gentle' ? '1em' : '0';
  const align = type.align === 'justify' ? 'justify' : 'left';
  const hyphens = type.hyphens === 'off' ? 'none' : 'auto';
  const leading = Number.isFinite(Number(type.leading)) ? Math.max(1.3, Math.min(2, Number(type.leading))) : 1.55;
  return { margin, indent, align, hyphens, leading };
}

export function epubStylesheet(presentation = {}) {
  const rules = paragraphRules(presentation);
  return `html { -webkit-text-size-adjust: 100%; }\nbody { margin: 5%; font-family: ${genericFont(presentation)}; font-size: 1em; line-height: ${rules.leading}; }\nmain { max-width: 42em; margin: 0 auto; }\nh1, h2, h3, h4 { break-after: avoid; line-height: 1.18; }\nh1 { margin: 1.2em 0 .7em; }\nh2 { margin: 1.35em 0 .55em; }\np { margin: ${rules.margin} 0; text-align: ${rules.align}; hyphens: ${rules.hyphens}; -webkit-hyphens: ${rules.hyphens}; }\np + p { text-indent: ${rules.indent}; }\nh1 + p, h2 + p, h3 + p, blockquote + p, li p { text-indent: 0; }\nblockquote { margin: 1.2em 7%; }\nimg, svg { max-width: 100%; height: auto; }\nfigure { margin: 1.3em auto; break-inside: avoid; }\nfigcaption { margin-top: .55em; font-size: .86em; }\ntable { width: 100%; border-collapse: collapse; font-size: .92em; }\nth, td { padding: .35em .45em; border-bottom: 1px solid currentColor; text-align: left; vertical-align: top; }\npre, code { white-space: pre-wrap; overflow-wrap: anywhere; }\n.reader-footnote { display: grid; grid-template-columns: auto 1fr; gap: .4em; margin: .8em 0; font-size: .84em; }\n.reader-reference { margin: .7em 0; padding-left: 1.2em; text-indent: -1.2em; font-size: .9em; }\n.reader-math-display { overflow-x: auto; text-align: center; }\na { color: inherit; text-decoration: underline; }\n`;
}

const NAMED_ENTITIES = Object.freeze({
  nbsp: '&#160;', copy: '&#169;', reg: '&#174;', hellip: '&#8230;', mdash: '&#8212;', ndash: '&#8211;',
  lsquo: '&#8216;', rsquo: '&#8217;', ldquo: '&#8220;', rdquo: '&#8221;'
});

export function normalizeXhtml(fragment) {
  let html = String(fragment || '');
  html = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi, '')
    .replace(/\sdata-source-offset\s*=\s*("[^"]*"|'[^']*')/gi, '');
  html = html.replace(/&([A-Za-z][A-Za-z0-9]+);/g, (match, name) => {
    if (['amp', 'lt', 'gt', 'quot', 'apos'].includes(name)) return match;
    return NAMED_ENTITIES[name] || `&amp;${name};`;
  });
  html = html.replace(/<(img|br|hr|source|track)(\b[^>]*?)>/gi, (match, tag, attrs) => {
    if (/\/\s*$/.test(attrs)) return match;
    return `<${tag}${attrs} />`;
  });
  return html;
}

function xhtmlDocument(title, language, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${xml(language)}" lang="${xml(language)}">\n<head>\n  <meta charset="utf-8" />\n  <title>${xml(title)}</title>\n  <link rel="stylesheet" type="text/css" href="styles/book.css" />\n</head>\n<body>\n<main epub:type="bodymatter">\n${normalizeXhtml(body)}\n</main>\n</body>\n</html>\n`;
}

function navDocument(book, language, chapters) {
  const items = chapters.map((chapter) => `      <li><a href="${xml(chapter.file)}">${xml(chapter.title)}</a></li>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${xml(language)}" lang="${xml(language)}">\n<head><meta charset="utf-8" /><title>Contents — ${xml(book.title)}</title></head>\n<body>\n  <nav epub:type="toc" id="toc">\n    <h1>Contents</h1>\n    <ol>\n${items}\n    </ol>\n  </nav>\n</body>\n</html>\n`;
}

function containerDocument() {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">\n  <rootfiles>\n    <rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml" />\n  </rootfiles>\n</container>\n`;
}

function itemProperties(chapter) {
  const properties = [];
  if (chapter.remoteResources) properties.push('remote-resources');
  if (/<math\b/i.test(chapter.html)) properties.push('mathml');
  if (/<svg\b/i.test(chapter.html)) properties.push('svg');
  return properties.join(' ');
}

function packageDocument(book, language, chapters, assets, modified) {
  const creators = String(book.authors || '').replace(/@/g, '').trim();
  const publisher = String(book.publisher || '').trim();
  const date = String(book.publicationDate || book.year || '').trim();
  const metadata = [
    `    <dc:identifier id="pub-id">${xml(publicationIdentifier(book))}</dc:identifier>`,
    `    <dc:title>${xml(book.title || 'Untitled Publication')}</dc:title>`,
    `    <dc:language>${xml(language)}</dc:language>`,
    creators ? `    <dc:creator>${xml(creators)}</dc:creator>` : '',
    publisher ? `    <dc:publisher>${xml(publisher)}</dc:publisher>` : '',
    date ? `    <dc:date>${xml(date)}</dc:date>` : '',
    `    <meta property="dcterms:modified">${xml(epubModified(modified))}</meta>`,
  ].filter(Boolean).join('\n');

  const chapterItems = chapters.map((chapter, index) => {
    const props = itemProperties(chapter);
    return `    <item id="chapter-${index + 1}" href="${xml(chapter.file)}" media-type="application/xhtml+xml"${props ? ` properties="${props}"` : ''} />`;
  }).join('\n');
  const assetItems = assets.map((asset, index) => {
    const props = asset.cover ? ' properties="cover-image"' : '';
    return `    <item id="asset-${index + 1}" href="${xml(asset.href)}" media-type="${xml(asset.mediaType)}"${props} />`;
  }).join('\n');
  const spine = chapters.map((_, index) => `    <itemref idref="chapter-${index + 1}" />`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<package version="3.0" unique-identifier="pub-id" xmlns="http://www.idpf.org/2007/opf" xml:lang="${xml(language)}">\n  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">\n${metadata}\n  </metadata>\n  <manifest>\n    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav" />\n    <item id="css" href="styles/book.css" media-type="text/css" />\n${chapterItems}\n${assetItems ? `${assetItems}\n` : ''}  </manifest>\n  <spine>\n${spine}\n  </spine>\n</package>\n`;
}

export function buildEpubEntries(book, { chapters = [], assets = [], presentation = {}, modified = new Date() } = {}) {
  const language = epubLanguage(book?.language);
  const safeChapters = chapters.map((chapter, index) => ({
    id: chapter.id || `chapter-${index + 1}`,
    title: chapter.title || `Chapter ${index + 1}`,
    file: chapter.file || `chapter-${String(index + 1).padStart(3, '0')}.xhtml`,
    html: normalizeXhtml(chapter.html || ''),
    remoteResources: chapter.remoteResources === true,
  }));
  if (!safeChapters.length) throw new Error('EPUB export needs at least one manuscript file');

  const entries = [
    ['mimetype', EPUB_MIMETYPE],
    ['META-INF/container.xml', containerDocument()],
    ['EPUB/package.opf', packageDocument(book, language, safeChapters, assets, modified)],
    ['EPUB/nav.xhtml', navDocument(book, language, safeChapters)],
    ['EPUB/styles/book.css', epubStylesheet(presentation)],
  ];
  safeChapters.forEach((chapter) => {
    entries.push([`EPUB/${chapter.file}`, xhtmlDocument(chapter.title, language, chapter.html)]);
  });
  assets.filter((asset) => asset.data != null).forEach((asset) => {
    entries.push([`EPUB/${asset.href}`, asset.data]);
  });
  return entries;
}

function mediaTypeFromUrl(value, responseType = '') {
  const header = String(responseType || '').split(';')[0].trim().toLowerCase();
  if (EXTENSIONS[header]) return header;
  try {
    const path = new URL(value, globalThis.location?.href || 'https://bookself.invalid/').pathname.toLowerCase();
    const ext = Object.keys(IMAGE_TYPES).find((key) => path.endsWith(key));
    return ext ? IMAGE_TYPES[ext] : '';
  } catch {
    return '';
  }
}

function extensionFor(mediaType) {
  return EXTENSIONS[mediaType] || '';
}

function isBookMedia(url, slug) {
  try {
    const parsed = new URL(url, globalThis.location?.href || 'https://bookself.invalid/');
    const path = decodeURIComponent(parsed.pathname);
    return path.includes(`/books/${slug}/media/`);
  } catch {
    return false;
  }
}

function rewriteInternalLinks(html, slug, chapterFiles) {
  return String(html || '').replace(
    /href="#\/b\/[^/]+\/([^/"#]+)\/0"\s+data-internal="1"/g,
    (match, target) => {
      let id = target;
      try { id = decodeURIComponent(target); } catch { /* Keep encoded target. */ }
      const file = chapterFiles.get(id);
      return file ? `href="${file}"` : 'href="#"';
    }
  );
}

async function binaryAsset(url, index, cover = false) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not include publication media: ${url}`);
  const mediaType = mediaTypeFromUrl(url, response.headers.get('content-type'));
  const ext = extensionFor(mediaType);
  if (!ext) throw new Error(`Unsupported EPUB image type: ${url}`);
  return {
    href: `media/asset-${String(index).padStart(3, '0')}${ext}`,
    mediaType,
    data: new Uint8Array(await response.arrayBuffer()),
    cover,
    source: url,
  };
}

export async function bookAsEpub(book, { modified = new Date() } = {}) {
  if (!book?.chapters?.length) throw new Error('Open a publication with manuscript files first');
  const presentation = await loadBookPresentation(book.slug).catch(() => ({}));
  const chapterFiles = new Map(book.chapters.map((chapter, index) => [
    chapter.id,
    `chapter-${String(index + 1).padStart(3, '0')}.xhtml`,
  ]));
  const packaged = new Map();
  const remote = new Map();
  const chapters = [];

  async function ensurePackaged(url, cover = false) {
    if (packaged.has(url)) {
      if (cover) packaged.get(url).cover = true;
      return packaged.get(url);
    }
    const asset = await binaryAsset(url, packaged.size + 1, cover);
    packaged.set(url, asset);
    return asset;
  }

  for (let index = 0; index < book.chapters.length; index += 1) {
    const chapter = book.chapters[index];
    let html = rewriteInternalLinks(renderMarkdown(chapter.markdown || '', book.slug), book.slug, chapterFiles);
    let remoteResources = false;
    const sources = [...new Set([...html.matchAll(/\bsrc=(?:"([^"]+)"|'([^']+)')/gi)].map((match) => match[1] || match[2]))];
    for (const source of sources) {
      if (isBookMedia(source, book.slug)) {
        const asset = await ensurePackaged(source);
        html = html.split(source).join(asset.href);
      } else if (/^https:\/\//i.test(source)) {
        const mediaType = mediaTypeFromUrl(source);
        if (!mediaType) throw new Error(`Unsupported remote EPUB image type: ${source}`);
        remoteResources = true;
        if (!remote.has(source)) remote.set(source, { href: source, mediaType, data: null, cover: false, source });
      } else if (/^http:\/\//i.test(source)) {
        throw new Error('EPUB export does not include insecure remote media. Use HTTPS or repository media.');
      }
    }
    chapters.push({
      id: chapter.id,
      title: chapter.title || `Chapter ${index + 1}`,
      file: chapterFiles.get(chapter.id),
      html,
      remoteResources,
    });
  }

  if (book.cover) await ensurePackaged(book.cover, true);
  const assets = [...packaged.values(), ...remote.values()];
  const entries = buildEpubEntries(book, { chapters, assets, presentation, modified });
  return zipStore(entries, modified);
}

export function downloadEpub(filename, bytes) {
  const blob = new Blob([bytes], { type: EPUB_MIMETYPE });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
