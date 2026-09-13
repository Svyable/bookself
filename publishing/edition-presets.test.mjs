import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const readJson = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));

const presets = readJson('./edition-presets.json');
const starter = (path) => JSON.parse(readFileSync(new URL(`../books/_TEMPLATE/${path}`, import.meta.url), 'utf8'));

test('edition preset file carries a reviewed platform contract', () => {
  assert.equal(presets.schemaVersion, 1);
  assert.match(presets.reviewed, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(presets.amazonKdp.paperback.coverBleed, 0.125);
  assert.equal(presets.amazonKdp.paperback.spineInchesPerPage['black-white-cream'], 0.0025);
  assert.equal(presets.amazonKdp.hardcover.binding, 'case-laminate');
});

test('KDP paperback trims fit the declared custom trim envelope', () => {
  const { customTrim, trimSizes } = presets.amazonKdp.paperback;
  assert.ok(trimSizes.some(({ width, height }) => width === 6 && height === 9));
  for (const trim of trimSizes) {
    assert.ok(trim.width >= customTrim.minWidth && trim.width <= customTrim.maxWidth, `${trim.width} width outside custom envelope`);
    assert.ok(trim.height >= customTrim.minHeight && trim.height <= customTrim.maxHeight, `${trim.height} height outside custom envelope`);
  }
});

test('KDP hardcover contract exposes the current five trim presets', () => {
  const trims = presets.amazonKdp.hardcover.trimSizes;
  assert.equal(trims.length, 5);
  assert.deepEqual(trims[1], { width: 6, height: 9 });
  assert.equal(presets.amazonKdp.hardcover.minimumPages, 75);
  assert.equal(presets.amazonKdp.hardcover.maximumPages, 550);
});

test('blank book production manifests are valid and source-oriented', () => {
  const cover = starter('cover/cover.json');
  const kindle = starter('editions/kindle.json');
  const paperback = starter('editions/paperback-6x9.json');
  const hardcover = starter('editions/hardcover-6x9.json');

  assert.equal(cover.sourceMode, 'artwork-plus-deterministic-type');
  assert.equal(cover.front.textInArtwork, false);
  assert.equal(kindle.format, 'epub-reflowable');
  assert.deepEqual(paperback.trim, { width: 6, height: 9, units: 'in' });
  assert.equal(paperback.interior.pageCount, null);
  assert.equal(hardcover.binding, 'case-laminate');
  assert.equal(hardcover.interior.pageCount, null);
});
