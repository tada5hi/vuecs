# @vuecs/theme-tailwind

[![npm version](https://img.shields.io/npm/v/@vuecs/theme-tailwind)](https://www.npmjs.com/package/@vuecs/theme-tailwind)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**The Tailwind v4 theme for [vuecs](https://github.com/tada5hi/vuecs).** Utility-class mappings for every vuecs component, driven by `@vuecs/design` tokens — so dark mode and runtime palette switching come built in.

## ✨ What's inside

- 🎨 **Full component coverage** — class strings + variant matrices (`variant` × `color` × `size`) for every vuecs component family, including `data-[state=…]` animation hooks for overlays.
- 🧬 **Token-bound utilities** — exposes vuecs design tokens as Tailwind names via `@theme` (`bg-primary-600`, `text-fg`, `border-border`), so `.dark` flips and palette swaps reach every class.
- 🔀 **`twMerge` pre-wired** — ships as the theme's `classesMergeFn`, so `extend()` overrides merge without specificity fights; exported as `merge: ClassesMergeFn` for reuse.
- 🎛️ **Palette runtime** — `setColorPalette({ primary: 'emerald' })` + `renderColorPaletteStyles()`; contributes its renderer via `palette.handle` so `useColorPalette()` from `@vuecs/design` dispatches through it. All 22 Tailwind palettes are force-included via `@source inline()` so runtime swaps never hit tree-shaken colors.
- 🔐 **CSP-ready** — augments `Config['nonce']` for strict `style-src` policies.

## 📦 Installation

```bash
npm install @vuecs/theme-tailwind @vuecs/design
npm install -D tailwindcss @tailwindcss/vite
```

Requires **Tailwind CSS v4+**.

## ⚡ Usage

```css
/* main.css */
@import "tailwindcss";
@import "@vuecs/design";
@import "@vuecs/theme-tailwind";
```

```ts
import vuecs, { extend } from '@vuecs/core';
import tailwind, { merge } from '@vuecs/theme-tailwind';

app.use(vuecs, {
    themes: [tailwind()],
    overrides: {
        elements: { button: { classes: { root: extend('rounded-full') } } },
    },
});
```

```ts
import { useColorPalette } from '@vuecs/design';

useColorPalette().set({ primary: 'emerald' });   // live re-tint, no rebuild
```

Using Nuxt? [`@vuecs/nuxt`](https://vuecs.dev/nuxt/) handles SSR color mode + palettes for this theme automatically.

## 📚 Documentation

Full reference: **[vuecs.dev/themes/tailwind](https://vuecs.dev/themes/tailwind)**

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
