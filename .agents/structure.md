# Project Structure

## Monorepo Layout

```
vuecs/
  packages/           # Published npm packages (npm workspaces)
    core/             # @vuecs/core — theme system, utilities, types
    countdown/        # @vuecs/countdown
    form-controls/    # @vuecs/form-controls
    gravatar/         # @vuecs/gravatar
    link/             # @vuecs/link
    list-controls/    # @vuecs/list-controls
    navigation/       # @vuecs/navigation
    pagination/       # @vuecs/pagination
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
    type.ts / types.ts  # Only type/interface declarations
    constants.ts      # const/enum runtime values (if needed)
  dist/               # Build output (gitignored)
    index.mjs         # ESM bundle
    index.d.ts        # Type declarations
    style.css         # Extracted CSS (if applicable)
  tsdown.config.ts    # Package-specific build config
  package.json
  CHANGELOG.md
```

## Core Package Structure

```
packages/core/src/
  index.ts            # Default plugin export + re-exports
  theme/              # Theme resolution system
    constants.ts      # EXTEND_SYMBOL
    types.ts          # ThemeSlots, Preset, ThemeManagerOptions, etc.
    extend.ts         # extend() marker, isExtendValue() guard
    resolve.ts        # Pure resolution function (no Vue dependency)
    manager.ts        # ThemeManager class
    composable.ts     # useComponentTheme() Vue composable
    install.ts        # installThemeManager() / injectThemeManager()
    index.ts          # Barrel exports
  utils/              # Shared utilities (inject, provide, normalizeSlot, etc.)
  types.ts            # VNodeClass, VNodeProperties, PartialPick
```

## Build Outputs

Each package produces ESM-only bundles via tsdown:
- `dist/index.mjs` — ES Modules
- `dist/index.d.ts` — TypeScript declarations
- `dist/style.css` — Extracted CSS (packages with styles only)

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
