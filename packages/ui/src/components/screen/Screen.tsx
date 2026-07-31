import {
  Children,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ElementType,
  Fragment,
  forwardRef,
  isValidElement,
  type PropsWithChildren,
  type ReactNode,
  useMemo,
} from 'react';
import { View } from 'react-native';
import type { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import { StyleSheet } from 'react-native-unistyles';
import type { ColorToken } from '#theme/types';
import { PortalProvider } from '../portal';
import { ScreenScrollProvider } from './ScreenContext';
import { ScreenFlashList } from './ScreenFlashList';
import { ScreenFlatList } from './ScreenFlatList';
import { ScreenScrollView } from './ScreenScrollView';

export type ScreenHeaderProps<T extends ElementType = typeof Fragment> =
  PropsWithChildren<
    {
      /**
       * Component to render the header as. Defaults to `Fragment` (no
       * wrapper). Use this to cast the header to a different container,
       * e.g. `as={View}` — any extra props are forwarded to it.
       */
      as?: T;
    } & Omit<ComponentPropsWithoutRef<T>, 'children'>
  >;

/**
 * Marker slot identifying the screen's header — its purpose is to let
 * `Screen` detect a header synchronously and drop the `top` safe-area edge
 * (the header manages its own top inset).
 *
 * Place a `Header.Title` / `Header.LargeTitle` (or any custom header) inside it.
 *
 * @example
 * ```tsx
 * <Screen.Header as={Header.Title} title="Meditate" />
 * ```
 */
function ScreenHeader<T extends ElementType = typeof Fragment>({
  children,
  as,
  ...rest
}: ScreenHeaderProps<T>) {
  const Component = as ?? Fragment;
  return <Component {...rest}>{children}</Component>;
}
ScreenHeader.displayName = 'Screen.Header';

/** True if `children` directly contains a `Screen.Header`. */
function hasScreenHeader(children: ReactNode): boolean {
  let found = false;
  Children.forEach(children, (child) => {
    if (found) return;
    if (
      isValidElement(child) &&
      typeof child.type !== 'string' &&
      (child.type as { displayName?: string }).displayName === 'Screen.Header'
    )
      found = true;
  });
  return found;
}

export interface ScreenProps extends ViewProps {
  children: ReactNode;
  /** Background color token. Defaults to the `background` token. */
  bg?: ColorToken;
  /** Hosted inside a tab navigator? Exposed via `useScreen()`. Default false. */
  inTabView?: boolean;
  /**
   * Apply `layout.screen.margin` padding on `Screen.ScrollView` /
   * `Screen.FlatList`. Default true. Overridable per scroll container.
   */
  hasMargins?: boolean;
}

type ScreenComponent = ReturnType<
  typeof forwardRef<ComponentRef<typeof View>, ScreenProps>
> & {
  Header: typeof ScreenHeader;
  ScrollView: typeof ScreenScrollView;
  FlatList: typeof ScreenFlatList;
  FlashList: typeof ScreenFlashList;
};

/**
 * Themed page container: solid themed background, safe-area handling, and a
 * shared scroll context for headers. Pair with `Screen.ScrollView` /
 * `Screen.FlatList` and a `Header.LargeTitle` / `Header.Title`.
 *
 * @example
 * ```tsx
 * <Screen>
 *   <Screen.Header as={Header.LargeTitle} title="Meditate" />
 *   <Screen.ScrollView>{content}</Screen.ScrollView>
 * </Screen>
 * ```
 */
const ScreenBase = forwardRef<ComponentRef<typeof View>, ScreenProps>(
  function Screen(
    { children, bg = 'background', hasMargins = true, style, ...rest },
    _ref
  ) {
    const hasHeader = useMemo(() => hasScreenHeader(children), [children]);

    return (
      <ScreenScrollProvider hasMargins={hasMargins} hasHeader={hasHeader}>
        <PortalProvider>
          <View style={[styles.container(bg), style]} {...rest}>
            {children}
          </View>
        </PortalProvider>
      </ScreenScrollProvider>
    );
  }
) as ScreenComponent;

ScreenBase.Header = ScreenHeader;
ScreenBase.ScrollView = ScreenScrollView;
ScreenBase.FlatList = ScreenFlatList;
ScreenBase.FlashList = ScreenFlashList;

export const Screen = ScreenBase;

const styles = StyleSheet.create((theme, runtime) => ({
  container: (bg?: string) => ({
    flex: 1,
    paddingTop: runtime.insets.top,
    backgroundColor: bg || theme.color.background,
  }),
}));
