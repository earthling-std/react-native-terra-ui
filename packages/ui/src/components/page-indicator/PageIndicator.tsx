import { useMemo } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import type { SharedValue } from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { resolveThemeColor } from '#utils/resolve-theme-color';

import {
  type PageIndicatorColors,
  type PageIndicatorConfig,
  resolvePageIndicatorConfig,
} from './utils';
import { DotIndicator } from './variants/DotIndicator';
import { PillIndicator } from './variants/PillIndicator';

export type PageIndicatorVariant = 'pill' | 'dot';

export interface PageIndicatorProps extends PageIndicatorColors {
  /** Indicator style. `pill` preserves the default active-pill animation. */
  variant?: PageIndicatorVariant;
  /** Number of pages represented by the indicator. */
  count: number;
  /** Animated page progress, where `0` is page one and `1` is page two. */
  progress: SharedValue<number>;
  /** External loading state. Only affects `variant="dot"`. */
  isLoading?: boolean;

  config?: Partial<PageIndicatorConfig>;

  style?: StyleProp<ViewStyle>;
}

export function PageIndicator({
  count,
  progress,
  variant = 'pill',
  isLoading = false,
  activeColor = 'content.primary',
  inactiveColor = 'content.disabled',
  loadingColor = 'content.disabled',
  style,
  config,
}: PageIndicatorProps) {
  const { theme } = useUnistyles();

  // Top-level color props take precedence over the config's color tokens.
  const colors = useMemo(() => {
    return {
      activeColor:
        resolveThemeColor(activeColor, theme) ?? theme.color.content.primary,
      inactiveColor:
        resolveThemeColor(inactiveColor, theme) ?? theme.color.content.disabled,
      loadingColor:
        resolveThemeColor(loadingColor, theme) ?? theme.color.content.disabled,
    };
  }, [activeColor, inactiveColor, loadingColor, theme]);

  return (
    <View pointerEvents="none" style={style}>
      {variant === 'dot' ? (
        <DotIndicator
          config={resolvePageIndicatorConfig(config)}
          colors={colors}
          count={count}
          isLoading={isLoading}
          progress={progress}
        />
      ) : (
        <PillIndicator
          config={resolvePageIndicatorConfig(config)}
          colors={colors}
          count={count}
          progress={progress}
        />
      )}
    </View>
  );
}
