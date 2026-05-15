# Introduction

**vuecs** is a Vue 3 **theming framework with shipped components**. Reframed: the components are the obvious surface, but the theming machinery underneath them is the value. Three layers:

1. **Theming machinery** (`@vuecs/core`). Every component reads its CSS classes through a four-layer resolution chain (defaults → themes → overrides → instance props) with structured variants and compound variants. The same machinery is exported for **third-party use** — your own `<MyDataTable>` registers a theme slot via `ThemeElements` declaration merging and resolves through the same manager that vuecs's primitives use. Consumers re-skin everything (vuecs + your library) through one `app.use(vuecs, …)` call.

2. **Design tokens + runtime palette switching.** Colors, radii, and semantic aliases live in CSS custom properties in `@vuecs/design` (concrete OKLCH defaults — works with or without Tailwind). `useColorPalette()` from `@vuecs/design` dispatches through whichever themes the app installs; a one-line `useColorPalette().set({ primary: 'green' })` re-tints every component on the page with no Vue re-render. `@vuecs/theme-tailwind` and `@vuecs/theme-bulma` contribute their renderers (`palette.handle`) against the **same 22-name palette catalog** — Bulma renders those names as HSL channel vars internally, but the stored payload is interchangeable across themes (so a single picker UI drives both).

3. **SSR-safe Nuxt integration.** `@vuecs/nuxt` wires color-mode + palette plumbing into Nuxt's `<head>` on the server, so first paint matches what the client computes — no FOUC, no hydration mismatch. One theme-agnostic module covers every theme; the runtime dispatches through whichever themes you install.

## Why another component library?

Because vuecs isn't (just) a component library. Most libraries pick a CSS framework upfront and bake it in. vuecs treats themes as **data**: a theme is a function returning a class-map, merged in array order against component defaults. That has two consequences:

- The same component renders correctly under Tailwind v4, Bootstrap 5, or Bulma 1.0+ — pick at consume time. Override individual slot classes via `app.use(vuecs, { overrides: ... })` or per-instance via `themeClass` / `themeVariant` props.
- **You can build on the same theme system.** A library author drops `useComponentTheme` into their own components, and downstream consumers reskin the union (vuecs + that library) with one config call. No fork; no parallel theme system.

## What's in the box

- **Components** — button, navigation (incl. stepper), pagination, forms (checkbox / switch / input / number / pin / radio / select / select-search / slider / tags / textarea), list, overlays (modal / popover / hover-card / tooltip / dropdown-menu / context-menu), elements (separator / tag / avatar / aspect-ratio / visually-hidden / badge), countdown, gravatar, link, timeago, icon.
- **Themes** — `@vuecs/theme-tailwind`, `@vuecs/theme-bootstrap`, `@vuecs/theme-bulma`. Cosmetic adapters that compose with the design-token layer.
- **Icons** — `@vuecs/icon` (`<VCIcon>`, Iconify-backed) plus presets (`@vuecs/icons-lucide`, `@vuecs/icons-font-awesome`) that map vuecs's semantic-slot defaults to specific icon vocabularies.
- **Design tokens** — `@vuecs/design` ships CSS variables, theme-aware `useColorPalette()`, and generic palette primitives.
- **Runtime palette** — `useColorPalette()` from `@vuecs/design` dispatches through installed themes' `palette.handle` hooks. `@vuecs/theme-tailwind` and `@vuecs/theme-bulma` each contribute a renderer against the **shared 22-name Tailwind palette catalog** (Bulma renders those names as HSL channel vars internally — payload is interchangeable, so a single picker UI drives both).
- **Nuxt module** — `@vuecs/nuxt` ships tokens + SSR-safe color mode + SSR-safe palette in one theme-agnostic module.
- **Example apps** — one Nuxt + three vanilla Vite + Vue 3 (Tailwind, Bootstrap, Bulma), all consuming a shared private workspace package of demo views. See `examples/` in the repo.

## Next steps

- [Installation](/getting-started/installation) — install packages and wire the plugin.
- [Theming](/getting-started/theming) — pick a theme, override slot classes, switch palette at runtime.
- [Dark Mode](/getting-started/dark-mode) — toggle `.dark` and let the design tokens flip everything.
- [Components](/components/) — browse the component catalog with live demos.
