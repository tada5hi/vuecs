# Table

Compound table — `<VCTable>` outer + eight semantic-HTML parts (`Header` / `Body` / `Footer` / `Row` / `Cell` / `HeadCell` / `Empty` / `Loading`). A `:columns :data` driver covers the common entity-list shape; manual compound markup is an escape hatch for custom layouts. Single-column controlled sort via `v-model:sort`; opt-in row-click affordance with full keyboard navigation. Row-meta variants (`_rowVariant` / `_cellVariants`) tint rows + cells declaratively from the data.

```bash
npm install @vuecs/table
```

<Playground name="table">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import { ref } from 'vue';
import {
    VCTable,
    VCTableBody,
    VCTableCell,
    VCTableEmpty,
    VCTableHeadCell,
    VCTableHeader,
    VCTableRow,
} from '@vuecs/table';
import type { TableColumn, TableSortState } from '@vuecs/table';

type User = { id: number; name: string; email: string; role: string };

const sort = ref<TableSortState>(null);
const columns: TableColumn<User>[] = [
    { key: 'name', label: 'Name', sortable: true, isRowHeader: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role' },
];
const data: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'editor' },
];
</script>

<template>
    <VCTable v-model:sort="sort" :columns :data>
        <VCTableHeader>
            <VCTableRow>
                <VCTableHeadCell
                    v-for="col in columns" :key="col.key"
                    :column-key="col.key" :sortable="col.sortable"
                >{{ col.label }}</VCTableHeadCell>
            </VCTableRow>
        </VCTableHeader>
        <VCTableBody>
            <template #row="{ row, index }">
                <VCTableRow :row :index>
                    <VCTableCell
                        v-for="col in columns" :key="col.key"
                        :column-key="col.key" :is-row-header="col.isRowHeader"
                    >{{ row[col.key as keyof User] }}</VCTableCell>
                </VCTableRow>
            </template>
        </VCTableBody>
        <VCTableEmpty>No users yet.</VCTableEmpty>
    </VCTable>
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";
@import "@vuecs/table";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Playground>

## `<VCTable>` props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `Row[]` | `[]` | Row payload. |
| `columns` | `TableColumnRaw<Row>[]` | `undefined` | Column definitions (object form or bare-string shorthand). When omitted, columns are derived from `Object.keys(data[0])`. |
| `busy` | `boolean` | `false` | Sets `aria-busy="true"` on the `<table>` and gates the loading-band render. |
| `sort` | `{ key, direction } \| null` | `null` | Controlled sort state. Use `v-model:sort`. |
| `mustSort` | `boolean` | `false` | When true, the cycle skips the `null` step (`null → asc → desc → asc`). |
| `scrollable` | `boolean` | `false` | Wrap the `<table>` in an overflow scroll container. |
| `stickyHeader` | `boolean` | `false` | Stick the `<thead>` to the top of the scroll container. Requires `:scrollable`. |
| `maxHeight` | `string` | `undefined` | CSS length applied to the scroll container's `max-height`. |
| `rowClickable` | `boolean` | `false` | Opt-in: each row becomes focusable + clickable. Emits `@row-click`; row keyboard nav activates. |
| `density` | `'compact' \| 'normal' \| 'spacious'` | `'normal'` | Theme variant shorthand. |
| `striped` / `bordered` / `hover` | `boolean` | `undefined` | Theme variant shorthands. |

## Column shape

```ts
interface TableColumn<Row, K extends string = string> {
    key: K;
    label?: string;          // defaults to startCase(key)
    class?: VNodeClass;      // applied to <th> AND <td>
    headerClass?: VNodeClass;
    cellClass?: VNodeClass;
    sortable?: boolean;
    accessor?: string | ((row: Row) => unknown); // string supports dot-paths
    formatter?: (ctx: { value, key, row }) => string;
    isRowHeader?: boolean;   // <th scope="row"> instead of <td>
    cellAttrs?: Record<string, unknown> | ((ctx) => Record<string, unknown>);
    headerAttrs?: Record<string, unknown> | ((ctx) => Record<string, unknown>);
    headerTitle?: string;
    headerAbbr?: string;
    stickyColumn?: boolean;
    initialSortDirection?: 'asc' | 'desc';
}
```

A bare-string shorthand normalises to `{ key, label: startCase(key) }`:

```ts
columns: ['id', 'name', 'email']
// ≡ [{ key: 'id', label: 'Id' }, { key: 'name', label: 'Name' }, ...]
```

## Default cell rendering

`<VCTableCell columnKey="...">` with no slot content auto-renders the
value via the column's `accessor` + `formatter`. Slot content always
wins, so passing children opts out of the default render:

