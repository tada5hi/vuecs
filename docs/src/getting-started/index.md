# Introduction

**vuecs** is a Vue 3 component library focused on three things:

1. **Themeable, layered class resolution.** Every component reads its CSS classes through a four-layer resolution chain (defaults → themes → overrides → instance props), with structured variants and compound variants. You can drop in a Tailwind, Bootstrap v5, or Bootstrap v4 theme — or write your own — without forking the components.

2. **Design tokens, runtime palette switching.** Colors, radii, and semantic aliases live in CSS custom properties in `@vuecs/design`. Switching the primary palette is a one-line call (`setPalette({ primary: 'green' })`) and re-tints every component on the page with no Vue re-render.

3. **SSR-safe Nuxt integration.** `@vuecs/nuxt` wires the palette and color-mode plumbing into Nuxt's `<head>` on the server, so first paint matches what the client computes — no FOUC, no hydration mismatch.

## Why another component library?

Most Vue libraries make you pick a CSS framework upfront and bake it in. vuecs treats themes as **data**: a theme is a function returning a class-map, merged in array order against component defaults. That means:

- The same component renders correctly under Bootstrap v5, Bootstrap v4, or Tailwind v4 — pick at consume time.
- Override individual slot classes from `app.use(vuecs, { overrides: ... })` without touching component source.
- Per-instance overrides via `themeClass` and `themeVariant` props for one-off variations.

## What's in the box

- **Components** — form controls, navigation, pagination, list controls, countdown, gravatar, link, timeago.
- **Themes** — `@vuecs/theme-tailwind`, `@vuecs/theme-bootstrap-v5`, `@vuecs/theme-bootstrap-v4`, `@vuecs/theme-font-awesome`.
- **Design tokens** — `@vuecs/design` ships CSS variables + a runtime palette switcher.
- **Nuxt module** — `@vuecs/nuxt` ships SSR-safe palette + color-mode composables.

## Next steps

- [Installation](/getting-started/installation) — install packages and wire the plugin.
- [Theming](/getting-started/theming) — pick a theme, override slot classes, switch palette at runtime.
- [Dark Mode](/getting-started/dark-mode) — toggle `.dark` and let the design tokens flip everything.
- [Components](/components/) — browse the component catalog with live demos.
