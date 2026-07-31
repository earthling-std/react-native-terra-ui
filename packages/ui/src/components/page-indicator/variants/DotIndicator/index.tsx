import { useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { SharedValue } from 'react-native-reanimated';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import type { ColorToken } from '#theme/types';

import { usePageIndicatorCore } from '../../hooks/use-page-indicator-core';
import { PageIndicatorRoot } from '../../PageIndicatorRoot';
import {
  computePageIndicatorWindowTranslate,
  DEFAULT_PAGE_INDICATOR_MAX_VISIBLE,
  PAGE_INDICATOR_SINGLE_PAGE_DURATION,
  pageIndicatorAxisTranslateStyle,
  pageIndicatorTrackMainSize,
  pageIndicatorViewportMainSize,
} from '../../utils';

import { InactiveDot } from './InactiveDot';
import { LoadingOrbit } from './LoadingOrbit';
import { TravelingPill } from './TravelingPill';
import { DOT_INDICATOR_GEOMETRY } from './utils';

export interface DotIndicatorProps {
  /** Number of pages represented by the indicator. */
  count: number;
  /**
   * Active page index, or a shared value for scroll-linked motion.
   * Index `0` is the first page; fractional values animate between pages.
   */
  current?: number | SharedValue<number>;
  /** Duration for discrete `current` changes. Defaults to `250`. */
  duration?: number;
  /** Active page color token. */
  activeColor?: ColorToken;
  /** Inactive page color token. */
  inactiveColor?: ColorToken;
  /** Loading ring color token. */
  loadingColor?: ColorToken;
  /** Renders a ring around the active dot while loading. */
  loading?: boolean;
  /** Stack dots vertically instead of horizontally. */
  vertical?: boolean;
  /**
   * Maximum dots visible before the track scrolls and edge-scales.
   * Defaults to `5`. Overflow scrolling is off when `count <= maxVisible`.
   */
  maxVisible?: number;
  style?: StyleProp<ViewStyle>;
}

export function DotIndicator({
  count,
  current = 0,
  duration = PAGE_INDICATOR_SINGLE_PAGE_DURATION,
  activeColor,
  inactiveColor,
  loadingColor,
  loading = false,
  vertical = false,
  maxVisible = DEFAULT_PAGE_INDICATOR_MAX_VISIBLE,
  style,
}: DotIndicatorProps) {
  const { colors, progress } = usePageIndicatorCore(
    count,
    current,
    'dot',
    duration,
    { activeColor, inactiveColor, loadingColor }
  );

  const { dotSize, slot, crossSize, inactiveOpacity } = DOT_INDICATOR_GEOMETRY;
  const viewportMainSize = pageIndicatorViewportMainSize(
    count,
    slot,
    dotSize,
    maxVisible
  );
  const fullTrackMainSize = pageIndicatorTrackMainSize(count, slot, dotSize);
  const overflows = count > maxVisible;

  const indices = useMemo(
    () => Array.from({ length: count }, (_, index) => index),
    [count]
  );

  const trackStyle = useAnimatedStyle(() => {
    const translate = computePageIndicatorWindowTranslate(
      count,
      progress.value,
      slot,
      dotSize,
      maxVisible
    );

    return pageIndicatorAxisTranslateStyle(vertical, translate);
  });

  return (
    <PageIndicatorRoot
      crossSize={crossSize}
      overflows={overflows}
      style={style}
      vertical={vertical}
      viewportMainSize={viewportMainSize}
    >
      <Animated.View
        style={[
          vertical
            ? { width: crossSize, height: fullTrackMainSize }
            : { width: fullTrackMainSize, height: crossSize },
          overflows ? trackStyle : null,
        ]}
      >
        {indices.map((index) => (
          <InactiveDot
            key={index}
            color={colors.inactiveColor}
            count={count}
            index={index}
            maxVisible={maxVisible}
            opacity={inactiveOpacity}
            overflows={overflows}
            progress={progress}
            vertical={vertical}
          />
        ))}
        <TravelingPill
          activeColor={colors.activeColor}
          count={count}
          progress={progress}
          vertical={vertical}
        />
        <LoadingOrbit
          color={colors.loadingColor}
          count={count}
          loading={loading}
          progress={progress}
          vertical={vertical}
        />
      </Animated.View>
    </PageIndicatorRoot>
  );
}
