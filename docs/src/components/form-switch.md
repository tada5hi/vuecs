# FormSwitch

Toggle switch built on Reka UI's `Switch` primitive. `<VCFormSwitch>` renders a real `<button role="switch">` with `data-state="checked|unchecked"` — distinct from `Checkbox` because the ARIA semantics, keyboard contract, and visual affordance are different (a switch represents an immediate on/off state, while a checkbox represents an item to be confirmed).

```bash
npm install @vuecs/forms
```

## Basic usage

<Playground name="form-switch">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCFormSwitch } from '@vuecs/forms';
import { ref } from 'vue';

const notifications = ref(true);
const dnd = ref(false);
</script>

<template>
    <VCFormSwitch v-model="notifications" label-content="Enable notifications" />
    <VCFormSwitch v-model="dnd" label-content="Do not disturb" />
</template>
```

```css [CSS]
/* Tailwind v4 + design tokens */
@import "tailwindcss";
@import "@vuecs/design";

/*
 * Structural CSS for the switch track + thumb ships in @vuecs/forms.
 * Without this import the thumb does not slide between checked/unchecked
 * positions.
 */
@import "@vuecs/forms";

/* Class-based dark mode (optional — pairs with the tokens) */
@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Playground>

## Custom label markup

Use the named `#label` slot to render the label as markup. The slot receives `class` and `id`:

```vue
<VCFormSwitch v-model="notifications">
    <template #label="{ class: labelClass, id }">
        <label :class="labelClass" :for="id">
            <strong>Notifications</strong> — receive realtime updates
        </label>
    </template>
</VCFormSwitch>
```

## Custom thumb

Replace the default thumb element via the `#thumb` slot. The slot receives `class` (the resolved `thumb` class):

```vue
<VCFormSwitch v-model="enabled">
    <template #thumb="{ class: thumbClass }">
        <span :class="thumbClass">
            <i class="fa fa-power-off" />
        </span>
    </template>
</VCFormSwitch>
```

## Behavioral defaults

| Key | Default | Description |
|-----|---------|-------------|
| `labelContent` | `'Toggle'` | Label text when neither `label-content` prop nor `#label` slot is provided |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean \| null` | `undefined` | Switch state |
| `value` | `string` | `undefined` | Form-submission value (sent when checked) |
| `disabled` | `boolean` | `false` | Disables interaction; reflected as `data-disabled` |
| `required` | `boolean` | `false` | Native form-required attribute |
| `name` | `string` | `undefined` | Form-submission name |
| `id` | `string` | (auto) | Override the auto-generated id |
| `label` | `boolean` | `true` | Render the label wrapper. Set `false` for the bare switch |
| `labelContent` | `string` | (defaults system) | Inline label text — bypasses the `#label` slot |
| `themeClass` | `Partial<FormSwitchThemeClasses>` | `undefined` | Per-instance theme overrides |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values |

## See also

- [`<VCFormCheckbox>`](/components/form-checkbox) — boolean / tri-state + array group
- [Theme System](/guide/theme-system)
