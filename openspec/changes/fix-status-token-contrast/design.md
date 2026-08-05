## Context

See proposal.md - Why. The two failing pairs and their measured contrast (WCAG 2.1, relative luminance formula):

| Theme | Token | Current bg | fg | Contrast |
|---|---|---|---|---|
| light | `status.bg.success` (solid) | `green.600` `#00a63e` | white | 3.22:1 |
| dark | `status.bg.danger` (solid) | `red.500` `#fb2c36` | white | 3.81:1 |

Both tokens are hand-authored entries in `packages/ui/src/theme/tokens/light.ts` / `dark.ts`, referencing shades from the Tailwind-derived ramps in `packages/ui/src/theme/tokens/primitives.ts`. No color-math derivation is involved (see proposal.md - Impact); fixing contrast means picking a different ramp rung.

## Goals / Non-Goals

**Goals:**
- Bring both failing pairs to ≥4.5:1 with the smallest possible token-value change (no new ramp entries, no foreground changes, no token renames).
- Keep the fix inside the two affected `(theme, color)` cells; leave `warning` and every `soft` pairing untouched since they already pass.

**Non-Goals:**
- Not addressing the `primary` solid contrast failure (light theme, `emerald.600`/white = 3.65:1) — out of scope per proposal.md, tracked as a follow-up.
- Not addressing the `primary`/`success` hue-similarity noted during review (both greens, visually close in the swatch grid) — a design preference, not a contrast defect, and outside what was asked.
- Not introducing a contrast-checking utility/lint rule. The new `theme-status-tokens` spec documents the requirement; automated enforcement is future work if regressions recur.

## Decisions

**Light `success` solid: `green.600` → `green.700` (`#008236`), not `green.800`.**
`green.700` already clears the 4.5:1 bar (4.95:1) with a one-step move. `green.800` (7.13:1) was considered but rejected — it darkens the swatch more than needed for AA and would flatten `success` and `primary` even closer in perceived weight/lightness; `green.700` is the minimal fix.

**Dark `danger` solid: `red.500` → `red.600` (`#e7000b`), not `red.700`.**
`red.600` is the same value already used for `danger` solid in the *light* theme, so this isn't a new color choice — it reuses an existing, already-vetted token value and happens to land at 4.77:1 (AA pass). `red.700` (6.42:1) was considered as a more conservative margin but rejected: it's a value not used anywhere else in the palette for this role, and `red.600` already clears AA with a smaller visual shift from the current `red.500`.

**Scope: fix only the two failing cells, not all status tokens.**
`warning` (both themes) and every `soft` pairing were checked (see proposal.md) and already meet AA with a consistent light/dark ramp-symmetry pattern. Changing them would be unrequested churn with no contrast benefit.

## Risks / Trade-offs

- **Visual shift in existing screenshots/snapshots** → any visual regression test or screenshot fixture capturing `Avatar`/`Chip` with `color="success"` (light) or `color="danger"` (dark) `solid` will need its baseline updated. Mitigation: re-run/update snapshot tests as part of implementation (see tasks.md).
- **`green.700` narrows the visual gap between `success` and `warning` slightly less than a lighter shade would, but widens the gap from `primary`'s `emerald.600`** → net effect is a (minor, unrequested but not harmful) improvement in status-color distinctiveness, not a regression.
- **No automated contrast check exists yet** → a future token edit could reintroduce a similar failure undetected. Accepted for this change; the new `theme-status-tokens` spec at least makes the requirement explicit for reviewers.
