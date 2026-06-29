# Git Commit Conventions

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/) and are validated by **Husky + commitlint**. Pre-commit also runs **lint-staged** (typecheck, lint, tests on staged files).

## Format

```
<type>(<scope>): <message>
```

- **type** — what kind of change (required)
- **scope** — what area of the codebase (optional, but recommended)
- **message** — short imperative description, lowercase, no trailing period

## Allowed types

| Type | When to use |
|------|-------------|
| `feat` | New component, prop, API, or user-visible behaviour |
| `fix` | Bug fix |
| `refactor` | Code change that neither adds a feature nor fixes a bug |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `build` | Build system, dependencies, tooling config |
| `ci` | CI/CD pipeline changes |
| `chore` | Repo maintenance (rename, move files, update lockfile) |

## Scopes

Use the component or package name. Common values:

| Scope | Covers |
|-------|--------|
| `ui` | `packages/ui` library (general) |
| `button`, `toast`, `header`, … | A specific component |
| `showcase` | `apps/showcase-expo` |
| `docs` | Documentation site or markdown files |
| `theme` | Theme tokens and configuration |
| `deps` | Dependency updates |

Omit the scope when the change spans multiple areas or is repo-wide.

## Examples

```
feat(toast): add persistent duration option
fix(button): render children alongside spinner when isLoading
refactor(ui): enforce component folder convention across all components
docs: add git commit conventions guide
test(page-indicator): add SharedValue mock for progress hook
build(deps): upgrade react-native-unistyles to v3.1
chore: move controller.ts into toast/utils/
```

## Breaking changes

Append `!` after the type/scope and add a `BREAKING CHANGE:` footer:

```
feat(theme)!: rename accent tokens

BREAKING CHANGE: `theme.color.accent` is now `theme.color.brand`.
Update all direct token references.
```
