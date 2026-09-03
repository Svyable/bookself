import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../reader/js/catalog.js', import.meta.url), 'utf8');
const encoded = Buffer.from(source).toString('base64');
const catalog = await import(`data:text/javascript;base64,${encoded}`);

const legacy = `# Shelf\n\n## The books\n\n- [Old](books/old/)\n\n## The stand\n\n- [Elsewhere](https://example.com/)\n`;

assert.deepEqual(catalog.parsePortalCatalogManifest({ version: 1, books: ['alpha', 'beta', 'alpha', '_TEMPLATE', 'Bad Slug'] }), ['alpha', 'beta']);
assert.equal(catalog.parsePortalCatalogManifest('{not-json'), null);
assert.equal(catalog.parsePortalCatalogManifest({ version: 2, books: ['alpha'] }), null);

const overlaid = catalog.applyPortalCatalogManifest(legacy, { version: 1, books: ['alpha', 'beta'] });
assert.deepEqual(catalog.parsePortalCatalog(overlaid), ['alpha', 'beta']);
assert.match(overlaid, /## The stand\n\n- \[Elsewhere\]/);
assert.doesNotMatch(overlaid, /books\/old/);

const empty = catalog.applyPortalCatalogManifest(legacy, { version: 1, books: [] });
assert.deepEqual(catalog.parsePortalCatalog(empty), []);
assert.match(empty, /## The books\n## The stand/);

const fallback = catalog.applyPortalCatalogManifest(legacy, '{bad-json');
assert.equal(fallback, legacy);

const inserted = catalog.applyPortalCatalogManifest('# Shelf\n', { version: 1, books: ['alpha'] });
assert.deepEqual(catalog.parsePortalCatalog(inserted), ['alpha']);

console.log('catalog manifest tests ok');
