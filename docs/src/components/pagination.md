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

Edge-button display behaviour depends on whether an icon resolves for the button:

- **Icon resolved** (icon preset installed or `firstIcon` / `prevIcon` / `nextIcon` / `lastIcon` passed) → **icon-only** by default. Pass `with-text` to render the label string alongside the icon.
- **No icon resolved** → falls back to the **label string** so the button isn't visually empty.

Reka's `aria-label="First Page"` etc. keeps the buttons accessible regardless.

```vue
<!-- Icon preset installed → icon-only -->
<VCPagination :total="100" :offset="0" :limit="10" @load="load" />

<!-- Icon preset installed → icon + label -->
<VCPagination :total="100" :offset="0" :limit="10" with-text @load="load" />

<!-- No icon preset → label text fallback -->
<VCPagination :total="100" :offset="0" :limit="10" @load="load" />
```

Label defaults: `'First'`, `'Previous'`, `'Next'`, `'Last'`. Override per-instance via `firstLabel` / `prevLabel` / `nextLabel` / `lastLabel`, or globally via the [Behavioral Defaults](/guide/behavioral-defaults) system:

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

Pass `''` to a single label prop (e.g. `:prev-label="''"`) to suppress that one button's text even when `with-text` is enabled.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `total` | `number` | `0` | Total number of items |
| `offset` | `number` | `0` | Current offset |
| `limit` | `number` | `0` | Items per page. Values `<= 0` are normalised to `Math.max(total, 1)`, so the component still renders — typically as a single page covering every item. Set `limit > 0` for proper multi-page pagination. |
| `busy` | `boolean` | `false` | Disable controls during loading |
| `hideDisabled` | `boolean` | `true` | When `true`, edge controls (First/Prev at page 1, Next/Last at the last page) are unrendered instead of rendered-disabled. Pass `:hide-disabled="false"` to keep them rendered-disabled. Does not apply to the `busy` state. |
| `withText` | `boolean` | `false` | When `true`, forces the resolved label string (First / Previous / Next / Last) to render as visible text next to each edge button. When `false` (default), edge buttons are icon-only **if an icon resolves** for that button; otherwise the label string is rendered as a fallback so the button isn't empty. |
| `siblingCount` | `number` | `1` | Number of sibling page items shown on either side of the current page; forwarded to Reka `siblingCount`. |
| `showEdges` | `boolean` | `true` | Render First/Last edge buttons; forwarded to Reka `showEdges`. |
| `tag` | `string` | `'ul'` | Root element tag |
| `itemTag` | `string` | `'li'` | Item wrapper tag |
| `firstIcon` | `string` | (preset) | Iconify name for the First-page button. `''` suppresses. |
| `prevIcon` | `string` | (preset) | Iconify name for the Previous-page button. `''` suppresses. |
| `nextIcon` | `string` | (preset) | Iconify name for the Next-page button. `''` suppresses. |
| `lastIcon` | `string` | (preset) | Iconify name for the Last-page button. `''` suppresses. |
| `firstLabel` | `string` | `'First'` | Visible text for the First-page button when `with-text` is enabled. `''` suppresses. |
| `prevLabel` | `string` | `'Previous'` | Visible text for the Previous-page button when `with-text` is enabled. `''` suppresses. |
| `nextLabel` | `string` | `'Next'` | Visible text for the Next-page button when `with-text` is enabled. `''` suppresses. |
| `lastLabel` | `string` | `'Last'` | Visible text for the Last-page button when `with-text` is enabled. `''` suppresses. |
| `themeClass` | `Partial<PaginationThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

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
