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
    <!-- displaySize drives the rendered chip; size is the URL `?s=` parameter -->
    <!-- (match it to displaySize × 2 for retina-crisp rendering). -->
    <VCGravatar email="alice@example.com" display-size="md" :size="80" alt="Alice's avatar" />
    <VCGravatar email="bob@example.com" display-size="md" :size="80" alt="Bob's avatar" />
    <VCGravatar email="charlie@example.com" display-size="md" :size="80" alt="Charlie's avatar" />
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

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `email` | `string` | `''` | Email address (hashed client-side via MD5) |
| `hash` | `string` | `''` | Pre-computed MD5 hash — bypasses `email` if set |
| `size` | `number` | `80` | Resolution served by Gravatar (URL `?s=` parameter, range 1–2048). **Does not** control rendered size — match it to your displayed dimensions (or 2× for retina) to avoid up/down-scaling. |
| `displaySize` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `undefined` | Visual size — forwards to `<VCAvatar :size>`. `xs` ≈ 24px, `sm` ≈ 32px, `md` ≈ 40px, `lg` ≈ 56px. Omit to fall back to the structural `vc-gravatar` 5rem (80px) baseline. Pair with a matching `size` (URL resolution) for crisp rendering: `<VCGravatar :size="80" display-size="md">`. |
| `defaultImg` | `string` | `'retro'` | Gravatar's built-in placeholder when the email has no associated avatar (`mp`, `identicon`, `monsterid`, `wavatar`, `retro`, `robohash`, `blank`) |
| `rating` | `string` | `'g'` | Gravatar's `r=` parameter — content rating filter (`g`, `pg`, `r`, `x`) |
| `alt` | `string` | `'Avatar'` | Alt text for the rendered image |
| `protocol` | `string` | `''` | URL protocol prefix (e.g. `'https'`). Empty means protocol-relative |
| `hostname` | `string` | `'www.gravatar.com'` | Gravatar service host — override for self-hosted Gravatar-compatible services |
| `delayMs` | `number` | `undefined` | Delay (ms) before the `#fallback` slot appears on network failure. Only strictly positive values are forwarded to `<VCAvatar>` (its underlying Reka `AvatarFallback` treats `0` as "wait forever"); omit to render the fallback immediately. |
| `themeClass` | `Partial<GravatarThemeClasses>` | `undefined` | Per-instance theme override — composed onto the `<VCAvatar>` wrapper via `extend()` |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `fallback` | `{ class }` | Renders while the Gravatar image is loading and persists if it fails. `delayMs` controls how long to wait before the fallback becomes visible (avoids flicker on fast connections); without `delayMs` it appears immediately. Note: Gravatar's `defaultImg` covers the "unknown email" case server-side, so the fallback typically only sticks around on actual network failures. |

## Composition

`<VCGravatar>` is a thin wrapper around [`<VCAvatar>`](/components/avatar) that computes the image URL as `<protocol>://<hostname>/avatar/<hash>?s=<size>&d=<defaultImg>&r=<rating>`, where `<hash>` is `props.hash` if set, else `md5(email.trim().toLowerCase())`. `protocol` and `hostname` default to `''` (protocol-relative) and `'www.gravatar.com'` respectively — override `hostname` for self-hosted Gravatar-compatible services. The component forwards `alt` / `delayMs` / the `fallback` slot to `<VCAvatar>`. Theming the inner avatar — sizing, ring, hover state — happens on the `avatar` theme key; gravatar-specific overrides live on the `gravatar` key and compose onto the avatar wrapper via `extend()`.

### Sizing

Visual size is decoupled from the served-image resolution:

- **Display** — `displaySize="xs" | "sm" | "md" | "lg"` forwards to `<VCAvatar :size>` and resolves to a theme-defined size (`xs` ≈ 24px, `sm` ≈ 32px, `md` ≈ 40px, `lg` ≈ 56px). Mirrors `<VCBadge>`'s size axis. For arbitrary pixel sizes, drop `displaySize` and use `:theme-class="{ root: extend('h-12 w-12') }"` (or any other size class). When neither is set, falls back to the structural `vc-gravatar` 5rem (80px) baseline so a bare `<VCGravatar>` keeps the historical default.
- **Resolution** — `size` (number, default 80) drives Gravatar's `?s=` URL parameter. Match it to your display size (or 2× for retina) so Gravatar serves a crisp image without wasted bandwidth. Recommended pairings:
  - `displaySize="sm"` → `:size="64"` (32px × 2)
  - `displaySize="md"` → `:size="80"` (40px × 2)
  - `displaySize="lg"` → `:size="112"` (56px × 2)

Don't ship `@vuecs/gravatar`'s structural CSS? Import it explicitly:

```css
@import "@vuecs/gravatar";
```
