# FormSlider

Range / value slider built on Reka UI's `Slider` primitive. One component covers both modes — the shape of `v-model` decides:

| `v-model` shape | Mode | Thumbs |
|---|---|---|
| `number` | Single value | 1 |
| `number[]` (length 2) | Range | 2 |
| `number[]` (length N) | Multi-thumb | N |

```bash
npm install @vuecs/forms
```

## Basic usage

<Demo name="form-slider">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCFormSlider } from '@vuecs/forms';
import { ref } from 'vue';

const volume = ref<number>(40);
const range = ref<number[]>([20, 80]);
</script>

<template>
    <VCFormSlider v-model="volume" :min="0" :max="100" />
    <VCFormSlider v-model="range" :min="0" :max="100" />
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
</Demo>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number \| number[] \| null` | `undefined` | Bound value(s). Array → multi-thumb. |
| `min` | `number` | `0` | Lower bound |
| `max` | `number` | `100` | Upper bound |
| `step` | `number` | `1` | Increment per arrow-key press |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout + drag axis |
| `inverted` | `boolean` | `false` | Visually invert the track direction |
| `disabled` | `boolean` | `false` | Disable interaction |
| `required` | `boolean` | `false` | Native form-required attribute |
| `name` | `string` | `undefined` | Form-submission name |
| `minStepsBetweenThumbs` | `number` | `0` | Minimum step gap between adjacent thumbs (multi only) |
| `themeClass` | `Partial<FormSliderThemeClasses>` | `undefined` | Per-instance theme override |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `number \| number[]` | Emitted as the user drags; mirrors the `modelValue` shape |
| `valueCommit` | `number \| number[]` | Emitted when the user releases the thumb (commit point) |

## Migration from `<VCFormRangeMultiSlider>`

The hand-rolled `VCFormRangeMultiSlider` was removed in 3.0 — `<VCFormSlider>` replaces it on top of Reka's accessible `Slider` primitive. The old `@change` event payload (`{ min, max }`) is gone; bind to `v-model` (or listen for `valueCommit`) to read the array.

```diff
- <VCFormRangeMultiSlider :min="0" :max="100" @change="handle" />
+ <VCFormSlider v-model="range" :min="0" :max="100" />
```
