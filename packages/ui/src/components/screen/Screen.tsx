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
import {
  type Edge,
  SafeAreaView,
  type SafeAreaViewProps,
} from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

import type { ColorToken } from '#theme/types';
import { resolveThemeColor } from '#utils/resolve-theme-color';

import { PortalProvider } from '../portal';
import { ScreenScrollProvider } from './ScreenContext';
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

/** True if `children` directly contains a `Screen.Header`. */
function hasScreenHeader(children: ReactNode): boolean {
  let found = false;
  Children.forEach(children, (child) => {
    if (found) return;
    if (isValidElement(child) && child.type === ScreenHeader) found = true;
  });
  return found;
}

export interface ScreenProps extends Omit<SafeAreaViewProps, 'edges'> {
  children: ReactNode;
  /** Background color token. Defaults to the `background` token. */
  bg?: ColorToken;
  /**
   * Safe-area edges to inset. Defaults are header-aware: `[]` when a
   * `Screen.Header` is present (the header owns the top inset), otherwise
   * `['top', 'bottom']`. An explicit value is respected, except `top` is
   * dropped when a header is present.
   */
  edges?: Edge[];
  /** Hosted inside a tab navigator? Exposed via `useScreen()`. Default false. */
  inTabView?: boolean;
  /**
   * Apply `layout.screen.margin` padding on `Screen.ScrollView` /
   * `Screen.FlatList`. Default true. Overridable per scroll container.
   */
  margins?: boolean;
}

type ScreenComponent = ReturnType<
  typeof forwardRef<ComponentRef<typeof SafeAreaView>, ScreenProps>
> & {
  Header: typeof ScreenHeader;
  ScrollView: typeof ScreenScrollView;
  FlatList: typeof ScreenFlatList;
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
const ScreenBase = forwardRef<ComponentRef<typeof SafeAreaView>, ScreenProps>(
  function Screen(
    {
      children,
      bg = 'background',
      edges,
      inTabView = false,
      margins = true,
      style,
      ...rest
    },
    ref
  ) {
    const { theme } = useUnistyles();
    const backgroundColor =
      resolveThemeColor(bg, theme) ?? theme.color.background;

    const hasHeader = useMemo(() => hasScreenHeader(children), [children]);

    const safeEdges = useMemo<Edge[]>(() => {
      if (edges) {
        return hasHeader ? edges.filter((edge) => edge !== 'top') : edges;
      }
      return hasHeader ? [] : ['top', 'bottom'];
    }, [edges, hasHeader]);

    return (
      <ScreenScrollProvider
        isInTabView={inTabView}
        margins={margins}
        hasHeader={hasHeader}
      >
        <PortalProvider>
          <SafeAreaView
            ref={ref}
            edges={safeEdges}
            style={[{ flex: 1, backgroundColor }, style]}
            {...rest}
          >
            {children}
          </SafeAreaView>
        </PortalProvider>
      </ScreenScrollProvider>
    );
  }
) as ScreenComponent;

ScreenBase.Header = ScreenHeader;
ScreenBase.ScrollView = ScreenScrollView;
ScreenBase.FlatList = ScreenFlatList;

export const Screen = ScreenBase;
