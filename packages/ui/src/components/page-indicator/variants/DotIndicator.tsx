import { useEffect, useMemo } from 'react';
import { View } from 'react-native';

import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import type { PageIndicatorConfig, ResolvedColors } from '../utils';

/**
 * Each loading arc has a peak length, its own lap duration (speed), and a
 * start `delay`. After its delay each arc grows out of the bottom (trailing
 * edge pinned while it lengthens), sweeps one full revolution at its own speed,
 * then is cut off back into the bottom (leading edge pinned while it shrinks).
 * The loop — and the next start of every arc — is gated on the last arc to
 * finish, i.e. the largest `delay + duration`.
 */
const ORBIT_ARCS = [
  { id: 'arc-1', arcDegrees: 120, duration: 800, delay: 0 },
  { id: 'arc-2', arcDegrees: 60, duration: 1200, delay: 50 },
  { id: 'arc-3', arcDegrees: 30, duration: 1600, delay: 200 },
] as const;

/** Loop length is set by the last arc to finish (its delay plus duration). */
const ORBIT_LOOP_DURATION = Math.max(
  ...ORBIT_ARCS.map((arc) => arc.delay + arc.duration)
);

/** A page is "settled" (and the spinner runs) within this much of a dot. */
const ORBIT_SETTLE_THRESHOLD = 0.04;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** Geometry derived once from the config and shared by the sub-components. */
interface DotGeometry {
  dotSize: number;
  /** Center-to-center spacing between adjacent dots. */
  slot: number;
  /** Row height, sized to fit whichever is taller: the dot or the ring. */
  rowHeight: number;
  ringSize: number;
  ringStroke: number;
  ringRadius: number;
  ringCircumference: number;
}

function buildGeometry(config: PageIndicatorConfig): DotGeometry {
  const ringRadius = (config.ringSize - config.ringStroke) / 2;
  return {
    dotSize: config.dotSize,
    slot: config.dotSize + config.gap,
    rowHeight: Math.max(config.ringSize, config.dotSize),
    ringSize: config.ringSize,
    ringStroke: config.ringStroke,
    ringRadius,
    ringCircumference: 2 * Math.PI * ringRadius,
  };
}

/** Resting horizontal center of dot `index` within the dot row. */
function dotCenter(index: number, slot: number, dotSize: number) {
  'worklet';
  return index * slot + dotSize / 2;
}

interface TravelingPillProps {
  activeColor: string;
  count: number;
  progress: SharedValue<number>;
  geometry: DotGeometry;
}

/**
 * A single pill that lives on top of the resting dots. As `progress` moves
 * between two pages its leading edge advances first (stretch), then its
 * trailing edge catches up (collapse) — so the active dot appears to grow into
 * a pill, travel to the next slot, and settle back into a dot.
 */
function TravelingPill({
  activeColor,
  count,
  progress,
  geometry,
}: TravelingPillProps) {
  const { dotSize, slot, rowHeight } = geometry;

  const animatedStyle = useAnimatedStyle(() => {
    const maxSegment = Math.max(0, count - 2);
    const segment = Math.min(
      Math.max(Math.floor(progress.value), 0),
      maxSegment
    );
    const frac = progress.value - segment;

    const from = dotCenter(segment, slot, dotSize);
    const to = dotCenter(segment + 1, slot, dotSize);

    // Leading edge moves over the first half; trailing edge over the second.
    const left = interpolate(
      frac,
      [0, 0.5, 1],
      [from - dotSize / 2, from - dotSize / 2, to - dotSize / 2],
      Extrapolation.CLAMP
    );
    const right = interpolate(
      frac,
      [0, 0.5, 1],
      [from + dotSize / 2, to + dotSize / 2, to + dotSize / 2],
      Extrapolation.CLAMP
    );

    return {
      left,
      width: Math.max(dotSize, right - left),
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top: (rowHeight - dotSize) / 2,
          height: dotSize,
          borderRadius: 999,
          backgroundColor: activeColor,
        },
        animatedStyle,
      ]}
    />
  );
}

interface SweepArcProps {
  color: string;
  arcDegrees: number;
  duration: number;
  delay: number;
  geometry: DotGeometry;
  /** Shared loop clock, looping 0→1 over `ORBIT_LOOP_DURATION`. */
  clock: SharedValue<number>;
}

/**
 * One loading arc driven by the shared loop `clock`. After its `delay`, its
 * leading edge travels `360 + arcDegrees` over the arc's own `duration`, with
 * both edges clipped at the bottom gate. So it grows out of the bottom (trailing
 * edge pinned, lengthening to `arcDegrees`), sweeps one revolution at full
 * length, then is cut off back into the bottom (leading edge pinned, shrinking
 * to zero). The dash starts at the SVG 3 o'clock point, so a +90° base rotation
 * anchors the gate at the bottom.
 */
