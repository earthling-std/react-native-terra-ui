## Purpose

The `chip` capability provides a compact, themed label component for representing tags, filters, categories, or selected values, with consistent sizing, color, and visual-weight options across the design system.

## ADDED Requirements

### Requirement: Chip renders children as content
The system SHALL render a `Chip` component that displays its `children`. `Chip` SHALL NOT expose separate `label` or `icon` props; text and icon content are composed via `children`, consistent with the `Button`/`Button.Icon` convention. `children` SHALL accept arbitrary, dynamic React content — any mix or number of elements (custom components, multiple icons, conditionally rendered nodes, etc.), not only the single-icon-plus-text shape — with the following auto-wrapping rule applied per child: a `string` or `number` child SHALL render as the chip's themed label text; any other child (a React element, including but not limited to `Chip.Icon`) SHALL render exactly as given, unmodified.

#### Scenario: Renders plain text children
- **WHEN** a `Chip` is rendered with a string or number as `children` (e.g. `<Chip>Active</Chip>`)
- **THEN** that content is displayed using the chip's themed label text, colored with the chip's resolved foreground color

#### Scenario: Renders icon and text together
- **WHEN** a `Chip` is rendered with a `Chip.Icon` element followed by text as `children` (e.g. `<Chip><Chip.Icon name="check" />Active</Chip>`)
- **THEN** the icon is displayed before the text, both within the chip

#### Scenario: Renders arbitrary dynamic children
- **WHEN** a `Chip` is rendered with an arbitrary combination of children — e.g. multiple `Chip.Icon` elements, a custom React element that is neither text nor `Chip.Icon`, or a children tree computed at render time from dynamic/conditional state
- **THEN** every child is rendered, each non-text/non-number child passed through unmodified and each string/number child rendered as the chip's themed label text, with no restriction to a fixed "one icon plus text" shape

### Requirement: Chip exposes a Chip.Icon sub-component
The system SHALL expose `Chip.Icon`, a sub-component accepting the same icon-selection props as the standalone `Icon` component (at minimum a theme icon `name`), for use as a child of `Chip`. `Chip.Icon` SHALL default its color to the chip's resolved foreground color and its size to match the chip's resolved `size`, while allowing both to be overridden via props.

#### Scenario: Chip.Icon inherits chip foreground and size by default
- **WHEN** a `Chip.Icon` is rendered as a child of `Chip` without explicit `color` or `size` props
- **THEN** it renders colored with the chip's resolved foreground color and sized to match the chip's resolved `size`

#### Scenario: Chip.Icon overrides are respected
- **WHEN** a `Chip.Icon` is rendered with an explicit `color` or `size` prop
- **THEN** that explicit value is used instead of the chip's default

### Requirement: Chip supports a size prop
The `Chip` component SHALL accept a `size` prop of `'sm' | 'md' | 'lg'` that controls the chip's height, horizontal padding, and internal text/icon scale. The default size SHALL be `'md'`.

#### Scenario: Default size
- **WHEN** a `Chip` is rendered without a `size` prop
- **THEN** it renders at the `'md'` size

#### Scenario: Explicit size
- **WHEN** a `Chip` is rendered with `size="sm"` or `size="lg"`
- **THEN** it renders at the corresponding smaller or larger height, padding, and text/icon scale

### Requirement: Chip supports a variant prop
The `Chip` component SHALL accept a `variant` prop of `'solid' | 'soft' | 'outline' | 'ghost'` that controls the visual weight of its background and border. The default variant SHALL be `'soft'`.

