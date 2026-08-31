import {
  READER_QUALITY_SCENARIOS,
  evaluateReaderScenario,
  summarizeReaderQuality,
} from './contracts.js';

const resultScript = document.getElementById('reader-quality-result');
const summaryNode = document.getElementById('qualitySummary');
const resultsNode = document.getElementById('qualityResults');
const frameHost = document.getElementById('qualityFrames');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function fixtureMarkup(spec) {
  const rightPage = spec.spread === 'spread'
    ? '<section class="page-surface active right" id="pageRight"><div class="page-running">Quality chapter</div><div class="page-inner"><h2>Second leaf</h2><p>Spread geometry should stay inside the reader stage.</p></div><div class="page-num">2</div></section>'
    : '<section class="page-surface right" id="pageRight" hidden><div class="page-inner"></div></section>';
  const longToken = 'https://example.test/' + 'unbroken-reader-token-'.repeat(10);
  const code = 'const difficultContent = "' + '0123456789abcdef'.repeat(18) + '";';
  const cells = Array.from({ length: 12 }, (_, index) => `<td>Column ${index + 1} · ${'data'.repeat(5)}</td>`).join('');
  const scrollHidden = spec.mode === 'scroll' ? '' : ' hidden';

  return `<!doctype html>
<html lang="en" data-reader-device="${spec.device}" data-reader-orientation="${spec.orientation}" data-reader-mode="${spec.mode}" data-reader-measure="balanced" data-reader-font="book" data-reader-leading="normal" data-reader-align="left" data-reader-indent="off" data-reader-hyphens="auto">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <base href="../../reader/">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/experience.css">
  <link rel="stylesheet" href="css/experience-scroll.css">
  <link rel="stylesheet" href="css/navigation.css">
  <link rel="stylesheet" href="css/content-scroll-regions.css">
  <style>
    .quality-token { display:block; max-width:100%; }
    .quality-code > code { display: inline-block; min-width: 58rem; }
    .quality-table td { white-space: nowrap; }
  </style>
</head>
<body data-stage="read">
  <div class="app">
    <header class="app-header is-reading" id="readerChrome">
      <div class="header-left"><button class="logo" type="button" aria-label="Library"><span class="logo-mark">⌘</span></button></div>
      <div class="header-right">
        <button class="header-btn" type="button" aria-label="Bookmark">B</button>
        <button class="header-btn" type="button" aria-label="Search">S</button>
        <button class="header-btn" type="button" aria-label="Contents">C</button>
        <button class="header-btn" type="button" aria-label="Settings">T</button>
        <span class="reading-time">~12m left</span>
      </div>
    </header>
    <div class="progress-bar-container"><div class="progress-bar" style="width:42%"></div></div>
    <main class="stage">
      <section class="book-stage" id="bookStage">
        <div class="pages-wrapper active" id="pagesWrapper" data-reader-spread="${spec.spread}">
          <section class="page-surface active left" id="pageLeft">
            <div class="page-running">Quality chapter</div>
            <div class="page-inner">
              <h1>Reader quality specimen</h1>
              <p>Typography, difficult content, controls, and responsive geometry share one deterministic fixture.</p>
              <p><a href="#" class="quality-token">${longToken}</a></p>
              <pre class="quality-code"><code>${code}</code></pre>
              <table class="quality-table"><tbody><tr>${cells}</tr></tbody></table>
            </div>
            <div class="page-num">1</div>
          </section>
          <div class="gutter"></div>
          ${rightPage}
        </div>
        <div class="scroll-reader" id="scrollReader"${scrollHidden}>
          <article class="scroll-document">
            <section class="scroll-chapter" data-chapter="quality">
              <div class="scroll-block"><h1>Reader quality specimen</h1></div>
              <div class="scroll-block"><p>Continuous reading keeps the same difficult-content and typography contracts.</p></div>
              <div class="scroll-block"><p><a href="#" class="quality-token">${longToken}</a></p></div>
              <div class="scroll-block"><pre class="quality-code"><code>${code}</code></pre></div>
              <div class="scroll-block"><table class="quality-table"><tbody><tr>${cells}</tr></tbody></table></div>
            </section>
          </article>
        </div>
      </section>
    </main>
    <nav class="page-nav" id="pageNav">
      <button class="nav-btn" type="button" aria-label="Previous page">‹</button>
      <div class="nav-center"><span class="page-indicator">1 / 10</span></div>
      <button class="nav-btn" type="button" aria-label="Next page">›</button>
    </nav>
  </div>
</body>
</html>`;
}

function rectObject(rect) {
  return rect ? {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  } : null;
}

function visible(element, view) {
  if (!element || element.hidden) return false;
  const style = view.getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
}

