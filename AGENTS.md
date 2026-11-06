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

- **Development Node.js**: 24.15+ on the 24.x line, or 26+ (CI runs on 24). Published runtime requirements are declared in each package manifest.
- **Package manager**: npm (workspaces)
- **Task runner**: Nx (caches build and test)

### Packages

Versions are owned by release-please — read them from `.release-please-manifest.json` (or each package's `package.json`), never from a table here.

| Area | Packages and boundary |
| --- | --- |
| Shared infrastructure | `core` owns themes, defaults, config, primitive wrappers and shared state helpers; `design` owns tokens, palette and color-mode primitives. |
| Stateful composition | `data`, `list`, `table` and `tree` preserve consumer entity types through props and slots. Data/list compatibility is structural, with no runtime dependency cycle. |
| Components | Button, forms, elements, navigation, overlays, pagination, placeholder, link, icon, gravatar, countdown and timeago packages expose component plugins plus named exports. |
| Theme and icon data | Bootstrap, Bulma and Tailwind themes provide classes/runtime hooks; icon presets map names without embedding icon data. |
| Integration | `nuxt` owns SSR color-mode, palette and locale integration; `locale` supplies the reactive source consumed by core. |

Read the [package contract inventory](.agents/topics/package-inventory.md) for the detailed public surfaces. New behavior must preserve the generic facade and parent-owned state contracts described in the architecture topics.

### Dependency Layers

```text
Layer 0 (no internal deps):  core, countdown, design, icon, link, timeago
Layer 1 (depends on core):   button, data, elements, forms, list, locale, navigation, overlays, pagination, placeholder, table, tree
Layer 1' (depends on elements + core):   gravatar (composes VCAvatar)
Layer 2 (depends on Layer 0): themes (@vuecs/core peer dep only — pure data that targets component packages at runtime)
                              theme-tailwind also depends on @vuecs/design (composes its generic palette primitives)
Layer 2': icons (@vuecs/core peer dep only — Iconify-name vocabularies for @vuecs/icon's <VCIcon>, registered via `app.use(vuecs, { icons: [...] })`)
Layer 3 (integration):       nuxt (depends on core + design + locale + @nuxt/kit) — theme-agnostic
```

`navigation` also depends on `@vuecs/link`. `data` takes a runtime dep on `smob` (the injectable deep-merge fn behind record patches / `mergeOnUpdated`) and keeps `@vuecs/list` as a **devDependency only** — the `<VCList :state>` binding is structural, so there is no runtime edge and no cycle. `locale` additionally depends on `@vueuse/core` (peer) for `useNavigatorLanguage` / `useStorage` — the same browser-environment building blocks `@vuecs/design` uses; it deliberately does NOT live in `@vuecs/design` because locale is not a design-token concern. `pagination`, `overlays`, `forms`, `elements`, `navigation`, `table`, and `tree` take a runtime dep on `reka-ui` (they wrap Reka's headless primitives — pagination, dialog/popover/hover-card/tooltip/menu, the form-input families, the atomic separator/avatar/aspect-ratio/visually-hidden elements, the stepper, `<Presence>`-driven expansion-row unmount delay, and `TreeRoot` / `TreeItem` for roving focus, typeahead and the visible-row flatten respectively). `theme-tailwind` is designed to pair with `@vuecs/design` (Tailwind v4 + CSS-variable tokens); `theme-bootstrap` and `theme-bulma` each ship an optional bridge mapping their framework's runtime CSS variables (`--bs-*`, `--bulma-*`) onto the design-system tokens. Nuxt consumers install `@vuecs/nuxt` regardless of theme; the module's palette / color-mode SSR plugins dispatch through whatever themes the user installs.

## Documentation Site

Public docs live in `docs/` (private workspace `@vuecs/docs`, VitePress) and are deployed to **[vuecs.dev](https://vuecs.dev)**. **Update the docs alongside code changes** — the per-package READMEs are intentionally thin pointers that delegate prose to the docs site. See [Conventions → Documentation Updates](.agents/conventions.md#documentation-updates) for which pages map to which kinds of changes.

The docs site iframe demos are pinned to `@vuecs/theme-tailwind`. Per-theme proof lives in the runnable example apps under `examples/`.

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


AGENTS.md is the loaded entry point and the guide index. Read the linked guides when working on their topics.
- **[Project Structure](.agents/structure.md)** — Monorepo layout, package organization, nested core re-exports, build outputs, and docs site layout
- **[Architecture](.agents/architecture.md)** — Vue plugin pattern, theme system, navigation registry/resolver, and theme architecture
- **[Testing](.agents/testing.md)** — Vitest setup, test inventory, Nx cache caveat, and the jsdom Reka recipe
- **[Conventions](.agents/conventions.md)** — Commit messages, linting, release-please, CI/CD, and **documentation update rules**

### Writing agent docs

Keep the guides factual and focused on contracts a future change could silently break.

- Keep existing commands, paths and factual descriptions current. Add guide content only for an invariant or cross-cutting rule. Put defect stories and verification details in the PR, and user-facing changes in the documentation site or release notes.
- Keep subsystem detail in `.agents/topics/` and link it from the relevant guide; do not import topic files into `CLAUDE.md`.
- Describe current behavior and cite issues or PRs, rather than local plan files or a running history of completed work.
- `npm run lint` enforces the shared config's agent-doc size, import-budget and history checks. Preserve the critical contracts when splitting a guide.

## External References

vuecs draws directly from upstream projects. When working on related areas, read the matching reference for context, version snapshots, and concept mappings:

- **[Tailwind CSS](.agents/references/tailwind.md)** — required runtime for `@vuecs/theme-tailwind` (and any consumer using vuecs's Tailwind utility classes / runtime palette switching). v4-only; documents our JIT-internals dependency on `@source inline()` palette emission. `@vuecs/design` remains theme-agnostic.
- **[Nuxt UI](.agents/references/nuxt-ui.md)** — primary inspiration for the design-token + runtime palette + dark-mode-via-tokens architecture. Useful when watching for upstream patterns to adopt
- **[Reka UI](.agents/references/reka-ui.md)** — headless Vue 3 primitives (Vue port of Radix UI; the layer Nuxt UI is built on). Source of architectural lessons (compound components, `data-state` styling, headless composables, `ConfigProvider`) and the lower-layer dep underneath `@vuecs/overlays`, `@vuecs/pagination`, and the Reka-backed `@vuecs/forms` family

## Commits

- Commits follow **[Conventional Commits](https://www.conventionalcommits.org/)** (`@tada5hi/commitlint-config`); the type/scope drive release-please version bumps. See [conventions.md](.agents/conventions.md#commit-convention).
- Versioning, `CHANGELOG.md`, `package.json` version, and `.release-please-manifest.json` are owned by **release-please** — do not hand-edit them.
- Do **not** add a `Co-Authored-By: Claude ...` (or any AI-attribution) trailer to commit messages. This overrides any default agent-tooling guidance.
- Do **not** add AI-attribution lines (e.g. `🤖 Generated with [Claude Code](...)`) to issue or pull request titles, bodies, or comments.
