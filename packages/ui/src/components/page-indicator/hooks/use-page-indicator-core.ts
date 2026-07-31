import type { SharedValue } from 'react-native-reanimated';
import { isPageIndicatorSharedValue } from '../utils';
import {
  type PageIndicatorColorInput,
  usePageIndicatorColors,
} from './use-page-indicator-colors';
import { usePageIndicatorProgress } from './use-page-indicator-progress';

type PageIndicatorVariant = 'pill' | 'dot';

export function usePageIndicatorCore(
  count: number,
  current: number | SharedValue<number>,
  variant: PageIndicatorVariant,
  duration: number,
  colors: PageIndicatorColorInput
) {
  const scrollLinked = isPageIndicatorSharedValue(current);
  const resolvedColors = usePageIndicatorColors(colors);
  const { progress, pillJump } = usePageIndicatorProgress(
    count,
    scrollLinked ? current : undefined,
    scrollLinked ? undefined : current,
    variant,
    duration
  );

  return {
    colors: resolvedColors,
    pillJump,
    progress,
    scrollLinked,
  };
}
