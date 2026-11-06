# Table compound

Semantic-HTML compound for entity-list pages. Outer `<VCTable>` + eight
parts (`<VCTableHeader>` / `<VCTableBody>` / `<VCTableFooter>` /
`<VCTableRow>` / `<VCTableCell>` / `<VCTableHeadCell>` / `<VCTableEmpty>` /
`<VCTableLoading>`). Layer 1 — `@vuecs/core` peer dep only; no Reka dep
(no Reka table primitive exists, semantic HTML covers it).

### Two authoring shapes

- **`:columns :data` driver** (primary): consumer passes `:columns`
  (array of `TableColumn` or bare-string shorthand) + `:data`; uses
  `#cell-<key>` / `#header-<key>` slots for per-column overrides.
  Direct lift-and-shift from `<BTable :fields :items>`.
- **Manual compound markup** (escape hatch): consumer writes
  `<VCTableHeader>` + `<VCTableBody>` + `<VCTableRow>` etc by hand for
  layouts that don't fit the driver (merged cells, custom row
  groupings, multi-line rows).

Both shapes can mix — pass `:columns` AND write `<VCTableHeader>` to
override only the header band, etc.

### Generic over `Row` (issue #1601)

`<VCTable>` and `<VCTableLite>` are published as **generic components**
— `Row` is inferred from `:data` / `:columns` and flows into the shared
slot props (`#cell-<key>` → `{ row: Row }`, `#header-<key>` →
`{ column: TableColumn<Row> }`, `#default` → `{ data: Row[] }`).
`<VCTable>` additionally threads `Row` through its `#expansion` slot
(`{ row: Row }`) and the `@row-click` / `getRowKey` props — none of
those exist on `<VCTableLite>`.
Inferring `Row` per call site also **dissolves the `TableColumn`
variance friction** the issue describes: `TableColumn<User>[]` assigns
to `:columns` because `Row` resolves to `User` rather than being pinned
at `unknown`.

