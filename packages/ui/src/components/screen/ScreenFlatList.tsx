import {
  createElement,
  type FunctionComponent,
  isValidElement,
  type ReactElement,
} from 'react';
import { type FlatListProps, type NativeScrollEvent, type NativeSyntheticEvent, View } from 'react-native';

import Animated, {
  type AnimatedRef,
  type ScrollHandlerProcessed,
  useAnimatedScrollHandler,
  useComposedEventHandler,
} from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { PortalHost } from '../portal';
import { useScreen } from './ScreenContext';
import { resolveScreenContentInsets } from './screenContentInsets';

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

function renderListHeader(
  ListHeaderComponent: FlatListProps<unknown>['ListHeaderComponent']
): ReactElement | null {
  if (!ListHeaderComponent) return null;
  if (isValidElement(ListHeaderComponent)) return ListHeaderComponent;
  return createElement(ListHeaderComponent as FunctionComponent);
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
  const { theme } = useUnistyles();
  const {
    scrollRef,
    scrollHandler,
    headerSnapOffsets,
    margins: screenMargins,
  } = useScreen();

  const margin = theme.layout.screen.margin;
  const marginsEnabled = margins ?? screenMargins;
  const { contentPadding, portalSpacing } = resolveScreenContentInsets(
    margin,
    marginsEnabled,
    bottomInset
  );

  const jsScrollHandler = useAnimatedScrollHandler((event) => {
    if (onScroll)
      onScroll(event as unknown as NativeSyntheticEvent<NativeScrollEvent>);
  }, [onScroll]);

  const composedHandler = useComposedEventHandler([
    scrollHandler,
    jsScrollHandler,
  ]);

  const headerComponent = (
    <View
      style={portalSpacing > 0 ? { marginBottom: portalSpacing } : undefined}
    >
      <PortalHost />
      {renderListHeader(ListHeaderComponent)}
    </View>
  );

  return (
    <Animated.FlatList
      ref={scrollRef as unknown as AnimatedRef<Animated.FlatList<T>>}
      style={style}
      contentContainerStyle={[contentPadding, contentContainerStyle]}
      ListHeaderComponent={headerComponent}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      snapToOffsets={headerSnapOffsets}
      {...rest}
      onScroll={composedHandler}
    />
  );
}
