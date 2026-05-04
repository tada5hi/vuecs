# FormNumber

Typed numeric input with stepper buttons, built on Reka UI's `NumberField` primitive. Locale-aware via `Intl.NumberFormatOptions`, snap-to-step, and proper `min` / `max` bounds. Cleaner than `<input type="number">` and consistent across browsers.

```bash
npm install @vuecs/forms
```

## Basic usage

<Playground name="form-number">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCFormNumber } from '@vuecs/forms';
import { ref } from 'vue';

const quantity = ref<number>(1);
const price = ref<number>(19.99);
</script>

<template>
    <VCFormNumber v-model="quantity" :min="0" :max="99" :step="1" />

    <VCFormNumber
        v-model="price"
        :min="0"
        :step="0.01"
        :format-options="{ style: 'currency', currency: 'USD' }"
    />
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
</Playground>

## Locale + currency formatting

`format-options` is forwarded to `Intl.NumberFormat`. Anything that constructor accepts works — `style: 'currency'`, `style: 'percent'`, `maximumFractionDigits`, etc. The `locale` prop overrides the document locale:

```vue
<VCFormNumber
    v-model="amount"
    :format-options="{ style: 'currency', currency: 'EUR' }"
    locale="de-DE"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number \| null` | `undefined` | Bound value |
| `min` | `number` | `undefined` | Lower bound (inclusive) |
| `max` | `number` | `undefined` | Upper bound (inclusive) |
| `step` | `number` | `1` | Increment per stepper click / arrow-key press |
| `stepSnapping` | `boolean` | `true` | Snap typed values to the nearest `step` |
| `focusOnChange` | `boolean` | `false` | Re-focus the input after stepper-driven changes |
| `formatOptions` | `Intl.NumberFormatOptions` | `undefined` | Display + parsing format |
| `locale` | `string` | `undefined` | BCP-47 locale for formatting |
| `steppers` | `boolean` | `true` | Render the ± stepper buttons |
| `disabled` | `boolean` | `false` | Disable interaction |
| `required` | `boolean` | `false` | Form-required attribute |
| `name` | `string` | `undefined` | Form-submission name |
| `id` | `string` | `undefined` | Root id |
| `themeClass` | `Partial<FormNumberThemeClasses>` | `undefined` | Per-instance theme override |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `number` | Emitted on user input or stepper click |
