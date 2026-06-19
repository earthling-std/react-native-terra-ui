import { useEffect } from 'react';

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

import { DOT_INDICATOR_GEOMETRY, pageIndicatorDotCenter } from './utils';

const ORBIT_ARCS = [
  { id: 'arc-1', arcDegrees: 120, duration: 800, delay: 0 },
  { id: 'arc-2', arcDegrees: 60, duration: 1200, delay: 50 },
  { id: 'arc-3', arcDegrees: 30, duration: 1600, delay: 200 },
] as const;

const ORBIT_LOOP_DURATION = Math.max(
  ...ORBIT_ARCS.map((arc) => arc.delay + arc.duration)
);

const ORBIT_SETTLE_THRESHOLD = 0.04;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function computeSweepArcState(
  clock: number,
  delay: number,
  duration: number,
  arcDegrees: number
) {
  'worklet';
  const elapsed = clock * ORBIT_LOOP_DURATION;
  const localProgress = Math.min(Math.max((elapsed - delay) / duration, 0), 1);
  const leadTravel = 360 + arcDegrees;
  const lead = leadTravel * localProgress;
  const tailVisible = Math.min(Math.max(lead - arcDegrees, 0), 360);
  const headVisible = Math.min(Math.max(lead, 0), 360);
  const visibleDegrees = Math.max(0, headVisible - tailVisible);

  return { tailVisible, visibleDegrees };
}

interface SweepArcProps {
  color: string;
  arcDegrees: number;
  duration: number;
  delay: number;
  clock: SharedValue<number>;
}

function SweepArc({
  color,
  arcDegrees,
  duration,
  delay,
  clock,
}: SweepArcProps) {
  const { ringSize, ringStroke, ringRadius, ringCircumference } =
    DOT_INDICATOR_GEOMETRY;

  const containerStyle = useAnimatedStyle(() => {
    const { tailVisible, visibleDegrees } = computeSweepArcState(
      clock.value,
      delay,
      duration,
      arcDegrees
    );

    return {
      opacity: visibleDegrees > 0.01 ? 1 : 0,
      transform: [{ rotate: `${90 + tailVisible}deg` }],
    };
  });

  const animatedProps = useAnimatedProps(() => {
    const { visibleDegrees } = computeSweepArcState(
      clock.value,
      delay,
      duration,
      arcDegrees
    );
    const dash = (ringCircumference * visibleDegrees) / 360;

    return { strokeDasharray: [dash, ringCircumference] };
  });

  return (
    <Animated.View
      pointerEvents="none"
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
  loading: boolean;
  progress: SharedValue<number>;
  vertical: boolean;
}

export function LoadingOrbit({
  color,
  count,
  loading,
  progress,
  vertical,
}: LoadingOrbitProps) {
  const { dotSize, slot, crossSize, ringSize } = DOT_INDICATOR_GEOMETRY;
  const crossOffset = (crossSize - ringSize) / 2;
  const clock = useSharedValue(0);
  const loadingActive = useSharedValue(loading);

  useEffect(() => {
    loadingActive.value = loading;
  }, [loading, loadingActive]);

  const frameCallback = useFrameCallback((frame) => {
    if (!loadingActive.value) return;

    const activeIndex = Math.min(
      Math.max(Math.round(progress.value), 0),
      count - 1
    );
    const settleDistance = Math.abs(progress.value - activeIndex);

    if (settleDistance >= ORBIT_SETTLE_THRESHOLD) return;

    const dt = frame.timeSincePreviousFrame ?? 0;
    clock.value = (clock.value + dt / ORBIT_LOOP_DURATION) % 1;
  });

  useEffect(() => {
    frameCallback.setActive(loading);
  }, [frameCallback, loading]);

  const containerStyle = useAnimatedStyle(() => {
    const activeIndex = Math.min(
      Math.max(Math.round(progress.value), 0),
      count - 1
    );
    const settleDistance = Math.abs(progress.value - activeIndex);
    const mainOffset =
      pageIndicatorDotCenter(activeIndex, slot, dotSize) - ringSize / 2;

    return {
      ...(vertical ? { top: mainOffset } : { left: mainOffset }),
      opacity: loadingActive.value
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
          ...(vertical
            ? { left: crossOffset, width: ringSize, height: ringSize }
            : { top: crossOffset, width: ringSize, height: ringSize }),
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
          clock={clock}
        />
      ))}
    </Animated.View>
  );
}
