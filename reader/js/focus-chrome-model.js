export const FOCUS_CHROME_IDLE_MS = 2400;

export function focusChromeEligible({
  stage = '',
  focusMode = false,
  documentHidden = false,
  overlayOpen = false,
  selectionActive = false,
  controlFocus = false,
} = {}) {
  return stage === 'read'
    && !!focusMode
    && !documentHidden
    && !overlayOpen
    && !selectionActive
    && !controlFocus;
}

export function focusChromeState(input = {}) {
  if (!focusChromeEligible(input)) return 'visible';
  return input.idle ? 'hidden' : 'visible';
}

export function shouldConsumeRevealPointer({
  chromeHidden = false,
  pointerType = '',
  interactiveTarget = false,
  selectionActive = false,
} = {}) {
  if (!chromeHidden || interactiveTarget || selectionActive) return false;
  return pointerType === 'touch' || pointerType === 'pen';
}

export function focusChromeRevealZone(clientY, viewportHeight, {
  top = 72,
  bottom = 88,
} = {}) {
  const y = Number(clientY);
  const height = Number(viewportHeight);
  if (!Number.isFinite(y) || !Number.isFinite(height) || height <= 0) return 'none';
  if (y <= Math.max(0, top)) return 'top';
  if (y >= Math.max(0, height - bottom)) return 'bottom';
  return 'none';
}
