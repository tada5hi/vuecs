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

const sort = ref<TableSortState>([]);
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

## Row selection

`<VCTable :selection-mode>` enables row selection with the W3C ARIA
grid pattern. When set, the table renders as `role="grid"` with
`aria-selected` on each row and roving tabindex for keyboard
navigation.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { VCTable } from '@vuecs/table';
import type { TableColumn } from '@vuecs/table';

type User = { id: number; name: string; email: string };

const selection = ref<number[]>([]);
const columns: TableColumn<User>[] = [
    { key: 'name' },
    { key: 'email' },
];
const data: User[] = [/* ... */];
</script>

<template>
    <VCTable
        v-model:selection="selection"
        selection-mode="multi"
        :columns
        :data
    />
</template>
```

| Prop | Type | Description |
|---|---|---|
| `selectionMode` | `'single' \| 'multi'` | Enables the grid pattern. `undefined` keeps the plain-table semantics. |
| `selection` | `RowSelectionKey \| RowSelectionKey[] \| null` | Controlled selection state. Use `v-model:selection`. |
| `getRowKey` | `(row, index) => RowSelectionKey` | Resolve the selection key per row. Defaults to `row.id ?? index`. |

**Click semantics in multi mode:**

- Plain click toggles the row.
- Shift + click extends the range from the anchor.
- Ctrl / Cmd + click toggles one row without affecting the rest.

**Keyboard semantics:**

- `↓` / `↑` move focus row-by-row.
- `Home` / `End` jump to first / last.
- `Space` / `Enter` toggle the focused row.
- `Shift + ↓` / `Shift + ↑` extend the range while moving focus.

`<VCTableLite>` doesn't support selection — Lite consumers bring their
own state plumbing.

## `<VCTableLite>` — slim escape hatch

Same columns driver + theme system + auto-render as `<VCTable>`, but
without the controlled-sort + row-click + keyboard-nav machinery.
For consumers who bring their own state plumbing (e.g. tanstack-table
layered on top) and want bundle savings on the sort machine.

```vue
<script setup lang="ts">
import { VCTableLite } from '@vuecs/table';
import type { TableColumn } from '@vuecs/table';

const columns: TableColumn<User>[] = [
    { key: 'name', sortable: true },
    { key: 'email' },
];
</script>

<template>
    <!-- Same driver shape; no v-model:sort, no @row-click -->
    <VCTableLite :columns :data />
</template>
```

Sortable headers render with the indicator markup but clicking is a
no-op. `:row-clickable` is not a declared prop on `<VCTableLite>` —
it has no behavioral effect (the Lite `TableContext` pins
`rowClickable: false`), but since Lite uses
`inheritAttrs: false` + attribute fallthrough, an undeclared
attribute like `row-clickable` will still land on the `<table>` DOM
element if you pass it. Pass only the props Lite actually declares
to avoid spurious HTML attributes. All other parts
(`<VCTableHeader>`, `<VCTableBody>`, `<VCTableEmpty>`,
`<VCTableLoading>`, …) work identically.

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

Controlled sort via `v-model:sort`. The state shape is always
`SortDescriptor[]` — empty array means "no sort active",
single-column sort is an array of length 1, multi-column sort grows
the array.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { TableSortState } from '@vuecs/table';

const sort = ref<TableSortState>([]);
</script>

<template>
    <VCTable v-model:sort="sort" :columns :data />
</template>
```

Clicking a `:sortable` header cycles `[] → [asc] → [desc] → []`.
`Enter` / `Space` on a focused `<th>` does the same. `aria-sort`
flips to `ascending` / `descending` / `none`. With `<VCTable :must-sort>`,
the primary key skips the empty step (`[asc] → [desc] → [asc] → ...`)
so the data is never unsorted.

### Multi-column sort + client-side sort

| Prop | Type | Default | Description |
|---|---|---|---|
| `multiSort` | `boolean` | `false` | When `true`, Shift-click on a sortable header adds it as a secondary key (or cycles its direction). Plain click replaces. |
| `maxSortKeys` | `number` | `3` | Cap on the sort array under `:multi-sort`. `0` = unlimited. Adding past the cap evicts the oldest. |
| `clientSort` | `boolean` | `false` | When `true`, the table reorders `:data` internally — no consumer-side sort helper needed. `v-model:sort` still emits state. |

Per-column hooks:

| Field | Type | Description |
|---|---|---|
| `sortable` | `boolean` | Header is interactive (click / Enter / Space cycles sort). |
| `initialSortDirection` | `'asc' \| 'desc'` | First-click direction for this column. Default `'asc'`. |
| `sortFn` | `(a, b) => number` | Custom value comparator for client-side sort (semver, IPs, etc.). Receives resolved `accessor` (or formatter) values. |
| `sortByFormatted` | `boolean` | Client-side sort compares formatter output instead of raw accessor value. Default `false`. |
| `nullsFirst` | `boolean` | Client-side sort floats `null` / `undefined` to the top. Default — nulls sort last regardless of direction. |

```vue
<VCTable
    v-model:sort="sort"
    :columns :data
    multi-sort
    client-sort
/>
```

The numeric sort-position badge (1-based) renders via the
`data-sort-index` attribute on secondary/tertiary `<th>` cells —
the primary key keeps the up/down arrow. Themes can override the
badge via `.vc-table-head-cell[data-sort-index]::after`.

### `<VCTableSortIndicators>` — discoverable multi-sort UX

Modifier-key-free alternative to Shift-click. Renders a chip row of
active sort descriptors. Each chip is clickable (toggles asc ↔ desc)
and carries a `×` button to remove. The bar also surfaces an
**Add column** dropdown listing unsorted sortable columns, plus a
**Clear all** action.

```vue
<VCTableSortIndicators v-model:sort="sort" :columns="columns" />
<VCTable v-model:sort="sort" :columns :data multi-sort client-sort />
```

Bind `v-model:sort` to the same ref the table uses — both stay in
sync without prop forwarding. Place the chip row above or below the
table; it renders a `<div>`, so it can't live as a slot child of
`<VCTable>` (the default slot goes inside `<table>`).

All text strings are customisable. Per-instance via props
(`:label`, `:emptyContent`, `:addLabel`, `:clearLabel`,
`:removeAriaLabel`) or app-wide via `useComponentDefaults`:

```ts
app.use(vuecs, {
    defaults: {
        tableSortIndicators: {
            label: 'Sortieren:',
            emptyContent: 'Keine Spalten sortiert',
            addLabel: '+ Spalte hinzufügen',
            clearLabel: 'Alle entfernen',
            removeAriaLabel: 'Sortierschlüssel entfernen',
        },
    },
});
```

Customisable text keys: `label`, `emptyContent`, `addLabel`,
`clearLabel`, `removeAriaLabel`, `toggleAscTitle`, `toggleDescTitle`,
`arrowAsc`, `arrowDesc`, `removeGlyph`.

Slot overrides for visual customisation: `#label`, `#empty`,
`#chip="{ descriptor, index, position, toggle, remove }"`,
`#add="{ options, add }"`, `#clear="{ clear }"`, or `#default` for a
complete layout replacement using the same handlers.

::: warning Breaking change in v1.x-B
`v-model:sort` is now `SortDescriptor[]` instead of v0.1's
`{ key, direction } \| null`. Migrate single-sort bindings as:

```diff
- const sort = ref<TableSortState>(null);
+ const sort = ref<TableSortState>([]);

- if (sort.value) { ... }
+ if (sort.value.length > 0) {
+     const { key, direction } = sort.value[0];
+ }
```
:::

## Theme keys

| Component | Slot keys |
|---|---|
| `table` | `root`, `scrollContainer` |
| `tableHeader` / `tableBody` / `tableFooter` / `tableRow` / `tableEmpty` | `root` |
| `tableCell` | `root` |
| `tableHeadCell` | `root`, `sortIcon` |
| `tableLoading` | `root`, `overlay` |
| `tableSortIndicators` | `root`, `label`, `empty`, `chip`, `chipToggle`, `chipPosition`, `chipLabel`, `chipArrow`, `chipRemove`, `add`, `clear` |

## Variant axes opted-into per theme

| Component | Axis | Values |
|---|---|---|
| `table` | `density` × `striped` × `bordered` × `hover` × `stickyHeader` | `compact`/`normal`/`spacious` × boolean × boolean × boolean × boolean |
| `tableRow` | `disabled` / `selected` / `focused` / `rowVariant` | boolean × boolean × boolean × `success` / `warning` / `error` / `info` / `neutral` / `primary` |
| `tableCell` | `align` / `stickyColumn` / `cellVariant` | `left`/`center`/`right` × boolean × six semantic colors |
| `tableHeadCell` | `align` / `stickyColumn` / `sorted` | `left`/`center`/`right` × boolean × `asc`/`desc`/`none` |
| `tableEmpty` | `filtered` | boolean (distinct copy / style for empty-after-filter vs empty-no-data) |
| `tableLoading` | `overlay` | boolean (in-table band vs absolute overlay for refresh-feedback) |
