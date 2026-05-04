# Gravatar

Renders a [Gravatar](https://gravatar.com) avatar from an email address. Built on top of [`<VCAvatar>`](/components/avatar) (`@vuecs/elements`) — gets the image-load fallback story for free.

::: warning Breaking change — major bump on next release
The rendered DOM changed from `<img class="vc-gravatar">` to `<span class="vc-gravatar"><img /></span>` (the wrapper from `<VCAvatar>`). Consumers styling against `img.vc-gravatar` need to retarget the new shape. The `gravatar` theme key still applies — its classes now compose onto the wrapper via `extend()`.

The `size` prop's meaning narrowed: it now drives **only** the Gravatar URL's `?s=` parameter (i.e. the served-image resolution). Visual sizing is owned by CSS — the structural `vc-gravatar` class ships a 5rem (80px) default to preserve the historical look, and consumers override it via per-instance `themeClass` or the `gravatar.root` theme entry. Passing `:size="48"` no longer shrinks the rendered chip; pair it with `:theme-class="{ root: extend('h-12 w-12') }"` (or equivalent) when you want a smaller display.

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
@import "@vuecs/elements";
@import "@vuecs/gravatar";

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
| `size` | `number` | `80` | Resolution served by Gravatar (URL `?s=` parameter, range 1–2048). **Does not** control rendered size — match it to your displayed dimensions (or 2× for retina) to avoid up/down-scaling. Visual sizing lives in the theme system (default 5rem via the structural `vc-gravatar` class). |
| `defaultImg` | `string` | `'retro'` | Gravatar's built-in placeholder when the email has no associated avatar (`mp`, `identicon`, `monsterid`, `wavatar`, `retro`, `robohash`, `blank`) |
| `alt` | `string` | `'Avatar'` | Alt text for the rendered image |
| `delayMs` | `number` | `undefined` | Delay (ms) before the `#fallback` slot appears on network failure. Only strictly positive values are forwarded to `<VCAvatar>` (its underlying Reka `AvatarFallback` treats `0` as "wait forever"); omit to render the fallback immediately. |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `fallback` | `{ class }` | Renders while the Gravatar image is loading and persists if it fails. `delayMs` controls how long to wait before the fallback becomes visible (avoids flicker on fast connections); without `delayMs` it appears immediately. Note: Gravatar's `defaultImg` covers the "unknown email" case server-side, so the fallback typically only sticks around on actual network failures. |

## Composition

`<VCGravatar>` is a thin wrapper around [`<VCAvatar>`](/components/avatar) that computes the image URL as `<protocol>://<hostname>/avatar/<hash>?s=<size>&d=<defaultImg>&r=<rating>`, where `<hash>` is `props.hash` if set, else `md5(email.trim().toLowerCase())`. `protocol` and `hostname` default to `''` (protocol-relative) and `'www.gravatar.com'` respectively — override `hostname` for self-hosted Gravatar-compatible services. The component forwards `alt` / `delayMs` / the `fallback` slot to `<VCAvatar>`. Theming the inner avatar — sizing, ring, hover state — happens on the `avatar` theme key; gravatar-specific overrides live on the `gravatar` key and compose onto the avatar wrapper via `extend()`.

### Sizing

Visual size is decoupled from the served-image resolution:

- **Display** is set in CSS — the structural `vc-gravatar` class ships at 5rem (80px) and composes onto `<VCAvatar>`'s root via the `gravatar.root` theme entry. Override per-instance:
  ```vue
  <VCGravatar email="…" :theme-class="{ root: extend('h-12 w-12') }" />
  ```
  or globally via the `gravatar` theme key.
- **Resolution** is set via the `size` prop (drives Gravatar's `?s=` URL parameter). Match it to your display size (or 2× for retina) so Gravatar serves a crisp image without wasted bandwidth.

Don't ship `@vuecs/gravatar`'s structural CSS? Import it explicitly:

```css
@import "@vuecs/gravatar";
```
