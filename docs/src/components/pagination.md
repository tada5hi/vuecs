# Pagination

Paginates a list by offset/limit, emitting `load` events when the user navigates pages. Built on top of [Reka UI](https://reka-ui.com/)'s headless pagination primitives — accessible by default, with edge-aware rendering (first/last anchors plus ellipses for large page counts).

```bash
npm install @vuecs/pagination
```

## Basic usage

<Playground name="pagination">
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
</Playground>

## Icons

Edge-control icons (First / Prev / Next / Last) are Iconify name strings rendered via `<VCIcon>`. The default values are populated by an icon preset — install one and configure it under `icons:` at `app.use(vuecs, …)` time:

```ts
import vuecs from '@vuecs/core';
import lucide from '@vuecs/icons-lucide';

app.use(vuecs, {
    icons: [lucide()],
});
```

This sets `pagination.firstIcon = 'lucide:chevrons-left'`, `prevIcon = 'lucide:chevron-left'`, etc. See [Icons](/getting-started/icons) for the full setup including icon delivery.

Per-instance overrides: pass any of the four icon-name props directly. Pass `''` to suppress an icon.

```vue
<VCPagination
    :total="100" :offset="0" :limit="10"
    prev-icon="lucide:arrow-left"
    next-icon="lucide:arrow-right"
    @load="load"
/>
```

## Labels (i18n)

Each edge button renders an icon + text label. Defaults: `'First'`, `'Previous'`, `'Next'`, `'Last'`. Override per-instance via `firstLabel` / `prevLabel` / `nextLabel` / `lastLabel`, or globally via the [Behavioral Defaults](/guide/behavioral-defaults) system:

```ts
import { computed } from 'vue';

app.use(vuecs, {
    defaults: {
        pagination: {
            firstLabel: computed(() => t('pagination.first')),
            prevLabel:  computed(() => t('pagination.previous')),
            nextLabel:  computed(() => t('pagination.next')),
            lastLabel:  computed(() => t('pagination.last')),
        },
    },
});
```

Pass `''` to suppress the label for icon-only buttons.

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
| `firstIcon` | `string` | (preset) | Iconify name for the First-page button. `''` suppresses. |
| `prevIcon` | `string` | (preset) | Iconify name for the Previous-page button. `''` suppresses. |
| `nextIcon` | `string` | (preset) | Iconify name for the Next-page button. `''` suppresses. |
| `lastIcon` | `string` | (preset) | Iconify name for the Last-page button. `''` suppresses. |
| `firstLabel` | `string` | `'First'` | Visible text for the First-page button. `''` suppresses. |
| `prevLabel` | `string` | `'Previous'` | Visible text for the Previous-page button. `''` suppresses. |
| `nextLabel` | `string` | `'Next'` | Visible text for the Next-page button. `''` suppresses. |
| `lastLabel` | `string` | `'Last'` | Visible text for the Last-page button. `''` suppresses. |

## Slots

| Slot | Description |
|------|-------------|
| `first` | Replace the entire First-page button content (overrides `firstIcon` + `firstLabel`). |
| `prev`  | Replace the entire Previous-page button content. |
| `next`  | Replace the entire Next-page button content. |
| `last`  | Replace the entire Last-page button content. |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `load` | `{ page, offset, limit, total }` (`PaginationMeta`) | Emitted when the user navigates pages. **Note:** the emitted `total` is the total **page count** (`Math.ceil(items / limit)`), not the input `total` items. |

## See also

- [Icons](/getting-started/icons) — icon preset setup and delivery
- [Behavioral Defaults](/guide/behavioral-defaults) — global label config (i18n)
- [Theme System](/guide/theme-system)
