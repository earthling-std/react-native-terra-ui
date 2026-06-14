# react-native-terra-ui — Plan

A reusable React Native UI component library built on **react-native-unistyles v3**, intended to be shared across multiple projects. Inspired by `es-meditation/packages/ui`, but deliberately improved: a leaner, brand-flexible theming layer and a stricter primitives/composites boundary.

Status: **planning complete, pre-implementation.** Scaffold (create-react-native-library + bob + Biome + Expo example) is already in place.

---

## 1. Principles

- **Reusable first.** The library is unopinionated and app-agnostic. Anything app-specific stays in the app.
- **Native now, web-safe later.** Target iOS/Android; keep the API free of DOM assumptions so web (`react-native-web`) can be enabled later without rewrites. No `react-native-web` peer yet. `hover`/`active` tokens are defined but unused for now.
- **Theme over hardcode.** Colors, typography, spacing, radius all live in the theme — components read semantic tokens, never literals.
- **Small surface, strong defaults.** Few, well-tested primitives beat a large half-finished catalog.

---

## 2. Scope

**In scope:** theming engine + generic primitives + broadly-useful composites.

**Out of scope (lives in each app, or a future `@terra/app-kit`):** app-specific composites such as Screen, Header, Markdown, CircularProgress, and hooks like `useIsInTabView`.

---

## 3. Theming model

The single most important design decision and the main upgrade over `packages/ui` (which hardcodes one `light` + one `dark`).

### 3.1 One engine: named overrides deep-merged onto a base

- The library ships a **`base` theme** that defines the full **token shape** and sensible default values, for both `light` and `dark`.
- A consuming project may pass **per-project base overrides** at config time (deep-merged onto `base`) so different apps can look different.
- **Accents** are **named partial-theme overrides**, switchable at **runtime**. An accent may be:
  - a **shorthand** — just a hue, which expands to a fuller patch so primary *and* secondary actions recolor consistently: `action.primary` (solid hue + derived hover/active + legible `fg`), `action.secondary` (soft translucent tint of the hue), and `content.accent`/`link`/`onAccent`. Hover/active darken on light, lighten on dark. — or
  - a **full partial override** — change any tokens (primary bg/fg/hover, text accent/link, tinted surfaces, etc.).
- "Accent" and "brand" are the **same mechanism** (a named deep-partial override on top of `base`). We use the term **accent** and do not introduce a separate "brand" concept. (The token shape stays brand-ready, so font/shape-level variants can be added later with no rework.)

### 3.2 Two runtime axes

- **scheme** — `light` / `dark`, system-adaptive by default (Unistyles `adaptiveThemes`).
- **accent** — the user-pickable override, applied on top of the active scheme.

### 3.3 Config & usage

```ts
// app entry — runs ONCE, before any component renders
configureTerraUI({
  // optional: per-project base overrides (set once)
  theme: { /* DeepPartial<TerraTheme> */ },

  // runtime-switchable named overrides
  accents: {
    emerald: { light: '#009966', dark: '#00bc7d' },          // shorthand
    sunset: {                                                 // full partial override
      light: {
        color: {
          action:  { primary: { bg: '#ea580c', hover: '#c2410c', fg: '#ffffff' } },
          content: { accent: '#ea580c', link: '#ea580c' },
          background: '#fff7ed',
        },
      },
      dark: { color: { action: { primary: { bg: '#fb923c' } } } },
    },
  },
  defaultAccent: 'emerald',
})
```

```tsx
const { accent, setAccent, scheme, setScheme } = useTheme()
setAccent('sunset')  // deep-merges the patch onto the active theme at runtime
setScheme('dark')
```

### 3.4 Runtime switching & persistence

