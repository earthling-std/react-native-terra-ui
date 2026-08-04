## Why

`Avatar`'s fallback color system (`color`/`variant` props) resolves to the exact same design tokens as `Chip`'s `primary`/`secondary` color scheme, but under different prop names (`'default'`/`'accent'` instead of `'secondary'`/`'primary'`, `'default'` instead of `'solid'`) and via a hand-rolled `resolveAvatarColors` switch statement instead of unistyles `compoundVariants` (the pattern `Chip` already establishes). This divergence makes the three themed components (`Button`, `Chip`, `Avatar`) harder to reason about together, and hides a latent bug: `resolveAvatarColors` ignores `variant` entirely for the `'default'` color, so `Avatar` never renders the `solid`-weight neutral tokens (`action.bg.neutral.hover` / `action.fg.neutral`) that `Chip`'s `secondary`/`solid` cell uses.

## What Changes

- **BREAKING**: Rename `AvatarColor` values `'default'` → `'secondary'` and `'accent'` → `'primary'`, matching `ChipColor`'s scheme names. `'success' | 'warning' | 'danger'` are unchanged.
- **BREAKING**: Rename `AvatarVariant` value `'default'` → `'solid'`, matching `ChipVariant`'s vocabulary. `'soft'` is unchanged. (Avatar keeps only `solid`/`soft` — `outline`/`ghost` don't apply to a filled fallback shape.)
- Fix the `secondary` + `solid` combination to resolve to `action.bg.neutral.hover` / `action.fg.neutral` (matching `Chip`'s `secondary`/`solid` cell) instead of incorrectly falling back to the `soft`-weight tokens regardless of `variant`.
- Replace `resolveAvatarColors`'s manual switch statement with unistyles `compoundVariants` on `Avatar`'s `StyleSheet.create` block, one entry per `(color, variant)` cell, following the declarative pattern in `Chip.tsx`.
- Update default prop values: `color` defaults to `'secondary'` (was `'default'`), `variant` defaults to `'solid'` (was `'default'`) — same resolved appearance, renamed to match the new vocabulary.

## Capabilities

### New Capabilities
- `avatar`: Behavioral spec for the `Avatar` component's color/variant token resolution (no `avatar` spec exists yet in `openspec/specs/`).

### Modified Capabilities
(none — no existing `avatar` spec to modify)

## Impact

- `packages/ui/src/components/avatar/types.ts` — `AvatarColor`, `AvatarVariant` value renames.
- `packages/ui/src/components/avatar/Avatar.tsx` — replace `resolveAvatarColors` with unistyles `compoundVariants`; update default prop values.
- `packages/ui/src/components/avatar/__tests__/Avatar.test.tsx` — update to new prop values.
- Any consumer passing `color="default"` / `color="accent"` / `variant="default"` to `Avatar` (showcase screens, app code) must migrate to the new names.
- `apps/showcase-expo` — update the Avatar showcase screen's color/variant controls to the renamed values.
