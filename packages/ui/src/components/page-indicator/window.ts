/** Default max dots visible before scrolling and edge scaling kick in. */
export const DEFAULT_PAGE_INDICATOR_WINDOW_SIZE = 5;

const EDGE_OUTWARD_SCALE = [1, 0.9, 0.9, 0.65, 0.5] as const;
const CENTERED_SCALE = [1, 0.9, 0.65, 0.5] as const;
const WINDOW_TAIL_SCALE = 0.5;

function scaleCurveValue(
  curve: readonly number[],
  distance: number,
  tailScale: number
): number {
  'worklet';
  if (distance < curve.length) return curve[distance];
  return tailScale;
}

/** Scale for a slot inside the window given the active slot. */
export function pageIndicatorWindowSlotScale(
  positionInWindow: number,
  activeSlot: number,
  windowSize: number
): number {
  'worklet';
  if (positionInWindow === activeSlot) return 1;

  const dist = Math.abs(positionInWindow - activeSlot);

  if (activeSlot === 0 || activeSlot === windowSize - 1) {
    return scaleCurveValue(EDGE_OUTWARD_SCALE, dist, WINDOW_TAIL_SCALE);
  }

  const centerSlot = Math.floor((windowSize - 1) / 2);
  if (activeSlot === centerSlot) {
    return scaleCurveValue(CENTERED_SCALE, dist, WINDOW_TAIL_SCALE);
  }

  if (positionInWindow < activeSlot) {
    if (activeSlot <= 1) {
      return scaleCurveValue(EDGE_OUTWARD_SCALE, dist, WINDOW_TAIL_SCALE);
    }
    return scaleCurveValue(CENTERED_SCALE, dist, WINDOW_TAIL_SCALE);
  }

  if (activeSlot >= windowSize - 2) {
    return scaleCurveValue(EDGE_OUTWARD_SCALE, dist, WINDOW_TAIL_SCALE);
  }

  return scaleCurveValue(CENTERED_SCALE, dist, WINDOW_TAIL_SCALE);
}

export function pageIndicatorTrackMainSize(
  count: number,
  slot: number,
  dotSize: number,
  activeMainSize = dotSize
): number {
  return Math.max(dotSize, (count - 1) * slot + activeMainSize);
}

export function pageIndicatorViewportMainSize(
  count: number,
  slot: number,
  dotSize: number,
  windowSize: number,
  activeMainSize = dotSize
): number {
  const visible = Math.min(count, windowSize);
  return Math.max(dotSize, (visible - 1) * slot + activeMainSize);
}

export function computePageIndicatorWindowTranslate(
  count: number,
  progress: number,
  slot: number,
  dotSize: number,
  windowSize: number,
  activeMainSize = dotSize
): number {
  'worklet';
  if (count <= windowSize) return 0;

  const viewportMainSize = Math.max(
    dotSize,
    (windowSize - 1) * slot + activeMainSize
  );
  const trackMainSize = Math.max(
    dotSize,
    (count - 1) * slot + activeMainSize
  );
  const activeCenter = progress * slot + activeMainSize / 2;
  const offset = Math.min(
    Math.max(activeCenter - viewportMainSize / 2, 0),
    trackMainSize - viewportMainSize
  );

  return -offset;
}

export function pageIndicatorWindowScale(
  index: number,
  displayProgress: number,
  count: number,
  slot: number,
  dotSize: number,
  windowSize: number,
  activeMainSize = dotSize
): number {
  'worklet';
  if (count <= windowSize) return 1;

  const translate = computePageIndicatorWindowTranslate(
    count,
    displayProgress,
    slot,
    dotSize,
    windowSize,
    activeMainSize
  );
  const visibleStart = -translate / slot;
  const activeSlot = Math.min(
    Math.max(Math.round(displayProgress - visibleStart), 0),
    windowSize - 1
  );
  const positionInWindow = Math.min(
    Math.max(Math.round(index - visibleStart), 0),
    windowSize - 1
  );

  return pageIndicatorWindowSlotScale(
    positionInWindow,
    activeSlot,
    windowSize
  );
}
