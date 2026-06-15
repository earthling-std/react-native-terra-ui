# Screen component — design plan

A `Screen` family for `react-native-terra-ui`, derived from the es-meditation
`Screen` idea but redesigned to fit terra-ui's conventions (token theme,
`forwardRef`, `#`-aliases, `bg` color tokens) and packaging philosophy.

## Goals

Deliver the signature behavior of the es-meditation screen — a themed page
container with safe-area handling and an iOS-style collapsing large-title
header — while (a) cutting the react-navigation and gradient couplings, and
(b) replacing magic numbers with theme tokens and props. Animated by default;
a single entry point.

## Resolved decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Dependency posture | Animated **by default**, **single entry point**. `react-native-reanimated` and `react-native-safe-area-context` are **expected peer deps**. (A pure `/lite` subpath was considered and dropped for now.) |
| 2 | Composition | **Compound dot-notation** — `Screen.Header`, `Screen.ScrollView`, `Screen.FlatList` (terra-ui's first compound component). |
| 3 | Collapsing header | **Keep the Portal injection** — port `PortalProvider`/`PortalHost` so the header stays declared outside the scroll view yet renders its title inside it. |
| 4 | Safe area | `react-native-safe-area-context` as an **expected peer**; `Screen` + headers use it directly. |
| 5 | Tab / edges | **Explicit `edges` + `inTabView` props**, smart header-aware default, **no react-navigation**. |
| 6 | Background | **Solid only** — `bg?: ColorToken`, default `background`. No gradient. |
| 7 | Header scope | `Screen`, scroll containers, Portal, and a composite **`Header`** namespace: `Header.Title` (compact bar) + `Header.LargeTitle` (collapsing). **No** back/close buttons / icon dep (deferred). |
| 8 | Header naming | Renamed `NavigationHeader` → **`TitleHeader`** (no false react-navigation implication; the axis is compact/inline vs large). Grouped under a composite `Header` (`Header.Title` / `Header.LargeTitle`), echoing es-meditation's `Header.*` dot-notation and matching the compound `Screen`. |
| 9 | Layout values | Content padding from `layout.screen.margin.{x,y}`; collapse threshold / header height / bottom clearance as **props with defaults**. No magic numbers. |
| 10 | Conventions | `bg` (not `backgroundColor`), `forwardRef`, JSDoc, semicolons, `#`-aliases. **Export `useScreen()`**. |

## Why this is "better" than the port

- **No react-navigation coupling.** es-meditation's `useIsInTabView()` is
  replaced by explicit `edges` / `inTabView` props plus a dependency-free
  default (drop `top` when a header is present, else `['top', 'bottom']`).
- **No Expo/gradient coupling.** The `string | [string, string]` background is
  reduced to a theme-aware `bg` token. Gradients are the consumer's concern.
- **No magic numbers.** `110` (tab clearance), `60` (collapse threshold),
  `50` (bar height), `16` (bar padding), and the missing `theme.screen.insets`
  token all become tokens or props with sane defaults.
- **Library-consistent surface.** `bg`/`forwardRef`/`#`-aliases/JSDoc match
  `Box`, `Surface`, `Stack`, so `Screen` feels native to terra-ui.

## Module layout

```
packages/ui/src/components/
  portal/                 # ported: context-only, NOT reanimated-dependent
    PortalProvider.tsx
    PortalHost.tsx
    index.ts
  screen/
    Screen.tsx            # container: safe area, bg token, edge logic, context
    ScreenContext.tsx     # { scrollY, isInTabView } + useScreen()
    ScreenScrollView.tsx  # animated (reanimated scroll offset → scrollY)
    ScreenFlatList.tsx    # animated (reanimated scroll offset → scrollY)
    index.ts
  header/
    TitleHeader.tsx       # compact bar, Left/Right slots (was NavigationHeader)
    LargeTitleHeader.tsx  # collapsing large title via Portal + scrollY
    Header.ts             # composite namespace: Header.Title, Header.LargeTitle
    index.ts
```

## Public API sketch

```tsx
// Container
interface ScreenProps extends Omit<ViewProps, 'children'> {
  children: ReactNode;
  bg?: ColorToken;            // default 'background'
  edges?: Edge[];             // default: header-aware
  inTabView?: boolean;        // explicit; no react-navigation auto-detect
}

// Compact title bar (was NavigationHeader)
interface TitleHeaderProps {
  title?: string;
  LeftComponent?: ReactNode;
  RightComponent?: ReactNode;
  titleAlignment?: 'center' | 'left';   // default 'center'
  headerHeight?: number;                 // default: layout.header.height token (56)
}

// Collapsing large-title header
interface LargeTitleHeaderProps extends TitleHeaderProps {
  caption?: string;
  isLargeTitleHidden?: boolean;
  collapseThreshold?: number;            // default ~60
}

// Scroll containers add bottom clearance as a prop, not a hardcoded 110:
interface ScreenScrollViewProps extends ScrollViewProps {
  bottomInset?: number;                  // default e.g. layout-token-derived
}

// Compound Screen
Screen.Header     = ScreenHeader;
Screen.ScrollView = ScreenScrollView;
Screen.FlatList   = ScreenFlatList;

// Composite Header namespace (sub-components also exported standalone)
Header.Title      = TitleHeader;
Header.LargeTitle = LargeTitleHeader;

export { useScreen };  // { scrollY } for consumer-built scroll-reactive UI
export { TitleHeader, LargeTitleHeader };  // standalone, for direct/tree-shaken use
```

```tsx
<Screen>
  <Screen.Header>
    <Header.LargeTitle title="Meditate" />
  </Screen.Header>
  <Screen.ScrollView>
    {content}
  </Screen.ScrollView>
</Screen>
```

> **`Screen.Header` vs `Header` are different things** — and intentionally so
> (this is the es-meditation pattern). `Screen.Header` is the *marker slot* that
> tells `Screen` a header is present; `Header.Title` / `Header.LargeTitle` are
> the actual header *components* you place inside it.

### `Screen.Header` is a marker slot — no `asChild`

es-meditation's `Screen.Header` carried an `asChild` prop toggling between
rendering its child directly and wrapping it in a plain `<View>`. That wrapper
is unstyled and does nothing useful (the header components render their own
`SafeAreaView` + layout), which is why every es-meditation example passes
`asChild` — a prop that's on in 100% of real usage shouldn't be a prop.

In terra-ui, **`Screen.Header` always renders its child directly and takes no
`asChild`**. Its sole job is to be an explicit, synchronously-detectable marker
so `Screen` can compute safe-area edges at render time (omit `top` when a header
is present). The marker is preferred over detecting header presence by component
identity, because identity checks break for any custom/wrapped header (memo,
HOC, a consumer's own header) whereas the marker recognizes anything you tag.

> `asChild` remains a legitimate, idiomatic pattern elsewhere in terra-ui
> (`Box`, the `Slot` primitive) where the wrap-vs-merge choice is real. It just
> isn't meaningful for `Screen.Header`.

**Alternatives considered (rejected).**

- **Polymorphic `as` — `<Screen.Header as={Header.Title} title="…" />`.** Flattens
  nesting and the marker still resolves, but requires generic polymorphic-
  component + `forwardRef` typing (the hard problem terra-ui avoids by using
  `Slot`/`asChild`), introduces a *second* polymorphism mechanism alongside
  `asChild`, and gives fragile prop autocomplete when the generics don't resolve.
- **Header as a `Screen` prop — `<Screen header={<Header.LargeTitle … />}>`.**
  Flatter, removes the slot and the `Screen.Header`-vs-`Header` naming overlap,
  and makes edge detection trivial (prop presence, no `Children` scan). Rejected
  to keep the compound `Screen.Header` consistent with `Screen.ScrollView` /
  `Screen.FlatList` and to preserve consumer control over header placement.

## Build order

1. Port the **Portal** subsystem (context-only; verify no reanimated import).
2. **ScreenContext** + `useScreen()` (export publicly).
3. **Screen** container — `bg` token, header-aware edge logic, `inTabView`,
   safe-area via the peer.
4. **ScreenScrollView / ScreenFlatList** — animated (reanimated scroll offset →
   `scrollY`); content padding from `layout.screen.margin`, `bottomInset` prop.
5. **`TitleHeader`**, then **`LargeTitleHeader`** (Portal + `scrollY`,
   `collapseThreshold` / `headerHeight` props); attach both to the composite
   **`Header`** (`Header.Title` / `Header.LargeTitle`).
6. Add the example-expo screen and verify.

## Open follow-ups (deferred, out of scope)

- Back/close `HeaderButton`s and the icon-source decision.
- A pure, reanimated-free build (the dropped `/lite` subpath) — revisit only if
  a consumer needs `Screen` without reanimated.

## Implemented so far

- `layout.header.height` token added (`56`dp — aligns to the 4dp grid /
  `spacing.14`). Lives in `theme/types.ts` (`LayoutTokens.header.height`) and
  `theme/tokens/primitives.ts`. Headers default `headerHeight` to it; a
  per-instance prop still wins.
