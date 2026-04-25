<script setup>
import Link from '../.vitepress/theme/demos/Link.vue';
</script>

# Link

Router-aware anchor — picks `<NuxtLink>`, `<RouterLink>`, or a plain `<a>` automatically depending on the runtime context.

```bash
npm install @vuecs/link
```

## Basic usage

<Demo>
  <Link />

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCLink } from '@vuecs/link';
</script>

<template>
    <!-- External — renders <a target="_blank"> -->
    <VCLink href="https://github.com/tada5hi/vuecs" target="_blank">External</VCLink>

    <!-- Internal — renders <RouterLink>/<NuxtLink> when a router is installed -->
    <VCLink to="/components/">Internal</VCLink>

    <!-- Disabled — adds the `disabled` class and blocks click events -->
    <VCLink href="https://example.com" :disabled="true">Disabled</VCLink>
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Demo>

## Resolution rules

`<VCLink>` runtime-resolves which underlying component to render via Vue's `resolveDynamicComponent`:

1. If `to` is set AND `RouterLink` is registered → if `NuxtLink` is also registered, render `<NuxtLink>`; otherwise render `<RouterLink>`.
2. Otherwise (no `to`, or no router), render a plain `<a>` with `href` and `target` set.

For external links, set `href` directly and leave `to` empty — the component renders an `<a>` with your `target` value (defaults to `_self`; pass `target="_blank"` for new-tab links).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `to` | `string \| RouteLocationRaw` | — | vue-router target. Triggers `<RouterLink>` / `<NuxtLink>` rendering when set |
| `href` | `string` | — | Plain anchor URL — used when no `to` is provided, or appended with `query` |
| `target` | `string` | `'_self'` | Anchor target — applied only on the plain-`<a>` render path |
| `prefetch` | `boolean` | `true` | Forwarded to `<NuxtLink>` |
| `active` | `boolean` | `false` | Adds an `active` class to the rendered element |
| `disabled` | `boolean` | `false` | Adds `disabled` class and prevents click events |
| `query` | `LinkQuery` | — | Extra query params to merge into the URL |

Used internally by [Navigation](/components/navigation) for route-aware nav links.
