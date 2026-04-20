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

- **ESLint** (flat config) with `@tada5hi/eslint-config`
- Lints `packages/` and `examples/` directories (`.ts` and `.vue` files)
- Vue-specific rules enabled via `eslint-plugin-vue`
- **`npm run lint` must always pass with zero errors.** Warnings (e.g. `no-console`) are acceptable for intentional dev diagnostics but errors are not.
- Generated/build output directories (`**/dist/**`, `.nx/cache/**`, `examples/nuxt/.nuxt/**`, `examples/nuxt/.output/**`) are ignored via `eslint.config.js`

```bash
npm run lint          # Check — must exit with 0 errors
npm run lint:fix      # Auto-fix style issues
```

## TypeScript

- **Target**: ESNext
- **Module**: ESNext with Node module resolution
- Decorators enabled (`experimentalDecorators`, `emitDecoratorMetadata`)
- Strict mode is not enabled at root level
- Type declarations generated via `vue-tsc`

## Code Organization

- **`types.ts` files** contain only `type` and `interface` declarations — no `const`, `enum`, or runtime values
- **`constants.ts` files** contain `const`, `enum`, and other runtime value exports
- **Object type checks**: Always use the `isObject()` helper from `@vuecs/core/src/utils/object.ts`. Never use inline `typeof x === 'object' && x !== null` checks

## Build

- **tsdown** for ESM-only bundling
- Each package has its own `tsdown.config.ts`
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

## Documentation Updates

After any code changes that affect architecture, APIs, or behavior:

1. **`.agents/` docs** — Update `architecture.md`, `structure.md`, `testing.md`, or `conventions.md` if the change alters documented patterns, APIs, or resolution behavior
2. **Package `README.md`** — Update the relevant package's README if public API, usage examples, or behavior changed
3. **`AGENTS.md`** — Update if the change affects package descriptions, dependency layers, or quick-reference commands

Do this as part of the same commit — documentation should never lag behind the code.

## Adding a New Package

1. Create `packages/<name>/` with `src/index.ts`, `package.json`, `tsdown.config.ts`
2. Follow the Vue plugin export pattern — install function calls `installThemeManager()` and registers components (see [architecture.md](architecture.md))
3. Add entry to `release-please-config.json` and `.release-please-manifest.json`
4. Add `@vuecs/core` as both `devDependencies` and `peerDependencies` if the package uses the theme system
