# Pagination

Paginates a list by offset/limit, emitting `load` events when the user navigates pages. Built on top of [Reka UI](https://reka-ui.com/)'s headless pagination primitives — accessible by default, with edge-aware rendering (first/last anchors plus ellipses for large page counts).

```bash
npm install @vuecs/pagination
```

## Basic usage

<Demo name="pagination">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { VCPagination } from '@vuecs/pagination';
import { ref } from 'vue';

const meta = ref({ total: 100, offset: 0, limit: 10 });

const load = (next) => {
    meta.value.offset = next.offset;
    // refetch your data with the new offset
};
</script>

<template>
    <VCPagination
        :total="meta.total"
        :offset="meta.offset"
        :limit="meta.limit"
        @load="load"
    />
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";

/* Active-page + ellipsis structural CSS. */
@import "@vuecs/pagination";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Demo>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `total` | `number` | `0` | Total number of items |
| `offset` | `number` | `0` | Current offset |
| `limit` | `number` | `0` | Items per page (must be > 0 for the component to render any pages) |
| `busy` | `boolean` | `false` | Disable controls during loading |
| `hideDisabled` | `boolean` | `false` | When `true`, edge controls (First/Prev at page 1, Next/Last at the last page) are unrendered instead of rendered-disabled. Does not apply to the `busy` state. |
| `tag` | `string` | `'ul'` | Root element tag |
| `itemTag` | `string` | `'li'` | Item wrapper tag |
| `iconTag` | `string` | `'i'` | Tag used to render `firstIcon` / `prevIcon` / `nextIcon` / `lastIcon` theme classes |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `load` | `{ page, offset, limit, total }` (`PaginationMeta`) | Emitted when the user navigates pages. **Note:** the emitted `total` is the total **page count** (`Math.ceil(items / limit)`), not the input `total` items. |

## See also

- [Theme System](/guide/theme-system)
