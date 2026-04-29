# Icon

`<VCIcon>` renders an Iconify icon by name. Thin wrapper around `@iconify/vue`'s `<Icon>` — every prop other than `name` is forwarded as an attr.

```bash
npm install @vuecs/icon
```

## Basic usage

```vue
<script setup lang="ts">
import { VCIcon } from '@vuecs/icon';
</script>

<template>
    <VCIcon name="lucide:plus" />
    <VCIcon name="lucide:save" class="text-green-500" />
    <VCIcon name="mdi:rocket" :width="32" :height="32" />
</template>
```

`<VCIcon>` is also globally registered when `@vuecs/icon`'s plugin is installed:

```ts
import { createApp } from 'vue';
import iconPlugin from '@vuecs/icon';

createApp(App).use(iconPlugin);
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | (required) | Iconify icon name (e.g. `'lucide:plus'`, `'mdi:rocket'`, `'fa6-solid:floppy-disk'`). |

All other attrs are forwarded to the underlying `<Icon>` component (`class`, `style`, `width`, `height`, color, …). See [@iconify/vue props](https://iconify.design/docs/icon-components/vue/) for the full attr list.

## How icons are resolved

`<VCIcon>` does not bundle any icon data. It resolves names through Iconify's runtime registry, which is populated by either:

- `@nuxt/icon` (Nuxt apps)
- A manual `addCollection()` call before mount (Vite / SPA)
- Iconify's CDN (lazy-loaded at runtime)

See [Icons setup](/getting-started/icons) for the full delivery recipes.

## See also

- [Icons setup](/getting-started/icons) — preset + delivery configuration
- [Pagination](/components/pagination) — example of icon-name props on a component
- [Button](/components/button) — `iconLeft` / `iconRight` props
