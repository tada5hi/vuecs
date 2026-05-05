# Introduction

**vuecs** is a Vue 3 component library focused on three things:

1. **Themeable, layered class resolution.** Every component reads its CSS classes through a four-layer resolution chain (defaults → themes → overrides → instance props), with structured variants and compound variants. You can drop in a Tailwind, Bootstrap v5, or Bootstrap v4 theme — or write your own — without forking the components.

2. **Design tokens, runtime palette switching (Tailwind).** Colors, radii, and semantic aliases live in CSS custom properties in `@vuecs/design` (concrete OKLCH defaults — works with or without Tailwind). For Tailwind users, `@vuecs/theme-tailwind` adds a one-line `setColorPalette({ primary: 'green' })` that re-tints every component on the page with no Vue re-render.

3. **SSR-safe Nuxt integration.** `@vuecs/nuxt` wires color-mode plumbing into Nuxt's `<head>` on the server, so first paint matches what the client computes — no FOUC, no hydration mismatch. Tailwind apps add `@vuecs/theme-tailwind-nuxt` for the same SSR guarantees on palette switching.

## Why another component library?

Most Vue libraries make you pick a CSS framework upfront and bake it in. vuecs treats themes as **data**: a theme is a function returning a class-map, merged in array order against component defaults. That means:

- The same component renders correctly under Bootstrap v5, Bootstrap v4, or Tailwind v4 — pick at consume time.
- Override individual slot classes from `app.use(vuecs, { overrides: ... })` without touching component source.
- Per-instance overrides via `themeClass` and `themeVariant` props for one-off variations.

## What's in the box

- **Components** — form controls, navigation, pagination, list controls, countdown, gravatar, link, timeago, icon.
- **Themes** — `@vuecs/theme-tailwind`, `@vuecs/theme-bootstrap`, `@vuecs/theme-bulma`.
- **Icons** — `@vuecs/icon` (`<VCIcon>`, Iconify-backed) plus presets (`@vuecs/icons-lucide`, `@vuecs/icons-font-awesome`) that map vuecs's semantic-slot defaults to specific icon vocabularies.
- **Design tokens** — `@vuecs/design` ships CSS variables + theme-agnostic generic palette primitives.
- **Tailwind palette runtime** — `@vuecs/theme-tailwind` ships `setColorPalette()` / `useColorPalette()` for Tailwind's catalog.
- **Nuxt modules** — `@vuecs/nuxt` (color mode + tokens) and `@vuecs/theme-tailwind-nuxt` (SSR-safe palette).

## Next steps

- [Installation](/getting-started/installation) — install packages and wire the plugin.
- [Theming](/getting-started/theming) — pick a theme, override slot classes, switch palette at runtime.
- [Dark Mode](/getting-started/dark-mode) — toggle `.dark` and let the design tokens flip everything.
- [Components](/components/) — browse the component catalog with live demos.
