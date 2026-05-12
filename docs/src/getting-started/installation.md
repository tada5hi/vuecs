# Installation

vuecs is published as a set of scoped npm packages. Install only what you use — each component package can be consumed standalone.

vuecs ships **concrete OKLCH design tokens** in `@vuecs/design` (matching Tailwind v4's palette) so the package works with or without Tailwind. The Tailwind theme adds utility classes and runtime palette switching on top; Bootstrap and Bulma users skip Tailwind entirely.

## Tailwind setup

The smallest Tailwind-flavored setup is `@vuecs/core` + the design tokens + the Tailwind theme:

```bash
npm install @vuecs/core @vuecs/design @vuecs/theme-tailwind
npm install -D tailwindcss @tailwindcss/vite
```

### Wire the plugin

```ts
// main.ts
import { createApp } from 'vue';
import vuecs from '@vuecs/core';
import tailwindTheme from '@vuecs/theme-tailwind';
import App from './App.vue';

createApp(App)
    .use(vuecs, { themes: [tailwindTheme()] })
    .mount('#app');
```

### Add the CSS imports

In your application stylesheet:

```css
@import "tailwindcss";
@import "@vuecs/design";
@import "@vuecs/theme-tailwind";
```

`@vuecs/design` registers the `--vc-color-*` design tokens. `@vuecs/theme-tailwind` rebinds those tokens to Tailwind palette names (so runtime `setColorPalette()` swaps work), exposes them as utility classes via `@theme` (`bg-primary-600`, `text-fg`, `border-border`), and force-includes all 22 Tailwind palettes via `@source inline()`.

## Bootstrap or Bulma setup

Skip Tailwind entirely. Install only the design tokens + your framework's theme bridge:

```bash
npm install @vuecs/core @vuecs/design @vuecs/theme-bootstrap
# or: @vuecs/theme-bulma
```

```css
@import "bootstrap/dist/css/bootstrap.css";
@import "@vuecs/design/standalone";
@import "@vuecs/theme-bootstrap";
```

`@vuecs/design`'s `/standalone` subpath inlines the full Tailwind v4 palette catalog (`--color-<palette>-*`, 22 palettes × 11 shades) on top of the default `--vc-color-*` tokens. These are the **source variables** that runtime palette renderers write against — without them, a `setColorPalette()` call would target undefined variables and silently no-op. The theme bridge maps `--bs-*` (or `--bulma-*`) onto `--vc-color-*` so vuecs components blend visually with the framework's chrome.

`setColorPalette()` itself ships from theme packages, not from `@vuecs/design`:

| Theme | Runtime palette API |
|---|---|
| `@vuecs/theme-tailwind` | `setColorPalette()` + `useColorPalette()` exported |
| `@vuecs/theme-bulma` | `setColorPalette()` + `useColorPalette()` exported |
| `@vuecs/theme-bootstrap` | No palette runtime ships today — compose `applyColorPaletteCss` from `@vuecs/design` directly, or install one of the above theme packages alongside |

::: tip
The base entry (`@vuecs/design`, ~3 KB) is enough if you only need the semantic-color defaults and don't plan to switch palettes at runtime. Reach for `/standalone` (~18 KB) when you want runtime palette switching to work without installing Tailwind.
:::

## Add component packages

Install each component package you want:

```bash
npm install @vuecs/forms @vuecs/navigation @vuecs/pagination
```

Each package re-installs the theme and defaults managers under the hood, so `app.use(vuecs, ...)` configures all of them at once. You can also `app.use(formControls)` individually if you prefer narrower plugin boundaries.

Some packages also ship structural CSS — checkbox switch variant, range-slider track and thumb, search-dropdown panel, nav tree-line. Import each you use:

```css
@import "@vuecs/forms";
@import "@vuecs/navigation";
@import "@vuecs/pagination";
```

These imports resolve to each package's `dist/style.css` via the `style` conditional export.

## Vue version

vuecs targets Vue 3.5+. There is no Vue 2 backport.

## TypeScript

vuecs ships TypeScript declarations in every package. The `ThemeElements` and `ComponentDefaults` interfaces are augmented via declaration merging when you import a component package — autocomplete and typo detection work in `app.use(vuecs, { overrides: ..., defaults: ... })` without extra setup.

## Frameworks beyond Vue

| Framework | Package | Notes |
|-----------|---------|-------|
| Nuxt 4 | [`@vuecs/nuxt`](/nuxt/) | Theme-agnostic Nuxt module — SSR color-mode + palette + tokens. Same module for every theme. |
| Vite + Vue | (no dedicated package) | Use `@vuecs/core` directly as shown above |
| Vue CLI / webpack | (no dedicated package) | Same as Vite — needs Tailwind v4 |

## Runnable example apps

The repository ships four example apps under `examples/` — fork any of them as a starting point:

| App | Stack | What it shows |
|-----|-------|----------------|
| `examples/nuxt/` | Nuxt 4 + `@vuecs/theme-tailwind` | Flagship Nuxt integration — single `@vuecs/nuxt` module, SSR-safe palette + color-mode |
| `examples/tailwind/` | Vite + Vue 3 + Tailwind | Vanilla SPA with the Tailwind theme; closest to a typical consumer setup without Nuxt |
| `examples/bootstrap/` | Vite + Vue 3 + Bootstrap 5 | vuecs in a Bootstrap-themed app, no Tailwind anywhere |
| `examples/bulma/` | Vite + Vue 3 + Bulma 1.0+ | vuecs in a Bulma-themed app, no Tailwind anywhere |

All four mount the same demo views from a shared private workspace package (`@vuecs-examples/shared`), so each app proves the same components render correctly under its theme.

## Next steps

- [Theming](/getting-started/theming) — pick a theme, override slot classes
- [Dark Mode](/getting-started/dark-mode) — toggle `.dark` and let tokens flip