function measure(frame) {
  const view = frame.contentWindow;
  const doc = frame.contentDocument;
  const html = doc.documentElement;
  const body = doc.body;
  const header = doc.getElementById('readerChrome');
  const pageNav = doc.getElementById('pageNav');
  const scrollReader = doc.getElementById('scrollReader');
  const scrollDocument = doc.querySelector('.scroll-document');
  const wrapper = doc.getElementById('pagesWrapper');
  const pages = [...doc.querySelectorAll('.page-surface')].filter((element) => visible(element, view));
  const targets = (selector) => [...doc.querySelectorAll(selector)]
    .filter((element) => visible(element, view))
    .map((element) => rectObject(element.getBoundingClientRect()));
  const longTokens = [...doc.querySelectorAll('.quality-token')]
    .filter((element) => visible(element, view))
    .map((element) => ({ clientWidth: element.clientWidth, scrollWidth: element.scrollWidth }));
  const wideRegions = [...doc.querySelectorAll('.quality-code, .quality-table')]
    .filter((element) => visible(element, view))
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        rectLeft: rect.left,
        rectRight: rect.right,
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      };
    });

  return {
    viewportWidth: html.clientWidth,
    viewportHeight: html.clientHeight,
    horizontalOverflow: Math.max(html.scrollWidth, body.scrollWidth) - html.clientWidth,
    pointerCoarse: view.matchMedia('(pointer: coarse)').matches,
    headerRect: rectObject(header?.getBoundingClientRect()),
    headerTargets: targets('.app-header .header-btn, .app-header .logo'),
    pageNavDisplay: pageNav ? view.getComputedStyle(pageNav).display : 'none',
    navTargets: targets('.page-nav .nav-btn'),
    scrollReaderDisplay: scrollReader ? view.getComputedStyle(scrollReader).display : 'none',
    scrollReaderRect: rectObject(scrollReader?.getBoundingClientRect()),
    scrollDocumentRect: rectObject(scrollDocument?.getBoundingClientRect()),
    visiblePageCount: pages.length,
    pageRects: pages.map((page) => rectObject(page.getBoundingClientRect())),
    wrapperRect: rectObject(wrapper?.getBoundingClientRect()),
    longTokens,
    wideRegions,
  };
}

function settle(frame) {
  return new Promise((resolve) => {
    frame.addEventListener('load', () => {
      const view = frame.contentWindow;
      const finish = () => view.requestAnimationFrame(() => view.requestAnimationFrame(resolve));
      const fonts = frame.contentDocument.fonts?.ready;
      if (fonts?.then) {
        Promise.race([fonts, new Promise((done) => view.setTimeout(done, 1200))]).then(finish, finish);
      } else {
        finish();
      }
    }, { once: true });
  });
}

async function runScenario(spec) {
  const frame = document.createElement('iframe');
  frame.title = spec.label;
  frame.className = 'quality-frame';
  frame.style.width = `${spec.width}px`;
  frame.style.height = `${spec.height}px`;
  frame.setAttribute('aria-hidden', 'true');
  frame.tabIndex = -1;
  const ready = settle(frame);
  frame.srcdoc = fixtureMarkup(spec);
  frameHost.appendChild(frame);
  await ready;
  const metrics = measure(frame);
  const result = evaluateReaderScenario(spec, metrics);
  frame.remove();
  return result;
}

function renderResult(result) {
  const item = document.createElement('li');
  item.className = result.pass ? 'pass' : 'fail';
  const details = result.failures.length
    ? `<ul>${result.failures.map((failure) => `<li><code>${escapeHtml(failure.id)}</code> ${escapeHtml(failure.message)}</li>`).join('')}</ul>`
    : '<p>All geometry/content contracts passed.</p>';
  item.innerHTML = `<strong>${escapeHtml(result.label)}</strong><span>${result.pass ? 'PASS' : 'FAIL'} · ${escapeHtml(result.pointer)} pointer</span>${details}`;
  resultsNode.appendChild(item);
}

async function run() {
  const results = [];
  for (const spec of READER_QUALITY_SCENARIOS) {
    const result = await runScenario(spec);
    results.push(result);
    renderResult(result);
  }
  const summary = summarizeReaderQuality(results);
  const payload = { summary, results };
  resultScript.textContent = JSON.stringify(payload);
  document.body.dataset.qualityStatus = summary.pass ? 'pass' : 'fail';
  summaryNode.textContent = summary.pass
    ? `${summary.passed}/${summary.total} responsive Reader scenarios passed.`
    : `${summary.failed}/${summary.total} responsive Reader scenarios failed.`;
  window.__BOOKSELF_READER_QUALITY__ = payload;
}

run().catch((error) => {
  const payload = {
    summary: { total: 0, passed: 0, failed: 1, pass: false },
    error: error instanceof Error ? error.message : String(error),
    results: [],
  };
  resultScript.textContent = JSON.stringify(payload);
  document.body.dataset.qualityStatus = 'fail';
  summaryNode.textContent = `Reader quality lab failed to run: ${payload.error}`;
});
