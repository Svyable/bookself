import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

const catalog = JSON.parse(await read('catalog.json'));
assert.equal(catalog.version, 1);
assert.ok(Array.isArray(catalog.books));
assert.ok(catalog.books.length >= 8, 'demo catalog should contain a useful neutral specimen set');
assert.equal(new Set(catalog.books).size, catalog.books.length, 'demo catalog should not contain duplicate slugs');

for (const slug of catalog.books) {
  assert.match(slug, /^[a-z0-9][a-z0-9-]*$/);
  assert.ok(!slug.startsWith('_'), `blank starter must not appear in demo catalog: ${slug}`);
  const publication = await read(`books/${slug}/README.md`);
  assert.match(publication, /\|\s*\*\*Status\*\*\s*\|\s*Published\s*\|/i, `${slug} must be deliberately Published before appearing on the demo Shelf`);
}

const projectReadme = await read('README.md');
const sharedReader = await read('reader/index.html');
const demoShelf = await read('shelf/reader/index.html');
const shelfReadme = await read('shelf/README.md');

const personalShelf = 'https://svyable.github.io/shelf/reader/';
const embeddedShelf = 'https://svyable.github.io/bookself/shelf/reader/';

assert.match(projectReadme, new RegExp(embeddedShelf.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
assert.ok(!projectReadme.includes(personalShelf), 'project README must not promote a personal Shelf');
assert.ok(!sharedReader.includes(personalShelf), 'shared Reader must not hard-code a personal Shelf');
assert.ok(!demoShelf.includes(personalShelf), 'embedded demo Shelf must not depend on a personal Shelf');
assert.ok(!shelfReadme.includes(personalShelf), 'embedded Shelf documentation must not depend on a personal Shelf');
assert.match(demoShelf, /<iframe\s+src="\.\.\/\.\.\/reader\/"/i);

console.log('demo shelf tests ok');
