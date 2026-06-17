import { useMemo } from 'react';
import { View } from 'react-native';

import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import type { PageIndicatorConfig, ResolvedColors } from '../utils';

interface PillIndicatorDotProps {
  activeColor: string;
  inactiveColor: string;
  index: number;
  progress: SharedValue<number>;
  dotSize: number;
  activeWidth: number;
  inactiveOpacity: number;
  inactiveScale: number;
}

function PillIndicatorDot({
  activeColor,
  inactiveColor,
  index,
  progress,
  dotSize,
  activeWidth,
  inactiveOpacity,
  inactiveScale,
}: PillIndicatorDotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const distance = Math.min(Math.abs(progress.value - index), 1);

    return {
      width: interpolate(
        distance,
        [0, 1],
        [activeWidth, dotSize],
        Extrapolation.CLAMP
      ),
      opacity: interpolate(
        distance,
        [0, 1],
        [1, inactiveOpacity],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          scale: interpolate(
            distance,
            [0, 1],
            [1, inactiveScale],
            Extrapolation.CLAMP
          ),
        },
      ],
      backgroundColor: interpolateColor(
        distance,
        [0, 1],
        [activeColor, inactiveColor]
      ),
    };
  });

  return (
    <Animated.View
      style={[{ height: dotSize, borderRadius: 999 }, animatedStyle]}
    />
  );
}

export interface PillIndicatorProps {
  colors: ResolvedColors;
  config: PageIndicatorConfig;
  count: number;
  progress: SharedValue<number>;
}

/**
 * The `pill` variant: each page is a dot that widens into a pill as it becomes
 * active. Geometry (dot size, gap, active width) comes from `config`.
 */
export function PillIndicator({
  colors,
  config,
  count,
  progress,
}: PillIndicatorProps) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: `page-${index}`,
        index,
      })),
    [count]
  );

  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', gap: config.gap }}
    >
      {items.map((item) => (
        <PillIndicatorDot
          key={item.id}
          activeColor={colors.activeColor}
          inactiveColor={colors.inactiveColor}
          index={item.index}
          progress={progress}
          dotSize={config.dotSize}
          activeWidth={config.activeWidth}
          inactiveOpacity={config.inactiveOpacity}
          inactiveScale={config.inactiveScale}
        />
      ))}
    </View>
  );
}
