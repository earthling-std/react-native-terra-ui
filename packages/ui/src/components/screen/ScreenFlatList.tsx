import {
  createElement,
  type FunctionComponent,
  isValidElement,
  type ReactElement,
} from 'react';
import { type FlatListProps, View } from 'react-native';

import Animated, { type AnimatedRef } from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { PortalHost } from '../portal';
import { useScreen } from './ScreenContext';

export interface ScreenFlatListProps<T>
  extends Omit<FlatListProps<T>, 'CellRendererComponent'> {
  /**
   * Extra bottom padding on the list content — clearance for a tab bar or home
   * indicator. Defaults to the `layout.screen.margin.y` token.
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
  bottomInset,
  ...rest
}: ScreenFlatListProps<T>) {
  const { theme } = useUnistyles();
  const { scrollRef, scrollHandler, headerSnapOffsets } = useScreen();

  const margin = theme.layout.screen.margin;

  const headerComponent = (
    <View style={{ marginBottom: margin.y }}>
      <PortalHost />
      {renderListHeader(ListHeaderComponent)}
    </View>
  );

  return (
    <Animated.FlatList
      ref={scrollRef as unknown as AnimatedRef<Animated.FlatList<T>>}
      style={style}
      contentContainerStyle={[
        {
          flexGrow: 1,
          paddingHorizontal: margin.x,
          paddingBottom: bottomInset ?? margin.y,
        },
        contentContainerStyle,
      ]}
      ListHeaderComponent={headerComponent}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      snapToOffsets={headerSnapOffsets}
      {...rest}
      onScroll={scrollHandler}
    />
  );
}
