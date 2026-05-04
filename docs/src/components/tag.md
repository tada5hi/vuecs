# Tag & Tags

A removable, value-bound chip and a list helper that renders one chip per item. Pure-CSS — no Reka primitive.

`<VCTag>` is the display-only counterpart to `<VCFormTags>` (which composes Reka's interactive `TagsInputItem` + input). Use Tag when you want chip rendering without an input — read-only summaries, profile pills, list-row badges. Use `<VCFormTags>` when you need the editable chip-input combo.

```bash
npm install @vuecs/elements
```

<Demo name="tag">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCTag, VCTags } from '@vuecs/elements';
import { ref } from 'vue';

const tags = ref([
    { value: 'vue', label: 'Vue' },
    { value: 'reka', label: 'Reka UI' },
    { value: 'tailwind', label: 'Tailwind' },
]);

function remove(value: string | number | undefined) {
    tags.value = tags.value.filter((t) => t.value !== value);
}
</script>

<template>
    <VCTag value="static" label="Static chip" />
    <VCTag value="removable" label="Removable" removable />

    <VCTags :items="tags" removable @remove="remove" />
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";
@import "@vuecs/elements";
```

:::

  </template>
</Demo>

## `<VCTag>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string \| number` | `undefined` | Bound value — emitted on `remove`. |
| `label` | `string` | `undefined` | Display text; default slot wins if both provided. |
| `icon` | `string` | `undefined` | Iconify-style name forwarded to the leading `icon` slot. |
| `removable` | `boolean` | `false` | Render the trailing remove button. |
| `size` | `'sm' \| 'md' \| 'lg'` | theme default (`md`) | Size variant — mirrors `<VCBadge>` sizes for visual consistency. |
| `themeClass` | `Partial<TagThemeClasses>` | `undefined` | Per-instance theme override. |

| Emit | Payload | Description |
|---|---|---|
| `remove` | `value: string \| number \| undefined` | Fired when the remove button is clicked. |

## `<VCTags>`

Flex container that renders `<VCTag>` per entry. Items can be plain strings/numbers (coerced to `{ value, label: String(value) }`) or `TagItem` objects.

```ts
type TagItem = {
    value: string | number;
    label?: string;
    icon?: string;
    /** Per-chip override; falls back to the list-level `size`. */
    size?: 'sm' | 'md' | 'lg';
    /** Skips the remove button on this chip even when list-level `removable` is true. */
    disabled?: boolean;
};
```

`TagItem` is structurally compatible with `@vuecs/forms`' `FormOption` so the same array can drive a select and a chip summary.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `(TagItem \| string \| number)[]` | `[]` | Items to render. |
| `removable` | `boolean` | `false` | Show remove buttons on every chip (per-item `disabled` opts out). |
| `size` | `'sm' \| 'md' \| 'lg'` | theme default (`md`) | Default size forwarded to every chip; per-item `size` overrides. |
| `themeClass` | `Partial<TagsThemeClasses>` | `undefined` | Per-instance theme override. |

| Emit | Payload | Description |
|---|---|---|
| `remove` | `(value, item)` | Fired with the bound value and the resolved `TagItem`. |

## Theme keys

| Component | Key | Default class |
|---|---|---|
| `tag` | `root` | `vc-tag` |
| `tag` | `icon` | `vc-tag-icon` |
| `tag` | `remove` | `vc-tag-remove` |
| `tags` | `root` | `vc-tags` |
| `tags` | `item` | `vc-tags-item` |
