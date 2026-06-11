# @vuecs/theme-bulma

[![npm version](https://img.shields.io/npm/v/@vuecs/theme-bulma)](https://www.npmjs.com/package/@vuecs/theme-bulma)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**The Bulma 1.0+ theme for [vuecs](https://github.com/tada5hi/vuecs).** Native Bulma classes (`button is-primary`, `input`, `dropdown-content`, …) for every vuecs component — vuecs in a Bulma app, with no Tailwind anywhere in the stack.

## ✨ What's inside

- 🟢 **Full component coverage** — Bulma class mappings + variant matrices for every vuecs component family, with gap-fill CSS for patterns Bulma core doesn't ship (stepper, switch, card bands, sort indicators).
- 🌉 **Design-token bridge** — optional CSS (`@import "@vuecs/theme-bulma"`) wiring Bulma's `--bulma-*` variables onto `--vc-color-*`, so vuecs and Bulma-native components share one source of color truth.
- 🎛️ **Palette renderer** — declares a `palette.handle` hook against the shared 22-palette catalog: `useColorPalette().set(...)` re-tints Bulma's per-variant colors live (a precomputed HSL table works around Bulma's channel-based theming).
- 🌗 **Dark mode wired in** — a `colorMode.handle` hook mirrors vuecs's resolved mode onto Bulma's `data-theme` attribute (SSR-safe via `@vuecs/nuxt`).
- 🚫 **Tailwind-free** — pair with `@vuecs/design/standalone` for the palette catalog as plain CSS variables.

## 📦 Installation

```bash
npm install @vuecs/theme-bulma bulma
```

## ⚡ Usage

```css
/* main.css */
@import "bulma/css/bulma.css";
@import "@vuecs/design/standalone";
@import "@vuecs/theme-bulma";
```

```ts
import vuecs from '@vuecs/core';
import bulma from '@vuecs/theme-bulma';

app.use(vuecs, { themes: [bulma()] });
```

## 📚 Documentation

Full reference (including Bulma-specific mapping decisions): **[vuecs.dev/themes/bulma](https://vuecs.dev/themes/bulma)**

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
