import { describe, expect, it } from '@jest/globals';

import {
  computePageIndicatorWindowTranslate,
  DEFAULT_PAGE_INDICATOR_WINDOW_SIZE,
  pageIndicatorTrackMainSize,
  pageIndicatorViewportMainSize,
  pageIndicatorWindowScale,
} from '../window';
import { PILL_INDICATOR_GEOMETRY } from '../variants/PillIndicator/utils';

const { dotSize, slot, activeWidth } = PILL_INDICATOR_GEOMETRY;
const COUNT = 10;
const WINDOW = DEFAULT_PAGE_INDICATOR_WINDOW_SIZE;

function visibleWindowIndices(activeIdx: number): number[] {
  const translate = computePageIndicatorWindowTranslate(
    COUNT,
    activeIdx,
    slot,
    dotSize,
    WINDOW,
    activeWidth
  );
  const visibleStart = Math.round(-translate / slot);

  return Array.from({ length: WINDOW }, (_, position) => visibleStart + position);
}

function windowScale(index: number, activeIdx: number): number {
  return pageIndicatorWindowScale(
    index,
    activeIdx,
    COUNT,
    slot,
    dotSize,
    WINDOW,
    activeWidth
  );
}

function expectWindowScales(activeIdx: number, expected: number[]) {
  const indices = visibleWindowIndices(activeIdx);

  expect(indices).toHaveLength(expected.length);
  indices.forEach((index, position) => {
    expect(windowScale(index, activeIdx)).toBeCloseTo(expected[position]);
  });
}

describe('page indicator window', () => {
  it('shows full width when count fits the viewport', () => {
    expect(
      pageIndicatorViewportMainSize(4, slot, dotSize, WINDOW, activeWidth)
    ).toBe(pageIndicatorTrackMainSize(4, slot, dotSize, activeWidth));
    expect(
      computePageIndicatorWindowTranslate(
        4,
        2,
        slot,
        dotSize,
        WINDOW,
        activeWidth
      )
    ).toBe(0);
  });

  it('caps the viewport to the window size when count is larger', () => {
    const viewport = pageIndicatorViewportMainSize(
      COUNT,
      slot,
      dotSize,
      WINDOW,
      activeWidth
    );
    const full = pageIndicatorTrackMainSize(COUNT, slot, dotSize, activeWidth);

    expect(viewport).toBe(
      pageIndicatorViewportMainSize(WINDOW, slot, dotSize, WINDOW, activeWidth)
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

  it('uses dot size for dot-variant window geometry', () => {
    const viewport = pageIndicatorViewportMainSize(
      COUNT,
      slot,
      dotSize,
      WINDOW,
      dotSize
    );

    expect(viewport).toBe(Math.max(dotSize, (WINDOW - 1) * slot + dotSize));
  });
});
