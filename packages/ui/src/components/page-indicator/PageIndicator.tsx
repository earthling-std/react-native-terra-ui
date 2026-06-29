import type { StyleProp, ViewStyle } from 'react-native';

import type { SharedValue } from 'react-native-reanimated';

import type { ColorToken } from '#theme/types';
import { DEFAULT_PAGE_INDICATOR_MAX_VISIBLE } from './utils';
import { DotIndicator } from './variants/DotIndicator';
import { PillIndicator } from './variants/PillIndicator';

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
   * Defaults to `5`. Overflow scrolling is off when `count <= maxVisible`.
   */
  maxVisible?: number;
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

export type PageIndicatorProps = PageIndicatorPillProps | PageIndicatorDotProps;

export function PageIndicator(props: PageIndicatorProps) {
  const {
    count,
    current,
    duration,
    activeColor,
    inactiveColor,
    vertical,
    maxVisible = DEFAULT_PAGE_INDICATOR_MAX_VISIBLE,
    style,
  } = props;

  if (props.variant === 'dot') {
    return (
      <DotIndicator
        count={count}
        current={current}
        duration={duration}
        activeColor={activeColor}
        inactiveColor={inactiveColor}
        loading={props.loading}
        loadingColor={props.loadingColor}
        vertical={vertical}
        maxVisible={maxVisible}
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
      maxVisible={maxVisible}
      style={style}
    />
  );
}

export type { DotIndicatorProps } from './variants/DotIndicator';
export { DotIndicator } from './variants/DotIndicator';
export type { PillIndicatorProps } from './variants/PillIndicator';
export { PillIndicator } from './variants/PillIndicator';
