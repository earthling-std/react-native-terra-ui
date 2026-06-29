# Terra UI — Agent Guide

## Monorepo layout

| Path | Purpose |
|------|---------|
| `packages/ui` | `react-native-terra-ui` — the component library |
| `apps/showcase-expo` | Expo gallery app for exploring components and themes |
| `docs/` | Documentation site (Fumadocs) |

The showcase resolves the library from **source** via Metro, so JS changes in `packages/ui/src` hot-reload without a rebuild.

## Common commands

```sh
yarn                        # install dependencies
yarn typecheck              # TypeScript across all workspaces
yarn lint                   # Biome lint + format check
yarn lint:fix               # auto-fix lint and formatting
yarn test                   # Jest unit tests (packages/ui only)
yarn showcase start         # start Metro for the showcase dev client
yarn showcase ios           # build & run on iOS simulator
yarn showcase android       # build & run on Android emulator
yarn showcase web           # run on web
yarn build                  # build the library package
```

> The showcase uses react-native-unistyles v3, which requires native modules. **Expo Go will not work.** Use a dev client built with `yarn showcase ios/android`.

## Component structure — `packages/ui/src/components/`

Every component lives in its own folder named after the component in `kebab-case`.

```
[component-name]/
├── __tests__/              # Jest tests
├── PublicComponent.tsx     # Component(s) exported to consumers
├── utils.ts                # Utilities used only by this component
├── types.ts                # TypeScript types for this component
├── index.ts                # Public barrel — only re-exports public API
├── parts/                  # Internal sub-components (NOT exported publicly)
└── variants/               # Variant components (one sub-folder per variant)
    └── [variant-name]/
        ├── __tests__/
        ├── index.tsx       # Variant entry point
        └── utils.ts        # Variant-specific utilities
```

### Rules

- `index.ts` is the **only** file consumers should import from. It re-exports the public API — types, components, hooks.
- Files inside `parts/` and `variants/` are internal. Do not export them from `index.ts`.
- `utils.ts` at any level is private to its enclosing folder.
- `types.ts` holds shared types for the component. Keep prop interfaces in the component file when they are only used there.
- A `hooks/` folder is used alongside `parts/` when the component has non-trivial stateful logic to isolate (e.g. `use-[component]-core.ts`).
- Test files live in the `__tests__/` folder closest to the code they test (component-level, variant-level, etc.).

### Practical example — `page-indicator`

```
page-indicator/
├── __tests__/
├── PageIndicator.tsx       ← public component
├── PageIndicatorRoot.tsx   ← internal root (not exported)
├── hooks/
│   ├── use-page-indicator-colors.ts
│   ├── use-page-indicator-core.ts
│   └── use-page-indicator-progress.ts
├── utils.ts
├── index.ts
└── variants/
    ├── DotIndicator/
    │   ├── __tests__/
    │   ├── InactiveDot.tsx
    │   ├── LoadingOrbit.tsx
    │   ├── TravelingPill.tsx
    │   ├── index.tsx
    │   └── utils.ts
    └── PillIndicator/
        ├── __tests__/
        ├── PillIndicatorDot.tsx
        ├── index.tsx
        └── utils.ts
```

## Adding a new component

1. Create `packages/ui/src/components/[component-name]/` following the structure above.
2. Write the public component in `[ComponentName].tsx` and re-export it from `index.ts`.
3. Export `index.ts` from `packages/ui/src/components/index.ts`.
4. Add a showcase screen in `apps/showcase-expo/src/screens/[Component]Screen.tsx`.
5. Add a route file at `apps/showcase-expo/src/app/[component].tsx` and link it in `GalleryScreen.tsx`.

## Styling

Components use **react-native-unistyles v3** (`StyleSheet.create` from `react-native-unistyles`). Access theme tokens via the `theme` argument in the stylesheet factory — never hard-code colours or spacing values.

## Testing

- Unit tests use **Jest + React Native Testing Library**.
- Mocks for `react-native-unistyles` and `react-native-reanimated` live in `packages/ui/jest.setup.ts`.
- Run a single test file: `yarn test [component-name]`.
