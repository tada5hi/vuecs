# FormCheckbox

Boolean checkbox built on Reka UI's `Checkbox` primitive. `<VCFormCheckbox>` handles the single-value case (`v-model: boolean | 'indeterminate'`); wrap multiple checkboxes in `<VCFormCheckboxGroup>` for an array v-model.

For toggle-switch UI, use the dedicated [`<VCFormSwitch>`](/components/form-switch) component instead — Reka splits Checkbox and Switch into separate primitives for a reason (different ARIA semantics).

```bash
npm install @vuecs/forms
```

## Basic usage

<Demo name="form-checkbox">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCFormCheckbox, VCFormCheckboxGroup } from '@vuecs/forms';
import { ref } from 'vue';

const accepted = ref(false);
const indeterminateState = ref<boolean | 'indeterminate'>('indeterminate');
const selected = ref<string[]>(['a']);
</script>

<template>
    <VCFormCheckbox v-model="accepted" label-content="I accept the terms" />

    <VCFormCheckbox
        v-model="indeterminateState"
        label-content="Indeterminate (tri-state)"
    />

    <VCFormCheckboxGroup v-model="selected">
        <VCFormCheckbox value="a" label-content="Apples" />
        <VCFormCheckbox value="b" label-content="Bananas" />
        <VCFormCheckbox value="c" label-content="Cherries" />
    </VCFormCheckboxGroup>
</template>
```

```css [CSS]
/* Tailwind v4 + design tokens */
@import "tailwindcss";
@import "@vuecs/design";

/*
 * Structural CSS for the checkbox indicator + group container ships in
 * @vuecs/forms. Without this import the checked-state checkmark + group
 * layout helpers are missing.
 */
@import "@vuecs/forms";

/* Class-based dark mode (optional — pairs with the tokens) */
@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Demo>

## Custom label markup

Use the named `#label` slot to render the label as markup. The slot receives `class` (the resolved label class) and `id` (matching the checkbox's `for`):

```vue
<VCFormCheckbox v-model="accepted">
    <template #label="{ class: labelClass, id }">
        <label :class="labelClass" :for="id">
            I accept the <a href="/terms">terms</a>
        </label>
    </template>
</VCFormCheckbox>
```

## Custom indicator (checkmark)

Replace the default checkmark via the `#indicator` slot:

```vue
<VCFormCheckbox v-model="accepted">
    <template #indicator="{ class: indicatorClass }">
        <span :class="indicatorClass">✔</span>
    </template>
</VCFormCheckbox>
```

## Group v-model

`<VCFormCheckboxGroup>` wraps Reka's `CheckboxGroupRoot`. Each child `<VCFormCheckbox value="...">` automatically syncs with the group's array `v-model`; you don't need to thread `update:modelValue` manually.

```vue
<VCFormCheckboxGroup v-model="selected" orientation="horizontal">
    <VCFormCheckbox value="a" label-content="A" />
    <VCFormCheckbox value="b" label-content="B" />
</VCFormCheckboxGroup>
```

The group also enables roving focus (arrow keys to move between children) by default.

## Behavioral defaults

| Key | Default | Description |
|-----|---------|-------------|
| `labelContent` | `'Input'` | Label text when neither `label-content` prop nor `#label` slot is provided |

## Props (`<VCFormCheckbox>`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean \| 'indeterminate' \| null` | `undefined` | Checked state. Pass `'indeterminate'` for tri-state. |
| `value` | `unknown` | `undefined` | Value pushed onto the parent `<VCFormCheckboxGroup>`'s array v-model |
| `disabled` | `boolean` | `false` | Disables interaction; reflected as `data-disabled` |
| `required` | `boolean` | `false` | Native form-required attribute |
| `name` | `string` | `undefined` | Form-submission name |
| `id` | `string` | (auto) | Override the auto-generated id |
| `label` | `boolean` | `true` | Render the label wrapper. Set `false` for the bare checkbox |
| `labelContent` | `string` | (defaults system) | Inline label text — bypasses the `#label` slot |
| `themeClass` | `Partial<FormCheckboxThemeClasses>` | `undefined` | Per-instance theme overrides |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values |

## Props (`<VCFormCheckboxGroup>`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `unknown[]` | `undefined` | Selected values |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout + arrow-key direction |
| `loop` | `boolean` | `true` | Wrap arrow-key focus from last to first child |
| `rovingFocus` | `boolean` | `true` | Enable arrow-key roving focus across children |
| `disabled` | `boolean` | `false` | Disable every child |
| `required` | `boolean` | `false` | Form-required attribute |
| `name` | `string` | `undefined` | Form-submission name |

## See also

- [`<VCFormSwitch>`](/components/form-switch) — toggle switch (Reka `Switch` primitive)
- [Theme System](/guide/theme-system)
