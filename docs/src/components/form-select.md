# FormSelect

Dropdown select with `v-model` binding. Accepts a flat `FormOption[]` or a mixed array of options and `FormOptionGroup`s. Supports a `placeholder` prop shown in the trigger when no value is selected.

Built on Reka UI's `Select` compound primitive — renders a real `<button role="combobox">` trigger plus a portal-mounted dropdown panel with full keyboard navigation, type-ahead, and `data-state` hooks. Note: this replaces the native `<select>` element from earlier `@vuecs/forms` versions, so the OS-native mobile picker is no longer used.

```bash
npm install @vuecs/forms
```

## Basic usage

<Playground name="form-select">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCFormSelect } from '@vuecs/forms';
import { ref } from 'vue';

const size = ref<string | undefined>(undefined);
const region = ref<string | undefined>(undefined);

const sizes = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
];

const regions = [
    {
        label: 'Americas',
        options: [
            { value: 'us', label: 'United States' },
            { value: 'br', label: 'Brazil' },
        ],
    },
    {
        label: 'Europe',
        options: [
            { value: 'de', label: 'Germany' },
            { value: 'fr', label: 'France' },
        ],
    },
];
</script>

<template>
    <VCFormSelect v-model="size" :options="sizes" placeholder="-- Pick a size --" />
    <VCFormSelect v-model="region" :options="regions" placeholder="-- Pick a region --" />
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Playground>

## The `FormOption` shape

```ts
type FormOption<T = AcceptableValue> = {
    value: T;                  // bound value — what flows through v-model
    label: string;             // display string the user sees
    disabled?: boolean;
    description?: string;      // optional secondary line (used by VCFormSelectSearch)
    icon?: string;             // optional icon token (consumer renders)
    meta?: Record<string, unknown>;
};

type FormOptionGroup<T = AcceptableValue> = {
    label: string;
    options: FormOption<T>[];
    disabled?: boolean;
};

// VCFormSelect.options accepts:
type FormOptionItems<T = AcceptableValue> = (FormOption<T> | FormOptionGroup<T>)[];
```

`AcceptableValue` (re-exported from `reka-ui`) covers `string | number | bigint | Record<string, any> | null` — every primitive a `<select>` can sensibly bind. Pass a generic to narrow: `FormOption<number>`.

## Generic value type

`<VCFormSelect>` is generic over `T` — TypeScript infers the bound type from `options[*].value`:

```ts
const options: FormOption<number>[] = [
    { value: 1, label: 'One' },
    { value: 2, label: 'Two' },
];

const id = ref<number | undefined>(undefined);
// <VCFormSelect v-model="id" :options="options" />
//                                 ↑ id is number | undefined
```

## Placeholder

`placeholder` is rendered inside the trigger via Reka's `SelectValue` whenever `modelValue` is unset (no native `<option>` element). The trigger gets a `data-placeholder` attribute so themes can style the empty state (e.g. muted color). Falls back to the global `formSelect.placeholder` default; when both are empty the trigger renders no text.

```vue
<VCFormSelect
    v-model="region"
    :options="regions"
    placeholder="-- Pick a region --"
/>
```

For i18n, set the global default once:

```ts
app.use(vuecs, {
    defaults: {
        formSelect: {
            placeholder: computed(() => t('forms.selectPlaceholder')),
        },
    },
});
```

## Behavioral defaults

| Key | Default | Description |
|-----|---------|-------------|
| `placeholder` | `''` | Trigger text shown while no option is selected. Empty hides the placeholder. |

See [Behavioral Defaults](/guide/behavioral-defaults) for the resolution rules.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `T \| undefined` | `undefined` | Bound value (matches an option's `value`) |
| `options` | `FormOptionItems<T>` | — | Flat options, groups, or a mix |
| `placeholder` | `string` | (defaults system) | Trigger placeholder text when no option selected |
| `disabled` | `boolean` | `false` | Block user interaction with the trigger |
| `name` | `string` | `undefined` | Native form field name — submitted via Reka's hidden input |
| `required` | `boolean` | `false` | Native form `required` semantics |
| `themeClass` | `Partial<FormSelectThemeClasses>` | `undefined` | Per-instance theme override |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values |

## Theme keys

::: warning Renamed in this release
The single `root` slot has been **renamed to `trigger`** to reflect the new compound DOM. Per-instance overrides need to migrate:

```vue
<!-- before -->
<VCFormSelect :theme-class="{ root: 'my-custom-styles' }" :options="..." />
<!-- after -->
<VCFormSelect :theme-class="{ trigger: 'my-custom-styles' }" :options="..." />
```

Same renaming applies to the `formSelect` entry in `app.use(vuecs, { overrides: { elements: { formSelect: { classes: { ... } } } } })` and to theme packages.
:::

The compound DOM exposes ten theme slots — target `[data-state=open]`, `[data-highlighted]`, `[data-disabled]`, `[data-placeholder]` for state-driven styling.

| Key | Element |
|-----|---------|
| `trigger` | The `<button role="combobox">` |
| `value` | Inner span showing the selected label or placeholder |
| `icon` | Chevron icon inside the trigger |
| `content` | Portal-mounted popover panel |
| `viewport` | Scrollable container inside content |
| `item` | A single option row |
| `itemIndicator` | Checkmark on the currently-selected item |
| `group` | An option-group wrapper |
| `groupLabel` | Group heading |
| `separator` | Optional divider (reserved for future use) |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `T` | Fired when the user picks an option |

## See also

- [`<VCFormSelectSearch>`](/components/form-select-search) — searchable select for long option lists; same `FormOption` shape
