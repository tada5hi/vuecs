# Conventions

## Commit Messages

Enforced by **commitlint** (via Husky `commit-msg` hook) using `@tada5hi/commitlint-config`. Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

# Examples:
feat(navigation): add keyboard navigation support
fix(form-controls): correct checkbox toggle state
chore(deps): bump rollup to v4.58
```

## Linting

- **ESLint** with `@tada5hi/eslint-config-vue-typescript`
- Runs on `./packages/` directory (`.ts` files)
- Vue-specific rules enabled via `eslint-plugin-vue`
- Notable disabled rules: `class-methods-use-this`, `no-shadow`, `no-underscore-dangle`

```bash
npm run lint          # Check
npm run lint:fix      # Auto-fix
```

## TypeScript

- **Target**: ESNext
- **Module**: ESNext with Node module resolution
- Decorators enabled (`experimentalDecorators`, `emitDecoratorMetadata`)
- Strict mode is not enabled at root level
- Type declarations generated via `vue-tsc`

## Build

- **Rollup** with SWC for transpilation (not tsc)
- Each package has its own `rollup.config.mjs` extending the root `createConfig()`
- The `vuePlugin` parameter controls whether `@vitejs/plugin-vue` is included
- Nx orchestrates builds with `^build` dependency ordering (dependencies build first)
- Build outputs are cached by Nx

## Releases

- **release-please** automates versioning, changelogs, and GitHub releases
- Triggered on push to `master` branch
- Each package is independently versioned (see `.release-please-manifest.json`)
- After release PR merge: builds, tests, and publishes all changed packages via `workspaces-publish`
- Tags follow pattern: `<component>-v<version>` (e.g., `core-v2.0.0`)

## CI/CD

Two workflows in `.github/workflows/`:

| Workflow | Trigger | Jobs |
|----------|---------|------|
| `main.yml` | All branches + PRs | install, build, lint, tests |
| `release.yml` | Push to `master` | release-please, build, test, publish to npm |

## Adding a New Package

1. Create `packages/<name>/` with `src/index.ts`, `package.json`, `rollup.config.mjs`
2. Follow the Vue plugin export pattern (see [architecture.md](architecture.md))
3. Add entry to `release-please-config.json` and `.release-please-manifest.json`
4. If it depends on `@vuecs/core`, consider adding a `core/` re-export subdirectory
