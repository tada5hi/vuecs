# ListControls

A composable list with header, body, footer, and "no more results" slots — designed to wrap your own item rendering with consistent loading / empty / paginated states.

```bash
npm install @vuecs/list-controls
```

## Basic usage

<Demo name="list-controls">

  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCList, VCListItem } from '@vuecs/list-controls';
import { ref } from 'vue';

const data = ref([
    { id: 1, name: 'Apples' },
    { id: 2, name: 'Oranges' },
    { id: 3, name: 'Pears' },
]);
</script>

<template>
    <VCList :data="data">
        <template #item="{ data: item }">
            <VCListItem :data="item" />
        </template>
    </VCList>
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";

/* List header/body/footer/no-more-results structural CSS. */
@import "@vuecs/list-controls";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Demo>

## Composite forwarding

`<VCList>` can forward behavioral props to its children. Important: the composite's own Vue `prop.default` for forwarded props must be `undefined` so `useComponentDefaults` on the child sees `undefined` (layer 1) and falls through to global defaults (layer 2).

See `VCList.noMoreContent` and `VCList.itemTextPropName` (both `default: undefined`) for the canonical pattern, and the [Behavioral Defaults](/guide/behavioral-defaults#composite-components-must-forward-undefined) guide.

## Slot props

`VCListItem` exposes typed slot props:

```ts
import type { ListItemSlotProps } from '@vuecs/list-controls';
```

Useful when you build a custom item template for entity-typed lists.

## Behavioral defaults

| Component | Key | Default | Description |
|-----------|-----|---------|-------------|
| `VCListItem` | `textPropName` | `'name'` | Key on `data` to render as the item's text |
| `VCListNoMore` | `content` | `'No more entries.'` | Text shown after the last page |

See [Behavioral Defaults](/guide/behavioral-defaults).
