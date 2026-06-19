/** Fixed geometry for the dot indicator variant. */
const DOT_SIZE = 8;
const GAP = 8;
const RING_SIZE = 14;
const RING_STROKE = 1.5;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;

/** Precomputed geometry shared by DotIndicator sub-components. */
export const DOT_INDICATOR_GEOMETRY = {
  dotSize: DOT_SIZE,
  slot: DOT_SIZE + GAP,
  crossSize: Math.max(RING_SIZE, DOT_SIZE),
  ringSize: RING_SIZE,
  ringStroke: RING_STROKE,
  ringRadius: RING_RADIUS,
  ringCircumference: 2 * Math.PI * RING_RADIUS,
  inactiveOpacity: 0.42,
} as const;

export type DotIndicatorGeometry = typeof DOT_INDICATOR_GEOMETRY;

/** Full extent of a dot track along its main axis. */
export function pageIndicatorTrackSize(
  count: number,
  slot: number,
  dotSize: number
): number {
  return Math.max(dotSize, (count - 1) * slot + dotSize);
}

/** Main-axis center of dot `index` within the track. */
export function pageIndicatorDotCenter(
  index: number,
  slot: number,
  dotSize: number
): number {
  'worklet';
  return index * slot + dotSize / 2;
}
