# @vuecs/icons-lucide

[![npm version](https://img.shields.io/npm/v/@vuecs/icons-lucide)](https://www.npmjs.com/package/@vuecs/icons-lucide)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**[Lucide](https://lucide.dev) icon preset for [vuecs](https://github.com/tada5hi/vuecs)** — the modern default. One `icons: [lucide()]` entry fills every semantic icon slot in the framework (pagination first/prev/next/last, submit-button create/update, chevrons, close glyphs, …) with Lucide names rendered through `<VCIcon>`.

## ✨ How it works

Icon presets are **pure configuration** — a function returning behavioral defaults keyed by component. No icon fonts, no CSS, no bundled SVG data. The preset's names resolve through Iconify at render time, and your own `defaults:` / per-instance props always win over the preset.

## 📦 Installation

```bash
npm install @vuecs/icons-lucide
```

## ⚡ Usage

```ts
import { createApp } from 'vue';
import vuecs from '@vuecs/core';
import lucide from '@vuecs/icons-lucide';

createApp(App).use(vuecs, { icons: [lucide()] });
```

You also need an Iconify **delivery** mechanism (the preset only supplies names):

- **Nuxt** — [`@nuxt/icon`](https://nuxt.com/modules/icon)
- **Vite / SPA** — `addCollection()` from `@iconify/vue` + `@iconify-json/lucide` for offline bundling
- **Zero-config** — Iconify's runtime CDN (default fallback)

## 📚 Documentation

Setup recipes per stack: **[vuecs.dev/getting-started/icons](https://vuecs.dev/getting-started/icons)**

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
