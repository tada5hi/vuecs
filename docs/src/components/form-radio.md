# FormRadio

Radio button + group built on Reka UI's `RadioGroup` primitives. The group owns the `v-model` (single value); each item declares a `value` prop and renders a Reka `RadioGroupItem` + `RadioGroupIndicator`. Roving focus across siblings comes for free.

```bash
npm install @vuecs/forms
```

## Basic usage

<Playground name="form-radio">

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
</Playground>

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

## Segmented

Set `segmented` on the group to render the same radio group as a segmented button bar — a view switch, a filter scope, a period picker. It stays one component with one role (`radiogroup` with `radio` items): roving focus, arrow keys, `Home` / `End`, `loop`, `disabled` options and `:options` all work unchanged.

```vue
<VCFormRadioGroup
    v-model="view"
    segmented
    aria-label="View mode"
    :theme-variant="{ size: 'sm' }"
    :options="[
        { value: 'list', label: 'List' },
        { value: 'grid', label: 'Grid' },
        { value: 'table', label: 'Table', disabled: true },
    ]"
/>
```

- Each `<VCFormRadio>` (from `:options` or the default slot) renders its label **inside** the Reka radio button — no indicator dot, no sibling `<label>`. A `#label` slot becomes the segment content.
- The checked button gets the `segment` + `segmentActive` theme classes (the classes are switched in JS so Bootstrap's `.btn.active` and Bulma's `.button.is-selected` work); the root uses the `formRadioGroup` **`segmented`** theme class *instead of* `root` (so overriding `root` never affects a segmented bar, and vice versa) and carries a `data-segmented` attribute.
- `segmented` forces `orientation="horizontal"`, so `ArrowLeft` / `ArrowRight` move the selection. Disabled options are skipped and ignore clicks.
- A segmented bar has no visible group label — give it an accessible name with `aria-label` (or `aria-labelledby`).
- In a segmented group, `themeVariant.size` on the group flows down to every item's `formRadio` size variant; an item's own `themeVariant.size` wins. (Non-segmented groups are unchanged — size each `<VCFormRadio>` directly.)

| Theme | `formRadioGroup.segmented` | `formRadio.segment` | `formRadio.segmentActive` |
|-------|--------------------------|-----------|-----------------|
| Tailwind | muted pill bar | text button | raised `bg-bg` pill |
| Bootstrap | `.btn-group` | `.btn.btn-outline-primary` | `.active` |
| Bulma | `.buttons.has-addons` | `.button` | `.is-primary.is-selected` |

## Behavioral defaults

| Key | Default | Description |
|-----|---------|-------------|
| `labelContent` | `'Option'` | Label text when neither `label-content` prop nor `#label` slot is provided |

## Props (`<VCFormRadio>`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `AcceptableValue` | (required) | Bound value when this item is selected |
| `disabled` | `boolean` | `false` | Disable interaction; reflected as `data-disabled` |
| `id` | `string` | (auto) | Override the auto-generated id |
| `label` | `boolean` | `true` | Render the label wrapper (ignored inside a segmented group) |
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
| `segmented` | `boolean` | `false` | Render as a segmented button bar (forces horizontal orientation) |
| `disabled` | `boolean` | `false` | Disable every item |
| `required` | `boolean` | `false` | Form-required attribute |
| `name` | `string` | `undefined` | Form-submission name |

## Slots (`<VCFormRadio>`)

| Slot | Slot props | Description |
|------|------------|-------------|
| `label` | `{ class, id }` | Custom label markup. `class` is the resolved `label` theme class; `id` matches the radio's `for` target. Replaces the default `<label>`; inside a segmented group it is the segment content |
| `indicator` | `{ class }` | Custom selected-state indicator content. `class` is the resolved `indicator` theme class |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `AcceptableValue` | Emitted when the selection changes. Clicking the already-checked radio emits nothing (Reka re-reports the current value; the group drops it) |
