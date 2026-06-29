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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

import { PortalHost } from '../portal';
import { useScreen } from './ScreenContext';
import { resolveScreenContentInsets } from './utils';

export interface ScreenScrollViewProps extends ScrollViewProps {
  children?: ReactNode;
  /**
   * Apply `layout.screen.margin` padding. Defaults to the enclosing `Screen`'s
   * `margins` value.
   */
  hasMargins?: boolean;
  /**
   * Extra bottom padding on the scroll content — clearance for a tab bar or
   * home indicator. Defaults to the `layout.screen.margin.y` token when margins
   * are enabled, otherwise `0`.
   */
  bottomInset?: number;
  /**
   * Optional Reanimated scroll handler composed with the screen's own scroll
   * tracking and any JS `onScroll` callback.
   */
  scrollHandler?: ScrollHandlerProcessed<Record<string, unknown>>;
}

/**
 * Scrollable content container for a `Screen`. Binds the screen's shared scroll
 * ref, mirrors offset into `scrollY`, hosts the portal target at the top (where
 * header content is injected), and applies token-driven content padding.
 *
 * @example
 * ```tsx
 * <Screen.ScrollView>
 *   <Text>Scrollable content</Text>
 * </Screen.ScrollView>
 * ```
 */
export function ScreenScrollView({
  children,
  style,
  contentContainerStyle,
  hasMargins,
  bottomInset,
  scrollHandler: externalScrollHandler,
  onScroll: onScrollProp,
  horizontal = false,
  ...rest
}: ScreenScrollViewProps) {
  const { theme } = useUnistyles();
  const { top } = useSafeAreaInsets();
  const {
    scrollRef,
    scrollHandler: screenScrollHandler,
    headerSnapOffsets,
    margins: screenMargins,
    hasHeader,
  } = useScreen();

  const jsScrollHandler = useAnimatedScrollHandler(
    onScrollProp
      ? {
          onScroll: (event) => {
            onScrollProp({
              nativeEvent: event,
            } as unknown as NativeSyntheticEvent<NativeScrollEvent>);
          },
        }
      : {}
  );

  const handlers: ScrollHandlerProcessed<Record<string, unknown>>[] = [
    screenScrollHandler,
    ...(externalScrollHandler ? [externalScrollHandler] : []),
    ...(onScrollProp ? [jsScrollHandler] : []),
  ];

  const composedHandler = useComposedEventHandler(handlers);

  const margin = theme.layout.screen.margin;
  const marginsEnabled = hasMargins ?? screenMargins;
  const compactHeaderHeight = hasHeader ? top + theme.layout.header.height : 0;
  const { contentPadding } = resolveScreenContentInsets(
    margin,
    marginsEnabled,
    bottomInset,
    compactHeaderHeight
  );

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={style}
      horizontal={horizontal}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      contentContainerStyle={contentPadding}
      snapToOffsets={headerSnapOffsets}
      {...rest}
      onScroll={composedHandler}
    >
      <View>
        <PortalHost />
      </View>
      <View
        style={[
          contentContainerStyle,
          { flexDirection: horizontal ? 'row' : 'column' },
        ]}
      >
        {/* content spacing */}
        {children}
      </View>
    </Animated.ScrollView>
  );
}
