# Terra UI example

A small gallery exercising the v1 components (Text, Button, Box/Stack) and the
theming engine, with a live light/dark + accent switcher.

## ⚠️ Requires a development build (not Expo Go)

This app uses **react-native-unistyles v3**, which depends on
**react-native-nitro-modules** — a native module. **Expo Go cannot run it**
(you'll see: _"NitroModules are not supported in Expo Go"_). Use a dev build:

```sh
# from the repo root
yarn install

cd example
npx expo prebuild        # generates ios/ + android/ with the native modules
npx expo run:ios         # or: npx expo run:android  — builds & launches a dev client
```

For later runs, start the bundler against the dev client (not Expo Go):

```sh
npx expo start --dev-client
```

On a device or CI, build a dev client with EAS instead (`eas build --profile development`).

## What it shows

- **Theme controls** — toggle light/dark and switch accent (emerald / indigo /
  rose / amber), demonstrating the runtime accent registry.
- **Typography** — representative `Text` variants.
- **Buttons** — variants, sizes, and loading/disabled/full-width states.
- **Layout** — `Box`/`Stack` surfaces and an `asChild` → `Pressable` example.
