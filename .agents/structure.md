# Project Structure

## Monorepo Layout

```
vuecs/
  packages/           # Component + infrastructure packages (npm workspaces)
    core/             # @vuecs/core — theme system, defaults manager, utilities
    countdown/        # @vuecs/countdown
    design/           # @vuecs/design — CSS design tokens (concrete OKLCH defaults) + motion primitives (animations.css) + useColorMode + generic palette primitives (applyColorPaletteCss / bindColorPalette<T> / COLOR_PALETTE_STYLE_ELEMENT_ID) — theme-agnostic, no Tailwind dep (plan 017). `/standalone` subpath additionally inlines the 22-palette Tailwind v4 catalog so setColorPalette() works for BS/Bulma consumers without Tailwind loaded (plan 015 P3). scripts/build-standalone.ts regenerates assets/palettes.css from upstream.
    elements/         # @vuecs/elements — atomic, presentation-only UI elements (Separator, Tag/Tags, Avatar, AspectRatio, VisuallyHidden, Badge); thin Reka wrappers + pure-CSS chips (plan 013)
    forms/            # @vuecs/forms (renamed from @vuecs/form-controls in 3.0; checkbox/switch on Reka primitives)
    gravatar/         # @vuecs/gravatar — composes <VCAvatar> from @vuecs/elements (2.0.0 breaking change in plan 013)
    icon/             # @vuecs/icon — <VCIcon> component wrapping @iconify/vue
    link/             # @vuecs/link
    list/             # @vuecs/list — compound List / Header / Body / Item / ItemText / ItemActions / Footer / Loading / Empty + defineList() / useList() (renamed from @vuecs/list-controls in plan 010; sub-component split + Empty rename + Pinia-rename + meta unification per plan-010 addenda)
    navigation/       # @vuecs/navigation — multi-level nav with NavigationManager + <VCStepper> compound (Reka StepperRoot/Item/Trigger/Indicator/Title/Description/Separator) (plan 013)
    nuxt/             # @vuecs/nuxt — theme-agnostic Nuxt module: tokens injection + SSR colorMode + palette plugins + useColorMode / useColorPalette auto-imports + optional themes: string[] auto-load plugin (plan 025 collapsed the per-theme Nuxt sub-module split)
    overlays/         # @vuecs/overlays — Modal (+ useModal view-stack), Popover, HoverCard (plan 013), Tooltip (+ TooltipProvider), DropdownMenu, ContextMenu — all on Reka primitives
    pagination/       # @vuecs/pagination
    timeago/          # @vuecs/timeago
  themes/             # Theme packages (npm workspaces) — pure data, no Vue runtime deps
    bootstrap/        # @vuecs/theme-bootstrap — Bootstrap (currently v5) theme + design-token bridge (assets/index.css)
    bulma/            # @vuecs/theme-bulma — Bulma 1.0+ theme + design-token bridge (assets/index.css)
    tailwind/         # @vuecs/theme-tailwind — Tailwind v4 theme (class strings) + Tailwind palette runtime (setColorPalette / renderColorPaletteStyles) + Tailwind rebind / @theme / @source inline safelist; contributes its palette.handle to @vuecs/design's theme-aware useColorPalette (plan 026 collapsed the per-theme useColorPalette + ColorPaletteConfig into @vuecs/design)
  icons/              # Icon-preset packages (npm workspaces) — Iconify-name vocabularies for @vuecs/icon, no runtime icon data
    font-awesome/     # @vuecs/icons-font-awesome — Font Awesome 6 Solid icon names (replaces the removed @vuecs/theme-font-awesome)
    lucide/           # @vuecs/icons-lucide — Lucide icon names (modern default)
  examples/           # Runnable example apps — one per theme (plan 019)
    _shared/          # @vuecs-examples/shared — private workspace package
                      #   src/views/<Name>.vue — theme-agnostic demo bodies
                      #     (vanilla CSS only; no Tailwind / BS / Bulma utilities)
                      #   src/routes.ts — sharedRoutes catalog driving every app's nav
                      # Source-only; never published. Docs site demos pull from here too.
    nuxt/             # @vuecs/nuxt-example — flagship Nuxt + Tailwind app
                      # Mounts shared views via /components/[name] resolver.
                      # Exercises @vuecs/nuxt (SSR color-mode + palette).
    tailwind/         # @vuecs/example-tailwind — vanilla Vite + Vue 3 + Tailwind theme
    bootstrap/        # @vuecs/example-bootstrap — vanilla Vite + Vue 3 + Bootstrap 5; no Tailwind
    bulma/            # @vuecs/example-bulma — vanilla Vite + Vue 3 + Bulma 1.0+; no Tailwind
  tests/              # Test workspaces (npm workspaces) — source-only, never published
    visual-regression/  # @vuecs-tests/visual-regression — Playwright snapshot
                        # matrix (3 themes × 33 demo routes = 99 tests). Drives
                        # the same sharedRoutes catalog the example apps consume.
                        # CI compares on PR; baselines committed under
                        # specs/__snapshots__/ (regenerate via the
                        # visual-regression-update workflow on Ubuntu).
                        # See plan 015 P2 / .agents/architecture.md.
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

## List Package Structure

```
packages/list/src/
  composables/         # State container + child-side context + selection machine
    define-list.ts     # defineList() factory — Pinia-style; returns ListState (+ ListMutators when a writer is derivable)
    context.ts         # provideListContext / useList + provideListItemContext / useListItem — strict Vue inject
    selection.ts       # useSelectionMachine — single/multi toggle, range select, focusedIndex, rangeAnchor
    index.ts
  components/
    list/              # Shell parts that read context — wrap `<VCList>`'s state
      List.vue ListBody.vue ListLoading.vue ListEmpty.vue
      index.ts
    list-item/         # Per-row layout — provides item-scope context
      ListItem.vue
      index.ts
    index.ts
  utils/               # Render-time helpers (asChild cloning, vnode filtering, slot-prop merge)
    render-utils.ts
    index.ts
  types.ts             # ThemeClasses + ThemeElements / ComponentDefaults augmentations
  index.ts             # Plugin install + barrel re-exports
  vue.ts               # GlobalComponents augmentation
```

The compound shape is five components (plan 027): `<VCList>` (outer
container + state + selection coordinator), `<VCListBody>` (the
`<ul>`), `<VCListItem>` (the `<li>`), `<VCListEmpty>`,
`<VCListLoading>`. Header / footer chrome and the per-row text /
actions clusters are **consumer markup** — `<VCList>`'s default slot
exposes `{ classes }` (with `classes.header` / `classes.footer`) and
`<VCListItem>`'s default slot exposes `{ classes }` (with
`classes.text` / `classes.actions`). The previous
`<VCListHeader>` / `<VCListFooter>` / `<VCListItemText>` /
`<VCListItemActions>` components were removed in the plan 027 rewrite.

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
