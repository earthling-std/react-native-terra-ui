import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { pageIndicatorWindowScale } from '../../utils';

import { DOT_INDICATOR_GEOMETRY, pageIndicatorDotCenter } from './utils';

interface InactiveDotProps {
  color: string;
  count: number;
  index: number;
  maxVisible: number;
  opacity: number;
  overflows: boolean;
  progress: SharedValue<number>;
  vertical: boolean;
}

export function InactiveDot({
  color,
  count,
  index,
  maxVisible,
  opacity,
  overflows,
  progress,
  vertical,
}: InactiveDotProps) {
  const { dotSize, slot, crossSize } = DOT_INDICATOR_GEOMETRY;
  const crossOffset = (crossSize - dotSize) / 2;

  const animatedStyle = useAnimatedStyle(() => {
    const center = pageIndicatorDotCenter(index, slot, dotSize);
    const windowScale = overflows
      ? pageIndicatorWindowScale(
          index,
          progress.value,
          count,
          slot,
          dotSize,
          maxVisible
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
