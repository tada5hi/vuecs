# Installation

vuecs is published as a set of scoped npm packages. Install only what you use — each component package can be consumed standalone.

## Minimal setup

The smallest workable setup is `@vuecs/core` + a theme + the design tokens:

```bash
npm install @vuecs/core @vuecs/theme-tailwind @vuecs/design
```

Add Tailwind v4 (peer dep of `@vuecs/theme-tailwind`):

```bash
npm install -D tailwindcss @tailwindcss/vite
```

## Wire the plugin

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

## Add the design tokens to your CSS

In your application stylesheet:

```css
@import "tailwindcss";
@import "@vuecs/design";
```

That's it. The `@vuecs/design` import registers the CSS variables (`--vc-color-primary-*`, `--vc-color-bg`, etc.) and the Tailwind v4 `@theme` block that exposes them as utility classes (`bg-primary-600`, `text-fg`, `border-border`).

## Add component packages

Install each component package you want:

```bash
npm install @vuecs/form-controls @vuecs/navigation @vuecs/pagination
```

Each package re-installs the theme and defaults managers under the hood, so `app.use(vuecs, ...)` configures all of them at once. You can also `app.use(formControls)` individually if you prefer narrower plugin boundaries.

Some packages also ship structural CSS — checkbox switch variant, range-slider track and thumb, search-dropdown panel, nav tree-line. Import each you use:

```css
@import "@vuecs/form-controls";
@import "@vuecs/list-controls";
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
| Nuxt 4 | [`@vuecs/nuxt`](/nuxt/) | Auto-imports composables, SSR-safe palette + color-mode |
| Vite + Vue | (no dedicated package) | Use `@vuecs/core` directly as shown above |
| Vue CLI / webpack | (no dedicated package) | Same as Vite — needs Tailwind v4 |

## Next steps

- [Theming](/getting-started/theming) — pick a theme, override slot classes
- [Dark Mode](/getting-started/dark-mode) — toggle `.dark` and let tokens flip
