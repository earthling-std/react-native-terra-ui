import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import {
  pageIndicatorDotCenter,
  type DotIndicatorGeometry,
} from './utils';

interface TravelingPillProps {
  activeColor: string;
  count: number;
  progress: SharedValue<number>;
  vertical: boolean;
  geometry: DotIndicatorGeometry;
}

/**
 * A single pill on top of the resting dots. As `progress` moves between pages
 * its leading edge advances first (stretch), then its trailing edge catches up
 * (collapse).
 */
export function TravelingPill({
  activeColor,
  count,
  progress,
  vertical,
  geometry,
}: TravelingPillProps) {
  const { dotSize, slot, crossSize } = geometry;
  const crossOffset = (crossSize - dotSize) / 2;

  const animatedStyle = useAnimatedStyle(() => {
    const maxSegment = Math.max(0, count - 2);
    const segment = Math.min(
      Math.max(Math.floor(progress.value), 0),
      maxSegment
    );
    const frac = progress.value - segment;

    const from = pageIndicatorDotCenter(segment, slot, dotSize);
    const to = pageIndicatorDotCenter(segment + 1, slot, dotSize);

    const leading = interpolate(
      frac,
      [0, 0.5, 1],
      [from - dotSize / 2, from - dotSize / 2, to - dotSize / 2],
      Extrapolation.CLAMP
    );
    const trailing = interpolate(
      frac,
      [0, 0.5, 1],
      [from + dotSize / 2, to + dotSize / 2, to + dotSize / 2],
      Extrapolation.CLAMP
    );
    const mainSize = Math.max(dotSize, trailing - leading);

    if (vertical) {
      return { top: leading, height: mainSize };
    }

    return { left: leading, width: mainSize };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          ...(vertical
            ? { left: crossOffset, width: dotSize }
            : { top: crossOffset, height: dotSize }),
          borderRadius: 999,
          backgroundColor: activeColor,
          zIndex: 2,
        },
        animatedStyle,
      ]}
    />
  );
}
