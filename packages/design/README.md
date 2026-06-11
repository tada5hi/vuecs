# @vuecs/design

[![npm version](https://img.shields.io/npm/v/@vuecs/design)](https://www.npmjs.com/package/@vuecs/design)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**The design-token layer of [vuecs](https://github.com/tada5hi/vuecs)** — OKLCH color scales, dark mode, motion primitives, and a runtime palette engine. Theme-agnostic by design: works with Tailwind, Bootstrap, Bulma, or no CSS framework at all.

## ✨ What's inside

- 🎨 **Semantic color scales** — `--vc-color-{primary,neutral,success,warning,error,info}-{50…950}` with concrete OKLCH defaults from Tailwind v4's palette, plus semantic aliases (`bg`, `fg`, `border`, `ring`).
- 🌗 **Dark mode** — `useColorMode()` (`light` / `dark` / `system`, localStorage-persisted, `<html>` class sync) with token-level `.dark` flips; themes hook in via `colorMode.handle` to mirror `data-bs-theme` / `data-theme`.
- 🎛️ **Runtime palette switching** — `useColorPalette().set({ primary: 'emerald' })` rewrites the semantic scales live, dispatching through every installed theme's `palette.handle` renderer. 22 catalog palettes × 11 shades.
- 🎞️ **Motion primitives** — a vanilla-CSS port of `tw-animate-css` (`animate-in`, `fade-out-0`, `zoom-in-95`, `accordion-down`, …) usable from any theme; `prefers-reduced-motion` respected.
- 🧰 **Building blocks for theme authors** — `applyColorPaletteCss()`, `bindColorPalette<T>()`, `bindColorMode()`, `captureColorModeAttrs()` (SSR), and the canonical catalog vocabulary (`SEMANTIC_SCALES`, `COLOR_PALETTES`, `COLOR_PALETTE_SHADES`, `ColorPaletteConfig`).
- 🚫 **No Tailwind dependency** — the `/standalone` subpath inlines the full palette catalog as plain CSS variables for Bootstrap / Bulma / framework-free stacks.

## 📦 Installation

```bash
npm install @vuecs/design
```

## ⚡ Usage

```css
/* Tailwind app */
@import "tailwindcss";
@import "@vuecs/design";
@import "@vuecs/theme-tailwind";

/* Bootstrap / Bulma app — no Tailwind needed */
@import "bootstrap/dist/css/bootstrap.css";
@import "@vuecs/design/standalone";
@import "@vuecs/theme-bootstrap";
```

```ts
import { useColorMode, useColorPalette } from '@vuecs/design';

const { mode, resolved, isDark, toggle } = useColorMode();
const { current, set } = useColorPalette();

toggle();                       // light ↔ dark
set({ primary: 'emerald' });    // re-tint the whole app at runtime, persisted
```

## 📐 Subpath exports

| Subpath | Bundle size | Includes |
|---|---|---|
| `@vuecs/design` (default) | ~3 KB | `--vc-color-*` semantic scales, light/dark aliases, radius, motion |
| `@vuecs/design/standalone` | ~18 KB | Default **+** full `--color-<palette>-*` catalog (22 palettes × 11 shades) |
| `@vuecs/design/palettes.css` | ~14 KB | Palette catalog only |
| `@vuecs/design/animations.css` | ~12 KB | Motion primitives only |

Default and `/standalone` are mutually exclusive — load one, never both.

## 📚 Documentation

Full reference: **[vuecs.dev/guide/design-tokens](https://vuecs.dev/guide/design-tokens)** · [Dark mode](https://vuecs.dev/getting-started/dark-mode)

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
