# FormSelectSearch

Searchable select for long option lists — type to filter by `label`, pick one (or many) without scrolling through hundreds of items. Uses the same `FormOption` shape as [`<VCFormSelect>`](/components/form-select).

```bash
npm install @vuecs/forms
```

## Basic usage

<Demo name="form-select-search">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import type { FormOption } from '@vuecs/forms';
import { VCFormSelectSearch } from '@vuecs/forms';
import { ref } from 'vue';

const value = ref<number | undefined>(undefined);

const options: FormOption<number>[] = [];
for (let i = 1; i <= 100; i++) {
    options.push({
        value: i,
        label: `Option ${i}`,
        description: i % 5 === 0 ? 'Multiple of 5' : undefined,
    });
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
 * input renders correctly but the dropdown popover has no styling.
 */
@import "@vuecs/forms";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Demo>

## Multiple selection

Bind an array to `modelValue` to switch into multi-select mode — there is no separate `multiple` prop, the shape of the bound value is what the component reads. In multi-select mode the component emits an array of `value` (the bound type `T`), not whole option objects.

<Demo name="form-select-search-multiple">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import type { FormOption } from '@vuecs/forms';
import { VCFormSelectSearch } from '@vuecs/forms';
import { ref } from 'vue';

const values = ref<number[]>([]);

const options: FormOption<number>[] = [];
for (let i = 1; i <= 50; i++) {
    options.push({ value: i, label: `Option ${i}` });
}
</script>

<template>
    <VCFormSelectSearch v-model="values" :options="options" />
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

## When to use this vs FormSelect

| Use | Component |
|-----|-----------|
| Fewer than ~10 options, single select | [`VCFormSelect`](/components/form-select) |
| Long option list, type-to-filter | `VCFormSelectSearch` (this page) |
| Multi-select with toggle UI | `VCFormSelectSearch` with array `v-model` |

## Search semantics

Filtering matches the `label` field with a case-insensitive `RegExp`. The optional `description` and `meta` fields are not searched today (consumers who need richer matching can pre-filter their `options` array).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `T \| T[] \| null \| undefined` | `undefined` | Bound value (single) or array (multi-select) |
| `options` | `FormOption<T>[]` | `[]` | Option list |
| `placeholder` | `string` | `'...'` | Input placeholder |
| `maxItems` | `number` | `10` | Max items rendered before infinite-scroll kicks in |
| `scrollDistance` | `number` | `10` | Scroll distance threshold for the next page |
| `disabled` | `boolean` | `false` | Disable the input |
| `closeOnSelect` | `boolean \| undefined` | `undefined` (mode-default) | Close the dropdown after a pick. Default: single closes, multi stays open. Set explicitly to override. |

## Slots

| Slot | Slot props | Description |
|------|------------|-------------|
| `selected` | `{ items, toggle }` | Custom selected-chips markup (rendered in multi-select mode only). `items` is the currently selected `FormOption[]`; invoke `toggle(option)` to deselect an option. Replaces the default removable chip buttons |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | single: `T \| null` &middot; multi: `T[]` | v-model update — emits values, not option objects |
| `change` | same as above | Emitted whenever the selection changes |

## See also

- [FormSelect](/components/form-select) — simpler dropdown for short lists; same `FormOption` shape
- [Theme System](/guide/theme-system)
