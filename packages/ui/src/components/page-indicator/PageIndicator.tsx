import { type StyleProp, type ViewStyle } from 'react-native';

import type { SharedValue } from 'react-native-reanimated';

import type { ColorToken } from '#theme/types';

import { DotIndicator } from './variants/DotIndicator';
import { PillIndicator } from './variants/PillIndicator';
import { DEFAULT_PAGE_INDICATOR_WINDOW_SIZE } from './window';

export type PageIndicatorVariant = 'pill' | 'dot';

type PageIndicatorCoreProps = {
  /** Number of pages represented by the indicator. */
  count: number;
  /**
   * Active page index, or a shared value for scroll-linked motion.
   * Index `0` is the first page; fractional values animate between pages.
   */
  current?: number | SharedValue<number>;
  /** Duration for discrete `current` changes. */
  duration?: number;
  /** Active page color token. */
  activeColor?: ColorToken;
  /** Inactive page color token. */
  inactiveColor?: ColorToken;
  /** Stack dots vertically instead of horizontally. */
  vertical?: boolean;
  /**
   * Maximum dots visible before the track scrolls and edge-scales.
   * Defaults to `5`. Windowing is off when `count <= windowSize`.
   */
  windowSize?: number;
  style?: StyleProp<ViewStyle>;
};

/** Pill indicator — active page widens into a pill. Default when `variant` is omitted. */
export type PageIndicatorPillProps = PageIndicatorCoreProps & {
  variant?: 'pill';
  loading?: never;
  loadingColor?: never;
};

/** Dot indicator — traveling dot with optional loading ring on the active page. */
export type PageIndicatorDotProps = PageIndicatorCoreProps & {
  variant: 'dot';
  /** Loading ring color token. */
  loadingColor?: ColorToken;
  /** Renders a ring around the active dot while loading. */
  loading?: boolean;
};

export type PageIndicatorProps =
  | PageIndicatorPillProps
  | PageIndicatorDotProps;

export function PageIndicator(props: PageIndicatorProps) {
  const {
    count,
    current,
    duration,
    activeColor,
    inactiveColor,
    vertical,
    windowSize = DEFAULT_PAGE_INDICATOR_WINDOW_SIZE,
    style,
  } = props;

  if (props.variant === 'dot') {
    const { loadingColor, loading } = props;

    return (
      <DotIndicator
        count={count}
        current={current}
        duration={duration}
        activeColor={activeColor}
        inactiveColor={inactiveColor}
        loadingColor={loadingColor}
        loading={loading}
        vertical={vertical}
        windowSize={windowSize}
        style={style}
      />
    );
  }

  return (
    <PillIndicator
      count={count}
      current={current}
      duration={duration}
      activeColor={activeColor}
      inactiveColor={inactiveColor}
      vertical={vertical}
      windowSize={windowSize}
      style={style}
    />
  );
}

export type { DotIndicatorProps } from './variants/DotIndicator';
export { DotIndicator } from './variants/DotIndicator';
export type { PillIndicatorProps } from './variants/PillIndicator';
export { PillIndicator } from './variants/PillIndicator';
