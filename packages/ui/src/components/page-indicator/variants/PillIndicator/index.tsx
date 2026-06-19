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

import { PillIndicatorDot } from './PillIndicatorDot';
import {
  pillIndicatorJumpDisplayProgress,
  PILL_INDICATOR_GEOMETRY,
} from './utils';

export interface PillIndicatorProps {
  /** Number of pages represented by the indicator. */
  count: number;
  /**
   * Active page index, or a shared value for scroll-linked motion.
   * Index `0` is the first page; fractional values animate between pages.
   */
  current?: number | SharedValue<number>;
  /** Duration for discrete `current` changes. Defaults to `420`. */
  duration?: number;
  /** Active page color token. */
  activeColor?: ColorToken;
  /** Inactive page color token. */
  inactiveColor?: ColorToken;
  /** Stack pills vertically instead of horizontally. */
  vertical?: boolean;
  /**
   * Maximum dots visible before the track scrolls and edge-scales.
   * Defaults to `5`. Windowing is off when `count <= windowSize`.
   */
  windowSize?: number;
  style?: StyleProp<ViewStyle>;
}

export function PillIndicator({
  count,
  current = 0,
  duration = PAGE_INDICATOR_SINGLE_PAGE_DURATION,
  activeColor,
  inactiveColor,
  vertical = false,
  windowSize = DEFAULT_PAGE_INDICATOR_WINDOW_SIZE,
  style,
}: PillIndicatorProps) {
  const scrollLinked = isPageIndicatorSharedValue(current);
  const colors = usePageIndicatorColors({ activeColor, inactiveColor });
  const { progress, pillJump } = usePageIndicatorProgress(
    count,
    scrollLinked ? current : undefined,
    scrollLinked ? undefined : current,
    'pill',
    duration
  );

  const geometry = PILL_INDICATOR_GEOMETRY;
  const { dotSize, gap, slot, activeWidth } = geometry;
  const viewportSize = pageIndicatorViewportMainSize(
    count,
    slot,
    dotSize,
    windowSize,
    activeWidth
  );
  const fullTrackSize = pageIndicatorTrackMainSize(
    count,
    slot,
    dotSize,
    activeWidth
  );
  const isWindowed = count > windowSize;

  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: `page-${index}`,
        index,
      })),
    [count]
  );

  const trackStyle = useAnimatedStyle(() => {
    const displayProgress = pillIndicatorJumpDisplayProgress(
      progress.value,
      pillJump.active.value,
      pillJump.from.value,
      pillJump.to.value,
      pillJump.t.value
    );

    const translate = computePageIndicatorWindowTranslate(
      count,
      displayProgress,
      slot,
      dotSize,
      windowSize,
      activeWidth
    );

    return {
      transform: vertical ? [{ translateY: translate }] : [{ translateX: translate }],
    };
  });

  const track = (
    <Animated.View
      style={[
        {
          flexDirection: vertical ? 'column' : 'row',
          alignItems: 'center',
          gap,
          ...(isWindowed
            ? vertical
              ? { height: fullTrackSize }
              : { width: fullTrackSize }
            : undefined),
        },
        isWindowed ? trackStyle : null,
      ]}
    >
      {items.map((item) => (
        <PillIndicatorDot
          key={item.id}
          activeColor={colors.activeColor}
          inactiveColor={colors.inactiveColor}
          count={count}
          index={item.index}
          isWindowed={isWindowed}
          pillJump={pillJump}
          progress={progress}
          vertical={vertical}
          windowSize={windowSize}
          geometry={geometry}
        />
      ))}
    </Animated.View>
  );

  return (
    <View pointerEvents="none" style={style}>
      {isWindowed ? (
        <View
          style={
            vertical
              ? { height: viewportSize, overflow: 'hidden' }
              : { width: viewportSize, overflow: 'hidden' }
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
