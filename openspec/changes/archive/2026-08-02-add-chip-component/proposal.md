## Why

Terra UI has no compact component for representing a single filterable, selectable, or informational tag (e.g. category labels, filter pills, selected-option summaries). Consumers currently have to hand-roll this with `Box`/`Text`/`Icon`, leading to inconsistent padding, radius, and color usage across apps. A themed `Chip` component closes this gap and follows the same size/variant/color conventions already established by `Button` and `Avatar`.

## What Changes

- Add a new `Chip` component to `packages/ui/src/components/chip/`.
- Support a `size` prop (`sm` | `md` | `lg`) controlling height, padding, and text/icon scale.
- Support a `variant` prop (`solid` | `soft` | `outline` | `ghost`) controlling the visual weight of the background/border, mirroring `Avatar`'s `variant` and `Button`'s `outline` treatment. `ghost` (transparent background, colored text only) represents a de-emphasized/"not selected" state.
- Support a `color` prop accepting either a semantic scheme name (`primary` | `secondary` | `success` | `warning` | `danger`) or a custom color literal (hex/`rgb()`/`hsl()`). Each scheme name maps to specific existing theme tokens per `variant` (see `specs/chip/spec.md` for the exact token table); a custom literal derives background/border/foreground the same way Terra UI already derives a full color scheme from a single accent hue.
- Compose content via `children` rather than `label`/`icon` props, mirroring `Button`'s convention: plain text/number children render through a themed label, and an exported `Chip.Icon` sub-component (mirroring `Button.Icon`) renders a leading icon that inherits the chip's resolved foreground color and size.
- Add a showcase screen and route so the component is explorable in the gallery app.

## Capabilities

### New Capabilities
- `chip`: A themed, compact label component with `size`, `variant`, and `color` props, optional leading icon, and text content, following Terra UI's component folder and theming conventions.

### Modified Capabilities
(none — this change only adds a new component; no existing capability's requirements change)

## Impact

- **New code**: `packages/ui/src/components/chip/` (component, types, tests) and its barrel export added to `packages/ui/src/components/index.ts`.
- **Showcase app**: new screen at `apps/showcase-expo/src/screens/ChipScreen.tsx`, route at `apps/showcase-expo/src/app/chip.tsx`, and a link from `GalleryScreen.tsx`.
- **No breaking changes**: purely additive; no existing public APIs change.
