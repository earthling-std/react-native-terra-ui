import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import type { PillJumpState } from '../../hooks/use-page-indicator-progress';
import { pageIndicatorWindowScale } from '../../window';

import {
  pillIndicatorDotDistance,
  pillIndicatorJumpDisplayProgress,
  type PillIndicatorGeometry,
} from './utils';

interface PillIndicatorDotProps {
  activeColor: string;
  inactiveColor: string;
  count: number;
  index: number;
  isWindowed: boolean;
  pillJump: PillJumpState;
  progress: SharedValue<number>;
  vertical: boolean;
  windowSize: number;
  geometry: PillIndicatorGeometry;
}

export function PillIndicatorDot({
  activeColor,
  inactiveColor,
  count,
  index,
  isWindowed,
  pillJump,
  progress,
  vertical,
  windowSize,
  geometry,
}: PillIndicatorDotProps) {
  const {
    dotSize,
    activeWidth,
    inactiveOpacity,
    inactiveScale,
    slot,
  } = geometry;

  const animatedStyle = useAnimatedStyle(() => {
    const distance = pillIndicatorDotDistance(
      index,
      progress.value,
      pillJump.active.value,
      pillJump.from.value,
      pillJump.to.value,
      pillJump.t.value
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
    const edgeScale = isWindowed
      ? pageIndicatorWindowScale(
          index,
          pillIndicatorJumpDisplayProgress(
            progress.value,
            pillJump.active.value,
            pillJump.from.value,
            pillJump.to.value,
            pillJump.t.value
          ),
          count,
          slot,
          dotSize,
          windowSize,
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
