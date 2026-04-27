# Project Structure

## Monorepo Layout

```
vuecs/
  packages/           # Component + infrastructure packages (npm workspaces)
    core/             # @vuecs/core — theme system, defaults manager, utilities
    countdown/        # @vuecs/countdown
    design/           # @vuecs/design — CSS design tokens + runtime palette switcher
    form-controls/    # @vuecs/form-controls
    gravatar/         # @vuecs/gravatar
    link/             # @vuecs/link
    list-controls/    # @vuecs/list-controls
    navigation/       # @vuecs/navigation
    nuxt/             # @vuecs/nuxt — Nuxt module: SSR palette + useColorMode()
    overlays/         # @vuecs/overlays — Modal (+ useModal view-stack) on Reka primitives; popover/tooltip/dropdown follow
    pagination/       # @vuecs/pagination
    timeago/          # @vuecs/timeago
  themes/             # Theme packages (npm workspaces) — pure data, no Vue runtime deps
    bootstrap-v4/     # @vuecs/theme-bootstrap-v4 — Bootstrap v4 theme + design-token bridge (assets/index.css)
    bootstrap-v5/     # @vuecs/theme-bootstrap-v5 — Bootstrap v5 theme + design-token bridge (assets/index.css)
    font-awesome/     # @vuecs/theme-font-awesome — Font Awesome icon theme
    tailwind/         # @vuecs/theme-tailwind — Tailwind v4 theme (semantic tokens)
  examples/
    nuxt/             # Nuxt demo app showcasing all components
  docs/               # @vuecs/docs — VitePress documentation site (deployed to vuecs.dev)
    src/
      .vitepress/
        config.mts    # title, nav, sidebar, search, edit-link, social
        theme/
          index.ts    # extends DefaultTheme; installs vuecs plugin + component plugins
          style.css   # tailwind + design tokens + VitePress brand overrides
          components/ # Hero, FeatureGrid, ThemeShowcase, CodeTabs, NuxtSection, Demo
          demos/      # Per-component live demo SFCs (e.g. FormCheckbox.vue)
      index.md        # Marketing landing page (composes the theme components)
      getting-started/
      guide/
      components/     # One page per component (Vue + CSS code-group tabs)
      themes/
      nuxt/
      public/         # CNAME, logo.svg
  .github/
    actions/          # Reusable composite actions (install, build)
    workflows/        # CI (main.yml), release (release.yml), docs deploy (docs.yml)
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
    types.ts          # ThemeClasses, ThemeElements, ComponentThemeDefinition, variant types, etc.
    extend.ts         # extend() marker, isExtendValue() guard
    resolve.ts        # Pure resolution function (no Vue dependency)
    variant.ts        # Pure variant resolution: extractVariantConfig(), resolveVariantClasses()
    manager.ts        # ThemeManager class
    composable.ts     # useComponentTheme() Vue composable
    install.ts        # installThemeManager() / injectThemeManager()
    index.ts          # Barrel exports
  defaults/           # Global behavioral defaults (i18n-friendly)
    types.ts          # ComponentDefaults (augmentable), ComponentDefaultValues, DefaultsManagerOptions
    manager.ts        # DefaultsManager class
    composable.ts     # useComponentDefaults() Vue composable
    install.ts        # installDefaultsManager() / injectDefaultsManager()
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
