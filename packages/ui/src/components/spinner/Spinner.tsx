import { useEffect } from 'react';

import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { useUnistyles } from 'react-native-unistyles';

import type { ColorToken } from '#theme/types';
import { resolveThemeColor } from '#utils/resolve-theme-color';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  /** Spinner diameter preset. Defaults to `'md'`. */
  size?: SpinnerSize;
  /** Theme color token or raw CSS color. Defaults to the accent color. */
  color?: ColorToken;
}

const DIMENSION: Record<SpinnerSize, number> = { sm: 16, md: 24, lg: 32 };
const STROKE: Record<SpinnerSize, number> = { sm: 2, md: 2.5, lg: 3 };

// 270° visible arc — leaves a short gap at the trailing end.
const ARC_FRACTION = 0.75;

/**
 * Animated loading spinner. Used by `Button` when `isLoading` is set.
 *
 * @example
 * ```tsx
 * <Spinner size="md" color="content.accent" />
 * ```
 */
export function Spinner({
  size = 'md',
  color = 'content.accent',
}: SpinnerProps) {
  const { theme } = useUnistyles();
  const resolvedColor =
    resolveThemeColor(color, theme) ?? theme.color.content.accent;

  const dim = DIMENSION[size];
  const stroke = STROKE[size];
  const radius = (dim - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashLength = circumference * ARC_FRACTION;

  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 850, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(rotation);
  }, [rotation]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      style={[{ width: dim, height: dim }, animStyle]}
    >
      <Svg width={dim} height={dim}>
        <Circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          stroke={resolvedColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={[dashLength, circumference]}
        />
      </Svg>
    </Animated.View>
  );
}
