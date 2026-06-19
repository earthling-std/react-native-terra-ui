import { useMemo } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';

import type { SharedValue } from 'react-native-reanimated';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import type { ColorToken } from '#theme/types';

import { usePageIndicatorCore } from '../../hooks/use-page-indicator-core';
import { PageIndicatorRoot } from '../../PageIndicatorRoot';
import {
  computePageIndicatorWindowTranslate,
  DEFAULT_PAGE_INDICATOR_MAX_VISIBLE,
  pageIndicatorAxisTranslateStyle,
  pageIndicatorTrackMainSize,
  pageIndicatorViewportMainSize,
  PAGE_INDICATOR_SINGLE_PAGE_DURATION,
} from '../../utils';

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
   * Defaults to `5`. Overflow scrolling is off when `count <= maxVisible`.
   */
  maxVisible?: number;
  style?: StyleProp<ViewStyle>;
}

export function PillIndicator({
  count,
  current = 0,
  duration = PAGE_INDICATOR_SINGLE_PAGE_DURATION,
  activeColor,
  inactiveColor,
  vertical = false,
  maxVisible = DEFAULT_PAGE_INDICATOR_MAX_VISIBLE,
  style,
}: PillIndicatorProps) {
  const { colors, pillJump, progress } = usePageIndicatorCore(
    count,
    current,
    'pill',
    duration,
    { activeColor, inactiveColor }
  );

  const { dotSize, gap, slot, activeWidth } = PILL_INDICATOR_GEOMETRY;
  const viewportMainSize = pageIndicatorViewportMainSize(
    count,
    slot,
    dotSize,
    maxVisible,
    activeWidth
  );
  const fullTrackMainSize = pageIndicatorTrackMainSize(
    count,
    slot,
    dotSize,
    activeWidth
  );
  const overflows = count > maxVisible;

  const indices = useMemo(
    () => Array.from({ length: count }, (_, index) => index),
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
      maxVisible,
      activeWidth
    );

    return pageIndicatorAxisTranslateStyle(vertical, translate);
  });

  return (
    <PageIndicatorRoot
      style={style}
      vertical={vertical}
      viewportMainSize={viewportMainSize}
      overflows={overflows}
    >
      <Animated.View
        style={[
          {
            flexDirection: vertical ? 'column' : 'row',
            alignItems: 'center',
            gap,
            ...(overflows
              ? vertical
                ? { height: fullTrackMainSize }
                : { width: fullTrackMainSize }
              : undefined),
          },
          overflows ? trackStyle : null,
        ]}
      >
        {indices.map((index) => (
          <PillIndicatorDot
            key={index}
            activeColor={colors.activeColor}
            inactiveColor={colors.inactiveColor}
            count={count}
            index={index}
            pillJump={pillJump}
            progress={progress}
            vertical={vertical}
            overflows={overflows}
            maxVisible={maxVisible}
          />
        ))}
      </Animated.View>
    </PageIndicatorRoot>
  );
}
