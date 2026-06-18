import { memo, useEffect, useMemo, useRef } from 'react';

import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

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
const STROKE: Record<SpinnerSize, number> = { sm: 2.5, md: 3.5, lg: 4.5 };

// ~324° visible arc — short gap at the trailing end.
const ARC_FRACTION = 0.7;

const ROTATION_DURATION = 850;

let spinnerInstance = 0;

interface SpinnerArcProps {
  dim: number;
  stroke: number;
  radius: number;
  dashLength: number;
  circumference: number;
  tailX: number;
  tailY: number;
  headX: number;
  headY: number;
  color: string;
  gradientId: string;
}

const SpinnerArc = memo(function SpinnerArc({
  dim,
  stroke,
  radius,
  dashLength,
  circumference,
  tailX,
  tailY,
  headX,
  headY,
  color,
  gradientId,
}: SpinnerArcProps) {
  return (
    <Svg width={dim} height={dim}>
      <Defs>
        <LinearGradient
          id={gradientId}
          x1={tailX}
          y1={tailY}
          x2={headX}
          y2={headY}
          gradientUnits="userSpaceOnUse"
        >
          {/* <Stop offset="0" stopColor={color} stopOpacity="0.2" /> */}
          <Stop offset="0.1" stopColor={color} stopOpacity="0.4" />
          <Stop offset="1" stopColor={color} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Circle
        cx={dim / 2}
        cy={dim / 2}
        r={radius}
        stroke={`url(#${gradientId})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={[dashLength, circumference]}
      />
    </Svg>
  );
});

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
  const gradientId = useRef(`spinner-${++spinnerInstance}`).current;
  const resolvedColor =
    resolveThemeColor(color, theme) ?? theme.color.content.accent;

  const dim = DIMENSION[size];
  const stroke = STROKE[size];
  const radius = (dim - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashLength = circumference * ARC_FRACTION;

  // SVG strokes start at 3 o'clock; the arc tail/head sit on the circle edge.
  const tailX = dim / 2 + radius;
  const tailY = dim / 2;
  const headX = dim / 2;
  const headY = dim / 2 - radius;

  const rotation = useSharedValue(0);

  useEffect(() => {
    // Fast refresh can remount without running cleanup — cancel any stale loop first.
    cancelAnimation(rotation);
    rotation.value = 0;
    rotation.value = withRepeat(
      withTiming(360, {
        duration: ROTATION_DURATION,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    return () => {
      cancelAnimation(rotation);
      rotation.value = 0;
    };
  }, [rotation]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const arc = useMemo(
    () => (
      <SpinnerArc
        dim={dim}
        stroke={stroke}
        radius={radius}
        dashLength={dashLength}
        circumference={circumference}
        tailX={tailX}
        tailY={tailY}
        headX={headX}
        headY={headY}
        color={resolvedColor}
        gradientId={gradientId}
      />
    ),
    [
      circumference,
      dashLength,
      dim,
      gradientId,
      headX,
      headY,
      radius,
      resolvedColor,
      stroke,
      tailX,
      tailY,
    ]
  );

  return (
    <Animated.View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      collapsable={false}
      style={[{ width: dim, height: dim }, animStyle]}
    >
      {arc}
    </Animated.View>
  );
}
