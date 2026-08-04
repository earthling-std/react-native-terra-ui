## Context

`Avatar.tsx` currently resolves fallback colors via a plain function, `resolveAvatarColors(color, variant, theme)`, called at render time from `useUnistyles()`'s `theme`, and applies the result as an inline `backgroundColor`/`color` style. `Chip.tsx` resolves the equivalent `(color, variant)` pairing declaratively via unistyles `compoundVariants` on its `StyleSheet.create` block, with `variants: { color: {...}, variant: {...} }` registering the axis names/options and `compoundVariants` supplying the actual token values per cell (see `specs/chip/spec.md` and `Chip.tsx:181-394`). See `proposal.md` for why the two should align.

## Goals / Non-Goals

**Goals:**
- Avatar's `(color, variant)` → token resolution is expressed as unistyles `compoundVariants`, not a hand-written switch.
- `AvatarColor`/`AvatarVariant` prop values match `ChipColor`/`ChipVariant` vocabulary where the concept overlaps (`primary`/`secondary`, `solid`/`soft`).
- The `secondary` + `solid` bug (currently identical to `secondary` + `soft`) is fixed as part of the same change, since fixing it requires touching the same code.

**Non-Goals:**
- Avatar does not gain `outline`/`ghost` variants or a custom-color-literal `color` (the string-literal escape hatch `Chip` has via `getCustomColorColors`). Avatar's fallback is always a filled shape; those variants don't apply.
- `size` and `shape` stay as runtime-computed JS (`SIZE_PX`, `getBorderRadius`), not unistyles variants — `shape="circle"` needs `sizePx / 2` computed from the numeric pixel size, which isn't expressible as a static per-variant style the way color tokens are.
- No backward-compatible aliasing of the old `'default'`/`'accent'` values. This is a straight rename; per project convention, no compatibility shims for renames.

## Decisions

**Move `(color, variant)` → token resolution into `compoundVariants`, mirroring `Chip`.**
`Avatar`'s `StyleSheet.create` factory gains `variants: { color: { secondary, primary, success, warning, danger }, variant: { solid, soft } }` (registering axis names for the type system, all-empty like `Chip.tsx:215-227`) plus one `compoundVariants` entry per `(color, variant)` cell supplying `backgroundColor`/`color`, following the token table in `specs/avatar/spec.md`. `Avatar.tsx` calls `styles.useVariants({ color, variant })` and reads `styles.base.backgroundColor` / `styles.base.color` the way `Chip.tsx:140-147` reads `styles.base.color`. This removes `resolveAvatarColors` entirely.
- Alternative considered: keep the manual switch but just fix the `secondary`/`solid` bug and rename the prop values. Rejected — the user explicitly asked for the `Chip`-style declarative approach, and a second hand-rolled switch is exactly the drift this change is meant to close.

**Rename prop values, not add new ones.**
`'default'` → `'secondary'`, `'accent'` → `'primary'`, variant `'default'` → `'solid'`, as a direct rename in `types.ts` with matching updates to defaults in `Avatar.tsx`, `Avatar.test.tsx`, and `AvatarScreen.tsx`.
- Alternative considered: add `'primary'`/`'secondary'`/`'solid'` as new accepted values while keeping `'default'`/`'accent'` working (soft-deprecate). Rejected per `proposal.md`'s explicit **BREAKING** framing and the project's no-compat-shim convention — Terra UI has no external consumers yet to protect, so there's no reason to carry dead aliases.

## Risks / Trade-offs

- **[Risk]** Renaming is a breaking API change for any code already using `Avatar`'s old `color`/`variant` values. → **Mitigation**: `tasks.md` includes updating every in-repo consumer (`AvatarScreen.tsx`, tests); `proposal.md` marks the change **BREAKING** so it surfaces in the commit/changelog.
- **[Risk]** The `secondary`/`solid` fix changes Avatar's rendered background for any existing usage of `color="default"` (now `"secondary"`) + the (previously ignored) solid variant. → **Mitigation**: this is the intended, spec'd behavior per `specs/avatar/spec.md`; the only prior behavior being replaced is the bug where `variant` had no effect for that color.
