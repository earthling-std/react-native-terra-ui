import { useEffect, useMemo } from 'react';

import type { SharedValue } from 'react-native-reanimated';
import {
  cancelAnimation,
  Easing,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  PAGE_INDICATOR_SINGLE_PAGE_DURATION,
  pageIndicatorPageJumpDistance,
  pageIndicatorPageJumpDuration,
} from '../utils';

function clampPageIndex(page: number, count: number): number {
  if (count <= 0) return 0;
  return Math.min(Math.max(page, 0), count - 1);
}

export interface PillJumpState {
  active: SharedValue<boolean>;
  from: SharedValue<number>;
  to: SharedValue<number>;
  t: SharedValue<number>;
}

/**
 * Returns scroll-linked `progress` when provided; otherwise owns a shared value
 * that animates toward the discrete page index.
 *
 * Single-step pill changes animate `progress` continuously. Multi-step pill
 * jumps cross-fade only the source and target dots — intermediates stay idle.
 */
export function usePageIndicatorProgress(
  count: number,
  progress: SharedValue<number> | undefined,
  page: number | undefined,
  variant: 'pill' | 'dot' = 'pill',
  duration = PAGE_INDICATOR_SINGLE_PAGE_DURATION
): { progress: SharedValue<number>; pillJump: PillJumpState } {
  const internalProgress = useSharedValue(
    page !== undefined ? clampPageIndex(page, count) : 0
  );
  const pillJumpActive = useSharedValue(false);
  const pillJumpFrom = useSharedValue(0);
  const pillJumpTo = useSharedValue(0);
  const pillJumpT = useSharedValue(0);

  const pillJump = useMemo(
    () => ({
      active: pillJumpActive,
      from: pillJumpFrom,
      to: pillJumpTo,
      t: pillJumpT,
    }),
    [pillJumpActive, pillJumpFrom, pillJumpTo, pillJumpT]
  );

  useEffect(() => {
    if (page === undefined) return;

    const target = clampPageIndex(page, count);
    const from = internalProgress.value;
    const distance = pageIndicatorPageJumpDistance(from, target);

    if (distance === 0) return;

    cancelAnimation(internalProgress);
    cancelAnimation(pillJumpT);
    pillJumpActive.value = false;

    if (variant === 'pill' && distance > 1) {
      const jumpDuration = pageIndicatorPageJumpDuration(from, target);

      internalProgress.value = from;
      pillJumpFrom.value = from;
      pillJumpTo.value = target;
      pillJumpActive.value = true;
      pillJumpT.value = 0;
      pillJumpT.value = withTiming(
        1,
        {
          duration: jumpDuration,
          easing: Easing.bezier(0.33, 0, 0.15, 1),
        },
        (finished) => {
          'worklet';
          if (finished) {
            internalProgress.value = target;
            pillJumpActive.value = false;
          }
        }
      );
      return;
    }

    internalProgress.value = withTiming(target, {
      duration:
        variant === 'dot'
          ? duration
          : pageIndicatorPageJumpDuration(from, target),
      easing:
        distance <= 1
          ? Easing.out(Easing.cubic)
          : Easing.bezier(0.33, 0, 0.15, 1),
    });
  }, [
    count,
    duration,
    internalProgress,
    page,
    pillJumpActive,
    pillJumpFrom,
    pillJumpT,
    pillJumpTo,
    variant,
  ]);

  return {
    progress: progress ?? internalProgress,
    pillJump,
  };
}
