# FormCheckbox

Boolean checkbox with `v-model`. Supports a `switch` variant via `themeVariant`. The label text is set via the `label-content` prop or the named `#label` slot — there is no default slot.

```bash
npm install @vuecs/form-controls
```

## Basic usage

<Demo name="form-checkbox">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCFormInputCheckbox } from '@vuecs/form-controls';
import { ref } from 'vue';

const accepted = ref(false);
const notifications = ref(true);
</script>

<template>
    <VCFormInputCheckbox v-model="accepted" label-content="I accept the terms" />

    <VCFormInputCheckbox
        v-model="notifications"
        label-content="Enable notifications"
        :theme-variant="{ variant: 'switch' }"
    />
</template>
```

```css [CSS]
/* Tailwind v4 + design tokens */
@import "tailwindcss";
@import "@vuecs/design";

/*
 * The switch variant is shipped as structural CSS in @vuecs/form-controls.
 * Without this import the variant prop applies the class but the switch
 * appearance is missing — looks identical to the default checkbox.
 */
@import "@vuecs/form-controls";

/* Class-based dark mode (optional — pairs with the tokens) */
@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Demo>

## Custom label markup

Use the named `#label` slot to render the label as markup. The slot receives `class` (the resolved `label` class) and `id` (matching the input's `for`):

```vue
<VCFormInputCheckbox v-model="accepted">
    <template #label="{ class: labelClass, id }">
        <label :class="labelClass" :for="id">
            I accept the <a href="/terms">terms</a>
        </label>
    </template>
</VCFormInputCheckbox>
```

## Variants

| Variant key | Values | Default | Description |
|-------------|--------|---------|-------------|
| `variant` | `'checkbox'` \| `'switch'` | `'checkbox'` | Render as a square checkbox or a toggle switch |

The `switch` variant changes the visual presentation only — `v-model` still binds a boolean (or a value pushed onto an array when used with `:group="true"`).

## Behavioral defaults

| Key | Default | Description |
|-----|---------|-------------|
| `labelContent` | `'Input'` | Label text when neither `label-content` prop nor `#label` slot is provided |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean \| any[]` | — | The checked state (boolean) or selected values (with `:group`) |
| `value` | `any` (via attrs) | — | Value to push onto/remove from `modelValue` when `:group="true"` |
| `group` | `boolean` | `false` | Treat `modelValue` as an array of selected values |
| `label` | `boolean` | `true` | Render the label wrapper. Set `false` to render only the bare `<input>` |
| `labelContent` | `string` | (defaults system) | Inline label text — bypasses the `#label` slot |

## See also

- [FormSelectSearch](/components/form-select-search) — multi-select with a search input
- [Theme System](/guide/theme-system)
