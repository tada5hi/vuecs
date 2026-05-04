# Avatar

Image with graceful fallback (initials, icon, or arbitrary slot). Built on [Reka UI](https://reka-ui.com/)'s `AvatarRoot` + `AvatarImage` + `AvatarFallback`. Reka handles the load-state dance — the fallback renders if the image is missing, fails, or is still loading.

```bash
npm install @vuecs/elements
```

<Demo name="avatar">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCAvatar } from '@vuecs/elements';
</script>

<template>
    <VCAvatar src="https://i.pravatar.cc/80?img=15" alt="User" />

    <!-- Image fails → fallback wins -->
    <VCAvatar src="https://invalid.example.com/x.jpg" alt="Broken">
        <template #fallback>AB</template>
    </VCAvatar>

    <!-- No src → fallback renders immediately -->
    <VCAvatar>
        <template #fallback>?</template>
    </VCAvatar>
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";
@import "@vuecs/elements";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Demo>

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | `undefined` | Image source. When omitted, the fallback renders immediately. |
| `alt` | `string` | `''` | Alt text for the image. Empty string = decorative; pass a meaningful value when the avatar conveys identity. |
| `delayMs` | `number` | `undefined` | Delay before the fallback appears — useful to avoid a flicker on fast connections. Only strictly positive values are forwarded to Reka (its `AvatarFallback` treats `0` as "wait forever"); omit to render the fallback immediately. |
| `size` | `'sm' \| 'md' \| 'lg'` | theme default (`md`) | Size variant. `sm` ≈ 32px, `md` ≈ 40px, `lg` ≈ 56px (theme-defined). For arbitrary pixel sizes, use `:theme-class="{ root: extend('h-12 w-12') }"` instead. Mirrors `<VCBadge>`'s size axis. |
| `themeClass` | `Partial<AvatarThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `fallback` | `{ class }` | Rendered when the image is absent or failed. Default: empty string. |

## Theme keys

| Key | Default class | Notes |
|---|---|---|
| `root` | `vc-avatar` | Outer wrapper. |
| `image` | `vc-avatar-image` | The `<img>` element. |
| `fallback` | `vc-avatar-fallback` | Fallback wrapper. |