The runtime stays a plain `defineComponent` render-function component
(SFC convention); the default export is **cast** to a generic
call/return signature `vue-tsc` recognizes (`GenericComponentShape`,
imported from `@vuecs/core` since #1660 — promoted there so
`@vuecs/table`, `@vuecs/list`, and third-party libs share one helper;
Volar reads slot types off a `__ctx` member on the return type). `Row`
is unconstrained (default `Record<string, unknown>`) so interface-typed
rows infer cleanly. See
[Conventions → Generic-over-data components](../conventions.md#generic-over-data-components--definecomponent--cast-not-script-setup-generic)
for the full pattern and rules. **Scope:** the driver path only — the
manual-compound parts (`<VCTableRow>` / `<VCTableCell>` /
`<VCTableHeadCell>`, `<VCTableSortIndicators>`) stay non-generic, so
hand-written compound markup casts its own row.

### Driver auto-render

When `:columns` resolves to a non-empty list AND the consumer's
default slot omits the band, `<VCTable>` auto-renders the missing
piece — same shape as Shape A's intent, no manual chrome required.

- **`<VCTable :columns :data />`** (slotless): renders auto-header +
  auto-body.
- **`<VCTable :columns :data><VCTableHeader>…</VCTableHeader></VCTable>`**:
  consumer header + auto-body.
- **`<VCTable :columns :data><VCTableBody>…</VCTableBody></VCTable>`**:
  auto-header + consumer body.
- **`<VCTable :columns :data><VCTableEmpty>…</VCTableEmpty></VCTable>`**:
  auto-header + auto-body (returns null when data empty) + Empty
  band — the three render as adjacent `<tbody>`s.

Detection walks the slot's rendered vnodes and recurses into
`Fragment` children so `<template v-if>` / `<template v-for>` wrapping
around a band doesn't hide it from the walker.

Explicit `:columns="[]"` is authoritative — no auto-render fires.
Unset `:columns` falls through to the existing auto-derive
(`Object.keys(data[0])`) behavior, which composes naturally with
auto-render (`<VCTable :data />` becomes a viable terse form).

Auto-cells render via the v0.2-A default cell renderer
(`accessor` + `formatter`); auto-headers render `column.label` and
forward `column.sortable`. The auto-render also honors the
per-column display fields off `TableColumn`:

- `class` → applied to BOTH `<th>` and `<td>`.
- `headerClass` → additive on `<th>`.
- `cellClass` → additive on `<td>`.
- `stickyColumn` → forwarded to both head + body cells.
- `headerTitle` / `headerAbbr` → native `<th title>` / `<th abbr>`.
- `isRowHeader` → renders the body cell as `<th scope="row">`.

The function-form escape hatches `cellAttrs` / `headerAttrs` are
out of scope for the auto-render path — consumers needing per-cell
attribute resolution compose the manual chrome and slot-render
those cells themselves.

### Lite escape hatch — `<VCTableLite>`

Slim sibling of `<VCTable>` for consumers who want the columns
driver + theme system + auto-render but bring their own state
plumbing (e.g. tanstack-table layered on top). Drops:

- `useSortMachine` (no `:sort` / `:must-sort` / `@update:sort`).
- Row-click + keyboard-nav wiring (no `:row-clickable` / `@row-click`).
- `focusedRow` state.

Provides the same `TableContext` shape so child components
(`<VCTableRow>`, `<VCTableHeadCell>`, …) work identically. The sort
+ row-click hooks resolve to no-ops, so sortable headers and
`:row-clickable` rows visually behave as if the consumer hadn't
opted in. The auto-render path (v0.2-B), default cell renderer
(v0.2-A), stacked responsive mode (v0.2-D), `<VCTableEmpty>` /
`<VCTableLoading>` band rendering, and `caption` / `colgroup` slots
all work identically.

Lite-only consumers tree-shake `useSortMachine` out of their
bundle. The shared `composeTableInner()` helper in
`packages/table/src/utils/auto-render.ts` is what both SFCs call to
build their `<table>` children — adding new behavior to the
auto-render path stays single-source.

### Row selection + grid a11y

`<VCTable :selection-mode>` enables row selection with the W3C ARIA
grid pattern. When set (`'single'` or `'multi'`), the table flips to:

- `role="grid"` on `<table>`; `aria-multiselectable="true"` for multi.
- `role="row"` + `aria-selected="true|false"` on every `<tr>`.
- Roving tabindex — only the focused row carries `tabindex="0"`,
  others get `-1`. Tab exits the grid (W3C grid pattern); arrow
  keys move row-by-row within.

**Public API:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `selectionMode` | `'single' \| 'multi'` | `undefined` | Enables the grid pattern. `undefined` keeps v0.1 plain-table semantics. |
| `selection` | `RowSelectionKey \| RowSelectionKey[] \| null` | `null` | Controlled selection state. Use `v-model:selection`. |
| `getRowKey` | `(row, index) => RowSelectionKey` | `row.id ?? index` | Resolve the selection key per row. |

Events:

- `update:selection` — fired on toggle / range / ctrl-click.

**Click semantics in multi mode:**

- Plain click → toggle this row's membership.
- Shift + click → range select from the last-clicked anchor.
- Ctrl/Cmd + click → toggle one without affecting others.

**Keyboard semantics:**

- `↓` / `↑` move focus row-by-row (does not toggle).
- `Home` / `End` jump to first / last row.
- `Space` / `Enter` toggle the focused row.
- `Shift + ↓` / `Shift + ↑` extend the range while moving focus.

**`<VCTableRow>` selection rendering:**

- Resolves `selected` from `useTable().selection.isSelected(key)`
  unless the consumer passes an explicit `:selected` (the v0.1
  declarative escape hatch).
- Folds `selected` into `themeVariant` so the `tableRow.selected`
  variant axis lights up. All three shipping themes declare it.

**Composition with `:row-clickable`:**

- `:row-clickable` and `:selection-mode` compose. A click on a
  selectable + row-clickable row both toggles selection AND emits
  `@row-click`. Consumers can opt in to either independently.

**Limitations / forward-compat:**

- `<VCTableHeadCell isSelector>` (select-all header) is not in v1.x-A
  scope. The plan reserves it for a follow-up once consumer demand
  is concrete.
- Cell-level focus (W3C grid pattern variant for spreadsheet-like
  data grids) is out of scope. Row-level focus is the v1.x-A
  default; a future `:a11y-mode="cells"` could layer on top.
- `useRowSelectionMachine` lives in `@vuecs/table` today but is
  data-shape-agnostic — a follow-up will promote it to
  `@vuecs/core/utils/composables` so `@vuecs/list`'s near-identical
  composable can dedupe to a single source.

### Stacked responsive mode

`<VCTable :responsive />` collapses the table into per-row cards
below the structural-CSS breakpoint (default 640px). Implementation:

- `<VCTable>` adds `data-responsive="true"` on the `<table>` when the
  `responsive` prop is set.
- Structural CSS in `packages/table/assets/index.css` ships the
  baseline stack rules under `@media (max-width: 640px)
  .vc-table[data-responsive="true"] { … }`. `<thead>` is
  visually-hidden (kept for a11y), `<tbody>` / `<tr>` become block,
  each `<td>` becomes a flex row with a `::before` pseudo reading
  the column label from `data-label`.
- Themes can override the breakpoint or card styling by targeting
  `[data-responsive="true"]` themselves. Each shipping theme keeps
  the structural baseline today; theme-specific stacked variants
  ship when consumers ask for them.

Every `<td>` emits `data-label="<column.label>"`; stacked rendering consumes that attribute.

### Column shape (excerpt)

```ts
type TableColumnRaw<Row> = string | TableColumn<Row>;  // bare-string shorthand
interface TableColumn<Row, K extends string = string> {
    key: K;
    label?: string;                              // defaults to startCase(key)
    class?: VNodeClass;                           // applied to both <th> AND <td>
    headerClass?: VNodeClass;                     // additive on <th>
    cellClass?: VNodeClass;                       // additive on <td>
    sortable?: boolean;
    accessor?: string | ((row: Row) => unknown); // string supports dot-paths
    formatter?: (ctx: { value, key, row }) => string;
    isRowHeader?: boolean;                        // <th scope="row"> instead of <td>
    cellAttrs?: ... | (ctx) => ...;               // per-cell data-* / aria-* escape hatch
    headerAttrs?: ... | (ctx) => ...;             // per-header escape hatch
    headerTitle?: string;                         // native <th title>
    headerAbbr?: string;                          // native <th abbr>
    stickyColumn?: boolean;
    initialSortDirection?: 'asc' | 'desc';
}
```

Near-superset of bootstrap-vue-next's `TableField` so most field
entries copy verbatim from a migration. Auto-derive: when `:columns`
is omitted and `data[0]` is an object, columns come from
`Object.keys(data[0])` (skipping underscore-prefixed row-meta keys).

### Default cell rendering

`<VCTableCell columnKey="...">` without slot content auto-renders the
cell value when both `<VCTable>` and `<VCTableRow>` context are
available. Resolution order per cell:

1. **Slot content wins** — any non-whitespace / non-comment slot content
   skips the auto-render entirely. The consumer keeps full control by
   passing children.
2. **Column lookup** — `columnKey` is matched against `tableCtx.columns`.
   No match → empty cell (no fallback to `row[columnKey]`).
3. **Value resolution** — `resolveCellValue(column, row)`:
   - `column.accessor` function → `accessor(row)`
   - `column.accessor` string → dot-path lookup on `row` (e.g.
     `'profile.email'`)
   - else → `row[column.key]`
4. **Formatting** — when `column.formatter` is set, it receives
   `{ value, key, row }` and its return value is rendered. Otherwise
   `null` / `undefined` render as `''`; everything else via `String(...)`.

The slot-vs-auto branch is decided by `isMeaningfulSlotContent()`
(a shared helper exported from `@vuecs/core`) — Vue passes
`slots.default` as an always-present render fn when a `<template>`
slot is declared, so a naive `slots.default?.()` truthy check would
always pick the slot path. The helper walks the returned vnode array
(recursing into `Fragment` children) and considers a slot meaningful
when it contains an element, a component, or a text node with
non-whitespace content — comment anchors (`v-if="false"`), whitespace,
and empty arrays are treated as empty. The same helper gates the
`<VCAlert>` `#icon` slot, `<VCButton>`'s `#leading` / `#trailing`
slots (fall back to the icon prop / default), `<VCFormCheckbox>`'s
`#indicator` slot (falls back to the built-in check / dash glyph —
see [Form glyphs](css.md#form-glyphs-are-rendered-not-css-masks-1694)), and
`<VCTableCell>`'s auto-render.

Mounting `<VCTableCell>` outside a `<VCTable>` context renders an
empty cell — no fallback to `row[columnKey]` from inject. Manual
compound markup that needs auto-render must wrap rows in
`<VCTableRow :row :index>` inside a `<VCTable>` so the contexts
exist.

### Row-meta convention (`_rowVariant` / `_cellVariants`)

Underscore-prefixed fields on the data row tint rows / specific cells
without a function prop. Resolved by `<VCTableRow>` (via row context)
and `<VCTableCell>` (via `columnKey` lookup in `_cellVariants`):

```ts
const users: WithRowMeta<User>[] = [
    { id: 1, name: 'Alice', _rowVariant: 'warning' },
    { id: 2, name: 'Bob', _cellVariants: { email: 'error' } },
];
```

### Sorting

Controlled sort via `v-model:sort`. **State shape is
`SortDescriptor[]` since v1.x-B** (breaking change from v0.1's
`{ key, direction } | null`). Empty array means "no sort";
single-column sort is an array of length 1; multi-column sort grows
the array, primary key first.

`setSort(key, opts)` cycles state via `useSortMachine`. Plain call
replaces the entire sort with `[{ key, initialDirection }]`,
cycling that single key through `[] → [asc] → [desc] → []` (or
`→ [asc]` when `:must-sort`). `opts.append === true` (Shift-click
on a sortable header) adds the key as a secondary descriptor or
cycles its direction if already present; cycling past removes just
that key. `opts.direction` jumps straight to a given direction
honoring `append`. Clicks + Enter/Space on a `:sortable`
`<VCTableHeadCell>` invoke it; `aria-sort` paints the W3C state.

**Per-column hooks** drive client-side sort behaviour:

- `initialSortDirection: 'asc' | 'desc'` — first-click direction.
  Default `'asc'`.
- `sortFn(a, b): number` — value comparator (Array.sort
  ergonomics). Receives resolved `accessor` / formatter values.
  Use for semver, IP, locale-aware strings.
- `sortByFormatted: boolean` — when `true`, compare formatter output
  rather than raw accessor value. Default `false`.
- `nullsFirst: boolean` — float `null` / `undefined` to the top.
  Default — nulls sort LAST regardless of direction.

**v1.x-B props on `<VCTable>`:**

| Prop | Default | Description |
|---|---|---|
| `multiSort` | `false` | Shift-click on a sortable header adds the key as a secondary descriptor instead of replacing. |
| `maxSortKeys` | `3` | Cap on the sort array length. `0` = unlimited. Oldest descriptor evicted when over cap. |
| `clientSort` | `false` | When `true`, the table reorders `:data` internally via `sortRows()` (in `utils/sort-rows.ts`); `v-model:sort` still emits state. |

The sort machine + the `sortRows` utility are decoupled — consumers
can use the machine for state without enabling `:client-sort`
(server-side sort path), or call `sortRows()` directly outside the
component for pre-render sort logic.

**Numeric badge for multi-sort positions 2+:** `<VCTableHeadCell>`
emits `data-sort-index="N"` (1-based) on the rendered `<th>` when
the column is at position 2+ in the sort array. Structural CSS
ships an `::after` superscript badge; themes can override at
`.vc-table-head-cell[data-sort-index]::after`. Position 1 keeps the
up/down arrow span.

### `<VCTableSortIndicators>` chip row

Modifier-key-free alternative to Shift-click for managing multi-
column sort. Renders one chip per active descriptor — clicking the
chip toggle button toggles asc ↔ desc, the trailing `×` button
removes that key — plus an **Add column** `<select>` listing
unsorted `:sortable` columns and a **Clear all** action.

**Chip structure.** Each chip is a non-interactive `<div>` wrapper
containing **two real `<button>` elements** (`chipToggle` + `chipRemove`).
Nesting one interactive element inside another is invalid HTML
(browsers hoist the inner button) and a screen-reader trap (nested
role=button announcements), so the wrapper carries the visual pill
styling while the inner buttons are themed borderless to inherit it.

**Default v-model mode (recommended)** — pass `:sort` + `:columns`
and bind `v-model:sort` against the same ref the `<VCTable>` reads.
Place the chip row as a sibling of the table:

```vue
<VCTableSortIndicators v-model:sort="sort" :columns="columns" />
<VCTable v-model:sort="sort" :columns :data multi-sort client-sort />
```

**Fallback context mode** — reads `sort` / `columns` /
`setSortState` from `useTable()` when neither prop is passed. Only
usable in custom layouts where the chip row's `<div>` can render
inside the table's component tree (the default `<table>` element
host means default-slot children become DOM children of `<table>`,
where a `<div>` is invalid HTML).

**Customisable text strings** flow through
`useComponentDefaults('tableSortIndicators', …)` — every key
(`label`, `emptyContent`, `addLabel`, `clearLabel`,
`removeAriaLabel`, `toggleAscTitle`, `toggleDescTitle`, `arrowAsc`,
`arrowDesc`, `removeGlyph`) is overridable per-instance via props
OR app-wide via the `defaults` install option.

**Slot escape hatches**: `#label`, `#empty`, `#chip="{ descriptor,
index, position, toggle, remove }"`, `#add="{ options, add }"`,
`#clear="{ clear }"`, or `#default` for full layout replacement
with the same handlers exposed as slot props.

**Underlying primitive**: the sort machine exposes `setState(state)`
(in addition to `setSort(key, opts)`) for absolute state
replacement; `<VCTable>` threads it through
`TableContext.setSortState`. Bypassing `multiSort` gating is
intentional — the chip row's `Add column` dropdown adds keys
regardless of the prop value (consumers who mount the chip row are
opted into multi-key management). The `maxSortKeys` cap is also
exposed via `TableContext.maxSortKeys` (or a `:max-sort-keys` prop
on the chip row directly) and is enforced **at the chip-row call
site** — `setState` itself stays cap-agnostic. Adding past the cap
evicts the oldest descriptor (mirrors the sort machine's
`appendCapped` semantic for Shift-click).

**`null` v-model handling**: passing `:sort="null"` keeps v-model
mode active (writeback path emits `update:sort`) but renders an
empty array, so migration-era consumers carrying
`ref<TableSortState | null>(null)` don't crash on `.map`. Only
`undefined` (i.e. the prop is unbound) falls back to context.

### Selection column

`<VCTableHeadCell isSelector>` + `<VCTableCell isSelector>` build a
Gmail-style selection column inside a grid-pattern table:

- **Head cell** — renders an indeterminate-capable
  `<input type="checkbox">` when `selection-mode === 'multi'`. State
  derives from the visible data set: `all` → checked; `some` →
  indeterminate; `none` → unchecked. Click toggles between
  select-all (writes `[...allRowKeys]`) and clear-all (writes `[]`).
  In `single` mode the cell renders empty (select-all doesn't
  apply); with no selection mode it falls back to the default slot
  so consumers can keep the column structurally present.
- **Body cell** — renders a per-row `<input type="checkbox">`
  (multi) or `<input type="radio">` (single), bound to
  `selection.isSelected(rowKey)`. Click stops propagation + calls
  `selection.toggle(rowKey)`. Falls back to the default slot when
  selection is disabled.

Underlying primitive: the selection machine gained a `setValue(next)`
method for absolute state replacement (parallels the sort machine's
`setState`). Used by the select-all path to write `[]` or
`[...allKeys]` in one shot; toggle / range / Ctrl semantics live on
the cycle methods as before.

### Shared selection machine (`useSelectionMachine` in `@vuecs/core`)

The selection state machine that drives both `<VCList>` (ARIA
listbox) and `<VCTable>` (ARIA grid) now lives at
`@vuecs/core/utils/composables/use-selection-machine.ts`. Both
packages re-export it under their own type aliases for back-compat
(`useRowSelectionMachine` / `RowSelectionKey` in `@vuecs/table`;
`useSelectionMachine` / `SelectionKey` in `@vuecs/list`), but the
runtime is single-source. Promotion is intentional — the machine is
data-shape-agnostic (`keyAt` mapper, mode-aware
toggle / range / Ctrl), and duplicating it across two packages
created drift risk on every bug fix.

The shape is **slim by design**: tracks selection state only, never
focus. Focus management is a per-consumer concern — the table keeps
`focusedRow` on its own context; the list component handles its own
roving tabindex. Coupling focus to selection made the shared API
misleading.

### Row click + keyboard navigation

`:row-clickable` opt-in adds `tabindex="0"` + `cursor-pointer` per row
and wires the keyboard ladder (`↓` / `↑` / `Home` / `End` + Shift, plus
Enter / Space for activation). The click handler runs through a shared
`filterRowClickEvent()` helper that suppresses the row-click when the
event originates inside an interactive descendant — `<a>`, `<button>`,
`<input>`, `<select>`, `<textarea>`, `<label for>`, `[role=button]`,
`[role=link]`, `[contenteditable]`, `[tabindex]:not([tabindex="-1"])`,
or `.vc-overlay-portal-content`. Ported from bootstrap-vue-next's
`utils/filterEvent.ts`; intended to migrate into `@vuecs/core/utils`
so `<VCListItem>`'s selection click can share it.

`useTable().focusedRow` tracks the current focus index — forward-compat
hook for future selection v1.x.

### Colspan resolution (D3 reversal)

`<VCTableEmpty>` and the default-mode `<VCTableLoading>` resolve their
`<td colspan="N">` from two parallel paths:

1. **Shape A** — `columns.length` when `:columns` is set on `<VCTable>`.
2. **Shape B** — auto-count from `<VCTableHeadCell>` siblings via a
   render-time `provide`/`inject` ref. `<VCTableFooter>` provides a
   no-op variant so footer cells don't double-register.

Per-instance `:colspan` on Empty / Loading wins over both. Do not use a sentinel colspan such as `9999`: Firefox honors the literal value instead of clamping it. Auto-counting plus the explicit prop covers the supported cases.

### Sortable header role (D4 reversal)

Sortable `<VCTableHeadCell>` renders as
`<th tabindex="0" role="columnheader" aria-sort="…">` — native
column-header semantics rather than a nested `<button>`. JAWS / NVDA /
VoiceOver announce column-header context more strongly than a wrapped
button; one focus stop per cell; DOM matches `<BTable>`'s output so
visual-regression markup stays consistent. Do not add a second nested button focus stop.

### Free-win a11y attributes

Applied unconditionally:

- `<table aria-busy="true">` while `:busy`.
- `aria-sort="ascending" | "descending" | "none"` on sortable `<th>`.
- Smart `<th scope>` default — `colgroup` for `colspan > 1`,
  `rowgroup` for `rowspan > 1`, else `'col'`.
- `data-label="<column.label>"` on every `<td>` — forward-compat for
  future stacked-mode CSS (responsive collapse to cards), out of
  scope for v0.1 but adding the attribute now means consumers don't
  rewrite cells later.
- `role="alert" aria-live="polite"` on `<VCTableEmpty>` and
  `role="status" aria-live="polite" aria-busy="true"` on
  `<VCTableLoading>`.

### Theme entries

Theme entries ship in **all three** shipping themes (tailwind /
bootstrap / bulma). theme-bootstrap composes Bootstrap's native
`.table` family (`table-striped`, `table-bordered`, `table-hover`,
`table-sm`, `table-success`, …). theme-bulma composes Bulma's
`.table` family (`is-striped`, `is-bordered`, `is-hoverable`,
`is-narrow`, `has-background-success-light`, …). theme-tailwind
emits utility classes via `@vuecs/design` semantic tokens
(`bg-bg-muted`, `border-border`, `text-fg`).

Bootstrap + Bulma theme strings can't carry `[aria-sort=…]` attribute
selectors, so sort-indicator state lives in dedicated
`vc-table-sort-{asc,desc}` helpers in each bridge's `assets/index.css`.
Sticky-header / sticky-column / row-focused / row-disabled use the
same gap-fill helper pattern (`vc-table-sticky-{header,column}`,
`vc-table-row-{focused,disabled}`) — Bootstrap's `.table-active`
inverts on hover and `.table-success/-warning/-danger` use Bootstrap's
runtime variables, both of which bridge correctly through
`--bs-*` → `--vc-color-*`.

### Expandable rows

Per-row expansion panels for inline entity detail (log payloads,
audit trails, comment threads). `<VCTable :expandable>` enables the
feature; each rendered row becomes a Vue Fragment of two `<tr>`: the
data row + a sibling `<tr><td colspan="N">` containing the
ResizeObserver-measured animated panel. A `#expansion="{ row, index }"`
scoped slot drives the panel content; an auto-injected leading (or
trailing) trigger column carries a chevron `<button>` with the
W3C disclosure pattern (`aria-expanded` + `aria-controls`).

**Public surface additions on `<VCTable>`:**

| Prop | Default | Purpose |
|---|---|---|
| `expandable` | `false` | Master opt-in. Drives `colspan` bump + auto-trigger injection. |
| `expanded` | `[]` | Controlled key array. `v-model:expanded`. |
| `expansionMode` | `'multi'` | `'single'` = accordion. |
| `expandableTrigger` | `'leading'` | `'leading'` / `'trailing'` / `'none'`. |

**New exposed components:**

- `<VCTableExpandTrigger>` — the chevron `<button>`. Auto-injected
  when `:expandableTrigger !== 'none'`; consumer-placed when
  `'none'`. Reads expansion state from row context; dev-warns when
  mounted outside an `:expandable` row.
- `<VCTableRowExpansion>` — internal (mounted by `<VCTableRow>`'s
  render fn). Exported for type-import only.

**State machine.** Reuses `useSelectionMachine` from `@vuecs/core` —
the "set of currently open row keys" semantic generalises directly.
Two independent instances live on the `TableContext`: `selection` and `expansion`. Both use the same
`getRowKey` resolution.

**Three-tier per-row state resolution** (in `<VCTableRow>`):
1. Bound `:open` prop → fully controlled, emits `update:open`,
   detached from table-level state.
2. Parent `<VCTable :expandable>` provides the expansion machine →
   read/write via `selectionKey` lookup.
3. Else → internal `ref(false)`, seeded ONCE from `row._expanded`.

`<VCTableLite>` provides `expansion: undefined` on its context, so
rows in a Lite host fall back to controlled `:open` or internal
state.

**Animation.** ResizeObserver-measured height — no max-height
sentinel. The inner content `<div>` is observed; the outer animated
wrapper consumes the measurement via inline
`--vc-table-row-expansion-height` CSS variable. SSR-safe (`typeof
ResizeObserver !== 'undefined'` guard); first-paint mitigated via
synchronous `offsetHeight` read at mount. Keyframes live in
`packages/table/assets/index.css`; `prefers-reduced-motion: reduce`
collapses duration to 1ms.

**ARIA.** Disclosure pattern only — trigger carries `aria-expanded`
+ `aria-controls`, panel carries `id` + `aria-labelledby`. NO
`role="region"` on the panel (would create landmark noise for short
detail panels; consumers can add it on their own slot content when
appropriate).

**Composition with selection.** Trigger button clicks `stopPropagation()`
the row-click event AND are filtered by `filterRowClickEvent` (which
already skips `<button>`-originated clicks), so neither selection
toggle nor `@row-click` fires. Selection and expansion are orthogonal
axes — a row can be selected AND expanded independently (Gmail-style).

**Theme keys.** `tableRowExpansion` (slots: `root` / `cell` / `panel`
/ `panelInner`), `tableExpandTrigger` (slots: `root` / `icon`),
`tableExpandTriggerCell` (slot: `root`). Shipped across all three
themes (`tailwind` / `bootstrap` / `bulma`).

**Behavioral defaults.** `tableExpandTrigger.expandLabel` /
`collapseLabel` / `chevronIcon` — overridable via
`app.use(vuecs, { defaults: { tableExpandTrigger: { ... } } })` for
i18n. Lucide + Font Awesome icon presets ship `chevronIcon` defaults.

**Runtime dependency.** `reka-ui` is an internal dependency of `@vuecs/table`. That matches every other Reka-consuming package: `forms`,
`elements`, `navigation`, `overlays`, `pagination`, and `tree` all
declare `"reka-ui": "^2.10.1"` under `dependencies`. Reka is an
implementation detail of those packages (consumers never import it
directly — see [Building blocks (Reka UI)](reka-primitives.md)),
so it is installed transitively rather than declared as an application peer. Justified for
table by `<Presence>` being the right primitive for the unmount-delay
pattern; rolling our own would re-invent half of `reka-ui`.

### Out of scope for v0.1

Virtual scrolling (tanstack-virtual on top of the compound is the
doctrinal path); drag-and-drop column reordering; pivot /
aggregate / grouping (different compound entirely). Nested tables
within an expansion are unsupported as a primitive but consumers
can compose any markup including another `<VCTable>` inside the
`#expansion` slot.
