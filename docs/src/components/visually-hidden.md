# VisuallyHidden

A11y helper — content visible to screen readers, hidden visually. Built on [Reka UI](https://reka-ui.com/)'s `VisuallyHidden` primitive. Use this to label icon-only buttons, supplement decorative imagery, or expose state changes for assistive tech.

```bash
npm install @vuecs/elements
```

<Demo name="visually-hidden">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCVisuallyHidden } from '@vuecs/elements';
</script>

<template>
    <button type="button">
        <span aria-hidden="true">×</span>
        <VCVisuallyHidden>Close dialog</VCVisuallyHidden>
    </button>
</template>
```

:::

  </template>
</Demo>

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `string` | `'span'` | HTML tag to render. |
