# Contributing

Contributions are always welcome, no matter how large or small!

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project. Before contributing, please read the [code of conduct](./CODE_OF_CONDUCT.md).

## Development workflow

This project is a monorepo managed using [Yarn workspaces](https://yarnpkg.com/features/workspaces). It contains:

- **`packages/ui`** — the `react-native-terra-ui` library
- **`apps/showcase-expo`** — an Expo gallery app for exploring components and themes

To get started, install the correct version of [Node.js](https://nodejs.org/) (see [`.nvmrc`](./.nvmrc)) and run:

```sh
yarn
```

> Since the project relies on Yarn workspaces, you cannot use [`npm`](https://github.com/npm/cli) for development without manually migrating.

The [showcase app](apps/showcase-expo) demonstrates usage of the library. Run it to test changes interactively.

The showcase resolves the library from **source** via Metro, so JavaScript changes in `packages/ui/src` hot-reload without rebuilding. Native code changes require a rebuild of the showcase dev client.

### Showcase commands

From the repo root (`yarn example` is an alias for `yarn showcase`):

```sh
yarn showcase start          # start Metro for the dev client
yarn showcase start:reset    # clear Metro + Watchman if reloads stall
yarn showcase ios            # build & run on iOS (requires prebuild)
yarn showcase android        # build & run on Android (requires prebuild)
yarn showcase web            # run on web
yarn showcase build:web      # production web build
```

### Dev build required

The showcase uses **react-native-unistyles v3**, which requires native modules. **Expo Go will not work.** See [apps/showcase-expo/README.md](apps/showcase-expo/README.md) for prebuild instructions.

### Quality checks

```sh
yarn typecheck   # TypeScript across all workspaces
yarn lint        # Biome lint + format check
yarn lint:fix    # auto-fix lint and formatting
yarn test        # Jest unit tests (packages/ui)
```

### Scripts reference

| Script | Description |
|--------|-------------|
| `yarn` | Install dependencies |
| `yarn typecheck` | Type-check with TypeScript |
| `yarn lint` | Lint and format-check with [Biome](https://biomejs.dev/) |
| `yarn lint:fix` | Auto-fix lint and formatting |
| `yarn test` | Run unit tests with [Jest](https://jestjs.io/) |
| `yarn showcase start` | Start Metro for the showcase app |
| `yarn showcase ios` / `android` | Run showcase on a device/simulator |
| `yarn showcase web` | Run showcase on web |
| `yarn build` | Build the library package |

### Theme setup for contributors

When customizing the theme in the showcase, import from `react-native-terra-ui/theme` (not the root entry) so your `configureTerraUI()` call runs before the default auto-configure. See [docs/getting-started.md](docs/getting-started.md).

## Sending a pull request

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github).

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that linters and tests are passing.
- Review the documentation to make sure it looks good.
- Follow the [pull request template](.github/pull_request_template.md) when opening a pull request.
- For pull requests that change the API or implementation, discuss with maintainers first by opening an issue.
