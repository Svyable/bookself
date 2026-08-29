const DEFAULT_VIEWPORT = Object.freeze({ width: 1280, height: 800 });

function finiteDimension(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function classifyViewport(width, height, { coarse = false } = {}) {
  const w = finiteDimension(width, DEFAULT_VIEWPORT.width);
  const h = finiteDimension(height, DEFAULT_VIEWPORT.height);
  const short = Math.min(w, h);
  const orientation = w >= h ? 'landscape' : 'portrait';

  let device = 'desktop';
  if (w < 720 || short < 480) device = 'phone';
  else if (w < 1180 || coarse) device = 'tablet';

  const spreadRecommended = (
    w >= 1120
    && h >= 620
    && (orientation === 'landscape' || (!coarse && w >= 1280))
  );

  return {
    width: w,
    height: h,
    short,
    orientation,
    device,
    coarse: !!coarse,
    spreadRecommended,
  };
}

export function viewportSnapshot(win = window) {
  const vv = win.visualViewport;
  const width = vv?.width || win.innerWidth || DEFAULT_VIEWPORT.width;
  const height = vv?.height || win.innerHeight || DEFAULT_VIEWPORT.height;
  const coarse = !!win.matchMedia?.('(pointer: coarse)').matches;
  return classifyViewport(width, height, { coarse });
}

function root() {
  return document.documentElement;
}

function setViewportCss(snapshot) {
  const el = root();
  el.dataset.readerDevice = snapshot.device;
  el.dataset.readerOrientation = snapshot.orientation;
  el.dataset.readerPointer = snapshot.coarse ? 'coarse' : 'fine';
  el.dataset.readerSpreadRecommended = String(snapshot.spreadRecommended);
  el.style.setProperty('--reader-viewport-width', `${snapshot.width}px`);
  el.style.setProperty('--reader-viewport-height', `${snapshot.height}px`);
}

function syncSpreadState() {
  const right = document.getElementById('pageRight');
  const wrapper = document.getElementById('pagesWrapper');
  if (!wrapper) return;
  const spread = !!right?.classList.contains('active');
  wrapper.dataset.readerSpread = spread ? 'spread' : 'single';
}

function syncPageSemantics() {
  const wrapper = document.getElementById('pagesWrapper');
  if (wrapper) {
    wrapper.setAttribute('role', 'group');
    wrapper.setAttribute('aria-roledescription', 'book pages');
  }

  for (const id of ['pageLeft', 'pageRight']) {
    const page = document.getElementById(id);
    if (!page) continue;
    page.setAttribute('role', 'article');
    page.setAttribute('aria-roledescription', 'page');
    const number = page.querySelector('.page-num')?.textContent?.trim();
    if (number) page.setAttribute('aria-label', `Page ${number}`);
    else page.removeAttribute('aria-label');
  }
}

function afterFrames(count, callback) {
  const step = () => {
    if (count <= 0) {
      callback();
      return;
    }
    count -= 1;
    requestAnimationFrame(step);
  };
  step();
}

function createRepaginator() {
  let timer = 0;
  let lastAt = 0;
  return function requestRepaginate(delay = 36) {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      const now = performance.now();
      if (now - lastAt < 80) return;
      lastAt = now;
      window.dispatchEvent(new Event('resize'));
    }, delay);
  };
}

function watchAdaptiveStyles(requestRepaginate) {
  let observer = null;

  const attach = (link) => {
    if (!link || link.dataset.readerSurfaceObserved === 'true') return false;
    link.dataset.readerSurfaceObserved = 'true';
    const ready = () => afterFrames(2, () => requestRepaginate(0));
    link.addEventListener('load', ready, { once: true });
    if (link.sheet) ready();
    return true;
  };

  const existing = document.querySelector('link[data-reader-navigation]');
  if (attach(existing)) return;

  observer = new MutationObserver(() => {
    const link = document.querySelector('link[data-reader-navigation]');
    if (!attach(link)) return;
    observer?.disconnect();
    observer = null;
  });
  observer.observe(document.head, { childList: true });
}

function installImmersiveChromeToggle() {
  const wrapper = document.getElementById('pagesWrapper');
  if (!wrapper) return;

  wrapper.addEventListener('click', (event) => {
    if (root().dataset.readerDevice !== 'phone') return;
    if (root().dataset.readerPointer !== 'coarse') return;
    if (document.body.dataset.stage !== 'read') return;
    if (event.target.closest('a, button, input, textarea, select, mark, .sel-pop')) return;
    if (window.getSelection?.().toString().trim()) return;
    if (document.querySelector('#tocOverlay.active, #progressPanel.active, #settingsPanel.active, #searchOverlay.active, #noteDialog.active, #helpOverlay.active')) return;

    const rect = wrapper.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const ratio = rect.width ? x / rect.width : 0;
    if (ratio < .34 || ratio > .66) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    document.body.classList.toggle('reader-chrome-hidden');
  }, true);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('reader-chrome-hidden')) {
      document.body.classList.remove('reader-chrome-hidden');
    }
  }, true);
}

export function installReadingSurface() {
  const el = root();
  if (el.dataset.readingSurfaceEnhanced === 'true') return;
  el.dataset.readingSurfaceEnhanced = 'true';

  const requestRepaginate = createRepaginator();

  const syncViewport = () => {
    setViewportCss(viewportSnapshot());
    syncSpreadState();
    syncPageSemantics();
  };

  syncViewport();
  watchAdaptiveStyles(requestRepaginate);
  installImmersiveChromeToggle();

  const coarseQuery = window.matchMedia?.('(pointer: coarse)');
  coarseQuery?.addEventListener?.('change', syncViewport);
  window.addEventListener('orientationchange', syncViewport, { passive: true });
  window.visualViewport?.addEventListener('resize', syncViewport, { passive: true });
  window.addEventListener('resize', syncViewport, { passive: true });

  const wrapper = document.getElementById('pagesWrapper');
  const right = document.getElementById('pageRight');
  const current = document.getElementById('currentPage');
  if (wrapper || right || current) {
    const observer = new MutationObserver(() => {
      syncSpreadState();
      syncPageSemantics();
    });
    if (wrapper) observer.observe(wrapper, { attributes: true, attributeFilter: ['class'] });
    if (right) observer.observe(right, { attributes: true, attributeFilter: ['class'] });
    if (current) observer.observe(current, { childList: true, subtree: true, characterData: true });
  }

  const stageObserver = new MutationObserver(() => {
    if (document.body.dataset.stage !== 'read') {
      document.body.classList.remove('reader-chrome-hidden');
    }
  });
  stageObserver.observe(document.body, { attributes: true, attributeFilter: ['data-stage'] });

  if (document.fonts) {
    el.dataset.readerFonts = document.fonts.status === 'loaded' ? 'ready' : 'loading';
    document.fonts.ready.then(() => {
      el.dataset.readerFonts = 'ready';
      afterFrames(2, () => requestRepaginate(0));
    }).catch(() => {});
    document.fonts.addEventListener?.('loading', () => {
      el.dataset.readerFonts = 'loading';
    });
    document.fonts.addEventListener?.('loadingdone', () => {
      el.dataset.readerFonts = 'ready';
      afterFrames(2, () => requestRepaginate(0));
    });
  }
}
