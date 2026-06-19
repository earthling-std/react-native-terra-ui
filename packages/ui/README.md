# react-native-terra-ui

Themeable React Native UI components built on react-native-unistyles.

## Entry points

| Import | Purpose |
|--------|---------|
| `react-native-terra-ui` | Components, `TerraUIProvider`, `useTheme` |
| `react-native-terra-ui/theme` | `configureTerraUI`, theme types, color utilities (no import-time side effects) |

Use the `/theme` entry for `configureTerraUI()` in your app entry file. See [docs/getting-started.md](../../docs/getting-started.md).

## Components

| Export | Description |
|--------|-------------|
| `Box`, `HStack`, `VStack`, `Stack` | Layout primitives with token style props |
| `Text` | Typography variants |
| `Button` | Action button with `Button.Icon` / `Button.Label` |
| `Surface` | Elevated surface levels |
| `Icon` | Semantic icon registry |
| `Spinner` | Loading indicator |
| `Screen` | Page shell with `Screen.Header`, `Screen.ScrollView`, `Screen.FlatList` |
| `Header` | `Header.Title`, `Header.LargeTitle`, `HeaderDismissButton` navigation headers |
| `PageIndicator` | Dot and pill pager indicators — see [page-indicator.md](../../docs/page-indicator.md) |
| `PortalProvider`, `PortalHost`, `usePortal` | Portal rendering |
| `Slot`, `composeRefs`, `mergeProps` | Composition primitives (advanced) |

## Context

| Export | Description |
|--------|-------------|
| `TerraUIProvider` | Root provider — wrap your app once |
| `useTheme` | Runtime accent/scheme switching |

## Theme API (`react-native-terra-ui/theme`)

- `configureTerraUI` — register themes, accents, icons, component defaults
- `defaultLightTheme`, `defaultDarkTheme` — built-in theme objects
- `resolveThemeColor`, `deepMerge`, `shade`, `withAlpha`, `readableOn` — color utilities
- Types: `TerraTheme`, `TerraConfig`, `Accent`, `Scheme`, `ColorToken`, etc.

## Showcase

Interactive demos live in [apps/showcase-expo](../../apps/showcase-expo). From the repo root:

```sh
yarn showcase start
```
