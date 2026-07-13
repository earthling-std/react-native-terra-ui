import { memo, useEffect, useId } from 'react';

import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

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

const ROTATION_DURATION = 900;

// HeroUI spinner arcs — two gradient-filled segments in a 24×24 viewBox.
const LEFT_ARC =
  'M8.749.021a1.5 1.5 0 0 1 .497 2.958A7.5 7.5 0 0 0 3 10.375a7.5 7.5 0 0 0 7.5 7.5v3c-5.799 0-10.5-4.7-10.5-10.5C0 5.23 3.726.865 8.749.021';
const RIGHT_ARC =
  'M15.392 2.673a1.5 1.5 0 0 1 2.119-.115A10.48 10.48 0 0 1 21 10.375c0 5.8-4.701 10.5-10.5 10.5v-3a7.5 7.5 0 0 0 5.007-13.084a1.5 1.5 0 0 1-.115-2.118';
const ARC_TRANSFORM = 'translate(1.5 1.625)';

interface SpinnerIconProps {
  size: number;
  color: string;
  gradientId1: string;
  gradientId2: string;
}

const SpinnerIcon = memo(function SpinnerIcon({
  size,
  color,
  gradientId1,
  gradientId2,
}: SpinnerIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <LinearGradient
          id={gradientId1}
          x1="50%"
          x2="50%"
          y1="5.271%"
          y2="91.793%"
        >
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor={color} stopOpacity={0.55} />
        </LinearGradient>
        <LinearGradient
          id={gradientId2}
          x1="50%"
          x2="50%"
          y1="15.24%"
          y2="87.15%"
        >
          <Stop offset="0%" stopColor={color} stopOpacity={0} />
          <Stop offset="100%" stopColor={color} stopOpacity={0.55} />
        </LinearGradient>
      </Defs>
      <G fill="none">
        <Path
          d={LEFT_ARC}
          fill={`url(#${gradientId1})`}
          transform={ARC_TRANSFORM}
        />
        <Path
          d={RIGHT_ARC}
          fill={`url(#${gradientId2})`}
          transform={ARC_TRANSFORM}
        />
      </G>
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
export function Spinner({ size = 'md', color = 'text.accent' }: SpinnerProps) {
  const { theme } = useUnistyles();
  const id = useId();
  const gradientId1 = `spinner-def-1-${id}`;
  const gradientId2 = `spinner-def-2-${id}`;
  const resolvedColor =
    resolveThemeColor(color, theme) ??
    (theme.color as unknown as Record<string, string | undefined>)[
      'text.accent'
    ] ??
    '';

  const dim = DIMENSION[size];
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

  return (
    <Animated.View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      collapsable={false}
      style={[{ width: dim, height: dim }, animStyle]}
    >
      <SpinnerIcon
        size={dim}
        color={resolvedColor}
        gradientId1={gradientId1}
        gradientId2={gradientId2}
      />
    </Animated.View>
  );
}