```vue
<!-- Auto-rendered: row[col.key] / accessor / formatter -->
<VCTableCell :column-key="col.key" />

<!-- Slot wins: consumer renders manually -->
<VCTableCell :column-key="col.key">
    {{ row[col.key as keyof User] }}
</VCTableCell>

<!-- With accessor dot-path + formatter -->
const columns: TableColumn<User>[] = [
    { key: 'email', accessor: 'profile.email' },
    { key: 'price', formatter: ({ value }) => `$${value}` },
];
```

`null` / `undefined` resolve to empty strings. Mounting
`<VCTableCell>` outside a `<VCTable>` (or with a `columnKey` that
isn't in the columns array) renders an empty cell.

## Driver auto-render

`<VCTable>` auto-renders the missing band(s) when `:columns` resolves
to a non-empty list and the consumer's default slot omits them. This
makes the terse form viable:

```vue
<!-- Slotless: auto-header + auto-body -->
<VCTable :columns :data />

<!-- Consumer header, auto body -->
<VCTable :columns :data>
    <VCTableHeader>
        <VCTableRow>
            <VCTableHeadCell v-for="col in columns" :key="col.key">
                {{ col.label }} <span v-if="col.sortable">⇅</span>
            </VCTableHeadCell>
        </VCTableRow>
    </VCTableHeader>
</VCTable>

<!-- Auto header + body, plus Empty band -->
<VCTable :columns :data>
    <VCTableEmpty>No users yet.</VCTableEmpty>
</VCTable>

<!-- Even terser: omit :columns and let the table derive from data[0] -->
<VCTable :data />
```

The walker recurses into Fragments, so `<template v-if>` /
`<template v-for>` around a manual `<VCTableHeader>` /
`<VCTableBody>` still suppresses the auto-render correctly.

Auto-cells use the default cell renderer (`accessor` / `formatter`)
documented above. Per-cell rendering control still requires
composing the manual chrome (`<VCTableBody>` + `<VCTableRow>` +
`<VCTableCell>` with a slot).

## Stacked responsive mode

`<VCTable :responsive />` opts in to a stacked-card layout below
the 640px viewport breakpoint. The structural CSS in
`@vuecs/table/style.css` collapses each row into a card, hides the
`<thead>` (kept for assistive tech), and shows each column label as
a `::before` pseudo element using the `data-label` attribute that
ships on every `<td>` since v0.1.

```vue
<VCTable :columns :data responsive />
```

Themes can override the breakpoint or card styling by targeting
`[data-responsive="true"]` in their own CSS. The
`--vc-table-stack-breakpoint` CSS variable is reserved for future
theme overrides (currently informational — the media-query
breakpoint is the source of truth).

## Row meta — `_rowVariant` / `_cellVariants`

Underscore-prefixed fields on the data row tint the row / specific cells without forcing a function prop:

```ts
const users: WithRowMeta<User>[] = [
    { id: 1, name: 'Alice', _rowVariant: 'warning' },
    { id: 2, name: 'Bob', _cellVariants: { email: 'error' } },
];
```

## Sort

Single-column controlled sort via `v-model:sort`. The table never sorts data — it emits intent. Consumer sorts (typically via server-side query refetch).

```vue
<VCTable v-model:sort="sort" :columns :data />
```

Clicking a `:sortable` header cycles `null → asc → desc → null`. `Enter` / `Space` on a focused `<th>` does the same. `aria-sort` flips to `ascending` / `descending` / `none`.

## Theme keys

| Component | Slot keys |
|---|---|
| `table` | `root`, `scrollContainer` |
| `tableHeader` / `tableBody` / `tableFooter` / `tableRow` / `tableEmpty` | `root` |
| `tableCell` | `root` |
| `tableHeadCell` | `root`, `sortIcon` |
| `tableLoading` | `root`, `overlay` |

## Variant axes opted-into per theme

| Component | Axis | Values |
|---|---|---|
| `table` | `density` × `striped` × `bordered` × `hover` × `stickyHeader` | `compact`/`normal`/`spacious` × boolean × boolean × boolean × boolean |
| `tableRow` | `disabled` / `selected` / `focused` / `rowVariant` | boolean × boolean × boolean × `success` / `warning` / `error` / `info` / `neutral` / `primary` |
| `tableCell` | `align` / `stickyColumn` / `cellVariant` | `left`/`center`/`right` × boolean × six semantic colors |
| `tableHeadCell` | `align` / `stickyColumn` / `sorted` | `left`/`center`/`right` × boolean × `asc`/`desc`/`none` |
| `tableEmpty` | `filtered` | boolean (distinct copy / style for empty-after-filter vs empty-no-data) |
| `tableLoading` | `overlay` | boolean (in-table band vs absolute overlay for refresh-feedback) |
