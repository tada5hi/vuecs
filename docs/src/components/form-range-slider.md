# FormRangeSlider

Dual-handle range slider. Always renders two thumbs (lower + upper); the user drags them to select a sub-range of `[min, max]`. The selected range is delivered via the `change` event — there is no `v-model`.

```bash
npm install @vuecs/form-controls
```

## Basic usage

<Demo name="form-range-slider">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCFormRangeMultiSlider } from '@vuecs/form-controls';
import { ref } from 'vue';

const range = ref<{ min: number; max: number } | null>(null);

const onChange = (next: { min: number; max: number }) => {
    range.value = next;
};
</script>

<template>
    <VCFormRangeMultiSlider
        :min="0"
        :max="100"
        @change="onChange"
    />
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";

/*
 * Track + thumb structural CSS (slider geometry, thumb dot, fill diff).
 * Without this import the slider markup renders but is visually invisible.
 */
@import "@vuecs/form-controls";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Demo>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `min` | `number` | `0` | Slider lower bound |
| `max` | `number` | `100` | Slider upper bound |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `{ min: number, max: number }` | Emitted when the user releases a thumb — payload is the current selected range |

## Notes

- The slider is DOM-driven (initializes via `onMounted`) — render it inside `<ClientOnly>` if you're using SSR or static-site generation, otherwise the thumbs won't initialize.
- Single-handle mode is not supported — the component always renders two thumbs. If you need a one-handle slider, use a native `<input type="range">` for now.

## See also

- [FormInput](/components/form-input)
- [FormSelectSearch](/components/form-select-search)
