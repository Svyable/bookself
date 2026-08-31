import assert from 'node:assert/strict';
import {
  READER_QUALITY_SCENARIOS,
  evaluateReaderScenario,
  requiredNavTarget,
  summarizeReaderQuality,
} from './contracts.js';

assert.equal(READER_QUALITY_SCENARIOS.length, 7);
assert.equal(requiredNavTarget(false), 48);
assert.equal(requiredNavTarget(true), 52);

const paged = READER_QUALITY_SCENARIOS[0];
const goodPaged = {
  viewportWidth: 1280,
  viewportHeight: 800,
  horizontalOverflow: 0,
  pointerCoarse: false,
  headerRect: { left: 0, top: 0, right: 1280, bottom: 56 },
  headerTargets: [{ width: 44, height: 44 }, { width: 48, height: 44 }],
  pageNavDisplay: 'flex',
  navTargets: [{ width: 48, height: 48 }, { width: 48, height: 48 }],
  scrollReaderDisplay: 'none',
  visiblePageCount: 2,
  wrapperRect: { left: 100, top: 60, right: 1180, bottom: 740 },
  pageRects: [
    { left: 100, top: 60, right: 637, bottom: 740 },
    { left: 643, top: 60, right: 1180, bottom: 740 },
  ],
  longTokens: [{ clientWidth: 520, scrollWidth: 520 }],
  wideRegions: [{ rectLeft: 140, rectRight: 600, clientWidth: 460, scrollWidth: 780 }],
};
assert.equal(evaluateReaderScenario(paged, goodPaged).pass, true);

const headerSmall = structuredClone(goodPaged);
headerSmall.headerTargets[0].width = 42;
assert.equal(evaluateReaderScenario(paged, headerSmall).failures.some((f) => f.id === 'header-targets'), true);

const navSmall = structuredClone(goodPaged);
navSmall.navTargets[0].height = 47;
assert.equal(evaluateReaderScenario(paged, navSmall).failures.some((f) => f.id === 'page-nav-targets'), true);

const coarseSmall = structuredClone(goodPaged);
coarseSmall.pointerCoarse = true;
coarseSmall.navTargets = [{ width: 51, height: 52 }, { width: 52, height: 52 }];
assert.equal(evaluateReaderScenario(paged, coarseSmall).failures.some((f) => f.id === 'page-nav-targets'), true);

const overflow = structuredClone(goodPaged);
overflow.horizontalOverflow = 3;
assert.equal(evaluateReaderScenario(paged, overflow).failures.some((f) => f.id === 'viewport-overflow'), true);

const wrongSpread = structuredClone(goodPaged);
wrongSpread.visiblePageCount = 1;
assert.equal(evaluateReaderScenario(paged, wrongSpread).failures.some((f) => f.id === 'visible-pages'), true);

const tokenOverflow = structuredClone(goodPaged);
tokenOverflow.longTokens = [{ clientWidth: 500, scrollWidth: 520 }];
assert.equal(evaluateReaderScenario(paged, tokenOverflow).failures.some((f) => f.id === 'long-token-wrap'), true);

const wideEscapes = structuredClone(goodPaged);
wideEscapes.wideRegions = [{ rectLeft: 20, rectRight: 1290, clientWidth: 500, scrollWidth: 800 }];
assert.equal(evaluateReaderScenario(paged, wideEscapes).failures.some((f) => f.id === 'wide-region-contained'), true);

const wideNotScrollable = structuredClone(goodPaged);
wideNotScrollable.wideRegions = [{ rectLeft: 20, rectRight: 600, clientWidth: 580, scrollWidth: 581 }];
assert.equal(evaluateReaderScenario(paged, wideNotScrollable).failures.some((f) => f.id === 'wide-region-scrollable'), true);

const scroll = READER_QUALITY_SCENARIOS.find((scenario) => scenario.id === 'phone-continuous');
const goodScroll = {
  viewportWidth: 390,
  viewportHeight: 844,
  horizontalOverflow: 0,
  pointerCoarse: true,
  headerRect: { left: 0, top: 0, right: 390, bottom: 56 },
  headerTargets: [{ width: 44, height: 44 }],
  pageNavDisplay: 'none',
  navTargets: [],
  scrollReaderDisplay: 'block',
  visiblePageCount: 0,
  scrollReaderRect: { left: 0, top: 59, right: 390, bottom: 844 },
  scrollDocumentRect: { left: 16, top: 110, right: 374, bottom: 1600 },
  longTokens: [{ clientWidth: 358, scrollWidth: 358 }],
  wideRegions: [{ rectLeft: 16, rectRight: 374, clientWidth: 358, scrollWidth: 740 }],
};
assert.equal(evaluateReaderScenario(scroll, goodScroll).pass, true);

const visiblePagedNav = structuredClone(goodScroll);
visiblePagedNav.pageNavDisplay = 'flex';
assert.equal(evaluateReaderScenario(scroll, visiblePagedNav).failures.some((f) => f.id === 'paged-nav-hidden'), true);

const hiddenScroll = structuredClone(goodScroll);
hiddenScroll.scrollReaderDisplay = 'none';
assert.equal(evaluateReaderScenario(scroll, hiddenScroll).failures.some((f) => f.id === 'scroll-reader-visible'), true);

const summary = summarizeReaderQuality([
  { pass: true },
  { pass: true },
  { pass: false },
]);
assert.deepEqual(summary, { total: 3, passed: 2, failed: 1, pass: false });
assert.equal(summarizeReaderQuality([{ pass: true }]).pass, true);
assert.equal(summarizeReaderQuality([]).pass, false);

console.log('reader quality contracts tests ok (17 assertions)');
