# FormRadio

Radio button + group built on Reka UI's `RadioGroup` primitives. The group owns the `v-model` (single value); each item declares a `value` prop and renders a Reka `RadioGroupItem` + `RadioGroupIndicator`. Roving focus across siblings comes for free.

```bash
npm install @vuecs/forms
```

## Basic usage

<Demo name="form-radio">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCFormRadio, VCFormRadioGroup } from '@vuecs/forms';
import { ref } from 'vue';

const size = ref<string>('md');
</script>

<template>
    <VCFormRadioGroup v-model="size">
        <VCFormRadio value="sm" label-content="Small" />
        <VCFormRadio value="md" label-content="Medium" />
        <VCFormRadio value="lg" label-content="Large" />
    </VCFormRadioGroup>
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

## Options shorthand

For declarative use, pass `:options="FormOption[]"` to the group instead of compound children. The group renders one `<VCFormRadio>` per option automatically:

```vue
<VCFormRadioGroup
    v-model="size"
    :options="[
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
    ]"
/>
```

## Props (`<VCFormRadio>`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `AcceptableValue` | (required) | Bound value when this item is selected |
| `disabled` | `boolean` | `false` | Disable interaction; reflected as `data-disabled` |
| `id` | `string` | (auto) | Override the auto-generated id |
| `label` | `boolean` | `true` | Render the label wrapper |
| `labelContent` | `string` | (defaults system) | Inline label text |
| `themeClass` | `Partial<FormRadioThemeClasses>` | `undefined` | Per-instance theme override |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values |

## Props (`<VCFormRadioGroup>`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `AcceptableValue` | `undefined` | Currently selected value |
| `options` | `FormOption[]` | `undefined` | Optional declarative shorthand for compound children |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout + arrow-key direction |
| `loop` | `boolean` | `true` | Wrap arrow-key focus from last to first |
| `disabled` | `boolean` | `false` | Disable every item |
| `required` | `boolean` | `false` | Form-required attribute |
| `name` | `string` | `undefined` | Form-submission name |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `AcceptableValue` | Emitted on selection change |
