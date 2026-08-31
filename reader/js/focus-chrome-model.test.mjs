import assert from 'node:assert/strict';
import {
  FOCUS_CHROME_IDLE_MS,
  focusChromeEligible,
  focusChromeState,
  shouldConsumeRevealPointer,
  focusChromeRevealZone,
} from './focus-chrome-model.js';

let assertions = 0;
const check = (actual, expected, message) => {
  assertions += 1;
  assert.deepEqual(actual, expected, message);
};

check(FOCUS_CHROME_IDLE_MS, 2400, 'idle delay stays intentional');
check(focusChromeEligible({ stage: 'read', focusMode: true }), true, 'active focused reading is eligible');
check(focusChromeEligible({ stage: 'cover', focusMode: true }), false, 'cover never hides chrome');
check(focusChromeEligible({ stage: 'library', focusMode: true }), false, 'library never hides chrome');
check(focusChromeEligible({ stage: 'read', focusMode: false }), false, 'ordinary reading keeps chrome');
check(focusChromeEligible({ stage: 'read', focusMode: true, documentHidden: true }), false, 'background tab does not manage hidden chrome');
check(focusChromeEligible({ stage: 'read', focusMode: true, overlayOpen: true }), false, 'open overlays force controls visible');
check(focusChromeEligible({ stage: 'read', focusMode: true, selectionActive: true }), false, 'selection keeps actions reachable');
check(focusChromeEligible({ stage: 'read', focusMode: true, controlFocus: true }), false, 'keyboard focus keeps chrome visible');
check(focusChromeState({ stage: 'read', focusMode: true, idle: true }), 'hidden', 'eligible idle reading hides chrome');
check(focusChromeState({ stage: 'read', focusMode: true, idle: false }), 'visible', 'recent activity keeps chrome visible');
check(focusChromeState({ stage: 'read', focusMode: true, idle: true, overlayOpen: true }), 'visible', 'overlay wins over idle');
check(shouldConsumeRevealPointer({ chromeHidden: true, pointerType: 'touch' }), true, 'first hidden touch is consumed');
check(shouldConsumeRevealPointer({ chromeHidden: true, pointerType: 'pen' }), true, 'first hidden pen tap is consumed');
check(shouldConsumeRevealPointer({ chromeHidden: true, pointerType: 'mouse' }), false, 'mouse click is not consumed');
check(shouldConsumeRevealPointer({ chromeHidden: false, pointerType: 'touch' }), false, 'visible chrome does not consume touch');
check(shouldConsumeRevealPointer({ chromeHidden: true, pointerType: 'touch', interactiveTarget: true }), false, 'interactive controls keep their click');
check(shouldConsumeRevealPointer({ chromeHidden: true, pointerType: 'touch', selectionActive: true }), false, 'active selection is never swallowed');
check(focusChromeRevealZone(20, 800), 'top', 'top edge reveals header');
check(focusChromeRevealZone(760, 800), 'bottom', 'bottom edge reveals navigation');
check(focusChromeRevealZone(400, 800), 'none', 'middle pointer movement stays immersive');
check(focusChromeRevealZone(20, 0), 'none', 'invalid viewport is ignored');
check(focusChromeRevealZone(Number.NaN, 800), 'none', 'invalid pointer coordinate is ignored');

console.log(`focus chrome tests ok (${assertions} assertions)`);
