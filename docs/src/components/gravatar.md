<script setup>
import Gravatar from '../.vitepress/theme/demos/Gravatar.vue';
</script>

# Gravatar

Renders a [Gravatar](https://gravatar.com) avatar from an email address.

```bash
npm install @vuecs/gravatar
```

## Basic usage

<Demo>
  <Gravatar />

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
| `defaultImg` | `string` | — | Default fallback (`mp`, `identicon`, `monsterid`, `wavatar`, `retro`, `robohash`, `blank`) |
| `alt` | `string` | (via attrs) | Alt text — pass through `alt` HTML attribute |
