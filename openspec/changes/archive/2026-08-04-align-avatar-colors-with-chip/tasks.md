## 1. Types

- [x] 1.1 In `packages/ui/src/components/avatar/types.ts`, rename `AvatarColor` values `'default'` → `'secondary'`, `'accent'` → `'primary'` (`'success' | 'warning' | 'danger'` unchanged).
- [x] 1.2 Rename `AvatarVariant` value `'default'` → `'solid'` (`'soft'` unchanged).
- [x] 1.3 Update the props' doc comments to reference the new default values (`color` defaults to `'secondary'`, `variant` defaults to `'solid'`).

## 2. Compound variants

- [x] 2.1 In `Avatar.tsx`, add a `variants: { color: { secondary, primary, success, warning, danger }, variant: { solid, soft } }` block to the `StyleSheet.create` factory (empty per-option objects, mirroring `Chip.tsx:215-227`).
- [x] 2.2 Add one `compoundVariants` entry per `(color, variant)` cell in the token table from `specs/avatar/spec.md`, setting `backgroundColor` and `color` to the listed tokens — including a distinct `secondary`/`solid` entry (`action.bg.neutral.hover` / `action.fg.neutral`) separate from `secondary`/`soft`.
- [x] 2.3 Remove `resolveAvatarColors` and its call site.
- [x] 2.4 In the `Avatar` component, call `styles.useVariants({ color, variant })` and read the resolved `bg`/`fg` from `styles.base.backgroundColor` / `styles.base.color` instead of the removed function's return value.
- [x] 2.5 Update `color`/`variant` default prop values in the `Avatar` function signature to `'secondary'` / `'solid'`.

## 3. Consumers

- [x] 3.1 Update `packages/ui/src/components/avatar/__tests__/Avatar.test.tsx` to use the renamed `color`/`variant` values, and add/adjust a case covering `color="secondary"` with `variant="solid"` vs `variant="soft"` resolving to different tokens.
- [x] 3.2 Update `apps/showcase-expo/src/screens/AvatarScreen.tsx` (`color="accent"` → `color="primary"`, `variant="default"` → `variant="solid"`, plus any color-picker list of options).

## 4. Verification

- [x] 4.1 Run `yarn typecheck` and `yarn lint`.
- [x] 4.2 Run `yarn test avatar` and confirm all `Avatar` tests pass.
- [x] 4.3 Run `yarn showcase ios` (or `android`/`web`) and visually confirm the Avatar screen renders all color/variant combinations correctly, in particular that `secondary`/`solid` now looks visually distinct from `secondary`/`soft`.

## 5. Bugfix found during visual verification (out of original scope, folded in)

- [x] 5.1 `Avatar.tsx` never passed a `radius` to the inner `Image`, so `Image`'s own default (`radius="md"`) always rendered rounded photo corners regardless of Avatar's `shape` — visibly wrong for `shape="square"`. Added `getImageRadius(shape)` mapping `circle`→`'full'`, `rounded`→`'md'`, `square`→`'none'`, and passed it as `<Image radius={...} .../>`.
- [x] 5.2 Re-run `yarn typecheck`, `yarn lint`, `yarn test avatar` after the fix.
