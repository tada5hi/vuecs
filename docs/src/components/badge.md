# Badge

Status pill. Variants (`solid` / `soft` / `outline`) compose with the standard semantic colors (primary / neutral / success / warning / error / info), mirroring `<VCButton>`. Pure-CSS — no Reka primitive.

`<VCBadge>` and `<VCTag>` are visually similar but semantically distinct: Badge is a static status indicator, Tag is a removable, value-bound chip (paired with `<VCFormTags>`).

```bash
npm install @vuecs/elements
```

<Playground name="badge">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCBadge } from '@vuecs/elements';

const colors = ['primary', 'neutral', 'success', 'warning', 'error', 'info'] as const;
const variants = ['solid', 'soft', 'outline'] as const;
</script>

<template>
    <!-- Color × variant grid: every (color, variant) cell renders. -->
    <div v-for="variant in variants" :key="variant">
        <VCBadge
            v-for="color in colors"
            :key="`${variant}-${color}`"
            :variant="variant"
            :color="color"
        >
            {{ color }}
        </VCBadge>
    </div>
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
</Playground>

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `'primary' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'neutral'` (theme default) | Semantic color. |
| `variant` | `'solid' \| 'soft' \| 'outline'` | `'soft'` (theme default) | Visual treatment. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size. |
| `tag` | `string` | `'span'` | HTML tag to render. |
| `themeClass` | `Partial<BadgeThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

## Theme keys

| Key | Default class | Notes |
|---|---|---|
| `root` | `vc-badge` | Pill element; variant + color drive bg / text classes via the variant system. |
