import { describe, expect, it } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';
import type { SharedValue } from 'react-native-reanimated';

import { usePageIndicatorProgress } from '../use-page-indicator-progress';

describe('usePageIndicatorProgress', () => {
  it('returns external progress when provided', () => {
    const external = { value: 2 } as SharedValue<number>;
    const { result } = renderHook(() =>
      usePageIndicatorProgress(4, external, undefined)
    );

    expect(result.current.progress).toBe(external);
  });

  it('returns internal progress when page is provided', () => {
    const { result, rerender } = renderHook(
      ({ page }: { page: number }) =>
        usePageIndicatorProgress(4, undefined, page),
      { initialProps: { page: 0 } }
    );

    expect(result.current.progress).toEqual({ value: 0 });

    rerender({ page: 2 });
    expect(result.current.progress.value).toBe(2);
  });

  it('clamps page to valid range', () => {
    const { result } = renderHook(() =>
      usePageIndicatorProgress(3, undefined, 99)
    );

    expect(result.current.progress.value).toBe(2);
  });
});
