# TableCard

The card frame around a collection table: a header with title, description, search input and actions, the table itself, an optional side panel, and pagination in the footer. When there is nothing to show it swaps the table for an [EmptyState](/components/empty-state) — `empty` for a collection with no records, `noResults` for a search or filter that matched nothing.

`<VCTableCard>` is a composition, not a new table. It renders [`<VCCard>`](/components/card), [`<VCTable>`](/components/table), [`<VCFormInput>`](/components/form-input), [`<VCPagination>`](/components/pagination) and [`<VCEmptyState>`](/components/empty-state), and only decides which of them appear. Anything bespoke goes through slots.

```bash
npm install @vuecs/table-card @vuecs/table @vuecs/elements @vuecs/forms @vuecs/pagination
```

<Playground name="table-card" component="VCTableCard">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { defineDataCollection } from '@vuecs/data';
import type { PaginationMeta } from '@vuecs/pagination';
import type { TableSortState } from '@vuecs/table';
import { VCTableCard } from '@vuecs/table-card';
import { ref, watch } from 'vue';

const search = ref('');
const sort = ref<TableSortState>([]);

const users = defineDataCollection({
    initialMeta: { pagination: { limit: 10, offset: 0 } },
    load: (meta) => fetchUsers({ ...meta.pagination, search: search.value, sort: sort.value }),
});
const { data, loading, total, meta } = users;

// A new query starts on the first page.
watch([search, sort], () => users.load({ pagination: { limit: 10, offset: 0 } }));

const onPage = (page: PaginationMeta) => users.load({
    pagination: { limit: page.limit, offset: page.offset },
});
</script>

<template>
    <VCTableCard
        v-model:search="search"
        v-model:sort="sort"
        title="Users"
        description="Everyone with access to this workspace."
        searchable
        :data="data"
        :columns="['name', 'email', 'role']"
        :busy="loading"
        :filtered="search !== ''"
        :total="total"
        :limit="meta.pagination.limit"
        :offset="meta.pagination.offset"
        @page="onPage"
        @reset="search = ''"
    >
        <template #actions>
            <VCButton @click="openCreateDialog">Add user</VCButton>
        </template>
        <template #cell-email="{ row }">
            <a :href="`mailto:${row.email}`">{{ row.email }}</a>
        </template>
    </VCTableCard>
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";
@import "@vuecs/elements";
@import "@vuecs/forms";
@import "@vuecs/pagination";
@import "@vuecs/placeholder";
@import "@vuecs/table";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Playground>

`@vuecs/table-card` ships no stylesheet of its own; import the structural CSS of the packages it composes. The search input reloads nothing by itself — bind `v-model:search` and react to it the way your data source needs.

## States

The body shows exactly one of three things:

| Condition | Renders |
|---|---|
| `busy` | `<VCTable :busy :placeholder>` — the header row plus skeleton rows |
| not `busy`, `data` empty, `filtered` | `<VCEmptyState variant="noResults">` — its Reset button emits `reset` |
| not `busy`, `data` empty | `<VCEmptyState variant="empty">` |
| otherwise | `<VCTable>` with your rows |

`busy` always wins. Bind it to a data source's [`loading`](/guide/data-source) (not `busy`) so the first load shows skeletons instead of flashing the empty state, and a superseded request finishing late doesn't flip the card back. The empty state **replaces the whole table**, header row included.

The built-in `empty` state shows only a title — the `tableCard.emptyTitle` behavioral default, `'No entries yet'`. Most pages override it to name the entity and offer a create action:

```vue
<VCTableCard :data="users" :columns="columns">
    <template #empty>
        <VCEmptyState
            title="No users yet"
            action-label="Invite user"
            @action="openInviteDialog"
        />
    </template>
    <template #noResults="{ reset }">
        <VCEmptyState variant="noResults" @action="reset" />
    </template>
</VCTableCard>
```

## Search

