function install() {
  const root = document.documentElement;
  const body = document.body;
  if (!root || !body) return;

  const sync = () => {
    const stage = body.dataset.stage || '';
    const device = root.dataset.readerDevice || '';
    const pointer = root.dataset.readerPointer || '';
    const orientation = root.dataset.readerOrientation || '';
    const compact = device === 'phone' || device === 'tablet';
    const coarse = pointer === 'coarse';
    const portrait = orientation === 'portrait';
    const reading = stage === 'book';
    const active = reading && compact && (coarse || portrait);

    body.classList.toggle('reader-one-handed', active);
  };

  const observer = new MutationObserver(sync);
  observer.observe(root, {
    attributes: true,
    attributeFilter: ['data-reader-device', 'data-reader-pointer', 'data-reader-orientation'],
  });
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['data-stage', 'class'],
    subtree: false,
  });

  const controls = document.querySelector('.header-right');
  if (controls) {
    observer.observe(controls, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['aria-pressed', 'class', 'hidden'],
    });
  }
  sync();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
}
