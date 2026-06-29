import type { ViewStyle } from 'react-native';

import type { SharedValue } from 'react-native-reanimated';

/** Duration for a single-page `current` transition. */
export const PAGE_INDICATOR_SINGLE_PAGE_DURATION = 600;

/** Extra duration per additional page when jumping more than one step. */
export const PAGE_INDICATOR_MULTI_PAGE_DURATION_STEP = 100;

/** Upper bound for multi-page `current` transitions. */
export const PAGE_INDICATOR_MULTI_PAGE_DURATION_MAX = 600;

/** Default max dots visible before scrolling and edge scaling kick in. */
export const DEFAULT_PAGE_INDICATOR_MAX_VISIBLE = 5;

const EDGE_OUTWARD_SCALE = [1, 0.9, 0.9, 0.65, 0.5] as const;
const CENTERED_SCALE = [1, 0.9, 0.65, 0.5] as const;
const WINDOW_TAIL_SCALE = 0.5;

/** Absolute page delta between two indices. */
export function pageIndicatorPageJumpDistance(
  from: number,
  to: number
): number {
  return Math.abs(to - from);
}

/**
 * Scales transition time for discrete `current` changes. Single-step jumps stay
 * snappy; longer jumps get more time (capped) so the pill does not blur
 * through intermediate dots.
 */
export function pageIndicatorPageJumpDuration(
  from: number,
  to: number
): number {
  const distance = pageIndicatorPageJumpDistance(from, to);
  if (distance <= 1) return PAGE_INDICATOR_SINGLE_PAGE_DURATION;

  return Math.min(
    PAGE_INDICATOR_SINGLE_PAGE_DURATION +
      PAGE_INDICATOR_MULTI_PAGE_DURATION_STEP * (distance - 1),
    PAGE_INDICATOR_MULTI_PAGE_DURATION_MAX
  );
}

export function isPageIndicatorSharedValue(
  value: number | SharedValue<number>
): value is SharedValue<number> {
  return typeof value === 'object' && value !== null && 'value' in value;
}

/** Transform style for overflow track scrolling along the main axis. */
export function pageIndicatorAxisTranslateStyle(
  vertical: boolean,
  translate: number
) {
  'worklet';
  return {
    transform: vertical
      ? [{ translateY: translate }]
      : [{ translateX: translate }],
  };
}

/** Clips an overflowing track to the visible viewport along the main axis. */
export function pageIndicatorViewportClipStyle(
  vertical: boolean,
  viewportMainSize: number,
  crossSize?: number
): ViewStyle {
  if (vertical) {
    return {
      height: viewportMainSize,
      ...(crossSize !== undefined ? { width: crossSize } : {}),
      overflow: 'hidden',
    };
  }

  return {
    width: viewportMainSize,
    ...(crossSize !== undefined ? { height: crossSize } : {}),
    overflow: 'hidden',
  };
}

function scaleCurveValue(
  curve: readonly number[],
  distance: number,
  tailScale: number
): number {
  'worklet';
  if (distance < curve.length) return curve[distance] ?? tailScale;
  return tailScale;
}

/** Scale for a slot inside the window given the active slot. */
export function pageIndicatorWindowSlotScale(
  positionInWindow: number,
  activeSlot: number,
  maxVisible: number
): number {
  'worklet';
  if (positionInWindow === activeSlot) return 1;

  const dist = Math.abs(positionInWindow - activeSlot);

  if (activeSlot === 0 || activeSlot === maxVisible - 1) {
    return scaleCurveValue(EDGE_OUTWARD_SCALE, dist, WINDOW_TAIL_SCALE);
  }

  const centerSlot = Math.floor((maxVisible - 1) / 2);
  if (activeSlot === centerSlot) {
    return scaleCurveValue(CENTERED_SCALE, dist, WINDOW_TAIL_SCALE);
  }

  if (positionInWindow < activeSlot) {
    if (activeSlot <= 1) {
      return scaleCurveValue(EDGE_OUTWARD_SCALE, dist, WINDOW_TAIL_SCALE);
    }
    return scaleCurveValue(CENTERED_SCALE, dist, WINDOW_TAIL_SCALE);
  }

  if (activeSlot >= maxVisible - 2) {
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
  maxVisible: number,
  activeMainSize = dotSize
): number {
  const visible = Math.min(count, maxVisible);
  return Math.max(dotSize, (visible - 1) * slot + activeMainSize);
}

export function computePageIndicatorWindowTranslate(
  count: number,
  progress: number,
  slot: number,
  dotSize: number,
  maxVisible: number,
  activeMainSize = dotSize
): number {
  'worklet';
  if (count <= maxVisible) return 0;

  const viewportMainSize = Math.max(
    dotSize,
    (maxVisible - 1) * slot + activeMainSize
  );
  const trackMainSize = Math.max(dotSize, (count - 1) * slot + activeMainSize);
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
  maxVisible: number,
  activeMainSize = dotSize
): number {
  'worklet';
  if (count <= maxVisible) return 1;

  const translate = computePageIndicatorWindowTranslate(
    count,
    displayProgress,
    slot,
    dotSize,
    maxVisible,
    activeMainSize
  );
  const visibleStart = -translate / slot;
  const activeSlot = Math.min(
    Math.max(Math.round(displayProgress - visibleStart), 0),
    maxVisible - 1
  );
  const positionInWindow = Math.min(
    Math.max(Math.round(index - visibleStart), 0),
    maxVisible - 1
  );

  return pageIndicatorWindowSlotScale(positionInWindow, activeSlot, maxVisible);
}
