import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  Keyframe,
  type SharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { ToastId, ToastPlacement } from './types';

export interface ToastAnimatedItemProps {
  children: ReactElement;
  heights: SharedValue<Record<ToastId, number>>;
  id: ToastId;
  index: number;
  maxVisibleToasts: number;
  placement: ToastPlacement;
  total: SharedValue<number>;
}

export const enteringTop = new Keyframe({
  0: {
    opacity: 1,
    transform: [{ translateY: -100 }],
  },
  100: {
    opacity: 1,
    transform: [{ translateY: 0 }],
    easing: Easing.out(Easing.cubic),
  },
}).duration(260);

export const exitingTop = new Keyframe({
  0: {
    opacity: 1,
    transform: [{ translateY: 0 }, { scale: 1 }],
  },
  100: {
    opacity: 0.5,
    transform: [{ translateY: -100 }, { scale: 0.97 }],
    easing: Easing.bezier(0.4, 0, 1, 1),
  },
}).duration(150);

export const enteringBottom = new Keyframe({
  0: {
    opacity: 1,
    transform: [{ translateY: 100 }],
  },
  100: {
    opacity: 1,
    transform: [{ translateY: 0 }],
    easing: Easing.out(Easing.cubic),
  },
}).duration(260);

export const exitingBottom = new Keyframe({
  0: {
    opacity: 1,
    transform: [{ translateY: 0 }, { scale: 1 }],
  },
  100: {
    opacity: 0.5,
    transform: [{ translateY: 100 }, { scale: 0.97 }],
    easing: Easing.bezier(0.4, 0, 1, 1),
  },
}).duration(150);

const opacityValue = [1, 0] as [number, number];
const opacityTimingConfig = { duration: 300 };
const translateYValue = [0, 10] as [number, number];
const translateYTimingConfig = { duration: 300 };
const scaleValue = [1, 0.97] as [number, number];
const scaleTimingConfig = { duration: 300 };

export function ToastAnimatedItem({
  children,
  heights,
  id,
  index,
  maxVisibleToasts,
  placement,
  total,
}: ToastAnimatedItemProps) {
  const containerStyle = useAnimatedStyle(() => {
    const heightEntries = Object.entries(heights.value);
    const lastToastId = heightEntries[heightEntries.length - 1]?.[0];
    const lastToastHeight = lastToastId
      ? heights.value[lastToastId]
      : undefined;
    const totalValue = total.value;
    const sign = placement === 'top' ? 1 : -1;

    const inputRange = [totalValue - 1, totalValue - 2];
    const opacityInputRange = [
      totalValue - maxVisibleToasts,
      totalValue - maxVisibleToasts - 1,
    ];

    const opacity = interpolate(index, opacityInputRange, opacityValue);
    const translateY = interpolate(
      index,
      inputRange,
      [translateYValue[0], translateYValue[1] * sign],
      Extrapolation.CLAMP
    );
    const scale = interpolate(index, inputRange, scaleValue, {
      extrapolateLeft: Extrapolation.CLAMP,
    });

    return {
      height: lastToastHeight
        ? withSpring(lastToastHeight, {
            damping: 100,
            stiffness: 1200,
            mass: 3,
          })
        : undefined,
      pointerEvents: opacity === 0 ? 'none' : 'auto',
      opacity: withTiming(opacity, opacityTimingConfig),
      transform: [
        { translateY: withTiming(translateY, translateYTimingConfig) },
        { scale: withTiming(scale, scaleTimingConfig) },
      ],
      zIndex: 1000 + index,
    };
  });

  return (
    <Animated.View
      entering={placement === 'top' ? enteringTop : enteringBottom}
      exiting={placement === 'top' ? exitingTop : exitingBottom}
      pointerEvents="box-none"
      style={[
        styles.position,
        placement === 'top' ? styles.top : styles.bottom,
      ]}
    >
      <Animated.View style={containerStyle}>{children}</Animated.View>
      <View
        pointerEvents="none"
        aria-hidden
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
        style={styles.measurement}
        onLayout={(event) => {
          const measuredHeight = event.nativeEvent.layout.height;
          heights.value = {
            ...heights.value,
            [id]: measuredHeight,
          };
        }}
      >
        {process.env.NODE_ENV === 'test' ? null : children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  position: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  top: {
    top: 0,
  },
  bottom: {
    bottom: 0,
  },
  measurement: {
    position: 'absolute',
    left: 0,
    right: 0,
    opacity: 0,
  },
});
