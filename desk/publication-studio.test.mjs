import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  PUBLICATION_STUDIO_EDITIONS,
  publicationReadiness,
} from './publication-studio.js';

test('studio keeps the edition list intentionally small', () => {
  assert.deepEqual(PUBLICATION_STUDIO_EDITIONS.map((edition) => edition.id), [
    'kindle',
    'paperback-6x9',
    'hardcover-6x9',
  ]);
  assert.equal(PUBLICATION_STUDIO_EDITIONS.filter((edition) => edition.state === 'ready').length, 1);
});

test('readiness separates export from release readiness', () => {
  assert.deepEqual(publicationReadiness('drafting', 0), {
    tone: 'neutral',
    label: 'Draft export is available',
    detail: 'Use EPUB as a proof while you write. Release readiness remains separate from export.',
  });

  assert.equal(publicationReadiness('ready', 0).tone, 'good');
  assert.equal(publicationReadiness('drafting', 2).label, 'Review 2 readiness issues');
});

test('manuscript cards expose only the focused primary action set', async () => {
  const html = await readFile(new URL('./index.html', import.meta.url), 'utf8');
  const template = html.match(/<template id="bookCardTemplate">([\s\S]*?)<\/template>/)?.[1] || '';

  assert.match(template, />Preview</);
  assert.match(template, />Publish</);
  assert.match(template, />Edit hub</);
  assert.match(template, /<summary>More<\/summary>/);
  assert.match(template, /class="export-epub-action"[^>]*hidden/);
  assert.match(template, /class="export-kdp-action"[^>]*hidden/);
  assert.match(template, /class="book-secondary-links"[\s\S]*?>Files<[\s\S]*?>History</);
});

test('print editions are honest about current capability', async () => {
  const html = await readFile(new URL('./index.html', import.meta.url), 'utf8');
  assert.match(html, /Paperback · 6 × 9/);
  assert.match(html, /Hardcover · 6 × 9/);
  assert.match(html, /Print-PDF export is not enabled yet\./);
  assert.match(html, /class="studio-export-epub"/);
});
