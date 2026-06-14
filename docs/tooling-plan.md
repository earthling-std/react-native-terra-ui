# Tooling plan — tree-shaking, Storybook, example gallery

Investigations and follow-ups beyond the v1 implementation. The example gallery
(§3) is being built now; tree-shaking (§1) and Storybook (§2) are scoped here
for a later milestone.

---

## 1. Tree-shaking

**Goal.** A consumer that imports only `Text` should not pull the whole library
(every component, the theme engine, etc.) into their bundle.

### What helps / hurts today

- **Build output.** bob emits an **ESM `module`** target — a precondition for
  tree-shaking. Good.
- **Barrels.** `src/index.tsx` and the sub-barrels use `export *`. Re-export
  barrels are tree-shakeable *only* when the bundler does cross-module DCE and
  the package is correctly marked side-effect-free.
- **The blocker — import-time side effect.** `src/index.tsx` exports `./context`
  first, and `context/ThemeProvider` runs `configureTerraUI()` at module load.
  So importing **anything** from the package root evaluates the provider + theme
  engine. That side effect (a) couples `import { Text }` to the whole engine and
  (b) prevents marking the package `sideEffects: false`.
- **Metro reality.** React Native's default bundler (Metro) historically does
  **not** tree-shake (no cross-module DCE); it relies on per-file dead-code
  elimination + `inlineRequires`. So for RN apps the practical win from
  tree-shaking is small until Metro's experimental tree-shaking is enabled.
  Web consumers (Webpack/Vite/Rollup) *do* benefit.

### Options

1. **Declare `sideEffects` precisely.** Mark the package side-effect-free except
   the provider/auto-configure module, e.g.
   `"sideEffects": ["**/ThemeProvider.tsx", "**/index.tsx"]`. Lets web bundlers
   drop unused exports while preserving the configure side effect where it lives.
2. **Make the root entry side-effect-free.** Drop the auto-configure from the
   import path: require apps to call `configureTerraUI()` explicitly (or only via
   `<TerraUIProvider>` at render, not at import). Then `sideEffects: false` is
   honest and `import { Text }` no longer drags in the provider. Trade-off: the
   "zero-config default" convenience changes.
3. **Per-component subpath exports.** Add `"./button"`, `"./text"`, … to the
   `exports` map so consumers can deep-import (`react-native-terra-ui/button`).
   Guarantees minimal graphs regardless of bundler, at the cost of a larger
   exports map and bob multi-entry config.
4. **Keep barrels, rely on ESM + `sideEffects`.** Simplest; best for web, modest
   for Metro.

### Recommendation

- Ship **Option 1** (precise `sideEffects`) now — cheap, safe, helps web.
- Evaluate **Option 2** seriously: moving auto-configure out of the import path
  is the single biggest correctness/tree-shaking win and aligns with the
  "configure once at entry" model we already document. Decide whether to keep
  the import-time default at all.
- Defer **Option 3** unless bundle measurements justify it.

### How to measure

- Web: a tiny Vite/Rollup app importing only `Text`; inspect the bundle for
  `Button`/engine symbols.
- RN: `npx react-native-bundle-visualizer` (or Expo Atlas) on the example app
  with one component imported vs. all.

### Open questions

- Do we keep import-time auto-configure (DX) or require explicit configure (tree-shaking)?
- Is web a real target soon enough to prioritize this? (Plan currently: "web later".)

---

## 2. Storybook

**Goal.** A browsable catalog of components × states × themes, doubling as a dev
harness — eventually augmenting or replacing the hand-rolled gallery (§3).

### Options

1. **`@storybook/react-native` (on-device).** Stories render inside the Expo
   example on a simulator/device. Closest to real RN rendering (Unistyles native
   runtime, real Pressable). Heavier setup; UI lives on-device; weaker docs/MDX.
2. **`@storybook/react-native-web` (web).** Stories render via `react-native-web`
   in a browser — best catalog UX, MDX docs, controls/addons, easy to host/share.
   Requires the **web** target (currently "later") and RNW-accurate components.
3. **Both** (on-device for fidelity, web for docs). Most work; usually overkill.

### Considerations

- **Unistyles + Storybook.** The Unistyles Babel plugin must process story files
  and the library; needs configuring in Storybook's Babel/Metro setup. Theme
  switching maps naturally to a Storybook **toolbar globals** + decorator calling
  `useTheme().setScheme/setAccent`.
- **Monorepo wiring.** Storybook would live in `example/` (or a dedicated
  `apps/storybook`) and resolve the library from source like the example does.
- **Web dependency.** Option 2 effectively pulls the "web later" decision forward
  (RNW peer, web-safe components verified).

### Recommendation

- **Defer to a dedicated milestone**, after the catalog grows past a few
  components. When we do it: prefer **react-native-web Storybook (Option 2)** for
  catalog/docs UX, executed together with enabling the web target — and keep the
  on-device gallery (§3) for native-fidelity checks in the meantime.

### Open questions

- Does enabling web (for RNW Storybook) happen before or after more components land?
- Storybook 8 vs 9 at implementation time; framework package choice (`@storybook/react-native-web-vite`).

---

## 3. Example gallery (building now)

**Goal.** A runnable Expo screen that exercises v1 components and the theming
engine, with a live **accent + light/dark switcher** (the v1 preview harness).

### Shape

- `example/src/unistyles.ts` — calls `configureTerraUI({ accents, defaultAccent })`
  imported from the side-effect-free `react-native-terra-ui/theme`. Imported as
  the **first** line of `example/index.js` so it configures before any component
  loads (and the root package's import-time default becomes a guarded no-op).
- `example/src/App.tsx` — wraps `<Gallery/>` in `<TerraUIProvider>`.
- `example/src/Gallery.tsx` — `useTheme()` for scheme/accent; sections:
  - Controls: scheme toggle + accent picker (`getAccentNames()`).
  - Typography: representative `Text` variants.
  - Buttons: variants, sizes, states (loading/disabled/fullWidth).
  - Layout: `Box`/`Stack` surfaces, and an `asChild` `Pressable` demo.

### Notes

- Replaces the CLI placeholder `App` (which imported the removed `multiply`).
- Verifies multi-accent switching and light/dark end-to-end.
- Runtime requires `yarn install` + the Unistyles Babel plugin (already added to
  `example/babel.config.js`); cannot be run in the dev sandbox.
- **Must run as a development build, not Expo Go** — Unistyles v3 pulls in
  `react-native-nitro-modules` (native), which Expo Go can't load. Use
  `npx expo prebuild` + `npx expo run:ios`/`run:android`, then
  `expo start --dev-client`. See `example/README.md`.
