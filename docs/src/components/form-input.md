# FormInput

Text input with `v-model` binding and optional debounce.

```bash
npm install @vuecs/forms
```

## Basic usage

<Playground name="form-input">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCFormInput } from '@vuecs/forms';
import { ref } from 'vue';

const value = ref('');
</script>

<template>
    <VCFormInput v-model="value" placeholder="Enter your email" />
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";

/* Required only if you use the input-group variant (prepend/append). */
@import "@vuecs/forms";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Playground>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| null \| undefined` | — | The bound value. `null`/`undefined` are accepted as the "unset" value (renders empty) for binding nullable entity fields |
| `type` | `string` | `'text'` | Native input type |
| `debounce` | `number` | `0` | Debounce input updates by N milliseconds |
| `group` | `boolean` | `false` | Render with input-group prepend/append wrappers |
| `groupPrepend` / `groupAppend` | `boolean` | `false` | Show prepend/append addon slots |
| `groupPrependContent` / `groupAppendContent` | `string` | — | Inline addon content (alternative to slots) |

`placeholder`, `disabled`, etc. are forwarded to the native `<input>` via `attrs`.

## Slots

| Slot | Slot props | Description |
|------|------------|-------------|
| `groupPrepend` | `{ class, tag }` | Custom prepend addon markup. `class` is the resolved `groupPrepend` theme class; `tag` is the suggested wrapper tag (`'div'`). Replaces the `groupPrependContent` default |
| `groupAppend` | `{ class, tag }` | Custom append addon markup. `class` is the resolved `groupAppend` theme class; `tag` is the suggested wrapper tag (`'div'`). Replaces the `groupAppendContent` default |

## Input group

When a prepend and/or append is present (via the `groupPrepend` / `groupAppend`
props or the `#groupPrepend` / `#groupAppend` slots), the input automatically
squares the corner(s) touching the addon so the group reads as one seamless
control — no consumer override needed.

The squared corners are theme-owned via two `formInput` theme classes, applied
to the `<input>` in addition to `root`:

| Slot | Applied when | theme-tailwind value |
|------|--------------|----------------------|
| `rootGroupStart` | a prepend is present | `rounded-l-none` |
| `rootGroupEnd` | an append is present | `rounded-r-none` |

Override them per instance via `:theme-class`, or globally via theme overrides,
to change how the seam is squared.

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number` | v-model update |

## See also

- [FormGroup wrapper for validation](/guide/theme-system) (forthcoming)
