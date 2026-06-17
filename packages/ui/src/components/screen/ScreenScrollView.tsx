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
import { useUnistyles } from 'react-native-unistyles';

import { PortalHost } from '../portal';
import { useScreen } from './ScreenContext';
import { resolveScreenContentInsets } from './screenContentInsets';

export interface ScreenScrollViewProps extends ScrollViewProps {
  children?: ReactNode;
  /**
   * Apply `layout.screen.margin` padding. Defaults to the enclosing `Screen`'s
   * `margins` value.
   */
  margins?: boolean;
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
  margins,
  bottomInset,
  onScroll,
  scrollHandler: externalScrollHandler,
  ...rest
}: ScreenScrollViewProps) {
  const { theme } = useUnistyles();
  const {
    scrollRef,
    scrollHandler: screenScrollHandler,
    headerSnapOffsets,
    margins: screenMargins,
  } = useScreen();

  const propScrollHandler = useAnimatedScrollHandler((event) => {
    if (onScroll)
      onScroll(event as unknown as NativeSyntheticEvent<NativeScrollEvent>);
  }, [onScroll]);

  const composedHandler = useComposedEventHandler(
    externalScrollHandler
      ? [screenScrollHandler, propScrollHandler, externalScrollHandler]
      : [screenScrollHandler, propScrollHandler]
  );

  const margin = theme.layout.screen.margin;
  const marginsEnabled = margins ?? screenMargins;
  const { contentPadding, portalSpacing } = resolveScreenContentInsets(
    margin,
    marginsEnabled,
    bottomInset
  );

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={style}
      contentContainerStyle={[contentPadding, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      snapToOffsets={headerSnapOffsets}
      {...rest}
      onScroll={composedHandler}
    >
      <View
        style={portalSpacing > 0 ? { marginBottom: portalSpacing } : undefined}
      >
        <PortalHost />
      </View>
      {children}
    </Animated.ScrollView>
  );
}
