import type { ReactNode } from 'react';
import { type ScrollViewProps, View } from 'react-native';

import Animated from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { PortalHost } from '../portal';
import { useScreen } from './ScreenContext';

export interface ScreenScrollViewProps extends ScrollViewProps {
  children?: ReactNode;
  /**
   * Extra bottom padding on the scroll content — clearance for a tab bar or
   * home indicator. Defaults to the `layout.screen.margin.y` token.
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
  bottomInset,
  ...rest
}: ScreenScrollViewProps) {
  const { theme } = useUnistyles();
  const { scrollRef, scrollHandler, headerSnapOffsets } = useScreen();

  const margin = theme.layout.screen.margin;

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={style}
      contentContainerStyle={[
        {
          flexGrow: 1,
          paddingHorizontal: margin.x,
          paddingBottom: bottomInset ?? margin.y,
        },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      snapToOffsets={headerSnapOffsets}
      {...rest}
      onScroll={scrollHandler}
    >
      <View style={{ marginBottom: margin.y }}>
        <PortalHost />
      </View>
      {children}
    </Animated.ScrollView>
  );
}
