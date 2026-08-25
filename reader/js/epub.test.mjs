import assert from 'node:assert/strict';
import {
  EPUB_MIMETYPE,
  buildEpubEntries,
  epubLanguage,
  epubModified,
  epubStylesheet,
  normalizeXhtml,
} from './epub.js';
import { zipStore } from './archive.js';

assert.equal(epubLanguage('English'), 'en');
assert.equal(epubLanguage('pt-BR'), 'pt-BR');
assert.equal(epubLanguage('Unknown language'), 'en');
assert.equal(epubModified(new Date('2026-08-25T12:00:00.123Z')), '2026-08-25T12:00:00Z');
assert.match(epubStylesheet({ typography: { font: 'modern', align: 'left', hyphens: 'off', indent: 'none', leading: 1.7 } }), /font-family: sans-serif/);
assert.match(normalizeXhtml('<p onclick="bad()">A&nbsp;B<br><img src="x.png"></p><script>bad()</script>'), /A&#160;B<br \/><img src="x\.png" \/>/);
assert.doesNotMatch(normalizeXhtml('<p onclick="bad()">x</p>'), /onclick/);

const book = {
  slug: 'sample-book',
  title: 'Sample & Book',
  authors: '@Ada Author',
  publisher: 'Open Press',
  language: 'English',
  isbn: '978-1-4028-9462-6',
};
const chapters = [
  { id: 'intro', title: 'Introduction', file: 'chapter-001.xhtml', html: '<h1>Introduction</h1><p>Hello.</p>' },
  { id: 'evidence', title: 'Evidence', file: 'chapter-002.xhtml', html: '<h1>Evidence</h1><math><mi>x</mi></math>', remoteResources: true },
];
const assets = [
  { href: 'media/cover.jpg', mediaType: 'image/jpeg', data: new Uint8Array([1, 2, 3]), cover: true },
  { href: 'https://example.org/chart.png', mediaType: 'image/png', data: null, cover: false },
];
const modified = new Date('2026-08-25T12:00:00Z');
const entries = buildEpubEntries(book, { chapters, assets, presentation: { typography: { font: 'literary' } }, modified });

assert.equal(entries[0][0], 'mimetype');
assert.equal(entries[0][1], EPUB_MIMETYPE);
const files = new Map(entries);
assert.match(files.get('META-INF/container.xml'), /full-path="EPUB\/package\.opf"/);
const opf = files.get('EPUB/package.opf');
assert.match(opf, /<dc:identifier id="pub-id">urn:isbn:9781402894626<\/dc:identifier>/);
assert.match(opf, /<dc:title>Sample &amp; Book<\/dc:title>/);
assert.match(opf, /<dc:language>en<\/dc:language>/);
assert.match(opf, /<meta property="dcterms:modified">2026-08-25T12:00:00Z<\/meta>/);
assert.match(opf, /properties="nav"/);
assert.match(opf, /properties="cover-image"/);
assert.match(opf, /properties="remote-resources mathml"/);
assert.match(opf, /href="https:\/\/example\.org\/chart\.png" media-type="image\/png"/);
assert.match(files.get('EPUB/nav.xhtml'), /chapter-001\.xhtml/);
assert.match(files.get('EPUB/chapter-001.xhtml'), /xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/);
assert.deepEqual([...files.get('EPUB/media/cover.jpg')], [1, 2, 3]);

const archive = zipStore(entries, modified);
const view = new DataView(archive.buffer, archive.byteOffset, archive.byteLength);
const firstNameLength = view.getUint16(26, true);
assert.equal(new TextDecoder().decode(archive.slice(30, 30 + firstNameLength)), 'mimetype');
assert.equal(view.getUint16(8, true), 0); // mimetype is stored, not compressed.
assert.equal(view.getUint16(28, true), 0); // no extra field on mimetype.

console.log('epub tests ok');
