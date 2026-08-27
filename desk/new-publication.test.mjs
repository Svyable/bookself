import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  PUBLICATION_FORMATS,
  STARTER_PRESETS,
  buildPublicationFiles,
  catalogSnippet,
  crc32,
  publicationRightsManifest,
  slugifyTitle,
  zipStore,
} from './new-publication.js';

assert.equal(slugifyTitle('  The Café & Moon  '), 'the-cafe-and-moon');
assert.equal(slugifyTitle('---'), 'my-publication');
assert.ok(STARTER_PRESETS.some(([id]) => id === 'accessible'));
assert.equal(Object.keys(PUBLICATION_FORMATS).length, 10);

const bundle = buildPublicationFiles({
  format: 'report',
  title: 'Field Notes: 2026',
  author: 'Ada | Editor',
  pieceTitle: 'What We Found',
  preset: 'quiet-study',
});
assert.equal(bundle.slug, 'field-notes-2026');
assert.equal(bundle.format, 'Report');
assert.equal(bundle.preset, 'quiet-study');
assert.equal(bundle.catalog, '- [Field Notes: 2026](books/field-notes-2026/) — Report');
assert.match(bundle.files['field-notes-2026/README.md'], /\*\*Authors\*\* \| Ada \\| Editor \|/);
assert.match(bundle.files['field-notes-2026/README.md'], /\*\*Rights\*\* \| © \d{4} Ada \\| Editor · All Rights Reserved \|/);
assert.match(bundle.files['field-notes-2026/README.md'], /\*\*AI use\*\* \| Training, RAG, AI indexing, and generative reuse reserved \|/);
assert.match(bundle.files['field-notes-2026/README.md'], /\[RIGHTS\.md\]\(RIGHTS\.md\)/);
assert.match(bundle.files['field-notes-2026/README.md'], /\[rights\.json\]\(rights\.json\)/);
assert.match(bundle.files['field-notes-2026/README.md'], /\[What We Found\]\(manuscript\/findings\.md\)/);
assert.deepEqual(JSON.parse(bundle.files['field-notes-2026/reader.json']), { version: 1, preset: 'quiet-study' });
assert.match(bundle.files['field-notes-2026/manuscript/findings.md'], /## Executive summary/);
assert.match(bundle.files['field-notes-2026/RIGHTS.md'], /© \d{4} Ada \| Editor\. All Rights Reserved\./);
assert.match(bundle.files['field-notes-2026/RIGHTS.md'], /model training or fine-tuning/i);
assert.match(bundle.files['field-notes-2026/RIGHTS.md'], /retrieval-augmented generation \(RAG\)/i);
assert.match(bundle.files['field-notes-2026/RIGHTS.md'], /copyright-management information/i);
assert.match(bundle.files['field-notes-2026/RIGHTS.md'], /Hosting-provider terms are separate/i);

const manifest = JSON.parse(bundle.files['field-notes-2026/rights.json']);
assert.equal(manifest.schemaVersion, 1);
assert.equal(manifest.policy, 'bookself-arr-v1');
assert.equal(manifest.work.title, 'Field Notes: 2026');
assert.equal(manifest.work.author, 'Ada | Editor');
assert.equal(manifest.copyright.owner, 'Ada | Editor');
assert.match(manifest.copyright.notice, /^© \d{4} Ada \| Editor\. All Rights Reserved\.$/);
assert.equal(manifest.permissions.publicReading, true);
assert.equal(manifest.permissions.conventionalSearch, true);
assert.equal(manifest.permissions.aiTraining, false);
assert.equal(manifest.permissions.aiRetrievalGrounding, false);
assert.deepEqual(manifest.registration, {
  jurisdiction: 'US',
  status: 'not-recorded-in-bookself',
  number: null,
  effectiveDate: null,
});

const directManifest = JSON.parse(publicationRightsManifest('A Work', 'Ada Example', 2026));
assert.equal(directManifest.copyright.notice, '© 2026 Ada Example. All Rights Reserved.');
assert.equal(directManifest.license.file, 'RIGHTS.md');

const fallback = buildPublicationFiles({ format: 'unknown', title: '', preset: 'not-real' });
assert.equal(fallback.format, 'Book');
assert.equal(fallback.slug, 'untitled-publication');
assert.equal(fallback.preset, 'book');
assert.ok(fallback.files['untitled-publication/RIGHTS.md']);
assert.ok(fallback.files['untitled-publication/rights.json']);

assert.equal(catalogSnippet({ title: 'A Book', slug: 'a-book', format: 'Book' }), '- [A Book](books/a-book/) — Book');
assert.equal(crc32(new TextEncoder().encode('123456789')), 0xcbf43926);

const zip = zipStore({
  'sample/README.md': '# Sample\n',
  'sample/reader.json': '{"version":1}\n',
  'sample/RIGHTS.md': 'All Rights Reserved\n',
  'sample/rights.json': '{"schemaVersion":1}\n',
}, new Date(2026, 7, 25, 7, 0, 0));
assert.equal(zip[0], 0x50);
assert.equal(zip[1], 0x4b);
assert.equal(zip[2], 0x03);
assert.equal(zip[3], 0x04);
const decoded = new TextDecoder().decode(zip);
assert.match(decoded, /sample\/README\.md/);
assert.match(decoded, /sample\/reader\.json/);
assert.match(decoded, /sample\/RIGHTS\.md/);
assert.match(decoded, /sample\/rights\.json/);
assert.equal(zip.at(-22), 0x50);
assert.equal(zip.at(-21), 0x4b);
assert.equal(zip.at(-20), 0x05);
assert.equal(zip.at(-19), 0x06);
assert.throws(() => zipStore({ '../escape.txt': 'no' }), /Unsafe archive path/);

const source = readFileSync(new URL('./new-publication.js', import.meta.url), 'utf8');
assert.doesNotMatch(source, /observer\.observe\(document\.body/);
assert.match(source, /observer\.observe\(rootEditLink, \{ attributes: true, attributeFilter: \['href'\] \}\)/);
assert.match(source, /catalog\.href !== target/);

console.log('new publication studio tests ok');