`searchable` renders a `type="search"` input in the header. The input is debounced (`searchDebounce`, default 300 ms) and emits `update:search`, so `v-model:search` updates once the user stops typing. The placeholder (also the input's accessible label) comes from the `searchPlaceholder` prop or the `tableCard.searchPlaceholder` [behavioral default](/guide/behavioral-defaults):

```ts
app.use(vuecs, {
    defaults: {
        tableCard: {
            searchPlaceholder: 'Suchen…',
            emptyTitle: 'Noch keine Einträge',
        },
    },
});
```

The search box is opt-in through `searchable` rather than inferred from a bound `v-model:search` — a bound value that starts as `undefined` is indistinguishable from no binding at all.

## Pagination

The footer renders `<VCPagination>` when `total > limit` (and `limit > 0`). Page clicks emit `page` with `VCPagination`'s `load` payload (`{ page, offset, limit, total }`) — pass it straight to your loader.

## Table options

Every attribute other than `class` / `style` is forwarded to `<VCTable>`, so table options and listeners need no card prop. `class` and `style` stay on the card root. This includes `id`, `data-*` (e.g. `data-testid`) and `aria-*`: they land on the `<table>`, not the card root — wrap the card in your own element if you need a hook on the frame.

```vue
<VCTableCard
    :data="users"
    :columns="columns"
    row-clickable
    :get-row-key="(user) => user.id"
    expandable
    striped
    @row-click="(user) => router.push(`/users/${user.id}`)"
>
    <template #expansion="{ row }">{{ row.bio }}</template>
</VCTableCard>
```

`@row-click` and `get-row-key` are typed against the row type like the other props.

## Table slots and typed rows

Every slot that isn't the card's own (`actions`, `aside`, `empty`, `noResults`) is forwarded to `<VCTable>` — `#cell-<key>`, `#header-<key>`, `#caption`, the compound `#default` slot. `<VCTableCard>` is generic over the row type, so `:data` types the slot props:

```vue
<VCTableCard :data="users" :columns="columns">
    <template #cell-name="{ row }">{{ row.email }}</template> <!-- row: User -->
</VCTableCard>
```

## Aside

`#aside` renders a panel beside the table — filters, a summary, a detail view. It sits to the right of the table on wider screens and wraps below it on narrow ones.

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Card heading. |
| `description` | `string` | — | Secondary text under the heading. |
| `data` | `Row[]` | `[]` | Rows, forwarded to `<VCTable>`. |
| `columns` | `TableColumnRaw<Row>[]` | — | Columns, forwarded to `<VCTable>`. |
| `sort` | `TableSortState` | — | Sort state. Use `v-model:sort`. |
| `searchable` | `boolean` | `false` | Render the search input. |
| `search` | `string` | — | Search text. Use `v-model:search`. |
| `searchDebounce` | `number` | `300` | Debounce window (ms) for `update:search`. |
| `searchPlaceholder` | `string` | `'Search…'` | Search placeholder / label (behavioral default). |
| `busy` | `boolean` | `false` | Show skeleton rows. Wins over the empty state. |
| `filtered` | `boolean` | `false` | A search or filter is active — empty results render `noResults`. |
| `total` | `number` | `0` | Total number of records. |
| `limit` | `number` | `0` | Page size. `0` hides the pagination. |
| `offset` | `number` | `0` | Offset of the current page. |
| `themeClass` | `Partial<TableCardThemeClasses>` | — | Per-instance class overrides. |
| `themeVariant` | `VariantValues` | — | Per-instance variant values. |

Any other attribute or listener is forwarded to `<VCTable>` — see [Table options](#table-options).

### Events

| Event | Payload | Description |
|---|---|---|
| `update:search` | `string` | Debounced search text. |
| `update:sort` | `TableSortState` | A sortable header was clicked. |
| `page` | `PaginationMeta` | A page was picked — `VCPagination`'s `load` payload. |
| `reset` | — | The `noResults` action was clicked (or the `#noResults` slot called `reset()`). |

### Slots

| Slot | Props | Description |
|---|---|---|
| `actions` | — | Header actions next to the search input. |
| `aside` | — | Panel beside the table. |
| `empty` | — | Replaces the built-in `empty` state. |
| `noResults` | `{ reset }` | Replaces the built-in `noResults` state. |
| any `<VCTable>` slot | as on `<VCTable>` | Forwarded — `cell-<key>`, `header-<key>`, `caption`, `default`, … |

### Theme keys

`tableCard` — `root`, `header`, `heading`, `title`, `description`, `toolbar`, `search`, `actions`, `body`, `main`, `aside`, `footer`.

### Behavioral defaults

`tableCard` — `searchPlaceholder`, `emptyTitle`.
