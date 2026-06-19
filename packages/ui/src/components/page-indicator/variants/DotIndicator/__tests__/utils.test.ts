import { describe, expect, it } from '@jest/globals';

import {
  DOT_INDICATOR_GEOMETRY,
  pageIndicatorDotCenter,
  pageIndicatorTrackSize,
} from '../utils';

const { dotSize, slot } = DOT_INDICATOR_GEOMETRY;

describe('dot indicator geometry', () => {
  it('computes main-axis dot center and track size', () => {
    expect(pageIndicatorDotCenter(0, slot, dotSize)).toBe(dotSize / 2);
    expect(pageIndicatorDotCenter(2, slot, dotSize)).toBe(2 * slot + dotSize / 2);
    expect(pageIndicatorTrackSize(4, slot, dotSize)).toBe(
      Math.max(dotSize, (4 - 1) * slot + dotSize)
    );
  });

  it('exposes precomputed geometry constants', () => {
    expect(DOT_INDICATOR_GEOMETRY.crossSize).toBe(
      Math.max(DOT_INDICATOR_GEOMETRY.ringSize, DOT_INDICATOR_GEOMETRY.dotSize)
    );
    expect(DOT_INDICATOR_GEOMETRY.ringCircumference).toBeGreaterThan(0);
    expect(DOT_INDICATOR_GEOMETRY.inactiveOpacity).toBe(0.42);
  });
});
