import { useMemo } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import type { SharedValue } from 'react-native-reanimated';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import type { ColorToken } from '#theme/types';

import { usePageIndicatorColors } from '../../hooks/use-page-indicator-colors';
import { usePageIndicatorProgress } from '../../hooks/use-page-indicator-progress';
import {
  isPageIndicatorSharedValue,
  PAGE_INDICATOR_SINGLE_PAGE_DURATION,
} from '../../utils';
import {
  computePageIndicatorWindowTranslate,
  DEFAULT_PAGE_INDICATOR_WINDOW_SIZE,
  pageIndicatorTrackMainSize,
  pageIndicatorViewportMainSize,
} from '../../window';

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
   * Defaults to `5`. Windowing is off when `count <= windowSize`.
   */
  windowSize?: number;
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
  windowSize = DEFAULT_PAGE_INDICATOR_WINDOW_SIZE,
  style,
}: DotIndicatorProps) {
  const scrollLinked = isPageIndicatorSharedValue(current);
  const colors = usePageIndicatorColors({
    activeColor,
    inactiveColor,
    loadingColor,
  });
  const { progress } = usePageIndicatorProgress(
    count,
    scrollLinked ? current : undefined,
    scrollLinked ? undefined : current,
    'dot',
    duration
  );

  const geometry = DOT_INDICATOR_GEOMETRY;
  const { dotSize, slot, crossSize, inactiveOpacity } = geometry;
  const viewportSize = pageIndicatorViewportMainSize(
    count,
    slot,
    dotSize,
    windowSize
  );
  const fullTrackSize = pageIndicatorTrackMainSize(count, slot, dotSize);
  const isWindowed = count > windowSize;

  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: `dot-${index}`,
        index,
      })),
    [count]
  );

  const trackStyle = useAnimatedStyle(() => {
    const translate = computePageIndicatorWindowTranslate(
      count,
      progress.value,
      slot,
      dotSize,
      windowSize
    );

    return {
      transform: vertical ? [{ translateY: translate }] : [{ translateX: translate }],
    };
  });

  const track = (
    <Animated.View
      style={[
        vertical
          ? { width: crossSize, height: fullTrackSize }
          : { width: fullTrackSize, height: crossSize },
        isWindowed ? trackStyle : null,
      ]}
    >
      {dots.map(({ id, index }) => (
        <InactiveDot
          key={id}
          color={colors.inactiveColor}
          count={count}
          index={index}
          isWindowed={isWindowed}
          opacity={inactiveOpacity}
          progress={progress}
          vertical={vertical}
          windowSize={windowSize}
          geometry={geometry}
        />
      ))}
      <TravelingPill
        activeColor={colors.activeColor}
        count={count}
        progress={progress}
        vertical={vertical}
        geometry={geometry}
      />
      <LoadingOrbit
        color={colors.loadingColor}
        count={count}
        loading={loading}
        progress={progress}
        vertical={vertical}
        geometry={geometry}
      />
    </Animated.View>
  );

  return (
    <View pointerEvents="none" style={style}>
      {isWindowed ? (
        <View
          style={
            vertical
              ? { height: viewportSize, width: crossSize, overflow: 'hidden' }
              : { width: viewportSize, height: crossSize, overflow: 'hidden' }
          }
        >
          {track}
        </View>
      ) : (
        track
      )}
    </View>
  );
}
