# FormCheckbox

Boolean checkbox built on Reka UI's `Checkbox` primitive. `<VCFormCheckbox>` handles the single-value case (`v-model: boolean | 'indeterminate'`); wrap multiple checkboxes in `<VCFormCheckboxGroup>` for an array v-model.

For toggle-switch UI, use the dedicated [`<VCFormSwitch>`](/components/form-switch) component instead — Reka splits Checkbox and Switch into separate primitives for a reason (different ARIA semantics).

```bash
npm install @vuecs/forms
```

## Basic usage

<Playground name="form-checkbox">

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
 * Structural CSS for the checkbox box + group container ships in
 * @vuecs/forms. The checkmark itself is rendered by the component, but
 * without this import the size helpers + group layout are missing.
 */
@import "@vuecs/forms";

/* Class-based dark mode (optional — pairs with the tokens) */
@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Playground>

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

## Default glyph (checkmark / indeterminate dash)

A checked box renders a check mark, and `'indeterminate'` renders a dash, **out of the box** — `<VCFormCheckbox>` paints both as an inline `<svg>` stroked in `currentColor`, so no icon package, theme, stylesheet import or slot wiring is needed. Themes colour the glyph through the `indicator` slot class they already ship (`text-current` on top of the root's `text-on-primary` in `@vuecs/theme-tailwind`, `text-white` in `@vuecs/theme-bootstrap`).

Importing `@vuecs/forms`' structural CSS is still recommended — it carries the checkbox box sizing, the `sm`/`lg` size helpers (which scale the glyph to match), the switch track/thumb structure and the slider rails:

```css
@import "@vuecs/forms"; /* → dist/style.css */
```

See [Installation](/getting-started/installation).

## Custom indicator (checkmark)

Replace the built-in glyph via the `#indicator` slot. It receives the resolved `indicator` theme class plus the current `state` (`true` or `'indeterminate'`), so a custom indicator can distinguish the two:

```vue
<VCFormCheckbox v-model="accepted">
    <template #indicator="{ class: indicatorClass, state }">
        <span :class="indicatorClass">{{ state === 'indeterminate' ? '–' : '✔' }}</span>
    </template>
</VCFormCheckbox>
```

An empty slot (a `v-if` that renders nothing) falls back to the built-in glyph rather than blanking the box.

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
| `value` | `unknown` | `'on'` | Value pushed onto the parent `<VCFormCheckboxGroup>`'s array v-model |
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

## Slots (`<VCFormCheckbox>`)

| Slot | Slot props | Description |
|------|------------|-------------|
| `label` | `{ class, id }` | Custom label markup. `class` is the resolved `label` theme class; `id` matches the checkbox's `for` target. Replaces the default `<label>` |
| `indicator` | `{ class, state }` | Custom checkmark content, replacing the built-in glyph. `class` is the resolved `indicator` theme class; `state` is `true` or `'indeterminate'`. Empty slot content falls back to the built-in glyph |

## See also

- [`<VCFormSwitch>`](/components/form-switch) — toggle switch (Reka `Switch` primitive)
- [Theme System](/guide/theme-system)
