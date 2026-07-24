# Getting started

This guide covers how to install, configure, and use `react-native-terra-ui` in a React Native app.

## Requirements

- React Native with the **New Architecture** enabled (recommended)
- A **development build** — Expo Go is not supported (Unistyles v3 requires native modules)
- Peer dependencies: `react-native-unistyles`, `react-native-reanimated`, `react-native-worklets`, `react-native-safe-area-context`, `react-native-svg`, `react-native-nitro-modules`

## Installation

`react-native-terra-ui` is built on top of [Unistyles](https://unistyl.es) and requires a few peer dependencies — including peers of Unistyles (`react-native-nitro-modules`) and Reanimated (`react-native-worklets`, split out as of Reanimated v4), which most package managers won't install automatically:

| Package | Purpose |
|---------|---------|
| `react-native-unistyles` | Theming and styling engine |
| `react-native-reanimated` | Animations |
| `react-native-worklets` | Worklet runtime required by Reanimated v4 |
| `react-native-safe-area-context` | Safe area insets |
| `react-native-svg` | Icon rendering |
| `react-native-nitro-modules` | Native module runtime required by Unistyles |

Install the library alongside its peer dependencies:

```sh
npm install react-native-terra-ui react-native-unistyles react-native-reanimated react-native-worklets react-native-safe-area-context react-native-svg react-native-nitro-modules
```

```sh
yarn add react-native-terra-ui react-native-unistyles react-native-reanimated react-native-worklets react-native-safe-area-context react-native-svg react-native-nitro-modules
```

```sh
pnpm add react-native-terra-ui react-native-unistyles react-native-reanimated react-native-worklets react-native-safe-area-context react-native-svg react-native-nitro-modules
```

In an Expo project, use `expo install` so versions resolve against your SDK:

```sh
npx expo install react-native-terra-ui react-native-unistyles react-native-reanimated react-native-worklets react-native-safe-area-context react-native-svg react-native-nitro-modules
```

Then follow the native setup guides for [Unistyles](https://unistyl.es) and [Reanimated](https://docs.swmansion.com/react-native-reanimated/) (Babel plugin, Reanimated worklet setup, etc.) before continuing below.

> `react-native-edge-to-edge` was a required peer of Unistyles before v3.1.0; it's now optional and only needed if you want Unistyles to manage edge-to-edge display on Android.

## Import order: `/theme` vs root

The library has two entry points:

| Entry | Side effects on import |
|-------|------------------------|
| `react-native-terra-ui/theme` | **None** — safe for app entry files |
| `react-native-terra-ui` | Auto-calls `configureTerraUI()` with defaults if not yet configured |

If you need a custom theme, configure **before** importing any component from the root entry. Otherwise the default auto-configure runs first and your custom `configureTerraUI()` call is ignored.

### Recommended setup

1. Create a theme bootstrap file and import it **first** in your app entry (`index.js` / `index.ts`):

```ts
// terra-ui.ts
import { configureTerraUI, type TerraTheme } from 'react-native-terra-ui/theme';

declare module 'react-native-unistyles' {
  interface UnistylesThemes {
    light: TerraTheme;
    dark: TerraTheme;
  }
}

configureTerraUI({
  shared: {
    radius: { base: 12 },
    typography: {
      fonts: {
        regular: 'YourFont_400Regular',
        medium: 'YourFont_500Medium',
        semibold: 'YourFont_600SemiBold',
        bold: 'YourFont_700Bold',
      },
    },
  },
  accents: {
    brand: { light: '#009966', dark: '#00bc7d' },
  },
  defaultAccent: 'brand',
  icons: {
    // Map custom icon names to Lucide (or any) components
    // add: Plus,
  },
  components: {
    button: { radius: 'full' },
    surface: { radius: 'xl', elevation: 'sm' },
  },
});
```

2. Import the bootstrap before your app root:

```js
// index.js
import './terra-ui';
import 'expo-router/entry'; // or your AppRegistry entry
```

3. Wrap your app with `TerraUIProvider`:

```tsx
import { TerraUIProvider } from 'react-native-terra-ui';

export function RootLayout() {
  return (
    <TerraUIProvider>
      <Stack />
    </TerraUIProvider>
  );
}
```

### Zero-config alternative

If the default theme is sufficient, skip the bootstrap file. Importing from `react-native-terra-ui` registers the default theme automatically. Wrap with `TerraUIProvider` and use components directly.

## Using components

```tsx
import { Button, Header, Screen, Text } from 'react-native-terra-ui';

export function HomeScreen() {
  return (
    <Screen>
      <Screen.Header>
        <Header.LargeTitle title="Home" dismissAction="back" />
      </Screen.Header>
      <Screen.ScrollView>
        <Text variant="title-lg">Welcome</Text>
        <Button onPress={() => {}}>Continue</Button>
      </Screen.ScrollView>
    </Screen>
  );
}
```

### Compound components

Several components use a namespace pattern:

- `Screen.Header`, `Screen.ScrollView`, `Screen.FlatList`
- `Header.Title`, `Header.LargeTitle`
- `Button.Icon`, `Button.Label`

`Header.LargeTitle` must be placed inside `Screen.Header` and used with `Screen.ScrollView` or `Screen.FlatList`.

### Layout and styling

Token style props (`p`, `gap`, `bg`, `radius`, `row`, etc.) are available on `Box` and `Surface` only. Other components accept specific props documented in their types.

## Runtime theme switching

Use `useTheme()` for accent and scheme changes at runtime:

```tsx
import { useTheme } from 'react-native-terra-ui';

function ThemeToggle() {
  const { accent, setAccent, scheme, setScheme } = useTheme();
  // ...
}
```

## Local development (monorepo)

The showcase app resolves the library from source via Metro. See [apps/showcase-expo/README.md](../apps/showcase-expo/README.md) and [CONTRIBUTING.md](../CONTRIBUTING.md).

Reference implementation: [apps/showcase-expo/src/unistyles.ts](../apps/showcase-expo/src/unistyles.ts).
