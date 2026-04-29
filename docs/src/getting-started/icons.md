# Icons

vuecs ships an Iconify-backed runtime component (`<VCIcon>`) plus icon-name presets that populate semantic icon-prop slots on components like `VCPagination`, `VCButton`, etc.

The icon system has three independent pieces:

1. **`<VCIcon>`** (`@vuecs/icon`) — runtime component that renders an icon by Iconify name.
2. **Presets** (`@vuecs/icons-lucide`, `@vuecs/icons-font-awesome`, …) — pure config: map vuecs's semantic-slot defaults (e.g. `pagination.prevIcon`, `submitButton.createIcon`) to Iconify names from a chosen collection.
3. **Icon delivery** — your responsibility. Iconify needs the actual icon data at runtime; pick the option that matches your stack (recipes below).

## Setup

```bash
npm install @vuecs/icon @vuecs/icons-lucide
```

```ts
// main.ts
import vuecs from '@vuecs/core';
import iconPlugin from '@vuecs/icon';
import lucide from '@vuecs/icons-lucide';

app.use(iconPlugin);          // registers <VCIcon> globally
app.use(vuecs, {
    icons: [lucide()],        // icon-name vocabulary
});
```

Configuring `icons:` populates **defaults**: every component prop that resolves an icon-name (e.g. `VCPagination`'s `prevIcon`) falls back to the preset's value when the prop is `undefined`. Per-instance icon-name props always win over the preset.

## Delivery options

`<VCIcon name="lucide:plus" />` looks up `'lucide:plus'` through Iconify's runtime registry. Something has to put the icon data in that registry first — that's the delivery step.

### Option 1 — Nuxt + `@nuxt/icon` (recommended for Nuxt apps)

Zero config and full SSR. `@nuxt/icon` intercepts Iconify lookups and hydrates icon data on demand from a CDN or a bundled collection.

```bash
npm install @nuxt/icon
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
    modules: ['@nuxt/icon', '@vuecs/nuxt'],
});
```

That's it. `<VCIcon name="lucide:plus" />` works in pages, layouts, and SSR.

### Option 2 — Manual `addCollection()` (Vite SPA, custom SSR, anything else)

Install the Iconify JSON package for the collection and register it before mounting:

```bash
npm install @iconify-json/lucide @iconify/vue
```

```ts
// main.ts
import { addCollection } from '@iconify/vue';
import lucideCollection from '@iconify-json/lucide/icons.json';

addCollection(lucideCollection);   // bundles every icon — ~3 MB raw JSON

import { createApp } from 'vue';
import App from './App.vue';
createApp(App).mount('#app');
```

The whole collection ships with your bundle. Tree-shaking only kicks in if you compile to per-icon modules (option 3).

### Option 3 — `unplugin-icons` (Vite, optimised builds)

For Vite consumers who want per-icon tree-shaken imports plus runtime fallback, [unplugin-icons](https://github.com/unplugin/unplugin-icons) auto-imports icons-as-components AND can register a runtime resolver so `<VCIcon>` keeps working. Setup is project-specific — see [unplugin-icons docs](https://github.com/unplugin/unplugin-icons#install).

Note: `<VCIcon>` always resolves names through Iconify's runtime registry. You still need an `addCollection()` step (or `@nuxt/icon`) for the runtime path; unplugin-icons alone does not register collections at runtime.

### Option 4 — Iconify CDN at runtime (lazy load)

Skip the bundle entirely; let Iconify fetch icons from `api.iconify.design` on demand. This is the default behavior of `@iconify/vue` if `addCollection()` is never called and the icon name has not been pre-registered. Best for prototypes; production apps usually want a bundled collection for offline support and consistent latency.

## Available presets

| Preset | Package | Default collection |
|--------|---------|---------------------|
| [Lucide](/icons/lucide) (recommended) | `@vuecs/icons-lucide` | `lucide:*` (`@iconify-json/lucide`) |
| [Font Awesome 6 Solid](/icons/font-awesome) | `@vuecs/icons-font-awesome` | `fa6-solid:*` (`@iconify-json/fa6-solid`) |

You can use any Iconify collection (`mdi`, `heroicons`, `tabler`, `simple-icons`, …) by passing the icon name directly to a component prop or to `<VCIcon name="…" />`. Presets exist purely to bulk-configure the semantic-slot defaults.

## Per-instance overrides

Every icon-name prop accepts a one-off override:

```vue
<VCPagination
    prev-icon="mdi:chevron-left"
    next-icon="mdi:chevron-right"
    :total="100" :offset="0" :limit="10"
/>
```

Pass `''` (empty string) to suppress the icon entirely while keeping the label visible.

## See also

- [`@vuecs/icon` component](/components/icon) — `<VCIcon>` reference
- [`@vuecs/icons-lucide`](/icons/lucide) — Lucide preset
- [`@vuecs/icons-font-awesome`](/icons/font-awesome) — Font Awesome preset
- [Theming](/getting-started/theming) — how icons fit alongside themes and tokens