function SweepArc({
  color,
  arcDegrees,
  duration,
  delay,
  geometry,
  clock,
}: SweepArcProps) {
  const { ringSize, ringStroke, ringRadius, ringCircumference } = geometry;
  const leadTravel = 360 + arcDegrees;

  const containerStyle = useAnimatedStyle(() => {
    const elapsed = clock.value * ORBIT_LOOP_DURATION;
    const localProgress = Math.min(
      Math.max((elapsed - delay) / duration, 0),
      1
    );
    const lead = leadTravel * localProgress;
    const tailVisible = Math.min(Math.max(lead - arcDegrees, 0), 360);
    const headVisible = Math.min(Math.max(lead, 0), 360);

    return {
      opacity: headVisible - tailVisible > 0.01 ? 1 : 0,
      transform: [{ rotate: `${90 + tailVisible}deg` }],
    };
  });

  const animatedProps = useAnimatedProps(() => {
    const elapsed = clock.value * ORBIT_LOOP_DURATION;
    const localProgress = Math.min(
      Math.max((elapsed - delay) / duration, 0),
      1
    );
    const lead = leadTravel * localProgress;
    const tailVisible = Math.min(Math.max(lead - arcDegrees, 0), 360);
    const headVisible = Math.min(Math.max(lead, 0), 360);
    const visibleDegrees = Math.max(0, headVisible - tailVisible);
    const dash = (ringCircumference * visibleDegrees) / 360;
    return { strokeDasharray: [dash, ringCircumference] };
  });

  return (
    <Animated.View
      style={[
        { position: 'absolute', width: ringSize, height: ringSize },
        containerStyle,
      ]}
    >
      <Svg width={ringSize} height={ringSize}>
        <AnimatedCircle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={ringRadius}
          stroke={color}
          strokeWidth={ringStroke}
          strokeLinecap="round"
          fill="none"
          animatedProps={animatedProps}
        />
      </Svg>
    </Animated.View>
  );
}

interface LoadingOrbitProps {
  color: string;
  count: number;
  isLoading: boolean;
  progress: SharedValue<number>;
  geometry: DotGeometry;
}

/**
 * The loading spinner: the `SweepArc`s share one loop clock so they restart in
 * unison once the slowest arc finishes. Stacked over the active dot, the group
 * runs only while the page is settled and `isLoading` is true. As soon as the
 * page starts moving the clock is frozen (the animation pauses) and the group
 * fades out; it resumes from where it paused once the next page settles.
 */
function LoadingOrbit({
  color,
  count,
  isLoading,
  progress,
  geometry,
}: LoadingOrbitProps) {
  const { dotSize, slot, rowHeight, ringSize } = geometry;
  const clock = useSharedValue(0);
  const loading = useSharedValue(isLoading);

  useEffect(() => {
    loading.value = isLoading;
  }, [isLoading, loading]);

  useFrameCallback((frame) => {
    const activeIndex = Math.min(
      Math.max(Math.round(progress.value), 0),
      count - 1
    );
    const settleDistance = Math.abs(progress.value - activeIndex);
    if (loading.value && settleDistance < ORBIT_SETTLE_THRESHOLD) {
      const dt = frame.timeSincePreviousFrame ?? 0;
      clock.value = (clock.value + dt / ORBIT_LOOP_DURATION) % 1;
    }
  });

  const containerStyle = useAnimatedStyle(() => {
    const activeIndex = Math.min(
      Math.max(Math.round(progress.value), 0),
      count - 1
    );
    const settleDistance = Math.abs(progress.value - activeIndex);

    return {
      left: dotCenter(activeIndex, slot, dotSize) - ringSize / 2,
      opacity: isLoading
        ? interpolate(settleDistance, [0, 0.12], [1, 0], Extrapolation.CLAMP)
        : 0,
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top: (rowHeight - ringSize) / 2,
          width: ringSize,
          height: ringSize,
        },
        containerStyle,
      ]}
    >
      {ORBIT_ARCS.map((arc) => (
        <SweepArc
          key={arc.id}
          color={color}
          arcDegrees={arc.arcDegrees}
          duration={arc.duration}
          delay={arc.delay}
          geometry={geometry}
          clock={clock}
        />
      ))}
    </Animated.View>
  );
}

export interface DotIndicatorProps {
  colors: ResolvedColors;
  config: PageIndicatorConfig;
  count: number;
  isLoading: boolean;
  progress: SharedValue<number>;
}

/**
 * The `dot` variant: a row of resting dots with a traveling pill marking the
 * active page and an optional loading spinner around it. Geometry comes from
 * `config`.
 */
export function DotIndicator({
  colors,
  config,
  count,
  isLoading,
  progress,
}: DotIndicatorProps) {
  const geometry = useMemo(() => buildGeometry(config), [config]);
  const { dotSize, slot, rowHeight } = geometry;
  const rowWidth = Math.max(dotSize, (count - 1) * slot + dotSize);
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: `dot-${index}`,
        index,
      })),
    [count]
  );

  return (
    <View style={{ width: rowWidth, height: rowHeight }}>
      {dots.map(({ id, index }) => (
        <View
          key={id}
          style={{
            position: 'absolute',
            left: dotCenter(index, slot, dotSize) - dotSize / 2,
            top: (rowHeight - dotSize) / 2,
            width: dotSize,
            height: dotSize,
            borderRadius: 999,
            backgroundColor: colors.inactiveColor,
            opacity: config.inactiveOpacity,
          }}
        />
      ))}
      <TravelingPill
        activeColor={colors.activeColor}
        count={count}
        progress={progress}
        geometry={geometry}
      />
      <LoadingOrbit
        color={colors.loadingColor}
        count={count}
        isLoading={isLoading}
        progress={progress}
        geometry={geometry}
      />
    </View>
  );
}
