export const PUBLICATION_STUDIO_EDITIONS = Object.freeze([
  Object.freeze({ id: 'kindle', label: 'Kindle eBook', detail: 'Reflowable EPUB', state: 'ready' }),
  Object.freeze({ id: 'paperback-6x9', label: 'Paperback · 6 × 9', detail: 'Trade print edition', state: 'setup' }),
  Object.freeze({ id: 'hardcover-6x9', label: 'Hardcover · 6 × 9', detail: 'Case-laminate print edition', state: 'setup' }),
]);

export function publicationReadiness(state = 'drafting', issueCount = 0) {
  const issues = Math.max(0, Number(issueCount) || 0);
  if (issues > 0) {
    return {
      tone: 'warn',
      label: `Review ${issues} readiness issue${issues === 1 ? '' : 's'}`,
      detail: 'You can still export a proof. Resolve the items on the manuscript card before treating it as release-ready.',
    };
  }
  if (state === 'ready' || state === 'published') {
    return {
      tone: 'good',
      label: state === 'published' ? 'Released edition is structurally healthy' : 'Manuscript structure looks ready',
      detail: 'EPUB export is available now. Print editions still need final pagination and cover geometry.',
    };
  }
  return {
    tone: 'neutral',
    label: 'Draft export is available',
    detail: 'Use EPUB as a proof while you write. Release readiness remains separate from export.',
  };
}

function issueCountForCard(card) {
  const value = card?.querySelector('.health-chip')?.textContent || '';
  return Number(value.match(/\d+/)?.[0] || 0);
}

function sourceGuideUrl() {
  return new URL('../docs/covers-and-editions.md', location.href).href;
}

function syncExportButton(button, trigger, idleLabel) {
  const update = () => {
    const text = trigger.textContent?.trim() || '';
    if (/packaging|building/i.test(text)) {
      button.textContent = text;
      button.setAttribute('aria-busy', 'true');
      button.disabled = true;
      return;
    }
    if (/downloaded/i.test(text)) {
      button.textContent = 'Downloaded';
      button.removeAttribute('aria-busy');
      button.disabled = false;
      return;
    }
    if (/failed/i.test(text)) {
      button.textContent = 'Export failed';
      button.title = trigger.title || 'Could not export this manuscript.';
      button.removeAttribute('aria-busy');
      button.disabled = false;
      return;
    }
    button.textContent = idleLabel;
    button.removeAttribute('aria-busy');
    button.disabled = false;
  };

  const observer = new MutationObserver(update);
  observer.observe(trigger, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['title', 'aria-busy'] });
  update();
  trigger.click();
  setTimeout(() => {
    observer.disconnect();
    if (!button.disabled && !/failed/i.test(button.textContent || '')) button.textContent = idleLabel;
  }, 5000);
}

function studioElements() {
  return {
    dialog: document.getElementById('publicationStudio'),
    title: document.getElementById('studioBookTitle'),
    byline: document.getElementById('studioBookByline'),
    readiness: document.getElementById('studioReadiness'),
    readinessLabel: document.getElementById('studioReadinessLabel'),
    readinessDetail: document.getElementById('studioReadinessDetail'),
    bookFiles: document.getElementById('studioBookFiles'),
    guide: document.getElementById('studioGuide'),
    epub: document.querySelector('.studio-export-epub'),
    html: document.querySelector('.studio-export-html'),
  };
}

let activeCard = null;

function openStudio(card) {
  const ui = studioElements();
  if (!ui.dialog) return;
  activeCard = card;

  const title = card.querySelector('.book-title')?.textContent?.trim() || card.dataset.slug || 'Untitled';
  const author = card.querySelector('.book-authors')?.textContent?.trim() || '';
  const readiness = publicationReadiness(card.dataset.state, issueCountForCard(card));

  ui.title.textContent = title;
  ui.byline.textContent = author && author !== 'Author not set' ? author : 'Author not set';
  ui.readiness.dataset.tone = readiness.tone;
  ui.readinessLabel.textContent = readiness.label;
  ui.readinessDetail.textContent = readiness.detail;

  const folder = card.querySelector('.folder-action')?.href || '#';
  ui.bookFiles.href = folder;
  ui.guide.href = sourceGuideUrl();
  ui.epub.textContent = 'Download EPUB';
  ui.epub.disabled = false;
  ui.epub.removeAttribute('aria-busy');
  ui.html.textContent = 'Download HTML';
  ui.html.disabled = false;
  ui.html.removeAttribute('aria-busy');

  if (typeof ui.dialog.showModal === 'function') ui.dialog.showModal();
  else ui.dialog.setAttribute('open', '');
}

function closeStudio() {
  const dialog = document.getElementById('publicationStudio');
  if (!dialog) return;
  activeCard = null;
  if (typeof dialog.close === 'function' && dialog.open) dialog.close();
  else dialog.removeAttribute('open');
}

function bindPublicationStudio() {
  document.addEventListener('click', (event) => {
    const publish = event.target.closest('.publish-action');
    if (publish) {
      event.preventDefault();
      const card = publish.closest('.book-card');
      if (card) openStudio(card);
      return;
    }

    const close = event.target.closest('.studio-close');
    if (close) {
      event.preventDefault();
      closeStudio();
      return;
    }

    const epub = event.target.closest('.studio-export-epub');
    if (epub && activeCard) {
      event.preventDefault();
      const trigger = activeCard.querySelector('.export-epub-action');
      if (trigger) syncExportButton(epub, trigger, 'Download EPUB');
      return;
    }

    const html = event.target.closest('.studio-export-html');
    if (html && activeCard) {
      event.preventDefault();
      const trigger = activeCard.querySelector('.export-kdp-action');
      if (trigger) syncExportButton(html, trigger, 'Download HTML');
      return;
    }

    const dialog = document.getElementById('publicationStudio');
    if (dialog && event.target === dialog) closeStudio();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') activeCard = null;
  });
}

if (typeof document !== 'undefined') bindPublicationStudio();
