import { FlashList, type FlashListProps } from '@shopify/flash-list';
import type { ComponentType } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  View,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useComposedEventHandler,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

import { PortalHost } from '../portal';
import { SCREEN_HEADER_PORTAL_HOST, useScreen } from './ScreenContext';
import { renderListHeader } from './utils';

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList as unknown as ComponentType<FlashListProps<unknown>>
);

export interface ScreenFlashListProps<T> extends FlashListProps<T> {
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
 * `FlashList` variant of `Screen.ScrollView`: mirrors scroll offset into the
 * screen's shared `scrollY`, hosts the portal target above the list, and
 * applies token-driven content padding.
 *
 * Requires `@shopify/flash-list` — it is a peer dependency of
 * `react-native-terra-ui` and must be installed in the consuming app.
 *
 * Note: unlike `Screen.FlatList`, this does not bind the screen's shared
 * imperative `scrollRef` — `FlashList`'s ref exposes a different (non
 * Reanimated-compatible) imperative API.
 *
 * @example
 * ```tsx
 * <Screen.FlashList data={items} renderItem={({ item }) => <Row item={item} />} />
 * ```
 */
export function ScreenFlashList<T>({
  style,
  contentContainerStyle,
  ListHeaderComponent,
  margins,
  bottomInset,
  onScroll,
  ...rest
}: ScreenFlashListProps<T>) {
  if (FlashList == null) {
    throw new Error(
      '[react-native-terra-ui] Screen.FlashList requires "@shopify/flash-list" to be installed in your app. Run `yarn add @shopify/flash-list` (or the npm/pnpm equivalent) and rebuild.'
    );
  }

  const { scrollHandler, headerSnapOffsets, hasMargins, hasHeader } =
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
    <AnimatedFlashList
      style={style}
      contentContainerStyle={[
        styles.content(hasMargins, bottomInset),
        contentContainerStyle,
      ]}
      ListHeaderComponent={headerComponent}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      snapToOffsets={headerSnapOffsets}
      {...(rest as FlashListProps<unknown>)}
      onScroll={composedHandler}
    />
  );
}

const styles = StyleSheet.create((theme, runtime) => ({
  content: (hasMargins: boolean, bottomInset: number | undefined) => ({
    paddingHorizontal: hasMargins ? theme.layout.screen.margin.x : 0,
    paddingBottom:
      bottomInset ?? (hasMargins ? theme.layout.screen.margin.y : 0),
  }),
  safeArea: {
    height: runtime.insets.top,
  },
  headerWrapper: (hasMargins: boolean) => ({
    marginHorizontal: hasMargins ? -theme.layout.screen.margin.x : 0,
  }),
  header: {
    height: theme.layout.header.height,
  },
}));
