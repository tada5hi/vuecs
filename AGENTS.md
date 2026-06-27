<!-- NOTE: Keep this file and all corresponding files in the .agents directory updated as the project evolves. When making architectural changes, adding new patterns, or discovering important conventions, update the relevant sections. -->

# vuecs — Agent Guide

A Vue 3 **theming framework** with shipped components — published as scoped `@vuecs/*` packages on npm.

The value proposition is layered:

1. **Theming machinery** (`@vuecs/core`): `useComponentTheme` + `useComponentDefaults` composables, `<VCConfigProvider>`, `defineTheme()` for composing themes that build on existing ones, design-token system (`@vuecs/design`), runtime palette + color-mode switching, and a typed augmentable theme registry (`ThemeElements`, `ComponentDefaults`, `Config`).
2. **A baseline of theme-aware components** (button, navigation, forms, overlays, list, pagination, …) built on that machinery.
3. **An opt-in path for third-party libraries** to publish their own components on the same machinery, so a downstream consumer reskins **everything** — vuecs primitives + third-party libraries — through a single `app.use(vuecs, { themes, overrides, defaults, config })` call.

Themes for Tailwind, Bootstrap 5, and Bulma 1.0+ ship today. The theme system, design tokens, and component machinery are independently consumable; pick what you need.

## Quick Reference

```bash
# Setup
npm ci

# Development
npm run build          # Build all packages via Nx
npm run test           # Run tests across packages via Nx
npm run lint           # ESLint on all packages
npm run lint:fix       # Auto-fix lint issues
```

- **Node.js**: >=20 (most packages), CI uses v22
- **Package manager**: npm (workspaces)
- **Task runner**: Nx (caches build and test)

### Packages

