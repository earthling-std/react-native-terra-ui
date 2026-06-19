const DOT_SIZE = 8;
const GAP = 8;

/** Precomputed geometry shared by PillIndicator sub-components. */
export const PILL_INDICATOR_GEOMETRY = {
  dotSize: DOT_SIZE,
  gap: GAP,
  slot: DOT_SIZE + GAP,
  activeWidth: 24,
  inactiveOpacity: 0.42,
  inactiveScale: 0.9,
} as const;

export type PillIndicatorGeometry = typeof PILL_INDICATOR_GEOMETRY;

export function pillIndicatorDotDistance(
  index: number,
  progress: number,
  jumpActive: boolean,
  jumpFrom: number,
  jumpTo: number,
  jumpT: number
): number {
  'worklet';
  if (!jumpActive) {
    return Math.min(Math.abs(progress - index), 1);
  }

  if (index === jumpFrom) {
    return jumpT;
  }

  if (index === jumpTo) {
    return 1 - jumpT;
  }

  return 1;
}

/** Progress for window translation during a multi-page pill jump. */
export function pillIndicatorJumpDisplayProgress(
  progress: number,
  jumpActive: boolean,
  jumpFrom: number,
  jumpTo: number,
  jumpT: number
): number {
  'worklet';
  if (!jumpActive) return progress;
  return jumpFrom + jumpT * (jumpTo - jumpFrom);
}