- **Library owns switching**: `TerraUIProvider` + `useTheme()` exposing `accent`/`setAccent`, `scheme`/`setScheme`, `setRadius`.
- **App owns persistence**: the app supplies the initial accent/scheme and persists the user's choice. **No storage dependency** baked into the library.
- **Implementation**: keep just two registered Unistyles themes (`light`, `dark`); on accent change, apply the partial override via Unistyles `updateTheme` rather than pre-registering a `scheme × accent` product of themes.

---

## 4. Token system

**Two tiers, refined** (primitive → semantic). Components read semantic tokens directly. No component-token tier.

### 4.1 Primitive tier (not on the theme)

Build-time constants, exported standalone and consumed by the semantic tier:

- `palette` — raw color ramps (Tailwind-derived), e.g. `palette.emerald[600]`. (Renamed from es/ui's `color` to avoid clashing with the semantic `color` group.)
- `spacing` — numeric dp scale.
- `radius` — numeric dp scale.

### 4.2 Semantic tier (what components use) — naming revised vs es/ui

Rationale for the renames is in the table below.

| es/ui (old) | Terra (new) | Why |
|-------------|-------------|-----|
| `surface: canvas/low/base/high/highest` | `background` + `surface: base/raised/sunken/overlay` | Old names had duplicates and unclear elevation semantics. Split the app canvas out; use a clear elevation ladder. |
| `text: neutral/secondary/muted/inverse/link/accent` | `content: primary/secondary/tertiary/disabled/inverse/link/accent/onAccent` | "neutral" was misleading for main text; group renamed `content` since icons share these colors; added `disabled` + `onAccent`. |
| `intent: primary/secondary/tertiary` + `danger/warning/success` | `action: primary/secondary/neutral` **and** `status: success/warning/danger/info` | One group conflated *emphasis* with *feedback*. Split them; add `info`. |
| `border: default/separator/focus` | `border: default/subtle/strong/focus` | `separator` folded into a clearer `subtle`/`strong`/`default` set; keep `focus`. |
| `field: bg/text/placeholder/border` | *(removed)* | Component-level token leaking into semantics. Inputs derive from `surface`/`border`/`content`/`border.focus`. |
| *(none)* | `elevation`, `opacity` | New: shadow presets and state-layer opacities (disabled/pressed). |
| `screen.insets.{x,y}` | `layout.screen.margin.{x,y}` | Margin between content and the screen edge (applied as container padding). Renamed off "insets" to avoid colliding with safe-area insets. Default `x: 16`, `y: 0`; consumed by the future `Screen` component. |

`action`/`status` entries pair fills with their on-colors so contrast is guaranteed:

- `action.*` = `{ bg, fg, hover, active, disabled }` (interactive emphasis)
- `status.*` = `{ solid, onSolid, surface, onSurface, border }` (feedback; soft + solid)

### 4.3 Themeable typography

A `typography` token group lives in the theme; `Text` reads its `variant` from `theme.typography.variants`. Projects can restyle type per accent/override; **apps load the actual fonts** (documented), degrading to the system font if missing.

**Role-based scale** (Material-3-style roles, mobile-tuned). Base body is **16pt** for readability (one step above M3's canonical 14, which suits mobile reading); smallest text is 11–12pt. Each role has Large/Medium/Small plus a non-bold `caption`.

Default scale (size / lineHeight in dp, weight token, tracking = letterSpacing in dp, maxScale = Dynamic Type cap):

| variant | size | line | weight | tracking | maxScale |
|---|---|---|---|---|---|
| display-lg | 57 | 64 | regular | -0.25 | 1.2 |
| display-md | 45 | 52 | regular | 0 | 1.2 |
| display-sm | 36 | 44 | regular | 0 | 1.2 |
| headline-lg | 32 | 40 | semibold | 0 | 1.3 |
| headline-md | 28 | 36 | semibold | 0 | 1.3 |
| headline-sm | 24 | 32 | semibold | 0 | 1.3 |
| title-lg | 20 | 28 | semibold | 0 | 1.4 |
| title-md | 18 | 26 | semibold | 0 | 1.4 |
| title-sm | 16 | 24 | semibold | 0.1 | 1.4 |
| body-lg | 18 | 28 | regular | 0 | 1.8 |
| body-md | 16 | 24 | regular | 0.15 | 1.8 |
| body-sm | 14 | 20 | regular | 0.25 | 1.8 |
| label-lg | 16 | 24 | medium | 0.1 | 1.5 |
| label-md | 14 | 20 | medium | 0.5 | 1.5 |
| label-sm | 12 | 16 | medium | 0.5 | 1.5 |
| caption | 12 | 16 | regular | 0.4 | 1.4 |

**Mobile typography practices baked in:**

- **Dynamic Type / font scaling.** `Text` keeps `allowFontScaling` **on** (accessibility) but applies a per-variant `maxFontSizeMultiplier` so large OS text sizes don't shatter layouts — display caps tight (~1.2), body generous (~1.8).
- **Tracking.** Negative on large display, slightly positive on small body/label — the standard legibility curve.
- **Weight → font-family map.** `typography.fonts` maps each weight token to a family name. With the **system font**, `Text` applies the numeric `fontWeight`. With a **custom font**, the family itself encodes the weight (e.g. `Inter-SemiBold`) and `Text` does *not* set a numeric weight — this avoids the well-known RN/Android faux-bold/synthesis problem.
- **Platform default.** `fonts` defaults to the system font (`San Francisco` on iOS, `Roboto` on Android) via RN's `System` family; brands override by pointing the tokens at loaded custom fonts.
- **Per-instance override** still available via the `Text` `weight` prop and `style`.

### 4.4 Theme type (TypeScript)

This is the authoritative shape. `light` and `dark` are both `TerraTheme`; accents and per-project overrides are `DeepPartial<TerraTheme>`.

```ts
// ── Primitive scale key unions (from the primitive tier) ──
type SpacingKey = 0 | 0.5 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 // …
type RadiusKey  = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'

// ── Reusable role shapes ──
interface InteractiveRole {
  bg: string        // fill
  fg: string        // text/icon on top of `bg`
  hover: string
  active: string
  disabled: string
}

interface StatusRole {
  solid: string     // strong fill (solid badge/button)
  onSolid: string   // text/icon on `solid`
  surface: string   // soft tinted background (alerts/banners)
  onSurface: string // text/icon on `surface`
  border: string
}

// ── Platform-aware shadow preset ──
interface ElevationStyle {
  shadowColor: string
  shadowOpacity: number
  shadowRadius: number
  shadowOffset: { width: number; height: number }
  elevation: number // Android
}

// ── Semantic color group ──
interface ThemeColor {
  background: string
  surface: {
    base: string
    raised: string
    sunken: string
    overlay: string // scrim behind modals/sheets
  }
  content: {
    primary: string
    secondary: string
    tertiary: string
    disabled: string
    inverse: string  // on dark/colored surfaces
    link: string
    accent: string
    onAccent: string // text/icon on the accent fill
  }
  border: {
    default: string
    subtle: string
    strong: string
    focus: string
  }
  action: {
    primary: InteractiveRole
    secondary: InteractiveRole
    neutral: InteractiveRole
  }
  status: {
    success: StatusRole
    warning: StatusRole
    danger: StatusRole
    info: StatusRole
  }
}

// ── Typography ──
type TextVariant =
  | 'display-lg' | 'display-md' | 'display-sm'
  | 'headline-lg' | 'headline-md' | 'headline-sm'
  | 'title-lg' | 'title-md' | 'title-sm'
  | 'body-lg' | 'body-md' | 'body-sm'
  | 'label-lg' | 'label-md' | 'label-sm'
  | 'caption'

type FontWeightToken = 'regular' | 'medium' | 'semibold' | 'bold' // → 400 | 500 | 600 | 700

interface TypeStyle {
  fontSize: number
  lineHeight: number
  fontWeight: FontWeightToken
  letterSpacing: number        // tracking, dp
  maxFontSizeMultiplier: number // cap OS Dynamic Type scaling to protect layout
}

interface Typography {
  /**
   * Weight token → font-family name. Defaults to the system font.
   * Android can't synthesize weights for custom fonts, so each weight maps to
   * its own family (e.g. { regular: 'Inter-Regular', semibold: 'Inter-SemiBold' }).
   * When a token resolves to the system font, `Text` applies the numeric weight;
   * for a custom family it does not (the family encodes the weight).
   */
  fonts: Record<FontWeightToken, string>
  variants: Record<TextVariant, TypeStyle>
}

// ── The full theme ──
interface TerraTheme {
  color: ThemeColor
  spacing: Record<SpacingKey, number>
  radius: Record<RadiusKey, number>
  typography: Typography
  elevation: Record<'none' | 'sm' | 'md' | 'lg' | 'xl', ElevationStyle>
  opacity: { disabled: number; pressed: number }
  layout: {
    /** Margin between content and the screen edge (applied as container padding). */
    screen: { margin: { x: number; y: number } }
  }
}

// ── Config-facing types ──
type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T

// An accent is either a hue shorthand (per scheme) or a full partial override (per scheme)
type Accent =
  | { light: string; dark: string }
  | { light?: DeepPartial<TerraTheme>; dark?: DeepPartial<TerraTheme> }

interface TerraConfig {
  /** Per-project base override, deep-merged onto the shipped base (set once). */
  theme?: { light?: DeepPartial<TerraTheme>; dark?: DeepPartial<TerraTheme> }
  /** Runtime-switchable named overrides. */
  accents?: Record<string, Accent>
  defaultAccent?: string
  /** Follow system light/dark. Default true. */
  adaptiveThemes?: boolean
  initialScheme?: 'light' | 'dark'
  /** Override radius scale values (sm/md/lg/…); affects Button + surfaces. */
  radius?: Partial<Record<RadiusKey, number>>
}

interface UseThemeResult {
  theme: TerraTheme
  scheme: 'light' | 'dark'
  setScheme: (scheme: 'light' | 'dark') => void
  accent: string
  setAccent: (name: string) => void
}
```

---

## 5. Component API conventions

- **Customization**: typed **variant props** (`variant`/`size`/`radius`…) + `style` passthrough + **`asChild`/Slot** composition.
- **Token style-props** (`p`, `px`, `gap`, `bg`, `radius`…) are confined to the **layout primitives** (`Box`/`Stack`) — not every component. (No Tamagui/Stitches-style style-props on everything.)
- **Authoring**: every component is built through **one shared "recipe" helper** (a thin wrapper over Unistyles variants) so variants/defaults are declared uniformly.
- **Accessibility**: every interactive component ships correct a11y from day one (`accessibilityRole`, `accessibilityState` for disabled/busy, focus order).

### 5.1 Layout primitives (`Box` / `Stack`) and `asChild`

**`Box`** — the base layout primitive: a `View` whose layout, spacing, and visuals are set through theme-token props. It is the **only** component family that exposes token style-props. **`Stack`** — a `Box` preset that lays children out along a direction with a `gap`; **`HStack`/`VStack`** are direction shorthands.

**Props** (all optional; all `ViewProps` also pass through):

```ts
type Align   = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
type BorderWidth = number | 'hairline'

interface BoxProps extends ViewProps {
  // Spacing — values are SpacingKey, resolved via theme.spacing
  p?: SpacingKey; px?: SpacingKey; py?: SpacingKey
  pt?: SpacingKey; pr?: SpacingKey; pb?: SpacingKey; pl?: SpacingKey
  m?: SpacingKey; mx?: SpacingKey; my?: SpacingKey
  mt?: SpacingKey; mr?: SpacingKey; mb?: SpacingKey; ml?: SpacingKey
  gap?: SpacingKey

  // Layout
  direction?: 'row' | 'column'   // default 'column'
  align?: Align
  justify?: Justify
  wrap?: boolean
  flex?: number
  alignSelf?: Align

  // Visual
  bg?: SurfaceColorToken | ColorToken
  radius?: RadiusKey
  borderWidth?: BorderWidth      // 'hairline' → StyleSheet.hairlineWidth
  borderColor?: BorderColorToken | ColorToken

  // Composition
  asChild?: boolean
  style?: StyleProp<ViewStyle>   // escape hatch (merged last)
  children?: ReactNode
}

interface StackProps extends Omit<BoxProps, 'direction'> {
  direction?: 'row' | 'column'   // Stack defaults gap-aware spacing
}
// HStack = <Stack direction="row">, VStack = <Stack direction="column">
```

**Token resolution.** Friendly `align`/`justify` values map to flexbox (`start`→`flex-start`, `between`→`space-between`, …); spacing/radius keys map to numbers via the theme; color tokens resolve through the theme (`surface.raised`, `border.default`). Raw values still pass through (e.g. a hex string in `bg`, a number in `borderWidth`).

**`asChild` semantics (Radix-style Slot).** When `asChild` is set, `Box` renders **no `View`** — it merges its computed props onto its single child via `Slot`:

- requires exactly one valid element child (logs a dev error otherwise),
- `style` merged as `[boxStyle, child.style]` — child wins on conflicts,
- `on*` handlers composed — child's runs first, then Box's,
- refs composed — both Box's and the child's ref receive the node,
- other Box props spread first; child props override.

```tsx
// Plain Box: padded, raised card with gap between children
<Box p={4} gap={2} bg="surface.raised" radius="lg">
  <Text variant="title-md">Card</Text>
  <Text variant="body-md" color="content.secondary">Subtitle</Text>
</Box>

// Row with centered items
<HStack gap={2} align="center">
  <Avatar />
  <Text>Jane</Text>
</HStack>

// asChild — give a Pressable the Box's padding/bg/radius; one node, native press
<Box asChild p={3} radius="md" bg="surface.raised">
  <Pressable onPress={open}>
    <Text>Open</Text>
  </Pressable>
</Box>

// asChild works with any element (Animated.View, expo-router <Link>, …)
<Box asChild flex={1}>
  <Animated.View style={animatedStyle} />
</Box>
```

**Decision — `asChild` over a polymorphic `as` prop.** We use `asChild`, **not** `<Box as={Pressable} pt={2} />`:

- the child stays **natively typed** (write `<Pressable onPress/>` directly; exact props + ref, no generics);
- polymorphic `as` needs fragile polymorphic-component generics (prop unions, ref typing) that break down across RN targets with very different prop shapes and emit unreadable type errors;
- Slot composition (style/handler/ref merging) is explicit and well-defined, and a `Slot` already exists in es/ui;
- trade-off accepted: more verbose (wrapper + child) and single-child only.

The library also exports the `Slot` primitive plus `mergeProps`/`composeRefs` so other components (and consumers) can implement `asChild` consistently.

---

## 6. v1 scope (first milestone)

Foundation only — tight and well-tested:

1. **Theme engine** — base theme, token shape, deep-merge, accent overrides, `configureTerraUI`, `TerraUIProvider`, `useTheme`.
2. **Layout primitives** — `Box` / `Stack` (token style-props, align/justify/gap, `asChild`).
3. **Text** — variants driven by themeable typography, semantic color tokens.
4. **Button** — variants/size/radius, loading/disabled, a11y, compound `Button.Icon` / `Button.Label` (icon slot accepts any node; no icon-set dependency yet).

The scaffold's placeholder `multiply.tsx` is removed during this milestone.

---

## 7. Roadmap (post-v1)

- **v2 — more primitives**: Icon (icon-set strategy TBD), Surface, Divider, Spinner.
- **v3 — common composites**: Card, Badge, Avatar, ListItem.
- **v4 — inputs**: TextField, Switch, Checkbox (focus + a11y heavy).
- **v5 — overlays**: Modal, Sheet (portals, gestures).
- **Later**: web enablement (`react-native-web`), Storybook, font/shape-level brand variants if needed.

---

## 8. Distribution & versioning

- **Publish** `react-native-terra-ui` to a registry, built with **react-native-builder-bob** (ESM module + TypeScript declaration targets — already configured).
- **Versioning via Changesets** (semver + changelog). Each consuming project pins a version and upgrades deliberately.
- Registry choice (public npm vs private GitHub Packages) to be confirmed at first publish.

---

## 9. Quality

- **Tests**: Jest + React Native Testing Library.
  - Theme engine tested hardest: deep-merge, accent resolution, token lookup, `configure`-before-`create` ordering.
  - Components: behavior + a11y props.
- **Accessibility**: required from day one (see §5).
- **CI gates** (already wired via `yarn lint`/`typecheck`/`prepare`): **Biome** (lint + format), **tsc**, **bob build**.
- **Deferred**: visual-regression / snapshot testing (revisit with web + larger catalog).

---

## 10. Preview / development harness

- The existing **Expo example app** becomes a **component gallery**.
- It includes a **accent + light/dark switcher**, which doubles as the live test surface for the theming engine.
- Storybook / standalone docs site deferred.

---

## 11. Key implementation notes & risks

- **Configure-before-create ordering**: Unistyles requires `StyleSheet.configure` to run before any `StyleSheet.create`. So `configureTerraUI` must run at app entry, before components are imported/rendered. Provide a side-effect-free config entry (e.g. `react-native-terra-ui/theme`) the app imports first; `TerraUIProvider` configures the default if the app hasn't, guarded so it only configures once.
- **Runtime accent via `updateTheme`**: verify Unistyles `updateTheme` re-renders consumers correctly and that deep-merged partials apply cleanly to both `light` and `dark`.
- **Type safety**: the semantic token shape (`TerraTheme`, §4.4) is the source of truth for component color props (autocomplete for `content.tertiary`, `action.primary.bg`, …). Keep that inference intact through the merge.
- **Fonts**: library references font-family *names*; document that apps must load fonts. Missing fonts should degrade to system gracefully.

---

## 12. Decisions log

| Area | Decision |
|------|----------|
| Scope | Primitives + broadly-useful composites; app-specific excluded |
| Platforms | Native now; API kept web-safe; web later |
| Styling engine | react-native-unistyles v3 |
| Theme model | One `base` + named runtime **accent** overrides (deep-merge); no separate "brand" concept |
| Token tiers | Two-tier (primitive → semantic), widened semantics |
| Token names | `background`+`surface`, `content`, `action`, `status`, `border`, `elevation`, `opacity` (renamed from es/ui's surface/text/intent/field). Full `TerraTheme` type in §4.4 |
| Typography | Themeable (families + scale in theme); apps load fonts |
| Component API | Variants + `style` + `asChild`; token style-props on Box/Stack only; shared recipe helper |
| Composition | `asChild` (Radix Slot), **not** a polymorphic `as` prop — chosen for TS type-safety across RN targets (see §5.1) |
| v1 | Theme engine, Box/Stack, Text, Button |
| Distribution | Publish + Changesets; bob build |
| Quality | Jest + RNTL; a11y from day one; Biome/tsc/bob in CI; visual-regression deferred |
| Runtime theming | Library switches (`useTheme`), app persists; no storage dep |
| Preview | Expo example as gallery + accent/scheme switcher |

---

## 13. Open items

- Registry: public npm vs private GitHub Packages.
- Icon strategy for v2 (bring-your-own node vs optional `lucide-react-native` peer).
- Whether elevation/shadow tokens need platform-specific values (iOS shadow vs Android elevation).
