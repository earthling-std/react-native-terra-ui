# Terra UI showcase

A small gallery exercising the v1 components (Text, Button, Surface, Box/Stack) and the
theming engine, with a live light/dark + accent switcher. Navigation uses **expo-router**
(file-based routes under `src/app/`).

## ⚠️ Requires a development build (not Expo Go)

This app uses **react-native-unistyles v3**, which depends on
**react-native-nitro-modules** — a native module. **Expo Go cannot run it**
(you'll see: _"NitroModules are not supported in Expo Go"_). Use a dev build:

```sh
# from the repo root
yarn install

cd apps/showcase-expo
npx expo prebuild        # generates ios/ + android/ with the native modules
npx expo run:ios         # or: npx expo run:android  — builds & launches a dev client
```

For later runs, start the bundler against the dev client (not Expo Go):

```sh
yarn showcase start          # dev client + Fast Refresh
yarn showcase start:reset    # clears Metro + Watchman if reloads stall
```

On a device or CI, build a dev client with EAS instead (`eas build --profile development`).

### Fast Refresh not updating?

1. **Use a dev build**, not Expo Go — this app requires native modules.
2. **Restart with a clean watcher** if saves don't trigger reloads:
   ```sh
   yarn showcase start:reset
   ```
3. Metro should only watch `apps/showcase-expo` and `packages/ui`, not the whole monorepo (misconfigured watchers cause Watchman recrawls and missed file events).

## What it shows

- **Theme controls** — toggle light/dark, switch accent (emerald / indigo /
  rose / amber), and change the radius scale (sharp / default / rounded),
  demonstrating runtime accent + radius switching.
- **Typography** — representative `Text` variants.
- **Buttons** — variants, sizes, and loading/disabled/full-width states.
- **Icon / Spinner / Page Indicator / Portal** — semantic icons, loading states, pager indicators, portal API.
- **Layout** — `Box`/`Stack` surfaces and an `asChild` → `Pressable` example.

## Agent skills

Paged showcase screens follow a shared pattern (`Screen` + horizontal swipe + `Pager` footer). To add or migrate a component screen, use the **`terra-ui-showcase`** skill.

Skills live in `.agents/skills/`; `.cursor/skills/` contains symlinks to the same folders (edit the `.agents/skills/` copy only).
