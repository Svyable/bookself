import { parseRoute } from './router.js';
import {
  normalizeOfflineReadiness,
  offlineReadinessLabel,
  offlineReadinessProgress,
  offlineReadinessState,
  offlineSaveAction,
  offlineSaveResultLabel,
  shouldKeepOfflineNoticeVisible,
} from './offline-readiness-model.js';

const STYLE_HREF = 'css/offline-readiness.css?v=r2';
const QUERY_TYPE = 'BOOKSELF_OFFLINE_READINESS';
const SAVE_TYPE = 'BOOKSELF_SAVE_PUBLICATION';
let pollTimer = null;
let hideTimer = null;
let requestSerial = 0;
let lastSlug = null;
let savingSlug = null;
let saveResult = 'idle';
let storagePersisted = null;
let lastReadiness = {};

function installStyles() {
  if (document.querySelector(`link[href="${STYLE_HREF}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = STYLE_HREF;
  document.head.appendChild(link);
}

function ensureNotice() {
  let notice = document.getElementById('offlineReadinessNotice');
  if (notice) return notice;
  notice = document.createElement('aside');
  notice.id = 'offlineReadinessNotice';
  notice.className = 'offline-readiness-notice';
  notice.hidden = true;
  notice.setAttribute('role', 'status');
  notice.setAttribute('aria-live', 'polite');
  notice.setAttribute('aria-atomic', 'true');
  notice.innerHTML = `
    <span class="offline-readiness-dot" aria-hidden="true"></span>
    <span class="offline-readiness-copy">
      <span class="offline-readiness-label"></span>
      <span class="offline-readiness-meter" aria-hidden="true"><span></span></span>
    </span>
    <button class="offline-readiness-action" type="button">Keep offline</button>`;
  notice.querySelector('.offline-readiness-action').addEventListener('click', () => void keepCurrentPublicationOffline());
  document.body.appendChild(notice);
  return notice;
}

function publicationReadme(slug) {
  return new URL(`../../books/${encodeURIComponent(slug)}/README.md`, import.meta.url).href;
}

async function activeWorker() {
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return null;
  if (navigator.serviceWorker.controller) return navigator.serviceWorker.controller;
  try {
    const registration = await navigator.serviceWorker.ready;
    return registration.active || null;
  } catch {
    return null;
  }
}

async function workerRequest(type, slug, timeoutMs = 1800) {
  const worker = await activeWorker();
  if (!worker || typeof MessageChannel === 'undefined') return null;
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timeout = window.setTimeout(() => resolve(null), timeoutMs);
    channel.port1.onmessage = (event) => {
      window.clearTimeout(timeout);
      resolve(event.data || null);
    };
    worker.postMessage({ type, url: publicationReadme(slug) }, [channel.port2]);
  });
}

async function queryReadiness(slug) {
  const response = await workerRequest(QUERY_TYPE, slug);
  return response?.readiness || null;
}

async function requestPersistentStorage() {
  if (!navigator.storage?.persist) return null;
  try {
    if (navigator.storage.persisted && await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return null;
  }
}

function clearTimers() {
  if (pollTimer) window.clearTimeout(pollTimer);
  if (hideTimer) window.clearTimeout(hideTimer);
  pollTimer = null;
  hideTimer = null;
}

function hideNotice() {
  const notice = ensureNotice();
  notice.hidden = true;
  notice.removeAttribute('data-state');
}

function render(state, readiness) {
  const notice = ensureNotice();
  const normalized = normalizeOfflineReadiness(readiness);
  lastReadiness = normalized;
  const explicitLabel = offlineSaveResultLabel({ result: saveResult, persisted: storagePersisted });
  const label = explicitLabel || offlineReadinessLabel({
    supported: state !== 'unsupported',
    online: navigator.onLine,
    readiness: normalized,
  });
  notice.dataset.state = state;
  notice.querySelector('.offline-readiness-label').textContent = label;
  notice.querySelector('.offline-readiness-meter > span').style.transform = `scaleX(${offlineReadinessProgress(normalized)})`;

  const action = offlineSaveAction({
    supported: state !== 'unsupported',
    online: navigator.onLine,
    readiness: normalized,
    saving: !!savingSlug,
  });
  const button = notice.querySelector('.offline-readiness-action');
  button.hidden = !action.visible;
  button.disabled = action.disabled;
  button.textContent = action.label;
  notice.hidden = false;

  if (!savingSlug && !shouldKeepOfflineNoticeVisible(state)) {
    hideTimer = window.setTimeout(hideNotice, state === 'online-ready' ? 4200 : 1800);
  }
}

async function keepCurrentPublicationOffline() {
  const route = parseRoute();
  if (route.view !== 'read' || !route.slug || !navigator.onLine || savingSlug) return;
  savingSlug = route.slug;
  saveResult = 'saving';
  storagePersisted = null;
  clearTimers();
  render('online-saving', lastReadiness);

  const persistPromise = requestPersistentStorage();
  const response = await workerRequest(SAVE_TYPE, route.slug, 45000);
  storagePersisted = await persistPromise;
  if (savingSlug !== route.slug || parseRoute().slug !== route.slug) return;

  savingSlug = null;
  const readiness = normalizeOfflineReadiness(response?.readiness || {});
  lastReadiness = readiness;
  saveResult = response?.ok && readiness.complete ? 'complete' : response ? 'partial' : 'failed';
  render(offlineReadinessState({ supported: !!response, online: navigator.onLine, readiness }), readiness);
  hideTimer = window.setTimeout(() => {
    saveResult = 'idle';
    if (readiness.complete && navigator.onLine) hideNotice();
    else void syncReadiness();
  }, 5200);
}

async function syncReadiness() {
  clearTimers();
  const route = parseRoute();
  if (route.view !== 'read' || !route.slug) {
    lastSlug = null;
    savingSlug = null;
    saveResult = 'idle';
    hideNotice();
    return;
  }
  if (lastSlug !== route.slug) {
    saveResult = 'idle';
    storagePersisted = null;
  }
  lastSlug = route.slug;
  const serial = ++requestSerial;
  const supported = 'serviceWorker' in navigator && window.isSecureContext;
  if (!supported) {
    render('unsupported', {});
    return;
  }

  const raw = await queryReadiness(route.slug);
  if (serial !== requestSerial || lastSlug !== route.slug) return;
  const readiness = normalizeOfflineReadiness(raw || {});
  const state = offlineReadinessState({ supported: !!raw, online: navigator.onLine, readiness });
  render(state, readiness);

  if (state === 'online-saving' && !savingSlug) {
    pollTimer = window.setTimeout(syncReadiness, 1400);
  }
}

function install() {
  installStyles();
  ensureNotice();
  window.addEventListener('hashchange', syncReadiness, { passive: true });
  window.addEventListener('online', syncReadiness, { passive: true });
  window.addEventListener('offline', syncReadiness, { passive: true });
  navigator.serviceWorker?.addEventListener('controllerchange', syncReadiness);
  void syncReadiness();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', install, { once: true });
} else {
  install();
}
