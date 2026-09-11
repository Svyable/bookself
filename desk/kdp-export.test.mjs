import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseManuscriptChecklist,
  markdownToKdpHtml,
  buildKdpHtml,
} from './kdp-export.js';

test('parseManuscriptChecklist preserves manuscript order', () => {
  const markdown = `# Book\n\n- [x] [Preface](manuscript/00-preface.md)\n- [ ] [Chapter One](manuscript/ch01.md)\n`;
  assert.deepEqual(parseManuscriptChecklist(markdown), [
    { checked: true, title: 'Preface', file: 'manuscript/00-preface.md' },
    { checked: false, title: 'Chapter One', file: 'manuscript/ch01.md' },
  ]);
});

test('markdownToKdpHtml emits portable semantic HTML', () => {
  const html = markdownToKdpHtml('# Opening\n\nHello **reader**.\n\n- One\n- Two');
  assert.match(html, /<h2>Opening<\/h2>/);
  assert.match(html, /<strong>reader<\/strong>/);
  assert.match(html, /<ul>/);
  assert.match(html, /<li>Two<\/li>/);
});

test('buildKdpHtml creates a title page, linked contents, and chapter breaks', () => {
  const html = buildKdpHtml({
    title: 'A Test Book',
    author: 'Ada Author',
    chapters: [
      { title: 'First', markdown: 'Hello.' },
      { title: 'Second', markdown: 'World.' },
    ],
  });
  assert.match(html, /<title>A Test Book<\/title>/);
  assert.match(html, /Ada Author/);
  assert.match(html, /href="#chapter-1-first"/);
  assert.match(html, /class="chapter" id="chapter-2-second"/);
  assert.match(html, /break-before: page/);
});
