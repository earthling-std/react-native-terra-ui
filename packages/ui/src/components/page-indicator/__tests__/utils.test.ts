import { describe, expect, it } from '@jest/globals';

import {
  computePageIndicatorWindowTranslate,
  DEFAULT_PAGE_INDICATOR_MAX_VISIBLE,
  PAGE_INDICATOR_SINGLE_PAGE_DURATION,
  pageIndicatorPageJumpDuration,
  pageIndicatorTrackMainSize,
  pageIndicatorViewportMainSize,
  pageIndicatorWindowScale,
} from '../utils';
import { PILL_INDICATOR_GEOMETRY } from '../variants/PillIndicator/utils';

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
    expect(pageIndicatorPageJumpDuration(0, 2)).toBe(600);
    expect(pageIndicatorPageJumpDuration(0, 3)).toBe(600);
  });

  it('caps very long jumps', () => {
    expect(pageIndicatorPageJumpDuration(0, 9)).toBe(600);
    expect(pageIndicatorPageJumpDuration(0, 99)).toBe(600);
  });
});

const { dotSize, slot, activeWidth } = PILL_INDICATOR_GEOMETRY;
const COUNT = 10;
const MAX_VISIBLE = DEFAULT_PAGE_INDICATOR_MAX_VISIBLE;

function visibleWindowIndices(activeIdx: number): number[] {
  const translate = computePageIndicatorWindowTranslate(
    COUNT,
    activeIdx,
    slot,
    dotSize,
    MAX_VISIBLE,
    activeWidth
  );
  const visibleStart = Math.round(-translate / slot);

  return Array.from(
    { length: MAX_VISIBLE },
    (_, position) => visibleStart + position
  );
}

function windowScale(index: number, activeIdx: number): number {
  return pageIndicatorWindowScale(
    index,
    activeIdx,
    COUNT,
    slot,
    dotSize,
    MAX_VISIBLE,
    activeWidth
  );
}

function expectWindowScales(activeIdx: number, expected: number[]) {
  const indices = visibleWindowIndices(activeIdx);

  expect(indices).toHaveLength(expected.length);
  indices.forEach((index, position) => {
    expect(windowScale(index, activeIdx)).toBeCloseTo(expected[position]!);
  });
}

describe('page indicator maxVisible', () => {
  it('shows full width when count fits the viewport', () => {
    expect(
      pageIndicatorViewportMainSize(4, slot, dotSize, MAX_VISIBLE, activeWidth)
    ).toBe(pageIndicatorTrackMainSize(4, slot, dotSize, activeWidth));
    expect(
      computePageIndicatorWindowTranslate(
        4,
        2,
        slot,
        dotSize,
        MAX_VISIBLE,
        activeWidth
      )
    ).toBe(0);
  });

  it('caps the viewport to maxVisible when count is larger', () => {
    const viewport = pageIndicatorViewportMainSize(
      COUNT,
      slot,
      dotSize,
      MAX_VISIBLE,
      activeWidth
    );
    const full = pageIndicatorTrackMainSize(COUNT, slot, dotSize, activeWidth);

    expect(viewport).toBe(
      pageIndicatorViewportMainSize(
        MAX_VISIBLE,
        slot,
        dotSize,
        MAX_VISIBLE,
        activeWidth
      )
    );
    expect(full).toBeGreaterThan(viewport);
  });

  it('matches the viewport scale templates for each active index', () => {
    expectWindowScales(0, [1, 0.9, 0.9, 0.65, 0.5]);
    expectWindowScales(1, [0.9, 1, 0.9, 0.65, 0.5]);

    for (const activeIdx of [2, 3, 4, 5, 6, 7]) {
      expectWindowScales(activeIdx, [0.65, 0.9, 1, 0.9, 0.65]);
    }

    expectWindowScales(8, [0.5, 0.65, 0.9, 1, 0.9]);
    expectWindowScales(9, [0.5, 0.65, 0.9, 0.9, 1]);
  });

  it('uses dot size for dot-variant overflow geometry', () => {
    const viewport = pageIndicatorViewportMainSize(
      COUNT,
      slot,
      dotSize,
      MAX_VISIBLE,
      dotSize
    );

    expect(viewport).toBe(
      Math.max(dotSize, (MAX_VISIBLE - 1) * slot + dotSize)
    );
  });
});
