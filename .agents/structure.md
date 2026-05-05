# Project Structure

## Monorepo Layout

```
vuecs/
  packages/           # Component + infrastructure packages (npm workspaces)
    core/             # @vuecs/core — theme system, defaults manager, utilities
    countdown/        # @vuecs/countdown
    design/           # @vuecs/design — CSS design tokens + motion primitives (animations.css) + runtime palette switcher
    elements/         # @vuecs/elements — atomic, presentation-only UI elements (Separator, Tag/Tags, Avatar, AspectRatio, VisuallyHidden, Badge); thin Reka wrappers + pure-CSS chips (plan 013)
    forms/            # @vuecs/forms (renamed from @vuecs/form-controls in 3.0; checkbox/switch on Reka primitives)
    gravatar/         # @vuecs/gravatar — composes <VCAvatar> from @vuecs/elements (2.0.0 breaking change in plan 013)
    icon/             # @vuecs/icon — <VCIcon> component wrapping @iconify/vue
    link/             # @vuecs/link
    list/             # @vuecs/list — compound List / Header / Body / Item / ItemText / ItemActions / Footer / Loading / Empty + defineList() / useList() (renamed from @vuecs/list-controls in plan 010; sub-component split + Empty rename + Pinia-rename + meta unification per plan-010 addenda)
    navigation/       # @vuecs/navigation — multi-level nav with NavigationManager + <VCStepper> compound (Reka StepperRoot/Item/Trigger/Indicator/Title/Description/Separator) (plan 013)
    nuxt/             # @vuecs/nuxt — Nuxt module: SSR palette + useColorMode()
    overlays/         # @vuecs/overlays — Modal (+ useModal view-stack), Popover, HoverCard (plan 013), Tooltip (+ TooltipProvider), DropdownMenu, ContextMenu — all on Reka primitives
    pagination/       # @vuecs/pagination
    timeago/          # @vuecs/timeago
  themes/             # Theme packages (npm workspaces) — pure data, no Vue runtime deps
    bootstrap/        # @vuecs/theme-bootstrap — Bootstrap (currently v5) theme + design-token bridge (assets/index.css)
    bulma/            # @vuecs/theme-bulma — Bulma 1.0+ theme + design-token bridge (assets/index.css)
    tailwind/         # @vuecs/theme-tailwind — Tailwind v4 theme (semantic tokens)
  icons/              # Icon-preset packages (npm workspaces) — Iconify-name vocabularies for @vuecs/icon, no runtime icon data
    font-awesome/     # @vuecs/icons-font-awesome — Font Awesome 6 Solid icon names (replaces the removed @vuecs/theme-font-awesome)
    lucide/           # @vuecs/icons-lucide — Lucide icon names (modern default)
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

## List Package Structure

```
packages/list/src/
  composables/         # State container + child-side context
    define-list.ts     # defineList() factory — Pinia-style; returns ListState (+ ListMutators when a writer is derivable)
    context.ts         # provideList() / useList() — strict Vue inject
    index.ts
  components/
    list/              # Shell parts that read context — wrap `<VCList>`'s state
      List.vue ListHeader.vue ListBody.vue ListFooter.vue ListLoading.vue ListEmpty.vue
      index.ts
    list-item/         # Per-row layout — no context dependency
      ListItem.vue ListItemText.vue ListItemActions.vue
      index.ts
    index.ts
  utils/               # Render-time helpers (asChild cloning, vnode filtering, slot-prop merge)
    render-utils.ts
    index.ts
  types.ts             # ThemeClasses + ThemeElements / ComponentDefaults augmentations
  index.ts             # Plugin install + barrel re-exports
  vue.ts               # GlobalComponents augmentation
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
