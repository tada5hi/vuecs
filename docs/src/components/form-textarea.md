# FormTextarea

Multi-line text input with `v-model` and optional debounce — same API surface as [FormInput](/components/form-input) but for `<textarea>`.

```bash
npm install @vuecs/forms
```

## Basic usage

<Playground name="form-textarea">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCFormTextarea } from '@vuecs/forms';
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
</Playground>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| null` | `''` | The bound value. `null` is accepted as the "unset" value for binding nullable entity fields |
| `debounce` | `number` | `0` | Debounce input updates by N milliseconds |

`rows`, `placeholder`, `disabled`, and any other native `<textarea>` attributes are forwarded via `attrs`.