| Package | Description | Version |
|---------|-------------|---------|
| `@vuecs/button` | General-purpose button (color/variant/size, loading, icon slots) + polymorphic `:as` (string tag or component — render as `RouterLink` / `NuxtLink` for button-styled links; deprecated `tag` alias) | 0.0.0 |
| `@vuecs/core` | Theme system, global behavioral defaults, utilities, component infrastructure. Also exports `VCPrimitive` (ported `as` / `asChild` building block) + `usePrimitiveElement` so downstream component libraries don't need a direct `reka-ui` dep (plan 034), and the `GenericComponentShape<Props, Slots>` helper for authoring `defineComponent`-style components that stay generic over a consumer entity type (shared by `@vuecs/table`, `@vuecs/list`, and third-party libs — issue #1601, #1660). | 2.0.0 |
| `@vuecs/countdown` | Countdown/timer component | 1.0.1 |
| `@vuecs/design` | CSS design tokens (concrete OKLCH defaults from Tailwind v4's palette + semantic aliases) + motion primitives (vanilla-CSS port of `tw-animate-css`) + theme-agnostic `useColorMode` + theme-aware `useColorPalette` (dispatches through installed themes' `palette.handle` hooks) + canonical `ColorPaletteConfig` type + generic palette primitives (`applyColorPaletteCss`, `bindColorPalette<T>`, `COLOR_PALETTE_STYLE_ELEMENT_ID`) for any theme to compose. No Tailwind dep — works standalone with BS/Bulma/no theme. (plan 017, plan 026) | 0.0.0 |
| `@vuecs/elements` | Atomic, presentation-only UI elements — `VCSeparator`, `VCTag` / `VCTags`, `VCAvatar`, `VCAspectRatio`, `VCVisuallyHidden`, `VCBadge`, the Card compound (`VCCard` / `VCCardHeader` / `VCCardTitle` / `VCCardDescription` / `VCCardBody` / `VCCardFooter`) + `VCCardPlaceholder` (skeleton sibling), the Alert compound (`VCAlert` / `VCAlertTitle` / `VCAlertDescription` / `VCAlertClose`), and the Collapse compound (`VCCollapse` / `VCCollapseTrigger` / `VCCollapseContent`, Reka `Collapsible` wrapper). Pure-CSS or thin Reka wrappers; each ≤150 LOC, owns its own theme key. | 0.0.0 |
| `@vuecs/forms` | Form components on Reka UI primitives — `VCFormCheckbox` / `VCFormCheckboxGroup`, `VCFormSwitch`, `VCFormRadio` / `VCFormRadioGroup`, `VCFormPin`, `VCFormSlider` (single+range), `VCFormNumber`, `VCFormTags`, `VCFormSelect` / `VCFormSelectSearch` (FormOption shape), `VCFormInput` / `VCFormTextarea` (native), plus the experimental `useSubmitButton()` helper for `@vuecs/button`. Renamed from `@vuecs/form-controls` in 3.0 (clean break — old package removed). | 3.0.0 |
| `@vuecs/gravatar` | Gravatar avatar component — composes `<VCAvatar>` from `@vuecs/elements` for fallback support (DOM shape changed; major bump on next release-please run) | 1.0.2 |
| `@vuecs/icon` | `<VCIcon>` component — thin Iconify wrapper for vuecs's icon-string-prop slots and consumer slot content | 0.0.0 |
| `@vuecs/link` | Router-aware link component (vue-router/nuxt) | 1.0.1 |
| `@vuecs/list` | Compound list (List / Body / Item / Empty / Loading) + `defineList()` factory + `useList()` / `useListItem()` injectors + built-in `v-model:selection` (single / multi, ARIA listbox). Header / footer / item-text / item-actions are consumer markup driven by slot-prop class strings. `VCList` / `VCListItem` are **generic over `Item`** so `<VCListItem :data>`'s `#default` slot (and `<VCList>`'s `:data` / `:state`) infer the consumer's row type (issue #1660 — same `defineComponent` + generic-cast facade as `@vuecs/table`; context-reading parts stay non-generic). Successor to `@vuecs/list-controls` — clean break (plan 027). | 0.0.0 |
| `@vuecs/locale` | Browser-language-aware, resettable locale source. `useNavigatorLanguage`-backed (via `@vueuse/core`); source is a BCP-47 tag or the `'auto'` sentinel (color-mode `'system'` analog) that defers to the browser. Install plugin bridges the resolved value into `@vuecs/core`'s `Config['locale']`, persists the source, and syncs `<html lang>`. `useLocaleManager()` exposes `set` (apply a backend-saved override) / `reset` (back to `'auto'`) / `source` / `resolved` / `isAuto`; `bindLocale()` is the lower-level building block (parallels `bindColorMode`). Read-side consumers use `useLocale()` from `@vuecs/core`. | 0.0.0 |
| `@vuecs/navigation` | Multi-level navigation — per-call-site `:data` items + a shared reactive registry for dependent navs (plan 037, 3.0 clean break, no NavigationManager) + `<VCStepper>` compound for multi-step wizards + the `<VCBreadcrumb>` compound (7 parts, generic over `Item`; `:items` driver / manual compound / registry-`activeTrail` derivation; `useBreadcrumb()` app-scoped push/pop manager, `useBreadcrumbItems()` route-meta floor, `useBreadcrumbLeaf()` dynamic-`/:id` leaf override — plan 039) | 2.4.1 |
| `@vuecs/nuxt` | Theme-agnostic Nuxt module — auto-imports `@vuecs/design` tokens, ships SSR-safe color-mode + palette + locale plugins (`useColorMode` / `useColorPalette` / `useLocale` / `useLocaleManager` auto-imports). Dispatches palette + colorMode runtime hooks through whichever themes the consumer installs (plan 025). The cookie-backed locale plugin is universal (server+client), resolves `'auto'` from `Accept-Language` server-side, bridges into `Config['locale']`, and emits `<html lang>`. Optional `themes: string[]` config auto-generates a plugin that installs listed theme packages. | 0.0.0 |
| `@vuecs/overlays` | Compound overlays on Reka primitives — Modal (+ `useModal()` view-stack composable), Popover, HoverCard, Tooltip, DropdownMenu, ContextMenu, Toast (+ `useToast()` shared queue composable, plan 029) | 0.0.0 |
| `@vuecs/pagination` | Pagination component | 1.3.1 |
| `@vuecs/placeholder` | Primitive skeleton loading components — `VCPlaceholder` (single animated bar, `shape: rect / pill / circle`, `size: xs–xl`, `duration` override) + `VCPlaceholderWrapper` (conditional `#loading` / `#default` slot switch with W3C "Loading content" ARIA wiring). Wave / glow / none animation modes; reduced-motion respected. Composite skeletons live next to the real components they mirror (`<VCCardPlaceholder>` in `@vuecs/elements`, `<VCTablePlaceholder>` in `@vuecs/table`). Pure-CSS + theme-class strings; ships its own structural CSS so it works without any theme. (issue #1476) | 0.0.0 |
| `@vuecs/table` | Compound table (`VCTable` + `VCTableLite` + Header / Body / Footer / Row / Cell / HeadCell / Empty / Loading / SortIndicators / Placeholder / ExpandTrigger / RowExpansion) with a `:columns :data` driver, default cell renderer (`accessor` + `formatter`), driver auto-render of header/body, stacked responsive mode, controlled `v-model:sort` on `VCTable` with multi-column + client-side sort, opt-in row-click + row keyboard nav, `_rowVariant` / `_cellVariants` row-meta, a discoverable `<VCTableSortIndicators>` chip-row for managing multi-sort without Shift-click, `<VCTablePlaceholder>` skeleton sibling for loading states, per-row expansion panels (`<VCTable :expandable>` + `#expansion` slot — ResizeObserver-measured height animation, W3C disclosure ARIA), and **generic over `Row`** so driver slot props (`#cell-<key>`, `#header-<key>`, `#expansion`) infer the entity type from `:data` / `:columns` (issue #1601 — `defineComponent` + generic cast, not `<script setup generic>`). Layer 1 — depends on `@vuecs/core` + `reka-ui` (the latter only for `<Presence>`-backed expansion unmount delay). (plans 028 + 033 + 038, issue #1476, #1601) | 0.0.0 |
| `@vuecs/theme-bootstrap` | Bootstrap theme (currently targets v5; renamed from `@vuecs/theme-bootstrap-v5` in 3.0) | 3.0.0 |
| `@vuecs/theme-bulma` | Bulma 1.0+ theme + design-token bridge | 0.0.0 |
| `@vuecs/theme-tailwind` | Tailwind v4 theme (class strings + `merge: ClassesMergeFn`) + Tailwind palette runtime (`setColorPalette`, `renderColorPaletteStyles`) + Tailwind rebind / `@theme` block / `@source inline()` safelist. Contributes its renderer via `palette.handle` so `useColorPalette()` from `@vuecs/design` dispatches through it. `useColorPalette` / `ColorPaletteConfig` now live in `@vuecs/design` (plan 026); deprecated re-exports remain for one release cycle. (plan 017, plan 026) | 0.0.0 |
| `@vuecs/icons-font-awesome` | Font Awesome 6 Solid icon-name preset for vuecs (Iconify-backed; replaces the removed `@vuecs/theme-font-awesome`) | 0.0.0 |
| `@vuecs/icons-lucide` | Lucide icon-name preset for vuecs (Iconify-backed) | 0.0.0 |
| `@vuecs/timeago` | Relative time display component | 1.1.2 |

### Dependency Layers

```text
Layer 0 (no internal deps):  core, countdown, design, icon, link, timeago
Layer 1 (depends on core):   button, elements, forms, list, locale, navigation, overlays, pagination, placeholder, table
Layer 1' (depends on elements + core):   gravatar (composes VCAvatar)
Layer 2 (depends on Layer 0): themes (@vuecs/core peer dep only — pure data that targets component packages at runtime)
                              theme-tailwind also depends on @vuecs/design (composes its generic palette primitives)
Layer 2': icons (@vuecs/core peer dep only — Iconify-name vocabularies for @vuecs/icon's <VCIcon>, registered via `app.use(vuecs, { icons: [...] })`)
Layer 3 (integration):       nuxt (depends on core + design + locale + @nuxt/kit) — theme-agnostic
```

`navigation` also depends on `@vuecs/link`. `locale` additionally depends on `@vueuse/core` (peer) for `useNavigatorLanguage` / `useStorage` — the same browser-environment building blocks `@vuecs/design` uses; it deliberately does NOT live in `@vuecs/design` because locale is not a design-token concern. `pagination`, `overlays`, `forms`, `elements`, `navigation`, and `table` take a runtime dep on `reka-ui` (they wrap Reka's headless primitives — pagination, dialog/popover/hover-card/tooltip/menu, the form-input families, the atomic separator/avatar/aspect-ratio/visually-hidden elements, the stepper, and `<Presence>`-driven expansion-row unmount delay respectively). `theme-tailwind` is designed to pair with `@vuecs/design` (Tailwind v4 + CSS-variable tokens); `theme-bootstrap` and `theme-bulma` each ship an optional bridge mapping their framework's runtime CSS variables (`--bs-*`, `--bulma-*`) onto the design-system tokens. Nuxt consumers install `@vuecs/nuxt` regardless of theme; the module's palette / color-mode SSR plugins dispatch through whatever themes the user installs (plan 025 collapsed the previous per-theme Nuxt sub-module split).

## Documentation Site

Public docs live in `docs/` (private workspace `@vuecs/docs`, VitePress) and are deployed to **[vuecs.dev](https://vuecs.dev)**. **Update the docs alongside code changes** — the per-package READMEs are intentionally thin pointers that delegate prose to the docs site. See [Conventions → Documentation Updates](.agents/conventions.md#documentation-updates) for which pages map to which kinds of changes.

The docs site iframe demos are pinned to `@vuecs/theme-tailwind`. Per-theme proof lives in the runnable example apps under `examples/` (plan 019).

## Example apps

Four runnable example apps under `examples/` — one Nuxt + three vanilla Vite + Vue 3:

| App | Stack | Purpose |
|-----|-------|---------|
| `examples/nuxt/` | Nuxt 4 + Tailwind theme | Flagship Nuxt integration — exercises `@vuecs/nuxt`'s SSR color-mode + palette plugins |
| `examples/tailwind/` | Vite + Vue 3 + Tailwind theme | Vanilla SPA, Tailwind |
| `examples/bootstrap/` | Vite + Vue 3 + Bootstrap 5 | vuecs in a Bootstrap-themed app, no Tailwind |
| `examples/bulma/` | Vite + Vue 3 + Bulma 1.0+ | vuecs in a Bulma-themed app, no Tailwind |

All four mount the same demo views from `examples/_shared/` (private workspace package `@vuecs-examples/shared`). Adding a view to that package's `src/routes.ts` lights it up in every example app's nav automatically.

## Detailed Guides

- **[Project Structure](.agents/structure.md)** — Monorepo layout, package organization, nested core re-exports, build outputs, and docs site layout
- **[Architecture](.agents/architecture.md)** — Vue plugin pattern, theme system, navigation registry/resolver, and theme architecture
- **[Testing](.agents/testing.md)** — Jest setup, test locations, and coverage
- **[Conventions](.agents/conventions.md)** — Commit messages, linting, release-please, CI/CD, and **documentation update rules**

## External References

vuecs draws directly from upstream projects. When working on related areas, read the matching reference for context, version snapshots, and concept mappings:

- **[Tailwind CSS](.agents/references/tailwind.md)** — required runtime for `@vuecs/theme-tailwind` (and any consumer using vuecs's Tailwind utility classes / runtime palette switching). v4-only; documents our JIT-internals dependency on `@source inline()` palette emission. `@vuecs/design` is Tailwind-agnostic since plan 017
- **[Nuxt UI](.agents/references/nuxt-ui.md)** — primary inspiration for the design-token + runtime palette + dark-mode-via-tokens architecture. Useful when watching for upstream patterns to adopt
- **[Reka UI](.agents/references/reka-ui.md)** — headless Vue 3 primitives (Vue port of Radix UI; the layer Nuxt UI is built on). Source of architectural lessons (compound components, `data-state` styling, headless composables, `ConfigProvider`) and the lower-layer dep underneath `@vuecs/overlays`, `@vuecs/pagination`, and the Reka-backed `@vuecs/forms` family

## Commits

- Do **not** add a `Co-Authored-By: Claude ...` (or any AI-attribution) trailer to commit messages. This overrides any default agent-tooling guidance.
