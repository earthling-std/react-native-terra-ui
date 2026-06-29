import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import type { PillJumpState } from '../../hooks/use-page-indicator-progress';
import { pageIndicatorWindowScale } from '../../utils';

import {
  PILL_INDICATOR_GEOMETRY,
  pillIndicatorDotDistance,
  pillIndicatorJumpDisplayProgress,
  readPillJumpState,
} from './utils';

interface PillIndicatorDotProps {
  activeColor: string;
  inactiveColor: string;
  count: number;
  index: number;
  maxVisible: number;
  overflows: boolean;
  pillJump: PillJumpState;
  progress: SharedValue<number>;
  vertical: boolean;
}

export function PillIndicatorDot({
  activeColor,
  inactiveColor,
  count,
  index,
  maxVisible,
  overflows,
  pillJump,
  progress,
  vertical,
}: PillIndicatorDotProps) {
  const { dotSize, activeWidth, inactiveOpacity, inactiveScale, slot } =
    PILL_INDICATOR_GEOMETRY;

  const animatedStyle = useAnimatedStyle(() => {
    const jump = readPillJumpState(pillJump);
    const displayProgress = pillIndicatorJumpDisplayProgress(
      progress.value,
      jump.active,
      jump.from,
      jump.to,
      jump.t
    );
    const distance = pillIndicatorDotDistance(
      index,
      progress.value,
      jump.active,
      jump.from,
      jump.to,
      jump.t
    );

    const mainSize = interpolate(
      distance,
      [0, 1],
      [activeWidth, dotSize],
      Extrapolation.CLAMP
    );
    const activeScale = interpolate(
      distance,
      [0, 1],
      [1, inactiveScale],
      Extrapolation.CLAMP
    );
    const edgeScale = overflows
      ? pageIndicatorWindowScale(
          index,
          displayProgress,
          count,
          slot,
          dotSize,
          maxVisible,
          activeWidth
        )
      : 1;

    return {
      ...(vertical
        ? { width: dotSize, height: mainSize }
        : { width: mainSize, height: dotSize }),
      opacity: interpolate(
        distance,
        [0, 1],
        [1, inactiveOpacity],
        Extrapolation.CLAMP
      ),
      transform: [{ scale: activeScale * edgeScale }],
      backgroundColor: interpolateColor(
        distance,
        [0, 1],
        [activeColor, inactiveColor]
      ),
    };
  });

  return <Animated.View style={[{ borderRadius: 999 }, animatedStyle]} />;
}
