# FormSelectSearch

Searchable select for long option lists — type to filter, pick one (or many) without scrolling through hundreds of items.

```bash
npm install @vuecs/form-controls
```

## Basic usage

<Demo name="form-select-search">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCFormSelectSearch } from '@vuecs/form-controls';
import type { FormSelectOption } from '@vuecs/form-controls';
import { ref } from 'vue';

const value = ref<string | number | null>(null);

const options: FormSelectOption[] = [];
for (let i = 1; i <= 100; i++) {
    options.push({ id: i, value: `Option ${i}` });
}
</script>

<template>
    <VCFormSelectSearch v-model="value" :options="options" />
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";

/*
 * Dropdown panel + item-row structural CSS. Without this import the
 * input renders correctly but the dropdown popover has no styling and
 * the item rows aren't clickable visually.
 */
@import "@vuecs/form-controls";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Demo>

## Multiple selection

Bind an array to `modelValue` to switch into multi-select mode — there is no separate `multiple` prop, the shape of the bound value is what the component reads. In multi-select mode the component pushes the full `FormSelectOption` object (with `id` and `value`) onto the array:

<Demo name="form-select-search-multiple">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCFormSelectSearch } from '@vuecs/form-controls';
import type { FormSelectOption } from '@vuecs/form-controls';
import { ref } from 'vue';

const values = ref<FormSelectOption[]>([]);

const options: FormSelectOption[] = [];
for (let i = 1; i <= 50; i++) {
    options.push({ id: i, value: `Option ${i}` });
}
</script>

<template>
    <VCFormSelectSearch v-model="values" :options="options" />
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";

/* Same imports as the basic case — multi-select uses the same dropdown CSS. */
@import "@vuecs/form-controls";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Demo>

## When to use this vs FormSelect

| Use | Component |
|-----|-----------|
| Fewer than ~10 options, single select | [`VCFormSelect`](/components/form-select) |
| Long option list, type-to-filter | `VCFormSelectSearch` (this page) |
| Multi-select with toggle UI | `VCFormSelectSearch` with array `v-model` |

## Props (selection)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number \| FormSelectOption \| FormSelectOption[]` | `''` | Selected option id (single) or array (multi-select) |
| `options` | `FormSelectOption[]` | `[]` | Option list |
| `placeholder` | `string` | `'...'` | Input placeholder |
| `maxItems` | `number` | `10` | Max items rendered before infinite-scroll kicks in |
| `scrollDistance` | `number` | `10` | Scroll distance threshold for the next page |
| `disabled` | `boolean` | `false` | Disable the input |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | single: `string \| number` &middot; multi: `FormSelectOption[]` | v-model update. In multi-select mode the component pushes the full option object onto the array (not just the id). |
| `change` | `FormSelectOption \| FormSelectOption[]` | Emitted whenever the selection changes |

## See also

- [FormSelect](/components/form-select) — simpler dropdown for short lists
- [Theme System](/guide/theme-system)
