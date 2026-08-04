# Link

Router-aware anchor — picks `<NuxtLink>`, `<RouterLink>`, or a plain `<a>` automatically depending on the runtime context.

```bash
npm install @vuecs/link
```

## Basic usage

<Demo name="link">

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
| `to` | `string \| Record<string, any>` | — | vue-router target. Triggers `<RouterLink>` / `<NuxtLink>` rendering when set; the object form is a vue-router `RouteLocationRaw`-compatible location |
| `href` | `string` | — | Plain anchor URL — used when no `to` is provided, or appended with `query` |
| `target` | `string` | `'_self'` | Anchor target — applied only on the plain-`<a>` render path |
| `prefetch` | `boolean` | `true` | Forwarded to `<NuxtLink>` |
| `active` | `boolean` | `false` | Adds an `active` class to the rendered element |
| `disabled` | `boolean` | `false` | Adds `disabled` class and prevents click events |
| `query` | `LinkQuery` | — | Extra query params to merge into the URL |

`query` applies on **both** render paths: it is appended to `href` on the
plain-`<a>` path, and merged into `to` on the router path (for a string `to`
it is appended to the path; for an object `to` it is merged into `to.query`,
where an explicit key already on `to.query` wins).

```vue
<!-- renders <a href="/settings?ref=%2Faccount"> -->
<VCLink href="/settings" :query="{ ref: '/account' }">Settings</VCLink>

<!-- router path — to becomes { path: '/settings', query: { ref: '/account' } } -->
<VCLink :to="{ path: '/settings' }" :query="{ ref: '/account' }">Settings</VCLink>
```

## Types

`LinkProps` is the exported type of the prop table above. It is derived from
the component's own prop declaration via Vue's `ExtractPublicPropTypes`, so it
can never drift from what `<VCLink>` actually accepts:

```ts
import type { LinkProps, LinkQuery } from '@vuecs/link';

// A link descriptor threaded through your own data, then `v-bind`-ed.
const link: LinkProps = { to: '/password', query: { ref: '/account' } };
```

Because `LinkProps` declares its keys exactly, a misspelled prop is a compile
error rather than a silent no-op:

```ts
// ✗ Object literal may only specify known properties — the prop is `query`.
const broken: LinkProps = { to: '/x', queries: { a: '1' } };
```

If you additionally thread arbitrary fallthrough attributes (`class`,
`data-*`, `aria-*`) through the same object, widen at your own call site —
`LinkProps & Record<string, unknown>` — so the known props stay checked.

::: warning Replaces `LinkProperties`
`LinkProperties` was a separate, hand-maintained copy of this surface carrying
a `[key: string]: any` index signature. It had gone stale (it never listed
`query`) and its index signature accepted any typo. It has been removed —
import `LinkProps` instead. See
[#1705](https://github.com/tada5hi/vuecs/issues/1705).
:::

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | click event | Fires only on the `<RouterLink>` / `<NuxtLink>` render path. Suppressed when `disabled` |
| `clicked` | click event | Fires on every non-disabled click, regardless of render path (router link or plain `<a>`). Suppressed when `disabled` |

On the router-link path a click emits **both** events (`click` first, then `clicked`); on the plain-`<a>` path only `clicked` fires. Listen to `clicked` when you want a render-path-independent handler.

Used internally by [Navigation](/components/navigation) for route-aware nav links.
