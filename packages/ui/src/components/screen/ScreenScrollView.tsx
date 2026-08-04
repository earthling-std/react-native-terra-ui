import type { ReactNode } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewProps,
  View,
} from 'react-native';

import Animated, {
  type ScrollHandlerProcessed,
  useAnimatedScrollHandler,
  useComposedEventHandler,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import { scheduleOnRN } from 'react-native-worklets';
import { PortalHost } from '../portal';
import { SCREEN_HEADER_PORTAL_HOST, useScreen } from './ScreenContext';

export interface ScreenScrollViewProps extends ScrollViewProps {
  children?: ReactNode;
  /**
   * Reanimated scroll handler for custom scroll-driven animation, composed
   * alongside the screen's own scroll tracking and any JS `onScroll`
   * callback. Runs on the UI thread — for simple JS-side callbacks, use
   * `onScroll` instead; it doesn't require writing a worklet.
   */
  scrollHandler?: ScrollHandlerProcessed<Record<string, unknown>>;
}

/**
 * Scrollable content container for a `Screen`. Binds the screen's shared scroll
 * ref, mirrors offset into `scrollY`, hosts the portal target at the top (where
 * header content is injected), and applies token-driven content padding.
 *
 * For simple side effects (analytics, infinite-scroll triggers), pass a plain
 * `onScroll` callback. For scroll-driven animation, pass your own
 * `useAnimatedScrollHandler` via `scrollHandler` instead — it runs on the UI
 * thread alongside the screen's own handler, with no JS-thread round trip.
 *
 * @example
 * ```tsx
 * <Screen.ScrollView>
 *   <Text>Scrollable content</Text>
 * </Screen.ScrollView>
 * ```
 *
 * @example Simple JS-side scroll callback
 * ```tsx
 * <Screen.ScrollView onScroll={(e) => console.log(e.nativeEvent.contentOffset.y)}>
 *   <Text>Scrollable content</Text>
 * </Screen.ScrollView>
 * ```
 *
 * @example Custom scroll-driven animation
 * ```tsx
 * const headerOpacity = useSharedValue(1);
 * const scrollHandler = useAnimatedScrollHandler({
 *   onScroll: (event) => {
 *     headerOpacity.value = interpolate(event.contentOffset.y, [0, 100], [1, 0]);
 *     // Need a JS-side side effect too? Call scheduleOnRN(fn, ...args) here.
 *   },
 * });
 *
 * <Screen.ScrollView scrollHandler={scrollHandler}>
 *   <Text>Scrollable content</Text>
 * </Screen.ScrollView>
 * ```
 */
export function ScreenScrollView({
  children,
  style,
  contentContainerStyle,
  scrollHandler: externalScrollHandler,
  onScroll: onScrollProp,
  horizontal = false,
  ...rest
}: ScreenScrollViewProps) {
  const {
    scrollRef,
    scrollHandler: screenScrollHandler,
    hasMargins,
    hasHeader,
  } = useScreen();

  const jsScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (onScrollProp) {
        scheduleOnRN(onScrollProp, {
          nativeEvent: event,
        } as unknown as NativeSyntheticEvent<NativeScrollEvent>);
      }
    },
  });

  const handlers: ScrollHandlerProcessed<Record<string, unknown>>[] = [
    screenScrollHandler,
    ...(externalScrollHandler ? [externalScrollHandler] : []),
    ...(onScrollProp ? [jsScrollHandler] : []),
  ];

  const composedHandler = useComposedEventHandler(handlers);

  return (
    <Animated.ScrollView
      ref={scrollRef}
      // contentInsetAdjustmentBehavior="never"
      // automaticallyAdjustContentInsets={false}
      style={style}
      horizontal={horizontal}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      contentContainerStyle={styles.scrollContent(hasHeader)}
      // snapToOffsets={headerSnapOffsets}
      {...rest}
      onScroll={composedHandler}
    >
      {/* <View style={styles.safeArea} /> */}
      <View>
        <PortalHost name={SCREEN_HEADER_PORTAL_HOST} />
      </View>
      <View
        style={[styles.content(horizontal, hasMargins), contentContainerStyle]}
      >
        {children}
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  scrollContent: (hasHeader) => ({
    flexGrow: 1,
    paddingTop: hasHeader ? theme.layout.header.height : 0,
  }),
  content: (horizontal, hasMargins) => ({
    paddingHorizontal: hasMargins ? theme.layout.screen.margin.x : 0,
    flexDirection: horizontal ? 'row' : 'column',
  }),
}));
