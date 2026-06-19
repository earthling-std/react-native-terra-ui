import { describe, expect, it } from '@jest/globals';

import {
  PAGE_INDICATOR_SINGLE_PAGE_DURATION,
  pageIndicatorPageJumpDuration,
} from '../utils';

describe('pageIndicatorPageJumpDuration', () => {
  it('keeps single-step jumps snappy', () => {
    expect(pageIndicatorPageJumpDuration(0, 1)).toBe(
      PAGE_INDICATOR_SINGLE_PAGE_DURATION
    );
    expect(pageIndicatorPageJumpDuration(3, 2)).toBe(
      PAGE_INDICATOR_SINGLE_PAGE_DURATION
    );
  });

  it('extends duration for multi-page jumps', () => {
    expect(pageIndicatorPageJumpDuration(0, 2)).toBe(510);
    expect(pageIndicatorPageJumpDuration(0, 3)).toBe(600);
  });

  it('caps very long jumps', () => {
    expect(pageIndicatorPageJumpDuration(0, 9)).toBe(650);
    expect(pageIndicatorPageJumpDuration(0, 99)).toBe(650);
  });
});
