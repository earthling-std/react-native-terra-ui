import type { ReactNode } from 'react';
import { type ScrollViewProps, View } from 'react-native';

import Animated from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { PortalHost } from '../portal';
import { resolveScreenContentInsets } from './screenContentInsets';
import { useScreen } from './ScreenContext';

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
  ...rest
}: ScreenScrollViewProps) {
  const { theme } = useUnistyles();
  const { scrollRef, scrollHandler, headerSnapOffsets, margins: screenMargins } =
    useScreen();

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
      onScroll={scrollHandler}
    >
      <View style={portalSpacing > 0 ? { marginBottom: portalSpacing } : undefined}>
        <PortalHost />
      </View>
      {children}
    </Animated.ScrollView>
  );
}
