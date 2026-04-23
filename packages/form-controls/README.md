# @vuecs/form-controls 📜

[![npm version](https://badge.fury.io/js/@vuecs%2Fform-controls.svg)](https://badge.fury.io/js/@vuecs%2Fform-controls)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

Form input components for Vue 3 with validation support, v-model binding, and themeable CSS classes.

**Table of Contents**

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Components](#components)
- [Debounced Input](#debounced-input)
- [Typed Slot Props](#typed-slot-props)
- [Theme Slots](#theme-slots)
- [License](#license)

## Installation

```bash
npm install @vuecs/form-controls @vuecs/core
```

## Quick Start

```typescript
import formControls from '@vuecs/form-controls';

app.use(formControls);
```

```vue
<template>
    <VCFormGroup label-content="Email" :validation-messages="errors">
        <VCFormInput v-model="form.email" type="email" />
    </VCFormGroup>

    <VCFormGroup label-content="Role">
        <VCFormSelect v-model="form.role" :options="roles" />
    </VCFormGroup>

    <VCFormSubmit :submit="onSubmit" :is-editing="!!form.id" />
</template>
```

## Components

| Component | Description |
|-----------|-------------|
| `VCFormGroup` | Wrapper with label, hint, and validation message rendering |
| `VCFormInput` | Text input with optional prepend/append group wrappers |
| `VCFormInputCheckbox` | Checkbox supporting single boolean and array multi-select |
| `VCFormTextarea` | Textarea input |
| `VCFormSelect` | Dropdown select with configurable default option |
| `VCFormSubmit` | Submit button with create/update modes, icon, and busy state |
| `VCFormSelectSearch` | Searchable multi-select with keyboard navigation |
| `VCFormRangeMultiSlider` | Dual-range slider |
| `VCValidationGroup` | Renders validation messages (used internally by VCFormGroup) |

## Debounced Input

`VCFormInput` and `VCFormTextarea` accept an optional `debounce` prop (milliseconds). When set, `update:modelValue` is delayed until the user stops typing. The displayed input value still updates immediately, so typing remains responsive. This is useful for search fields and other queries that trigger network requests.

Filter semantics (field names, operators, pagination behavior) are intentionally **not** handled by the component — consumers own that logic in their change handler:

```vue
<script setup lang="ts">
const query = ref('');

watch(query, (value) => {
    loadItems({
        filters: { name: value.length > 0 ? `~${value}` : value },
        pagination: { offset: 0 },
    });
});
</script>

<template>
    <VCFormInput v-model="query" :debounce="200" placeholder="Search..." />
</template>
```

## Typed Slot Props

Slot prop interfaces are exported for render-function consumers:

```typescript
import {
    VCFormInput,
    type FormInputGroupSlotProps,
} from '@vuecs/form-controls';

h(VCFormInput, { modelValue: '', group: true }, {
    groupPrepend: (props: FormInputGroupSlotProps) =>
        h(props.tag, { class: props.class }, '@'),
});
```

| Export | Used by |
|--------|---------|
| `FormInputGroupSlotProps` | `VCFormInput` `groupPrepend`/`groupAppend` |
| `FormInputCheckboxLabelSlotProps` | `VCFormInputCheckbox` `label` |
| `ValidationGroupDefaultSlotProps` | `VCValidationGroup` default |
| `ValidationGroupItemSlotProps` | `VCValidationGroup` `item` |
| `FormSelectSearchSelectedSlotProps` | `VCFormSelectSearch` `selected` |

## Theme Slots

| Component | Slot Keys |
|-----------|-----------|
| `formGroup` | `root`, `label`, `hint`, `validationError`, `validationWarning` |
| `formInput` | `root`, `group`, `groupAppend`, `groupPrepend` |
| `formInputCheckbox` | `root`, `label`, `group` |
| `formSelect` | `root` |
| `formTextarea` | `root` |
| `formSubmit` | `root`, `createButton`, `updateButton`, `createIcon`, `updateIcon` |
| `validationGroup` | `item` |

## License

Made with 💚

Published under [MIT License](./LICENSE).
