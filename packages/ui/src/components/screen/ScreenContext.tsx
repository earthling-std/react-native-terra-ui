import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  type AnimatedRef,
  type ScrollHandlerProcessed,
  type SharedValue,
} from 'react-native-reanimated';

export type ScreenScrollRef = AnimatedRef<Animated.ScrollView>;

export interface ScreenContextValue {
  /**
   * Live vertical scroll offset of the screen's scroll container, driven by
   * `Screen.ScrollView` / `Screen.FlatList`. Headers (and consumer UI) read it
   * to animate on scroll.
   */
  scrollY: SharedValue<number>;
  /**
   * Scroll distance (px) over which the active header collapses — measured by
   * the header (e.g. large-title portal height, parallax hero height). `0`
   * disables snap and collapse-range animations (`Header.Title` screens).
   */
  headerCollapseHeight: SharedValue<number>;
  /**
   * Native `snapToOffsets` for the scroll container. `[0, height]` when a
   * collapsible header is active; `undefined` otherwise.
   */
  headerSnapOffsets: number[] | undefined;
  /** Updates collapse height for animations and native snap offsets. */
  setHeaderCollapseHeight: (height: number) => void;
  /** Shared scroll container ref — bound by `Screen.ScrollView` / `Screen.FlatList`. */
  scrollRef: ScreenScrollRef;
  /** Scroll handler that mirrors offset into `scrollY`. */
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>;
  /** Whether the screen is hosted inside a tab navigator (affects edges). */
  isInTabView: boolean;
}

export const ScreenContext = createContext<ScreenContextValue | null>(null);

export interface ScreenScrollProviderProps {
  children: ReactNode;
  isInTabView: boolean;
}

/**
 * Owns the screen's shared scroll ref, offset, snap offsets, and header collapse
 * metrics. Header variants call {@link ScreenContextValue.setHeaderCollapseHeight};
 * scroll containers bind the ref via {@link useScreen}.
 */
export function ScreenScrollProvider({
  children,
  isInTabView,
}: ScreenScrollProviderProps) {
  const scrollY = useSharedValue(0);
  const headerCollapseHeight = useSharedValue(0);
  const [headerSnapOffsets, setHeaderSnapOffsets] = useState<number[]>();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const setHeaderCollapseHeight = useCallback(
    (height: number) => {
      const rounded = Math.round(height);
      headerCollapseHeight.value = rounded;
      setHeaderSnapOffsets(rounded > 0 ? [0, rounded] : undefined);
    },
    [headerCollapseHeight]
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const value = useMemo<ScreenContextValue>(
    () => ({
      scrollY,
      headerCollapseHeight,
      headerSnapOffsets,
      setHeaderCollapseHeight,
      scrollRef,
      scrollHandler,
      isInTabView,
    }),
    [
      scrollY,
      headerCollapseHeight,
      headerSnapOffsets,
      setHeaderCollapseHeight,
      scrollRef,
      scrollHandler,
      isInTabView,
    ]
  );

  return (
    <ScreenContext.Provider value={value}>{children}</ScreenContext.Provider>
  );
}

/**
 * Access the enclosing `Screen`'s shared scroll state, ref, and snap offsets.
 *
 * @example
 * ```tsx
 * const { scrollY, scrollRef, headerSnapOffsets } = useScreen();
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
