# @vuecs/icons-lucide

[Lucide](https://lucide.dev) icon preset for vuecs. Maps vuecs's semantic-slot behavioral defaults (pagination prev/next/first/last, submit-button create/update, …) to Lucide Iconify names.

```bash
npm install @vuecs/icons-lucide
```

```ts
import { createApp } from 'vue';
import vuecs from '@vuecs/core';
import lucide from '@vuecs/icons-lucide';

createApp(App).use(vuecs, { icons: [lucide()] });
```

This preset is **configuration only** — it doesn't ship icon data. You also need an Iconify delivery mechanism (`@nuxt/icon`, `addCollection()` from `@iconify/vue`, or `unplugin-icons`). See [vuecs.dev/getting-started/icons](https://vuecs.dev/getting-started/icons) for setup recipes.
