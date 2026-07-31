# react-native-terra-ui

Themeable React Native UI components built on [react-native-unistyles](https://unistyl.es).

## Installation

Install the library and its peer dependencies:

```sh
npm install react-native-terra-ui react-native-unistyles react-native-reanimated react-native-safe-area-context react-native-svg
```

This library requires a **development build** (not Expo Go) because Unistyles v3 depends on native modules.

## Quick start

1. Configure the theme **before** any component imports (use the `/theme` entry — it has no import-time side effects):

```ts
// unistyles.ts — import this first in your app entry (e.g. index.js)
import { configureTerraUI } from 'react-native-terra-ui/theme';

configureTerraUI({
  accents: {
    emerald: { light: '#00bc7d', dark: '#00bc7d' },
  },
  defaultAccent: 'emerald',
});
```

2. Wrap your app with `TerraUIProvider`:

```tsx
import { TerraUIProvider } from 'react-native-terra-ui';

export function App() {
  return (
    <TerraUIProvider>
      <RootNavigator />
    </TerraUIProvider>
  );
}
```

3. Use components:

```tsx
import { Button, Screen, Text } from 'react-native-terra-ui';

export function HomeScreen() {
  return (
    <Screen>
      <Screen.Header>
        <Text variant="title-lg">Hello</Text>
      </Screen.Header>
      <Screen.ScrollView>
        <Button onPress={() => {}}>Get started</Button>
      </Screen.ScrollView>
    </Screen>
  );
}
```

See [docs/getting-started.md](docs/getting-started.md) for the full setup guide (import order, theme customization, TypeScript module augmentation).

## Components

`Box`, `Text`, `Button`, `Surface`, `Icon`, `Spinner`, `Toast`, `Screen`, `Header`, `PageIndicator`, `Portal`, and more — see [packages/ui/README.md](packages/ui/README.md) for the full export list.

## Showcase app

The repo includes an interactive component gallery at [apps/showcase-expo](apps/showcase-expo). Run it locally:

```sh
yarn install
yarn showcase start
```

See [apps/showcase-expo/README.md](apps/showcase-expo/README.md) for dev-build requirements.

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT
