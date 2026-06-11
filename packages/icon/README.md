# @vuecs/icon

[![npm version](https://img.shields.io/npm/v/@vuecs/icon)](https://www.npmjs.com/package/@vuecs/icon)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**`<VCIcon>` — the icon runtime of [vuecs](https://github.com/tada5hi/vuecs).** A thin, vuecs-namespaced wrapper around [`@iconify/vue`](https://iconify.design/docs/icon-components/vue/)'s `<Icon>` that renders any of 200,000+ Iconify icons from a single string prop.

## ✨ What's inside

- 🪶 **One prop, every icon set** — `name="lucide:plus"`, `name="fa6-solid:user"`, `name="mdi:home"`; all other attrs forward to the underlying SVG.
- 🔌 **Powers vuecs's semantic icon slots** — components like `<VCPagination>` and `<VCButton>` take Iconify-name props and render them through `<VCIcon>`; [icon presets](https://github.com/tada5hi/vuecs/tree/master/icons) fill those slots app-wide.
- 📦 **No bundled icon data** — you choose the delivery mechanism: `@nuxt/icon` (Nuxt), `addCollection()` from an `@iconify-json/*` package (Vite/SPA), or Iconify's runtime CDN as the zero-config fallback.

## 📦 Installation

```bash
npm install @vuecs/icon
```

## ⚡ Usage

```vue
<VCIcon name="lucide:chevron-left" />
<VCIcon name="fa6-solid:rocket" class="text-xl" />
```

```ts
// Vite / SPA — bundle a collection offline (no CDN requests)
import { addCollection } from '@iconify/vue';
import { icons as lucide } from '@iconify-json/lucide';

addCollection(lucide);
```

## 📚 Documentation

Full reference + delivery recipes (Nuxt, Vite SSR, Vite SPA): **[vuecs.dev/components/icon](https://vuecs.dev/components/icon)** · [Icon setup guide](https://vuecs.dev/getting-started/icons)

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
