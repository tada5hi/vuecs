<!-- NOTE: Keep this file and all corresponding files in the .agents directory updated as the project evolves. When making architectural changes, adding new patterns, or discovering important conventions, update the relevant sections. -->

# vuecs — Agent Guide

A Vue 3 component library monorepo providing reusable UI components (navigation, form controls, pagination, list controls, etc.) with TypeScript support, CSS extraction, and themes for Bootstrap, Tailwind, and Font Awesome. Published as scoped `@vuecs/*` packages on npm.

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
| `@vuecs/button` | General-purpose button (color/variant/size, loading, icon slots) | 0.0.0 |
| `@vuecs/core` | Theme system, global behavioral defaults, utilities, component infrastructure | 2.0.0 |
| `@vuecs/countdown` | Countdown/timer component | 1.0.1 |
| `@vuecs/design` | CSS design tokens (color scales, semantic aliases) + motion primitives (vanilla-CSS port of `tw-animate-css`) + runtime palette switcher + `usePalette` / `useColorMode` Vue composables | 0.0.0 |
| `@vuecs/form-controls` | Form input components (input, select, checkbox, textarea, range slider) plus the experimental `useSubmitButton()` helper for `@vuecs/button` | 2.5.0 |
| `@vuecs/gravatar` | Gravatar avatar component | 1.0.2 |
| `@vuecs/link` | Router-aware link component (vue-router/nuxt) | 1.0.1 |
| `@vuecs/list-controls` | List display controls | 2.0.1 |
| `@vuecs/navigation` | Multi-level navigation with NavigationManager | 2.4.1 |
| `@vuecs/nuxt` | Nuxt module — SSR palette + @vuecs/design auto-import | 0.0.0 |
| `@vuecs/overlays` | Compound overlays on Reka primitives — Modal (+ `useModal()` view-stack composable), Popover, Tooltip, DropdownMenu, ContextMenu | 0.0.0 |
| `@vuecs/pagination` | Pagination component | 1.3.1 |
| `@vuecs/theme-bootstrap-v4` | Bootstrap v4 theme | 1.0.1 |
| `@vuecs/theme-bootstrap-v5` | Bootstrap v5 theme | 2.0.1 |
| `@vuecs/theme-font-awesome` | Font Awesome icon theme | 1.1.1 |
| `@vuecs/theme-tailwind` | Tailwind CSS theme (exports `merge: ClassesMergeFn`) | 0.0.0 |
| `@vuecs/timeago` | Relative time display component | 1.1.2 |

### Dependency Layers

```
Layer 0 (no internal deps):  core, countdown, design, gravatar, link, timeago
Layer 1 (depends on core):   button, form-controls, list-controls, navigation, overlays, pagination
Layer 2 (depends on Layer 0): themes (@vuecs/core peer dep only — pure data that targets component packages at runtime)
Layer 3 (integration):       nuxt (depends on design + @nuxt/kit)
```

`navigation` also depends on `@vuecs/link`. `pagination` and `overlays` also take a runtime dep on `reka-ui` (they wrap Reka's headless primitives — pagination + dialog respectively). `theme-tailwind` is designed to pair with `@vuecs/design` (Tailwind v4 + CSS-variable tokens); `theme-bootstrap-v5` ships an optional bridge that maps Bootstrap's `--bs-*` theme vars onto the design-system tokens.

## Documentation Site

Public docs live in `docs/` (private workspace `@vuecs/docs`, VitePress) and are deployed to **[vuecs.dev](https://vuecs.dev)**. **Update the docs alongside code changes** — the per-package READMEs are intentionally thin pointers that delegate prose to the docs site. See [Conventions → Documentation Updates](.agents/conventions.md#documentation-updates) for which pages map to which kinds of changes.

## Detailed Guides

- **[Project Structure](.agents/structure.md)** — Monorepo layout, package organization, nested core re-exports, build outputs, and docs site layout
- **[Architecture](.agents/architecture.md)** — Vue plugin pattern, theme system, NavigationManager, and theme architecture
- **[Testing](.agents/testing.md)** — Jest setup, test locations, and coverage
- **[Conventions](.agents/conventions.md)** — Commit messages, linting, release-please, CI/CD, and **documentation update rules**

## External References

vuecs draws directly from upstream projects. When working on related areas, read the matching reference for context, version snapshots, and concept mappings:

- **[Tailwind CSS](.agents/references/tailwind.md)** — required runtime for `@vuecs/design` and `@vuecs/theme-tailwind`. v4-only; documents our JIT-internals dependency on `@source inline()` palette emission
- **[Nuxt UI](.agents/references/nuxt-ui.md)** — primary inspiration for the design-token + runtime palette + dark-mode-via-tokens architecture. Useful when watching for upstream patterns to adopt
- **[Reka UI](.agents/references/reka-ui.md)** — headless Vue 3 primitives (Vue port of Radix UI; the layer Nuxt UI is built on). Source of architectural lessons (compound components, `data-state` styling, headless composables, `ConfigProvider`) and the natural lower-layer dep for a future `@vuecs/overlays` package
