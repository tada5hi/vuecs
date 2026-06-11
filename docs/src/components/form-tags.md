# FormTags

Multi-value chip input built on Reka UI's `TagsInput` primitive. Type a value and press the `delimiter` (default `,`) or `Enter` to commit it as a chip; backspace from an empty input removes the trailing chip; click `×` on a chip to delete it.

Common use cases: tag pickers, email recipient lists, comma-separated keyword inputs.

```bash
npm install @vuecs/forms
```

## Basic usage

<Playground name="form-tags">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCFormTags } from '@vuecs/forms';
import { ref } from 'vue';

const tags = ref<string[]>(['vue', 'reka', 'tailwind']);
</script>

<template>
    <VCFormTags v-model="tags" placeholder="Add a tag…" add-on-paste />
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

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string[] \| number[] \| null` | `undefined` | Bound value array |
| `placeholder` | `string` | `undefined` | Input placeholder when empty |
| `disabled` | `boolean` | `false` | Disable interaction |
| `required` | `boolean` | `false` | Form-required attribute |
| `max` | `number` | `0` | Max number of tags allowed (`0` = unlimited) |
| `addOnPaste` | `boolean` | `false` | Split pasted strings on `delimiter` and add each as a tag |
| `addOnTab` | `boolean` | `false` | Commit the current input as a tag on `Tab` |
| `addOnBlur` | `boolean` | `true` | Commit on input blur |
| `duplicate` | `boolean` | `false` | Allow duplicate tags |
| `delimiter` | `string \| RegExp` | `','` | Character (or regex) that triggers tag commit |
| `name` | `string` | `undefined` | Form-submission name |
| `id` | `string` | `undefined` | Root id |
| `themeClass` | `Partial<FormTagsThemeClasses>` | `undefined` | Per-instance theme override |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string[] \| number[]` | Emitted whenever the tag list changes |
| `invalid` | `string` | Emitted when a tag is rejected (e.g. duplicate, max exceeded) |