- `solid`: filled background, no border.
- `soft`: tinted (translucent/light) background, no border.
- `outline`: transparent background, visible border.
- `ghost`: transparent background, no border, foreground fixed to `text.default` regardless of the resolved `color` (mirroring `Button`'s `ghost`/`outline` foreground convention). Intended to represent a de-emphasized or "not selected" state, e.g. an unselected filter chip rendered as plain text before selection applies its color.

#### Scenario: Default variant
- **WHEN** a `Chip` is rendered without a `variant` prop
- **THEN** it renders using the `'soft'` visual treatment

#### Scenario: Solid variant
- **WHEN** a `Chip` is rendered with `variant="solid"`
- **THEN** it renders with a filled background and no border

#### Scenario: Outline variant
- **WHEN** a `Chip` is rendered with `variant="outline"`
- **THEN** it renders with a transparent background and a visible border

#### Scenario: Ghost variant
- **WHEN** a `Chip` is rendered with `variant="ghost"`, for any `color`
- **THEN** it renders with a transparent background, no border, and its text/icon content colored with `text.default` (the `color` prop has no effect on the rendered colors)

### Requirement: Chip supports a color prop
The `Chip` component SHALL accept a `color` prop that is either a semantic scheme name (`'primary' | 'secondary' | 'success' | 'warning' | 'danger'`) or a custom color literal (a `#rrggbb` hex string, `rgb()`/`rgba()`, or `hsl()`/`hsla()` value). The default color SHALL be `'secondary'`.

For each semantic scheme name, the theme color token used for the background and foreground (text/icon) SHALL be exactly as follows, selected by the resolved `variant`. `outline` and `ghost` always render a transparent background; `outline` additionally shows a border in the listed token. `ghost` is deliberately excluded from this table: per the `variant` requirement above, `ghost` always uses `text.default` as its foreground regardless of `color`.

| `color` | `solid` bg / fg | `soft` bg / fg | `outline` border / fg |
|---|---|---|---|
| `primary` | `action.bg.primary` / `action.fg.primary` | `action.bg.subtle` / `action.fg.subtle` | `border.accent` / `text.accent` |
| `secondary` | `action.bg.neutral.hover` / `action.fg.neutral` | `surface.sunken` / `text.muted` | `border.default` / `text.default` |
| `success` | `status.bg.success` / `status.fg.success` | `status.bg.success.subtle` / `status.fg.success.subtle` | `status.border.success` / `status.fg.success.subtle` |
| `warning` | `status.bg.warning` / `status.fg.warning` | `status.bg.warning.subtle` / `status.fg.warning.subtle` | `status.border.warning` / `status.fg.warning.subtle` |
| `danger` | `status.bg.danger` / `status.fg.danger` | `status.bg.danger.subtle` / `status.fg.danger.subtle` | `status.border.danger` / `status.fg.danger.subtle` |

`secondary`'s `solid` mapping intentionally mirrors `Button`'s `neutral` variant (using the `.hover` token as the resting background, since `action.bg.neutral` itself is `transparent`).

When a custom color literal is given instead of a scheme name, the chip SHALL derive its background, border, and foreground colors from that single literal at the resolved `variant`'s visual weight for `solid`, `soft`, and `outline`: `solid` uses the literal as the background with a legible (black or white) computed foreground; `soft` uses a translucent tint of the literal as the background with the literal itself as the foreground; `outline` uses the literal directly as the border and foreground with a transparent background — following the same derivation approach Terra UI already uses elsewhere to turn one accent color into a full color scheme. `ghost` SHALL still use `text.default` even when `color` is a custom literal (the literal has no effect on `ghost`).

#### Scenario: Default color
- **WHEN** a `Chip` is rendered without a `color` prop
- **THEN** it renders using the `'secondary'` color scheme

#### Scenario: Semantic color token mapping
- **WHEN** a `Chip` is rendered with a given `color` and a `variant` of `solid`, `soft`, or `outline`, per the table above
- **THEN** its background, border, and foreground colors resolve to exactly the theme tokens listed for that combination

#### Scenario: Custom hex color
- **WHEN** a `Chip` is rendered with `color="#7c3aed"` (or another hex/`rgb()`/`hsl()` literal) and a `variant` of `solid`, `soft`, or `outline`
- **THEN** its background, border, and foreground colors are derived from that literal color at the resolved `variant`'s visual weight, and the foreground color remains legible against the resulting background

#### Scenario: Color has no effect on ghost
- **WHEN** a `Chip` is rendered with `variant="ghost"` and any `color` (a semantic scheme name or a custom literal)
- **THEN** its foreground is `text.default`, unaffected by the `color` prop
