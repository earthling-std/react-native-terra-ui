import {
  type FlatListProps,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  View,
} from 'react-native';

import Animated, {
  type AnimatedRef,
  useAnimatedScrollHandler,
  useComposedEventHandler,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

import { PortalHost } from '../portal';
import { SCREEN_HEADER_PORTAL_HOST, useScreen } from './ScreenContext';
import { renderListHeader } from './utils';

export interface ScreenFlatListProps<T>
  extends Omit<FlatListProps<T>, 'CellRendererComponent'> {
  /**
   * Apply `layout.screen.margin` padding. Defaults to the enclosing `Screen`'s
   * `margins` value.
   */
  margins?: boolean;
  /**
   * Extra bottom padding on the list content — clearance for a tab bar or home
   * indicator. Defaults to the `layout.screen.margin.y` token when margins are
   * enabled, otherwise `0`.
   */
  bottomInset?: number;
}

/**
 * `FlatList` variant of `Screen.ScrollView`: binds the screen's shared scroll
 * ref, mirrors offset into `scrollY`, hosts the portal target above the list,
 * and applies token-driven content padding.
 *
 * @example
 * ```tsx
 * <Screen.FlatList data={items} renderItem={({ item }) => <Row item={item} />} />
 * ```
 */
export function ScreenFlatList<T>({
  style,
  contentContainerStyle,
  ListHeaderComponent,
  margins,
  bottomInset,
  onScroll,
  ...rest
}: ScreenFlatListProps<T>) {
  const { scrollRef, scrollHandler, headerSnapOffsets, hasMargins, hasHeader } =
    useScreen();

  const jsScrollHandler = useAnimatedScrollHandler(
    (event) => {
      if (onScroll)
        onScroll(event as unknown as NativeSyntheticEvent<NativeScrollEvent>);
    },
    [onScroll]
  );

  const composedHandler = useComposedEventHandler([
    scrollHandler,
    jsScrollHandler,
  ]);

  const headerComponent = (
    <View style={styles.headerWrapper(hasMargins)}>
      {hasHeader ? <View style={styles.header} /> : null}
      <PortalHost name={SCREEN_HEADER_PORTAL_HOST} />
      {renderListHeader(ListHeaderComponent)}
    </View>
  );

  return (
    <Animated.FlatList
      ref={scrollRef as unknown as AnimatedRef<Animated.FlatList<T>>}
      style={style}
      contentContainerStyle={[
        styles.content(hasMargins),
        contentContainerStyle,
      ]}
      ListHeaderComponent={headerComponent}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      snapToOffsets={headerSnapOffsets}
      {...rest}
      onScroll={composedHandler}
    />
  );
}

const styles = StyleSheet.create((theme, runtime) => ({
  scrollContent: {
    flexGrow: 1,
  },
  content: (hasMargins) => ({
    paddingHorizontal: hasMargins ? theme.layout.screen.margin.x : 0,
  }),
  safeArea: {
    height: runtime.insets.top,
  },
  headerWrapper: (hasMargins) => ({
    marginHorizontal: hasMargins ? -theme.layout.screen.margin.x : 0,
  }),
  header: {
    height: theme.layout.header.height,
  },
}));
