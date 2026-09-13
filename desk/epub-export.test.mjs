import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parsePublicationMetadata,
  resolveBookPath,
  planEpubImages,
  buildEpubFiles,
  buildEpubArchive,
} from './epub-export.js';

test('publication metadata feeds EPUB identity', () => {
  const markdown = `| | |\n|---|---|\n| **Authors** | Ada Author |\n| **Language** | English |\n| **ISBN** | 978-1-2345-6789-0 |\n| **Publisher** | Example Press |\n`;
  assert.deepEqual(parsePublicationMetadata(markdown), {
    authors: 'Ada Author', language: 'English', isbn: '978-1-2345-6789-0', publisher: 'Example Press',
  });
});

test('EPUB image planning resolves chapter-relative media and deduplicates it', () => {
  assert.equal(resolveBookPath('manuscript/ch01.md', '../media/figure-1.png'), 'media/figure-1.png');
  const plan = planEpubImages([
    { title: 'One', file: 'manuscript/ch01.md', markdown: '![Diagram](../media/figure-1.png)' },
    { title: 'Two', file: 'manuscript/ch02.md', markdown: 'Again ![Diagram](../media/figure-1.png)' },
  ]);
  assert.equal(plan.assets.length, 1);
  assert.equal(plan.assets[0].mediaType, 'image/png');
  assert.equal(plan.chapters[0].imageMap['../media/figure-1.png'], plan.assets[0].href);
  assert.throws(() => resolveBookPath('manuscript/ch01.md', '../../secret.png'), /escapes the book folder/);
  assert.throws(() => planEpubImages([{ title: 'One', file: 'manuscript/ch01.md', markdown: '![Remote](https://example.com/a.png)' }]), /book-local images/);
});

test('EPUB files include navigation, metadata, chapters, and packaged images', () => {
  const files = buildEpubFiles({
    title: 'A Test Book',
    author: 'Ada Author',
    metadata: { language: 'English', isbn: '978-1-2345-6789-0', publisher: 'Example Press' },
    modified: '2026-09-12T00:00:00Z',
    chapters: [{
      title: 'First',
      file: 'manuscript/ch01.md',
      markdown: 'Hello.\n\n![Diagram](../media/figure.png)',
      imageMap: { '../media/figure.png': 'assets/001-figure.png' },
    }],
    assets: {
      'assets/001-figure.png': { mediaType: 'image/png', data: new Uint8Array([1, 2, 3]) },
    },
  });
  assert.equal(files.mimetype, 'application/epub+zip');
  assert.match(files['META-INF/container.xml'], /EPUB\/package\.opf/);
  assert.match(files['EPUB/package.opf'], /urn:isbn:9781234567890/);
  assert.match(files['EPUB/package.opf'], /image\/png/);
  assert.match(files['EPUB/nav.xhtml'], /chapter-001\.xhtml/);
  assert.match(files['EPUB/chapter-001.xhtml'], /src="assets\/001-figure\.png"/);
  assert.deepEqual(files['EPUB/assets/001-figure.png'], new Uint8Array([1, 2, 3]));
});

test('EPUB archive stores mimetype as the first ZIP entry', () => {
  const archive = buildEpubArchive({
    title: 'A Test Book',
    author: 'Ada Author',
    metadata: { language: 'English' },
    modified: '2026-09-12T00:00:00Z',
    chapters: [{ title: 'First', file: 'manuscript/ch01.md', markdown: 'Hello.' }],
  }, new Date('2026-09-12T00:00:00Z'));
  assert.equal(String.fromCharCode(...archive.slice(0, 4)), 'PK\u0003\u0004');
  const nameLength = archive[26] | (archive[27] << 8);
  const firstName = new TextDecoder().decode(archive.slice(30, 30 + nameLength));
  assert.equal(firstName, 'mimetype');
  const firstData = new TextDecoder().decode(archive.slice(30 + nameLength, 30 + nameLength + 'application/epub+zip'.length));
  assert.equal(firstData, 'application/epub+zip');
});
