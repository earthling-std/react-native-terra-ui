# avatar Specification

## Purpose

The `avatar` capability defines how the `Avatar` component's `color` and `variant` props resolve to theme tokens for its fallback content (initials or placeholder icon), keeping that resolution consistent with the equivalent scheme used by `Chip`.

## Requirements

### Requirement: Avatar supports a color prop
The `Avatar` component SHALL accept a `color` prop of `'secondary' | 'primary' | 'success' | 'warning' | 'danger'` that selects the semantic color scheme used for its fallback background and foreground (initials text or placeholder icon). The default color SHALL be `'secondary'`. These scheme names and their resolved tokens SHALL match the equivalent `'secondary' | 'primary'` schemes accepted by `Chip`'s `color` prop.

#### Scenario: Default color
- **WHEN** an `Avatar` is rendered without a `color` prop
- **THEN** it renders its fallback content using the `'secondary'` color scheme

#### Scenario: Explicit color
- **WHEN** an `Avatar` is rendered with `color="primary"`, `color="success"`, `color="warning"`, or `color="danger"`
- **THEN** its fallback background and foreground colors resolve to the corresponding scheme's tokens

### Requirement: Avatar supports a variant prop
The `Avatar` component SHALL accept a `variant` prop of `'solid' | 'soft'` that controls the visual weight of its fallback background. The default variant SHALL be `'solid'`.

#### Scenario: Default variant
- **WHEN** an `Avatar` is rendered without a `variant` prop
- **THEN** it renders its fallback content using the `'solid'` visual weight

#### Scenario: Soft variant
- **WHEN** an `Avatar` is rendered with `variant="soft"`
- **THEN** it renders its fallback background using the tinted, lower-emphasis tokens for the resolved `color`

### Requirement: Color and variant resolve to a fixed token table
For each `(color, variant)` combination, the `Avatar` component SHALL resolve its fallback background and foreground (initials text / placeholder icon) colors to exactly the theme tokens below:

| `color` | `solid` bg / fg | `soft` bg / fg |
|---|---|---|
| `secondary` | `action.bg.secondary` / `action.fg.secondary` | `action.bg.secondary.subtle` / `action.fg.secondary.subtle` |
| `primary` | `action.bg.primary` / `action.fg.primary` | `action.bg.primary.subtle` / `action.fg.primary.subtle` |
| `success` | `status.bg.success` / `status.fg.success` | `status.bg.success.subtle` / `status.fg.success.subtle` |
| `warning` | `status.bg.warning` / `status.fg.warning` | `status.bg.warning.subtle` / `status.fg.warning.subtle` |
| `danger` | `status.bg.danger` / `status.fg.danger` | `status.bg.danger.subtle` / `status.fg.danger.subtle` |

This table SHALL hold for every `color`, including `secondary` — the resolved tokens SHALL differ between `solid` and `soft` for every color (no color may resolve to the same tokens regardless of `variant`).

#### Scenario: Token mapping holds per cell
- **WHEN** an `Avatar` is rendered with a given `color` and `variant`
- **THEN** its fallback background and foreground colors resolve to exactly the theme tokens listed for that `(color, variant)` cell above

#### Scenario: Secondary color respects variant
- **WHEN** an `Avatar` is rendered with `color="secondary"` (the default) and `variant="solid"` vs. `variant="soft"`
- **THEN** the two renders use different background and foreground tokens (`action.bg.secondary` / `action.fg.secondary` for `solid`, `action.bg.secondary.subtle` / `action.fg.secondary.subtle` for `soft`), not the same tokens regardless of `variant`
