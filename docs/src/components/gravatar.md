# Gravatar

Renders a [Gravatar](https://gravatar.com) avatar from an email address. Built on top of [`<VCAvatar>`](/components/avatar) (`@vuecs/elements`) — gets the image-load fallback story for free.

::: warning Breaking change — major bump on next release
The rendered DOM changed from `<img class="vc-gravatar">` to `<span class="vc-gravatar"><img /></span>` (the wrapper from `<VCAvatar>`). Consumers styling against `img.vc-gravatar` need to retarget the new shape. The `gravatar` theme key still applies — its classes now compose onto the wrapper via `extend()`.

The change is shipped via a `feat!:` commit so release-please will produce the major bump automatically.
:::

```bash
npm install @vuecs/gravatar @vuecs/elements
```

## Basic usage

<Demo name="gravatar">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCGravatar } from '@vuecs/gravatar';
</script>

<template>
    <VCGravatar email="user@example.com" :size="48" />
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

## Props (selection)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `email` | `string` | `''` | Email address (hashed client-side via MD5) |
| `hash` | `string` | `''` | Pre-computed MD5 hash — bypasses `email` if set |
| `size` | `number` | `80` | Image size in pixels (square) |
| `defaultImg` | `string` | `'retro'` | Gravatar's built-in placeholder when the email has no associated avatar (`mp`, `identicon`, `monsterid`, `wavatar`, `retro`, `robohash`, `blank`) |
| `alt` | `string` | `'Avatar'` | Alt text for the rendered image |
| `delayMs` | `number` | `0` | Delay (ms) before the `#fallback` slot appears on network failure. Forwarded to `<VCAvatar>`. |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `fallback` | `{ class }` | Rendered when the Gravatar image fails to load (network error). Gravatar's `defaultImg` covers the "unknown email" case server-side; this slot only fires on client-side load failures. |

## Composition

`<VCGravatar>` is a thin wrapper around [`<VCAvatar>`](/components/avatar) that computes `src = https://www.gravatar.com/avatar/<md5(email)>?s=<size>&d=<defaultImg>` and forwards `alt` / `delayMs` / the `fallback` slot. Themeing the inner avatar — sizing, ring, hover state — happens on the `avatar` theme key; gravatar-specific overrides live on the `gravatar` key and compose onto the avatar wrapper via `extend()`.
