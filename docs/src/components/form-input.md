# FormInput

Text input with `v-model` binding and optional debounce.

```bash
npm install @vuecs/form-controls
```

## Basic usage

<Demo name="form-input">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCFormInput } from '@vuecs/form-controls';
import { ref } from 'vue';

const value = ref('');
</script>

<template>
    <VCFormInput v-model="value" placeholder="Enter your email" />
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";

/* Required only if you use the input-group variant (prepend/append). */
@import "@vuecs/form-controls";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Demo>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | The bound value |
| `type` | `string` | `'text'` | Native input type |
| `debounce` | `number` | `0` | Debounce input updates by N milliseconds |
| `group` | `boolean` | `false` | Render with input-group prepend/append wrappers |
| `groupPrepend` / `groupAppend` | `boolean` | `false` | Show prepend/append addon slots |
| `groupPrependContent` / `groupAppendContent` | `string` | — | Inline addon content (alternative to slots) |

`placeholder`, `disabled`, etc. are forwarded to the native `<input>` via `attrs`.

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number` | v-model update |

## See also

- [FormGroup wrapper for validation](/guide/theme-system) (forthcoming)
