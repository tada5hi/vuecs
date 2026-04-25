<script setup>
import FormSelect from '../.vitepress/theme/demos/FormSelect.vue';
</script>

# FormSelect

Dropdown select with `v-model` binding and configurable option shape.

```bash
npm install @vuecs/form-controls
```

## Basic usage

<Demo>
  <FormSelect />

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCFormSelect } from '@vuecs/form-controls';
import { ref } from 'vue';

const value = ref<string | null>(null);
const options = [
    { id: 'sm', value: 'Small' },
    { id: 'md', value: 'Medium' },
    { id: 'lg', value: 'Large' },
];
</script>

<template>
    <VCFormSelect v-model="value" :options="options" />
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

## Behavioral defaults

`VCFormSelect` resolves these via `useComponentDefaults` — set them globally in `app.use(vuecs, { defaults: ... })`:

| Key | Default | Description |
|-----|---------|-------------|
| `optionDefault` | `true` | Render a default empty option |
| `optionDefaultId` | `''` | Id of the default option |
| `optionDefaultValue` | `''` | Display text for the default option (e.g. `'-- Select --'`) |

See [Behavioral Defaults](/guide/behavioral-defaults) for the resolution rules.

## Props (selection)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | — | Bound option id |
| `options` | `{ id, value }[]` | — | Option list |
| `disabled` | `boolean` | `false` | Disable the select |
