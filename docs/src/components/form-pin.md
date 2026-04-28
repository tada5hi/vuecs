# FormPin

PIN / OTP input built on Reka UI's `PinInput` primitive. Renders `length` single-character cells; user can paste a full code or type cell-by-cell. Supports `mask` (password dots), `otp` (mobile autofill from SMS), and a `'number'` type for numeric-only input.

```bash
npm install @vuecs/forms
```

## Basic usage

<Demo name="form-pin">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCFormPin } from '@vuecs/forms';
import { ref } from 'vue';

const code = ref<string[]>([]);
</script>

<template>
    <VCFormPin v-model="code" :length="6" type="number" otp />
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";

@import "@vuecs/forms";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Demo>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string[] \| number[] \| null` | `undefined` | Bound value array; element type matches `type` prop |
| `length` | `number` | `6` | Number of cells rendered |
| `type` | `'text' \| 'number'` | `'text'` | Input mode + element type of `modelValue` |
| `placeholder` | `string` | `''` | Per-cell placeholder character |
| `mask` | `boolean` | `false` | Render values as `<input type="password">` (dots) |
| `otp` | `boolean` | `false` | Set `autocomplete="one-time-code"` for mobile SMS autofill |
| `disabled` | `boolean` | `false` | Disable interaction |
| `required` | `boolean` | `false` | Form-required attribute |
| `name` | `string` | `undefined` | Form-submission name |
| `id` | `string` | `undefined` | Root id |
| `themeClass` | `Partial<FormPinThemeClasses>` | `undefined` | Per-instance theme override |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string[] \| number[]` | Emitted on every cell change |
| `complete` | `string[] \| number[]` | Emitted when every cell is filled |
