# Separator

Horizontal or vertical divider with proper ARIA semantics. Built on [Reka UI](https://reka-ui.com/)'s `Separator` primitive.

```bash
npm install @vuecs/elements
```

<Demo name="separator">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCSeparator } from '@vuecs/elements';
</script>

<template>
    <p>First section</p>
    <VCSeparator />
    <p>Second section</p>

    <div class="flex h-8 items-center gap-3">
        <span>Left</span>
        <VCSeparator orientation="vertical" />
        <span>Right</span>
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
</Demo>

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction. |
| `decorative` | `boolean` | `true` | When `true`, the separator is removed from the a11y tree (`role="none"`). Set `false` to expose it as `role="separator"` with `aria-orientation`. |
| `themeClass` | `Partial<SeparatorThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

## Theme keys

| Key | Default class | Notes |
|---|---|---|
| `root` | `vc-separator` | Sized off `data-orientation` (`horizontal` / `vertical`). |
