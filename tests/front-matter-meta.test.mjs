import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../reader/js/catalog.js', import.meta.url), 'utf8');
const encoded = Buffer.from(source).toString('base64');
const { parseFrontMatterMeta } = await import(`data:text/javascript;base64,${encoded}`);

assert.deepEqual(
  parseFrontMatterMeta('# Appeal\n\n*Why Decisions Feel Different When Machines Can Act*\n\n**Sven Hardy Benson**\n\n© 2026 Sven Hardy Benson. All Rights Reserved.\n\n---\n'),
  { title: 'Appeal', subtitle: 'Why Decisions Feel Different When Machines Can Act', year: '2026' }
);

assert.deepEqual(
  parseFrontMatterMeta('# Face the Strange\n\n**Sven Hardy Benson**\n\n© 2026 Sven Hardy Benson. All Rights Reserved.\n\n---\n'),
  { title: 'Face the Strange', subtitle: '', year: '2026' }
);

assert.deepEqual(
  parseFrontMatterMeta('# Legacy Book\n\n## A Legacy Subtitle\n\n**An Author**\n\n© 2025 An Author\n'),
  { title: 'Legacy Book', subtitle: 'A Legacy Subtitle', year: '2025' }
);

assert.deepEqual(
  parseFrontMatterMeta('# Title Only\n\n## Contents\n\nText begins here.\n'),
  { title: 'Title Only', subtitle: '', year: '' }
);

assert.deepEqual(
  parseFrontMatterMeta('# Plain Legacy\n\nA subtitle that predates the title-page contract.\n\n© 2024 Someone\n'),
  { title: 'Plain Legacy', subtitle: 'A subtitle that predates the title-page contract', year: '2024' }
);

console.log('front matter metadata tests ok');
