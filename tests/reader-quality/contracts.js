export const READER_QUALITY_SCENARIOS = Object.freeze([
  Object.freeze({ id: 'desktop-spread', label: 'Desktop · Pages · spread', width: 1280, height: 800, device: 'desktop', orientation: 'landscape', mode: 'paged', spread: 'spread' }),
  Object.freeze({ id: 'tablet-landscape-spread', label: 'Tablet landscape · Pages · spread', width: 1024, height: 768, device: 'tablet', orientation: 'landscape', mode: 'paged', spread: 'spread' }),
  Object.freeze({ id: 'tablet-portrait-single', label: 'Tablet portrait · Pages · single', width: 768, height: 1024, device: 'tablet', orientation: 'portrait', mode: 'paged', spread: 'single' }),
  Object.freeze({ id: 'phone-portrait-pages', label: 'Phone portrait · Pages', width: 390, height: 844, device: 'phone', orientation: 'portrait', mode: 'paged', spread: 'single' }),
  Object.freeze({ id: 'phone-landscape-pages', label: 'Short phone landscape · Pages', width: 844, height: 390, device: 'phone', orientation: 'landscape', mode: 'paged', spread: 'single' }),
  Object.freeze({ id: 'desktop-continuous', label: 'Desktop · Continuous', width: 1280, height: 800, device: 'desktop', orientation: 'landscape', mode: 'scroll', spread: 'single' }),
  Object.freeze({ id: 'phone-continuous', label: 'Phone portrait · Continuous', width: 390, height: 844, device: 'phone', orientation: 'portrait', mode: 'scroll', spread: 'single' }),
]);

const EPSILON = 1.25;
const TARGET_EPSILON = 0.35;

function finite(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function rectContained(rect, width, height, epsilon = EPSILON) {
  if (!rect) return false;
  return finite(rect.left) >= -epsilon
    && finite(rect.top) >= -epsilon
    && finite(rect.right) <= width + epsilon
    && finite(rect.bottom) <= height + epsilon;
}

function minTarget(targets = [], minimum = 44) {
  if (!targets.length) return false;
  return targets.every((target) => finite(target.width) + TARGET_EPSILON >= minimum
    && finite(target.height) + TARGET_EPSILON >= minimum);
}

export function requiredNavTarget(pointerCoarse = false) {
  return pointerCoarse ? 52 : 48;
}

export function evaluateReaderScenario(spec, metrics = {}) {
  const failures = [];
  const width = finite(spec?.width);
  const height = finite(spec?.height);
  const pointerCoarse = !!metrics.pointerCoarse;
  const navTarget = requiredNavTarget(pointerCoarse);

  const fail = (id, message, actual = null, expected = null) => {
    failures.push({ id, message, actual, expected });
  };

  if (Math.abs(finite(metrics.viewportWidth) - width) > 2
    || Math.abs(finite(metrics.viewportHeight) - height) > 2) {
    fail(
      'viewport-size',
      'Fixture viewport does not match the scenario contract.',
      [metrics.viewportWidth, metrics.viewportHeight],
      [width, height]
    );
  }

  if (finite(metrics.horizontalOverflow) > EPSILON) {
    fail('viewport-overflow', 'Reader creates horizontal viewport overflow.', metrics.horizontalOverflow, `<= ${EPSILON}px`);
  }

  if (!rectContained(metrics.headerRect, width, height)) {
    fail('header-contained', 'Reader header escapes the viewport.', metrics.headerRect, 'contained');
  }

  if (!minTarget(metrics.headerTargets, 44)) {
    fail('header-targets', 'A visible header action is smaller than 44×44 CSS px.', metrics.headerTargets, '>= 44×44');
  }

  if (spec.mode === 'paged') {
    if (metrics.pageNavDisplay === 'none') {
      fail('paged-nav-visible', 'Page navigation is hidden in Pages mode.', metrics.pageNavDisplay, 'visible');
    }
    if (!minTarget(metrics.navTargets, navTarget)) {
      fail(
        'page-nav-targets',
        `A page-turn target is smaller than ${navTarget}×${navTarget} CSS px for this pointer mode.`,
        metrics.navTargets,
        `>= ${navTarget}×${navTarget}`
      );
    }
    if (metrics.scrollReaderDisplay !== 'none') {
      fail('scroll-hidden-in-pages', 'Continuous reader is visible in Pages mode.', metrics.scrollReaderDisplay, 'none');
    }

    const expectedPages = spec.spread === 'spread' ? 2 : 1;
    if (finite(metrics.visiblePageCount) !== expectedPages) {
      fail('visible-pages', 'Visible page count does not match the explicit spread contract.', metrics.visiblePageCount, expectedPages);
    }
    if (!rectContained(metrics.wrapperRect, width, height)) {
      fail('wrapper-contained', 'Paged wrapper escapes the viewport.', metrics.wrapperRect, 'contained');
    }
    for (const [index, rect] of (metrics.pageRects || []).entries()) {
      if (!rectContained(rect, width, height)) {
        fail(`page-${index + 1}-contained`, `Visible page ${index + 1} escapes the viewport.`, rect, 'contained');
      }
    }
  } else if (spec.mode === 'scroll') {
    if (metrics.pageNavDisplay !== 'none') {
      fail('paged-nav-hidden', 'Page navigation remains visible in Continuous mode.', metrics.pageNavDisplay, 'none');
    }
    if (finite(metrics.visiblePageCount) !== 0) {
      fail('pages-hidden-in-scroll', 'Paged surfaces remain visible in Continuous mode.', metrics.visiblePageCount, 0);
    }
    if (metrics.scrollReaderDisplay === 'none') {
      fail('scroll-reader-visible', 'Continuous reader is hidden in Continuous mode.', metrics.scrollReaderDisplay, 'visible');
    }
    if (!rectContained(metrics.scrollReaderRect, width, height)) {
      fail('scroll-reader-contained', 'Continuous reader escapes the viewport.', metrics.scrollReaderRect, 'contained');
    }
    const rect = metrics.scrollDocumentRect || {};
    if (finite(rect.left) < -EPSILON || finite(rect.right) > width + EPSILON) {
      fail('scroll-document-contained', 'Continuous text measure escapes horizontally.', rect, 'contained horizontally');
    }
  }

  for (const token of metrics.longTokens || []) {
    if (finite(token.scrollWidth) > finite(token.clientWidth) + EPSILON) {
      fail('long-token-wrap', 'A long inline token overflows its reading column.', token, 'scrollWidth <= clientWidth');
      break;
    }
  }

  for (const region of metrics.wideRegions || []) {
    if (finite(region.rectRight) > width + EPSILON || finite(region.rectLeft) < -EPSILON) {
      fail(
        'wide-region-contained',
        'A wide table/code region escapes the viewport instead of containing its own overflow.',
        region,
        'contained'
      );
      break;
    }
    if (finite(region.scrollWidth) <= finite(region.clientWidth) + 4) {
      fail(
        'wide-region-scrollable',
        'The difficult-content fixture did not retain local horizontal overflow.',
        region,
        'scrollWidth > clientWidth + 4'
      );
      break;
    }
  }

  return {
    id: spec.id,
    label: spec.label,
    pass: failures.length === 0,
    pointer: pointerCoarse ? 'coarse' : 'fine',
    failures,
  };
}

export function summarizeReaderQuality(results = []) {
  const total = results.length;
  const passed = results.filter((result) => result.pass).length;
  return {
    total,
    passed,
    failed: total - passed,
    pass: total > 0 && passed === total,
  };
}
