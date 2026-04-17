# Project Structure

## Monorepo Layout

```
vuecs/
  packages/           # Published npm packages (npm workspaces)
    core/             # @vuecs/core — shared store, utilities, types
    countdown/        # @vuecs/countdown
    form-controls/    # @vuecs/form-controls (has core/ re-export subpath)
    gravatar/         # @vuecs/gravatar
    link/             # @vuecs/link
    list-controls/    # @vuecs/list-controls (has core/ re-export subpath)
    navigation/       # @vuecs/navigation (has core/ re-export subpath)
    pagination/       # @vuecs/pagination (has core/ re-export subpath)
    preset-bootstrap-v4/
    preset-bootstrap-v5/
    preset-font-awesome/
    timeago/          # @vuecs/timeago
  examples/
    nuxt/             # Nuxt demo app showcasing all components
  .github/
    actions/          # Reusable composite actions (install, build)
    workflows/        # CI (main.yml) and release (release.yml)
```

## Package Internal Structure

Each component package follows the same layout:

```
packages/<name>/
  src/
    index.ts          # Entry point — exports components, types, and Vue plugin
    components/       # Vue components (.ts render functions or .vue SFCs)
    type.ts / types.ts
  core/               # (some packages) Re-exports @vuecs/core for subpath import
    index.cjs
    index.mjs
    index.d.ts
    package.json
  dist/               # Build output (gitignored)
    index.mjs         # ESM bundle
    index.d.ts        # Type declarations
    index.css         # Extracted CSS (if applicable)
  tsdown.config.ts    # Package-specific build config
  package.json
  CHANGELOG.md
```

## Nested `core/` Re-exports

Four packages (`form-controls`, `list-controls`, `navigation`, `pagination`) contain a `core/` subdirectory that re-exports everything from `@vuecs/core`. This allows consumers to import core utilities via `@vuecs/form-controls/core` without adding `@vuecs/core` as a direct dependency. These are pre-built static files (not part of the build pipeline).

## Build Outputs

Each package produces ESM-only bundles via tsdown:
- `dist/index.mjs` — ES Modules
- `dist/index.d.ts` — TypeScript declarations
- `dist/index.css` — Extracted CSS (packages with styles only)

Each package has its own `tsdown.config.ts`.

## Key Root Files

| File | Purpose |
|------|---------|
| `nx.json` | Nx task runner config — caches `build` and `test`, `build` depends on `^build` |
| `release-please-config.json` | Automated release configuration for all packages |
| `.release-please-manifest.json` | Current version manifest |
| `commitlint.config.js` | Commit message validation (extends `@tada5hi/commitlint-config`) |
| `tsconfig.build.json` | Base TypeScript config (ESNext target, declarations enabled) |
| `tsconfig.json` | Root config extending build config with `noEmit` |
