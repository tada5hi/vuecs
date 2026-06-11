# @vuecs/icons-font-awesome

[![npm version](https://img.shields.io/npm/v/@vuecs/icons-font-awesome)](https://www.npmjs.com/package/@vuecs/icons-font-awesome)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**[Font Awesome](https://fontawesome.com) icon preset for [vuecs](https://github.com/tada5hi/vuecs).** One `icons: [fontAwesome()]` entry fills every semantic icon slot in the framework (pagination first/prev/next/last, submit-button create/update, chevrons, close glyphs, …) with Font Awesome 6 Solid names rendered through `<VCIcon>`.

## ✨ How it works

Icon presets are **pure configuration** — a function returning behavioral defaults keyed by component. No icon fonts, no CSS, no bundled SVG data. The preset's names resolve through Iconify at render time, and your own `defaults:` / per-instance props always win over the preset.

## 📦 Installation

```bash
npm install @vuecs/icons-font-awesome
```

## ⚡ Usage

```ts
import { createApp } from 'vue';
import vuecs from '@vuecs/core';
import fontAwesome from '@vuecs/icons-font-awesome';

createApp(App).use(vuecs, { icons: [fontAwesome()] });
```

You also need an Iconify **delivery** mechanism (the preset only supplies names):

- **Nuxt** — [`@nuxt/icon`](https://nuxt.com/modules/icon)
- **Vite / SPA** — `addCollection()` from `@iconify/vue` + `@iconify-json/fa6-solid` for offline bundling
- **Zero-config** — Iconify's runtime CDN (default fallback)

## 🔄 Migrating from `@vuecs/theme-font-awesome`

Same Font Awesome visuals, now driven through `<VCIcon>` (Iconify) instead of CSS-class injection:

```diff
- import fa from '@vuecs/theme-font-awesome';
- app.use(vuecs, { themes: [fa()] });
+ import fa from '@vuecs/icons-font-awesome';
+ app.use(vuecs, { icons: [fa()] });
```

…then install `@iconify-json/fa6-solid` (or use `@nuxt/icon`).

## 📚 Documentation

Setup recipes per stack: **[vuecs.dev/getting-started/icons](https://vuecs.dev/getting-started/icons)**

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
