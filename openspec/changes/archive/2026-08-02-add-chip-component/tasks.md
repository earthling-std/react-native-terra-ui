## 1. Component scaffold

- [x] 1.1 Create `packages/ui/src/components/chip/` following the standard component folder convention (component file, `types.ts`, `index.ts`, `utils.ts`, `__tests__/`)
- [x] 1.2 Define `ChipSize` (`'sm' | 'md' | 'lg'`) and `ChipVariant` (`'solid' | 'soft' | 'outline' | 'ghost'`) types in `types.ts`
- [x] 1.3 Define `ChipColor` as the semantic scheme names (`'primary' | 'secondary' | 'success' | 'warning' | 'danger'`) unioned with a custom color literal (reuse/extend the existing `ColorToken`-style literal detection) in `types.ts`
- [x] 1.4 Define `ChipProps` extending `ViewProps` with `size`, `variant`, `color`, and `children` (no `label`/`icon` props), defaulting `size='md'`, `variant='soft'`, `color='secondary'`

## 2. Implementation

- [x] 2.1 Add a `ChipContext` (mirroring `ButtonContext`) exposing the resolved foreground color and `size` to descendants
- [x] 2.2 Resolve `color`×`variant` combinations per the token table in `specs/chip/spec.md`:
  - Named schemes (`primary`/`secondary`/`success`/`warning`/`danger`) × `solid`/`soft`/`outline` are declared as unistyles `compoundVariants` directly on `styles.base` in `Chip.tsx` (one entry per token-table cell); a matching `variants: { color: {...}, variant: {...} }` registers the axis names for the type system.
  - `ghost` is a single compound variant with no `color` condition, so it matches — and ignores `color` — for every scheme, per the spec.
  - A custom color literal isn't a bounded set of options, so it can't be a compound variant condition: `getCustomColorColors` in `chip/utils.ts` derives background/border/foreground using the existing `shade`/`withAlpha`/`readableOn` helpers in `utils/color-utils.ts` (the same approach `utils/accent-utils.ts` uses to expand a single hue into a full scheme), applied as a style override on top of `styles.base` when `color` isn't a named scheme.
- [x] 2.3 Implement the `Chip` component using `StyleSheet.create` from `react-native-unistyles`, applying per-`size` height/padding/radius and the resolved background/border/foreground
- [x] 2.4 Implement a `ChipLabel` sub-component (mirroring `ButtonLabel`) that renders themed `Text` colored from `ChipContext`, and a `renderChildren` helper (mirroring `Button`'s) that maps over `children` via `Children.map`, auto-wrapping each string/number child in `ChipLabel` and passing every other child (e.g. `Chip.Icon`, any custom element, any number of children) through untouched — no assumption of a fixed "one icon plus text" shape
- [x] 2.5 Implement `Chip.Icon` (mirroring `Button.Icon`): renders the existing `Icon` component, defaulting `color` to `ChipContext`'s foreground and `size` to a per-`ChipSize` icon scale, both overridable via props
- [x] 2.6 Attach `Chip.Icon` to the exported `Chip` component (mirroring how `Button.Icon`/`Button.Label` are attached to `Button`)
- [x] 2.7 Export `Chip`, `ChipProps`, `ChipSize`, `ChipVariant`, `ChipColor` from `chip/index.ts`
- [x] 2.8 Add `export * from './chip';` to `packages/ui/src/components/index.ts` (alphabetical order)

## 3. Tests

- [x] 3.1 Write `__tests__/Chip.test.tsx` covering: renders plain text/number `children`, renders `Chip.Icon` + text together, renders arbitrary/dynamic children (multiple `Chip.Icon`s, a custom non-icon element, a children tree built from conditional/dynamic state) with each non-text child passed through untouched, default size/variant/color, each `size` value, each `variant` value, each `color`×`variant` combination (`solid`/`soft`/`outline`) resolving to the exact tokens in the spec's table (`primary`, `secondary`, `success`, `warning`, `danger`), a custom hex `color` value (background/border/foreground derived and foreground legible) across `solid`/`soft`/`outline`, `variant="ghost"` rendering transparent background/border with `text.default` foreground for every `color` value (including a custom hex `color`, confirming it has no effect on `ghost`), `Chip.Icon` inheriting foreground/size by default, and `Chip.Icon` prop overrides

## 4. Showcase

- [x] 4.1 Add `apps/showcase-expo/src/screens/ChipScreen.tsx` demonstrating all `size`, `variant` (including `ghost`), and semantic `color` combinations, at least one custom hex `color` example, and both text-only and `Chip.Icon` + text usage
- [x] 4.2 Add route `apps/showcase-expo/src/app/chip.tsx` exporting `ChipScreen`
- [x] 4.3 Add a `{ href: '/chip', label: 'Chip' }` entry to `GalleryScreen.tsx`

## 5. Verification

- [x] 5.1 Run `yarn typecheck` and fix any type errors
- [x] 5.2 Run `yarn lint` and fix any lint/format issues
- [x] 5.3 Run `yarn test chip` and confirm all tests pass
