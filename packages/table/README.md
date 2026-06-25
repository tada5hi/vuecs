# @vuecs/table

[![npm version](https://img.shields.io/npm/v/@vuecs/table)](https://www.npmjs.com/package/@vuecs/table)
[![CI](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

**The compound table of [vuecs](https://github.com/tada5hi/vuecs)** — semantic HTML for entity-list pages. Drive it with `:columns` + `:data` for the terse path, or compose the parts by hand for layouts the driver can't express. Both shapes mix freely.

## ✨ What's inside

- 🧾 **Columns/data driver** — pass `:columns` (or let them auto-derive from `data[0]`) and the table renders header + body for you; `#cell-<key>` / `#header-<key>` slots override per column. Column shape is a near-superset of bootstrap-vue-next's `TableField`, with `accessor` (dot-paths or functions) + `formatter`.
- 🔼 **Sorting** — controlled `v-model:sort` (`SortDescriptor[]`), multi-column via Shift-click or the `<VCTableSortIndicators>` chip row, optional `client-sort` with per-column comparators (`sortFn`, `sortByFormatted`, `nullsFirst`).
- ☑️ **Row selection** — `selection-mode="single|multi"` with the W3C ARIA grid pattern: roving tabindex, Shift-ranges, Ctrl-toggles, and an `isSelector` checkbox/radio column with select-all.
- 📂 **Expandable rows** — `:expandable` + `#expansion` slot for inline detail panels; ResizeObserver-measured height animation, disclosure-pattern ARIA, single (accordion) or multi mode.
- 📱 **Stacked responsive mode** — `:responsive` collapses to per-row cards below 640 px, labels read from `data-label`.
- 🎨 **Row/cell tinting** — `_rowVariant` / `_cellVariants` row-meta keys color rows and individual cells without function props.
- 🔤 **Typed rows** — `<VCTable>` / `<VCTableLite>` are generic over their row type, so `:data` / `:columns` drive typed slot props (`#cell-<key>="{ row }"`, `#header-<key>`, `#default`) — no `as` cast. `<VCTable>` also types its `#expansion` slot and the `@row-click` / `getRowKey` callbacks.
- 🪶 **`<VCTableLite>`** — same driver, theme wiring, and auto-render, minus sort/selection state — perfect under tanstack-table.
- 🦴 **`<VCTablePlaceholder>`** — matching skeleton for loading states.

## 📦 Installation

```bash
npm install @vuecs/table
```

## ⚡ Usage

**Driver shape (recommended):**

```vue
<VCTable
    :columns="[
        { key: 'name', label: 'Name', sortable: true, isRowHeader: true },
        { key: 'email', label: 'Email' },
    ]"
    :data="users"
    v-model:sort="sort"
    :busy="loading"
    multi-sort
    client-sort
>
    <template #cell-email="{ value }">
        <a :href="`mailto:${value}`">{{ value }}</a>
    </template>
    <VCTableEmpty>No users yet.</VCTableEmpty>
</VCTable>
```

**Compound shape (escape hatch):**

```vue
<VCTable :data="orders">
    <VCTableHeader>
        <VCTableRow>
            <VCTableHeadCell>Order</VCTableHeadCell>
            <VCTableHeadCell>Customer</VCTableHeadCell>
        </VCTableRow>
    </VCTableHeader>
    <VCTableBody>
        <template #row="{ row }">
            <VCTableRow>
                <VCTableCell>#{{ row.id }}</VCTableCell>
                <VCTableCell>{{ row.customer }}</VCTableCell>
            </VCTableRow>
        </template>
    </VCTableBody>
</VCTable>
```

## 📚 Documentation

Full reference — sorting, selection, expansion, theming: **[vuecs.dev/components/table](https://vuecs.dev/components/table)**

## License

Made with 💚

Published under [Apache 2.0 License](./LICENSE).
