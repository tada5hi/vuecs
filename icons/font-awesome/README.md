# @vuecs/icons-font-awesome

[Font Awesome](https://fontawesome.com) icon preset for vuecs. Maps vuecs's semantic-slot behavioral defaults (pagination prev/next/first/last, submit-button create/update, …) to Font Awesome 6 Solid Iconify names.

Successor to `@vuecs/theme-font-awesome` — same Font Awesome visuals, but driven through `<VCIcon>` (Iconify) instead of CSS-class injection. Migrate by replacing `import fa from '@vuecs/theme-font-awesome'` + `themes: [fa()]` with `import fa from '@vuecs/icons-font-awesome'` + `icons: [fa()]`, then install `@iconify-json/fa6-solid` (or use `@nuxt/icon`).

```bash
npm install @vuecs/icons-font-awesome
```

```ts
import { createApp } from 'vue';
import vuecs from '@vuecs/core';
import fontAwesome from '@vuecs/icons-font-awesome';

createApp(App).use(vuecs, { icons: [fontAwesome()] });
```

This preset is **configuration only** — it doesn't ship icon data. You also need an Iconify delivery mechanism (`@nuxt/icon`, `addCollection()` from `@iconify/vue`, or `unplugin-icons`). See [vuecs.dev/getting-started/icons](https://vuecs.dev/getting-started/icons) for setup recipes.
