## Why

A visual review of the `Avatar`/`Chip` status color scheme (`success`, `warning`, `danger`, both `solid` and `soft` variants) turned up two WCAG AA contrast failures in the underlying theme tokens: the light-theme `success` solid pairing (white text on `green.600`) measures 3.22:1, and the dark-theme `danger` solid pairing (white text on `red.500`) measures 3.81:1 — both below the 4.5:1 minimum for normal text. Any component that renders text or icons on these solid backgrounds (initials in `Avatar`, labels in `Chip`) is affected in real usage, not just the swatch grid used to spot it.

## What Changes

- Raise the light-theme `success` solid background from `green.600` (`#00a63e`) to `green.700` (`#008236`), restoring foreground/background contrast to ≥4.5:1 with the existing white text.
- Raise the dark-theme `danger` solid background from `red.500` (`#fb2c36`) to `red.600` (`#e7000b`) — the same value already used for `danger` solid in the light theme — restoring contrast to ≥4.5:1 with the existing white text.
- No other status tokens change: `warning` (both themes) and the `soft` variant of `success`/`warning`/`danger` (both themes) were checked and already meet AA (6.36:1–11.70:1) with a consistent, symmetric ramp pattern (light soft = `x.100` bg / `x.800` fg, dark soft = `x.900` bg / `x.200` fg).

## Capabilities

### New Capabilities
- `theme-status-tokens`: defines the minimum WCAG AA contrast requirement for the `success`/`warning`/`danger` status color tokens' `solid` variant, in both light and dark themes, so future token edits can't silently regress below AA again.

### Modified Capabilities
(none — `avatar` and `chip` specs reference token *names* like `status.bg.success`, not their resolved hex values, so this change doesn't alter their documented behavior)

## Impact

- `packages/ui/src/theme/tokens/light.ts` — `status.bg.success` value change.
- `packages/ui/src/theme/tokens/dark.ts` — `status.bg.danger` value change.
- Consumers: `Avatar` (fallback initials/icon) and `Chip` (label/icon), `solid` variant, `color="success"` (light theme) and `color="danger"` (dark theme) — visual shade shift only, no API or token-name change.
- Out of scope, flagged for a follow-up change: the same AA failure exists on `primary` solid (light theme, `emerald.600`/white = 3.65:1). Not fixed here since the user's review request was scoped to `success`/`warning`/`danger`.
