<script setup>
import FormTextarea from '../.vitepress/theme/demos/FormTextarea.vue';
</script>

# FormTextarea

Multi-line text input with `v-model` and optional debounce — same API surface as [FormInput](/components/form-input) but for `<textarea>`.

```bash
npm install @vuecs/form-controls
```

## Basic usage

<Demo>
  <FormTextarea />

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCFormTextarea } from '@vuecs/form-controls';
import { ref } from 'vue';

const value = ref('');
</script>

<template>
    <VCFormTextarea v-model="value" rows="4" placeholder="Type something..." />
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

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | The bound value |
| `debounce` | `number` | `0` | Debounce input updates by N milliseconds |

`rows`, `placeholder`, `disabled`, and any other native `<textarea>` attributes are forwarded via `attrs`.
