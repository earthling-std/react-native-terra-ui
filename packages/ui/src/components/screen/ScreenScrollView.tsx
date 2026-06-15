import type { ReactNode } from 'react';
import { type ScrollViewProps, View } from 'react-native';

import Animated, {
  useAnimatedReaction,
  useAnimatedRef,
  useScrollOffset,
} from 'react-native-reanimated';
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
 * Scrollable content container for a `Screen`. Mirrors its scroll offset into
 * the screen's shared `scrollY` (so headers can animate), hosts the portal
 * target at the top (where the large title is injected), and applies
 * token-driven content padding.
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
  const { scrollY } = useScreen();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  useAnimatedReaction(
    () => scrollOffset.value,
    (value) => {
      scrollY.value = value;
    }
  );

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
      {...rest}
    >
      <View style={{ marginBottom: margin.y }}>
        <PortalHost />
      </View>
      {children}
    </Animated.ScrollView>
  );
}
