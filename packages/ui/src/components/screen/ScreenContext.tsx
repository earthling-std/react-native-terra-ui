import { createContext, useContext } from 'react';

import type { SharedValue } from 'react-native-reanimated';

export interface ScreenContextValue {
  /**
   * Live vertical scroll offset of the screen's scroll container, driven by
   * `Screen.ScrollView` / `Screen.FlatList`. Headers (and consumer UI) read it
   * to animate on scroll.
   */
  scrollY: SharedValue<number>;
  /** Whether the screen is hosted inside a tab navigator (affects edges). */
  isInTabView: boolean;
}

export const ScreenContext = createContext<ScreenContextValue | null>(null);

/**
 * Access the enclosing `Screen`'s shared scroll state.
 *
 * @example
 * ```tsx
 * const { scrollY } = useScreen();
 * const style = useAnimatedStyle(() => ({
 *   opacity: interpolate(scrollY.value, [0, 100], [1, 0], 'clamp'),
 * }));
 * ```
 *
 * @throws if called outside a `Screen`.
 */
export function useScreen(): ScreenContextValue {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error('useScreen must be used within a Screen component');
  }
  return context;
}
