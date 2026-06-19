import type { SharedValue } from 'react-native-reanimated';

/** Duration for a single-page `current` transition. */
export const PAGE_INDICATOR_SINGLE_PAGE_DURATION = 420;

/** Extra duration per additional page when jumping more than one step. */
export const PAGE_INDICATOR_MULTI_PAGE_DURATION_STEP = 90;

/** Upper bound for multi-page `current` transitions. */
export const PAGE_INDICATOR_MULTI_PAGE_DURATION_MAX = 650;

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
