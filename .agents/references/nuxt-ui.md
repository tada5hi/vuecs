# Nuxt UI Reference

vuecs's design-token + runtime palette architecture is **directly inspired by [Nuxt UI](https://github.com/nuxt/ui)**. The semantic-color naming, `setPalette()`-style runtime switcher, dark-mode-via-CSS-variables approach, and the structural-class-vs-theme-class split all map to ideas Nuxt UI shipped first. The key difference: Nuxt UI is Nuxt-only and ties itself to `tailwind-variants` + Tailwind v4 explicitly, while vuecs's theme system is **framework- and CSS-library-agnostic** — you can stack Bootstrap v4/v5 themes alongside the Tailwind one.

## Version Snapshot (as of 2026-04-25)

| | Version | Date | Commit |
|---|---------|------|--------|
| **Latest stable** | v4.7.0 | 2026-04-24 | — |
| **Latest v3.x** | — | 2026-02-16 | `ec6edfd` (`v3` branch HEAD) |
| **Default branch HEAD** | — | 2026-04-24 | `2e3fed2` |

Repo: <https://github.com/nuxt/ui>

## Concept Mapping (Nuxt UI → vuecs)

| Concept | Nuxt UI | vuecs |
|---------|---------|-------|
| **Semantic colors** | `primary`, `secondary`, `success`, `info`, `warning`, `error` (+ implicit `neutral`) | `primary`, `neutral`, `success`, `warning`, `error`, `info` (`SemanticScaleName`) |
| **Configured at install** | `nuxt.config.ts` → `ui.theme.colors: ['primary', 'success', …]` | `app.use(vuecs, { themes: [...] })` + `setPalette({ primary: 'green' })` |
| **Color → palette binding** | `app.config.ts` → `ui.colors.primary: 'green'` (build-time + runtime via `useAppConfig`) | `--vc-color-primary-* → var(--color-green-*)` rewrite via `<style id="vc-palette">` (runtime, no rebuild) |
| **Dark mode** | `.dark` class + token flips | `.dark` class + token flips (identical pattern, `@vuecs/design/assets/index.css`) |
| **Theme definition** | TypeScript factory → `{ slots, variants, compoundVariants, defaultVariants }` (consumed via `tv()` from `tailwind-variants`) | Same shape: `{ classes, variants, compoundVariants, defaultVariants }`. Resolution is custom (`@vuecs/core/src/theme/resolve.ts`) — no `tailwind-variants` dep |
| **Runtime palette switch** | Mutate `appConfig.ui.colors.primary` (Vue reactivity flushes new tokens) | `setPalette({ primary: 'green' })` writes/updates `<style id="vc-palette">` (idempotent, framework-agnostic) |
| **SSR safety** | Nuxt-native — palette comes from `appConfig` already SSR'd | `@vuecs/nuxt`'s `palette.server.ts` plugin emits the `<style>` block via `useHead` before first paint |
| **Color mode** | `@nuxtjs/color-mode` (separate module) | Bundled `useColorMode()` (`@vueuse/core` + Nuxt cookie); opt-out via `vuecs: { colorMode: false }` |

## Code Mapping

| Concept | Nuxt UI | vuecs |
|---------|---------|-------|
| **Module entry** | `src/module.ts` (defineNuxtModule) | `packages/nuxt/src/module.ts` |
| **Theme files (per component)** | `src/theme/<component>.ts` (factory functions returning slot/variant maps) | Theme classes co-located in `packages/theme-{tailwind,bootstrap-v4,bootstrap-v5,font-awesome}/src/index.ts` |
| **Component slots/variants** | `src/runtime/components/<Component>.vue` references theme via `useUI()` | `packages/<component>/src/component.ts` calls `useComponentTheme(name, props, defaults)` |
| **Color config** | `app.config.ts` `ui.colors` (build-time hint + runtime) | `packages/design/src/palette.ts` `setPalette()` — pure runtime |
| **Composables** | `useUI()`, `useAppConfig()`, `useColorMode()` | `useComponentTheme()`, `useComponentDefaults()`, `usePalette()`, `useColorMode()` |
| **Token CSS** | Generated at build into `_dts.css` / `tailwind-variants` artifacts | Hand-written `packages/design/assets/index.css` (`:root` + `.dark` + `@theme`) |

## Architectural divergences worth knowing

### What we kept from Nuxt UI
- The semantic-scale model (`primary`, `success`, etc.) decoupling component look from concrete palette
- Dark mode via class-based token flips, not per-component dark variants
- Runtime palette switch as a one-line API instead of a build-time concern
- Per-component theme as `{ slots, variants, compoundVariants, defaultVariants }`

### What we changed
- **No `tailwind-variants` dependency.** vuecs ships its own pure resolver in `@vuecs/core/src/theme/resolve.ts` + `variant.ts`. Bootstrap and custom themes work the same way Tailwind themes do.
- **Themes are data, not code.** Nuxt UI themes are TS factories that return slot/variant objects after reading module options. vuecs themes are plain objects (`Theme`) with no Nuxt module dependency — installable in any Vue app.
- **Multi-theme stacking.** vuecs accepts an array of themes (`{ themes: [tailwind(), fontAwesome()] }`). Nuxt UI is single-themed.
- **Runtime palette as `<style>` block.** `setPalette()` writes a plain CSS `<style id="vc-palette">` instead of mutating an `appConfig` ref. Works in any framework, not just Nuxt.
- **`@vuecs/design` is standalone.** Nuxt UI bakes the design tokens into its module. vuecs ships them in a separate package with no Vue dependency — Bootstrap consumers and custom themes both link against it.
- **Smaller surface.** Nuxt UI ships ~80 components; vuecs ships ~13 focused on data-entry / nav / display.

### What Nuxt UI has that we don't
- A bigger component library (data tables, modals, tooltips, calendar, etc.)
- Built-in tailwind-variants integration with autocomplete in templates
- App-config reactivity baked in via `useAppConfig`
- Comprehensive Storybook / Compodium tooling
- Production-grade SSR + auto-imports across more surface

## Areas to Watch

When Nuxt UI ships major versions, review for:
- New semantic-scale additions (e.g. `tertiary`, `accent`) — worth considering for `SemanticScaleName`
- Changes to the runtime-palette mechanism (e.g. moving away from `appConfig` toward `<style>` injection like ours)
- `tailwind-variants` patterns that solve problems our resolver doesn't yet (compound-slot variants, slot-level defaults)
- Theme-level type-safety improvements — if Nuxt UI ships a way to derive slot keys from component types, see if it fits our `ThemeElements` augmentation
- SSR + `useColorMode` evolutions — our Nuxt module mirrors theirs and should track API changes
- Accessibility patterns (ARIA, focus management) — Nuxt UI is well-audited; we benefit from copying their primitives
- New "App" wrapper component / global config — Nuxt UI v3 introduced `<UApp>`; we've intentionally not added a wrapper component yet but may need one for global locale / RTL config
