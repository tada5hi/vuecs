# AspectRatio

Container that maintains a width / height ratio (16/9, 4/3, 1, custom). Built on [Reka UI](https://reka-ui.com/)'s `AspectRatio` primitive — useful for embeds, responsive images, and video thumbnails.

```bash
npm install @vuecs/elements
```

<Demo name="aspect-ratio">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCAspectRatio } from '@vuecs/elements';
</script>

<template>
    <VCAspectRatio :ratio="16 / 9">
        <img src="/my-image.jpg" alt="..." />
    </VCAspectRatio>

    <VCAspectRatio :ratio="1">
        <iframe src="https://example.com" />
    </VCAspectRatio>
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";
@import "@vuecs/elements";
```

:::

  </template>
</Demo>

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `ratio` | `number` | `1` | Desired width / height ratio (e.g. `16 / 9`, `4 / 3`, `1`). |
| `themeClass` | `Partial<AspectRatioThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

## Theme keys

| Key | Default class | Notes |
|---|---|---|
| `root` | `vc-aspect-ratio` | Wrapper that maintains the ratio via `padding-bottom`. |
