import {
  FOCUS_CHROME_IDLE_MS,
  focusChromeState,
  shouldConsumeRevealPointer,
  focusChromeRevealZone,
} from './focus-chrome-model.js';

const HIDDEN_CLASS = 'reader-focus-chrome-hidden';
const STYLE_ID = 'readerFocusChromeStyles';
const OVERLAY_SELECTOR = '.toc-overlay.active, .stats-overlay.active, .search-overlay.active';
const CONTROL_SELECTOR = 'button, a, input, textarea, select, [contenteditable="true"], [role="dialog"]';

let idle = false;
let idleTimer = 0;

function selectionActive() {
  return !!window.getSelection?.().toString().trim();
}

function overlayOpen() {
  return !!document.querySelector(OVERLAY_SELECTOR);
}

function controlFocus() {
  const active = document.activeElement;
  return !!active && active !== document.body && !!active.closest?.(CONTROL_SELECTOR);
}

function state() {
  return focusChromeState({
    stage: document.body.dataset.stage,
    focusMode: document.body.classList.contains('focus-mode'),
    documentHidden: document.hidden,
    overlayOpen: overlayOpen(),
    selectionActive: selectionActive(),
    controlFocus: controlFocus(),
    idle,
  });
}

function paint() {
  document.body.classList.toggle(HIDDEN_CLASS, state() === 'hidden');
}

function clearIdleTimer() {
  if (!idleTimer) return;
  window.clearTimeout(idleTimer);
  idleTimer = 0;
}

function scheduleHide() {
  clearIdleTimer();
  if (
    document.body.dataset.stage !== 'read'
    || !document.body.classList.contains('focus-mode')
    || document.hidden
    || overlayOpen()
    || selectionActive()
    || controlFocus()
  ) {
    idle = false;
    paint();
    return;
  }
  idleTimer = window.setTimeout(() => {
    idleTimer = 0;
    idle = true;
    paint();
  }, FOCUS_CHROME_IDLE_MS);
}

function reveal({ reschedule = true } = {}) {
  idle = false;
  paint();
  if (reschedule) scheduleHide();
}

function installStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    body.focus-mode[data-stage="read"] #readerChrome,
    body.focus-mode[data-stage="read"] #pageNav,
    body.focus-mode[data-stage="read"] .progress-bar-container,
    body.focus-mode[data-stage="read"] #readHint {
      transition: opacity 180ms ease, transform 220ms ease;
      will-change: opacity, transform;
    }
    body.focus-mode[data-stage="read"].${HIDDEN_CLASS} #readerChrome {
      opacity: 0;
      transform: translate3d(0, -110%, 0);
      pointer-events: none;
    }
    body.focus-mode[data-stage="read"].${HIDDEN_CLASS} #pageNav {
      opacity: 0;
      transform: translate3d(0, 110%, 0);
      pointer-events: none;
    }
    body.focus-mode[data-stage="read"].${HIDDEN_CLASS} .progress-bar-container,
    body.focus-mode[data-stage="read"].${HIDDEN_CLASS} #readHint {
      opacity: 0;
      pointer-events: none;
    }
    @media (prefers-reduced-motion: reduce) {
      body.focus-mode[data-stage="read"] #readerChrome,
      body.focus-mode[data-stage="read"] #pageNav,
      body.focus-mode[data-stage="read"] .progress-bar-container,
      body.focus-mode[data-stage="read"] #readHint {
        transition: none;
      }
    }
  `;
  document.head.appendChild(style);
}

function onPointerMove(event) {
  if (!document.body.classList.contains(HIDDEN_CLASS)) {
    reveal();
    return;
  }
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  if (focusChromeRevealZone(event.clientY, viewportHeight) !== 'none') reveal();
}

function onPointerDown(event) {
  const hidden = document.body.classList.contains(HIDDEN_CLASS);
  const interactiveTarget = !!event.target?.closest?.(CONTROL_SELECTOR);
  if (shouldConsumeRevealPointer({
    chromeHidden: hidden,
    pointerType: event.pointerType,
    interactiveTarget,
    selectionActive: selectionActive(),
  })) {
    event.preventDefault();
    event.stopImmediatePropagation();
    reveal();
    return;
  }
  reveal();
}

function bind() {
  let lastFocusMode = document.body.classList.contains('focus-mode');
  let lastStage = document.body.dataset.stage;

  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('keydown', () => reveal());
  document.addEventListener('focusin', () => reveal({ reschedule: false }));
  document.addEventListener('focusout', () => window.setTimeout(scheduleHide, 0));
  document.addEventListener('selectionchange', () => {
    if (selectionActive()) reveal({ reschedule: false });
    else scheduleHide();
  });
  document.addEventListener('visibilitychange', () => {
    idle = false;
    paint();
    if (!document.hidden) scheduleHide();
  });

  const observer = new MutationObserver((mutations) => {
    const focusMode = document.body.classList.contains('focus-mode');
    const stage = document.body.dataset.stage;
    const overlayChanged = mutations.some((mutation) => mutation.target !== document.body);
    if (!overlayChanged && focusMode === lastFocusMode && stage === lastStage) return;
    lastFocusMode = focusMode;
    lastStage = stage;
    idle = false;
    paint();
    scheduleHide();
  });
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class', 'data-stage'],
    subtree: false,
  });
  document.querySelectorAll('.toc-overlay, .stats-overlay, .search-overlay').forEach((overlay) => {
    observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });
  });
}

function initialize() {
  installStyles();
  bind();
  reveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
  initialize();
}
