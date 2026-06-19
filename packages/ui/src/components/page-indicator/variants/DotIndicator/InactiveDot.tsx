import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { pageIndicatorWindowScale } from '../../window';

import {
  pageIndicatorDotCenter,
  type DotIndicatorGeometry,
} from './utils';

interface InactiveDotProps {
  color: string;
  count: number;
  index: number;
  isWindowed: boolean;
  opacity: number;
  progress: SharedValue<number>;
  vertical: boolean;
  windowSize: number;
  geometry: DotIndicatorGeometry;
}

export function InactiveDot({
  color,
  count,
  index,
  isWindowed,
  opacity,
  progress,
  vertical,
  windowSize,
  geometry,
}: InactiveDotProps) {
  const { dotSize, slot, crossSize } = geometry;
  const crossOffset = (crossSize - dotSize) / 2;

  const animatedStyle = useAnimatedStyle(() => {
    const center = pageIndicatorDotCenter(index, slot, dotSize);
    const windowScale = isWindowed
      ? pageIndicatorWindowScale(
          index,
          progress.value,
          count,
          slot,
          dotSize,
          windowSize
        )
      : 1;

    return {
      ...(vertical
        ? { top: center - dotSize / 2, left: crossOffset }
        : { left: center - dotSize / 2, top: crossOffset }),
      transform: [{ scale: windowScale }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: dotSize,
          height: dotSize,
          borderRadius: 999,
          backgroundColor: color,
          opacity,
        },
        animatedStyle,
      ]}
    />
  );
}
