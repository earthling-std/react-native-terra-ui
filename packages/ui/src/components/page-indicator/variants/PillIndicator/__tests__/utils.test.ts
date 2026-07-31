import { describe, expect, it } from '@jest/globals';

import {
  pillIndicatorDotDistance,
  pillIndicatorJumpDisplayProgress,
} from '../utils';

describe('pillIndicatorDotDistance', () => {
  it('uses continuous progress for adjacent pages', () => {
    expect(pillIndicatorDotDistance(1, 1.5, false, 0, 0, 0)).toBe(0.5);
    expect(pillIndicatorDotDistance(2, 1.5, false, 0, 0, 0)).toBe(0.5);
    expect(pillIndicatorDotDistance(0, 1.5, false, 0, 0, 0)).toBe(1);
  });

  it('cross-fades only source and target during a multi-page jump', () => {
    expect(pillIndicatorDotDistance(1, 0, true, 1, 3, 0)).toBe(0);
    expect(pillIndicatorDotDistance(3, 0, true, 1, 3, 0)).toBe(1);
    expect(pillIndicatorDotDistance(2, 0, true, 1, 3, 0)).toBe(1);

    expect(pillIndicatorDotDistance(1, 0, true, 1, 3, 0.5)).toBe(0.5);
    expect(pillIndicatorDotDistance(3, 0, true, 1, 3, 0.5)).toBe(0.5);
    expect(pillIndicatorDotDistance(2, 0, true, 1, 3, 0.5)).toBe(1);

    expect(pillIndicatorDotDistance(1, 0, true, 1, 3, 1)).toBe(1);
    expect(pillIndicatorDotDistance(3, 0, true, 1, 3, 1)).toBe(0);
    expect(pillIndicatorDotDistance(2, 0, true, 1, 3, 1)).toBe(1);
  });
});

describe('pillIndicatorJumpDisplayProgress', () => {
  it('interpolates window progress between source and target', () => {
    expect(pillIndicatorJumpDisplayProgress(0, true, 1, 3, 0)).toBe(1);
    expect(pillIndicatorJumpDisplayProgress(0, true, 1, 3, 0.5)).toBe(2);
    expect(pillIndicatorJumpDisplayProgress(0, true, 1, 3, 1)).toBe(3);
    expect(pillIndicatorJumpDisplayProgress(2.5, false, 1, 3, 0.5)).toBe(2.5);
  });
});
