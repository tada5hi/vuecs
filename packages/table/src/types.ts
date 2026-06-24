import type { VNode } from 'vue';
import type { ThemeElementDefinition, VNodeClass } from '@vuecs/core';

// ──────────────────────────────────────────────────────────────────────────
// Column shape (plan 028 §"Column definition shape")
// ──────────────────────────────────────────────────────────────────────────

/**
 * Bare-string shorthand: `'name'` is equivalent to
 * `{ key: 'name', label: startCase('name') }`.
 */
export type TableColumnRaw<Row = unknown, K extends string = string> =    | K |
    TableColumn<Row, K>;

export type TableColumnFormatterCtx<Row, K extends string = string> = {
    value: unknown;
    key: K;
    row: Row;
};

export type TableColumnHeaderAttrsCtx<K extends string = string> = {
    key: K;
    type: 'top' | 'bottom';
};

export interface TableColumn<Row = unknown, K extends string = string> {
    /** Key into the row object. Used as the cell value default and the slot suffix. */
    key: K;

    /** Heading text. Defaults to `startCase(key)`. Override per-column via `#header-<key>` slot. */
    label?: string;

    /** Optional class string applied to BOTH `<th>` AND `<td>` for this column. */
    class?: VNodeClass;

    /** Class concatenated onto the `<th>` (in addition to `class`). Additive, not replacing. */
    headerClass?: VNodeClass;

    /** Class concatenated onto the `<td>` (in addition to `class`). Additive, not replacing. */
    cellClass?: VNodeClass;

    /** Marks the column sortable. Click / Enter / Space cycles sort state and emits `update:sort`. */
    sortable?: boolean;

    /**
     * Value accessor when the row's value isn't `row[key]`.
     * - String: dot-path (e.g. `'profile.email'`) — resolved against `row` at render time.
     * - Function: `(row) => unknown` — full custom resolution.
     */
    accessor?: string | ((row: Row) => unknown);

    /**
     * Default cell renderer when `#cell-<key>` slot isn't provided.
     * Object-arg shape (matches `cellAttrs` / `headerAttrs`).
     */
    formatter?: (ctx: TableColumnFormatterCtx<Row, K>) => string;

    /**
     * Render this column's `<td>` as `<th scope="row">` instead.
     * Highest-leverage a11y switch for entity-name columns: screen readers
     * announce row-header + column-header for every other cell in the row.
     */
    isRowHeader?: boolean;

    /**
     * Per-cell attribute escape hatch — applied to the `<td>` (or `<th>` when
     * `isRowHeader`). Object form is static; function form receives the same
     * ctx as `formatter`. Common uses: `data-testid`, ARIA labels.
     */
    cellAttrs?:
        | Record<string, unknown> |
        ((ctx: TableColumnFormatterCtx<Row, K>) => Record<string, unknown>);

    /**
     * Per-header attribute escape hatch — applied to the `<th>`. Object form
     * is static; function form receives `{ key, type }` where `type` is
     * `'top'` (header band) or `'bottom'` (footer band, when present).
     */
    headerAttrs?:
        | Record<string, unknown> |
        ((ctx: TableColumnHeaderAttrsCtx<K>) => Record<string, unknown>);

    /** Native `<th title="…">`. */
    headerTitle?: string;

    /** Native `<th abbr="…">`. */
    headerAbbr?: string;

    /**
     * `position: sticky; left: 0` on this column's `<th>` + `<td>`. Theme owns
     * the CSS (each shipping theme adds a `stickyColumn` variant axis on
     * `tableCell` / `tableHeadCell`).
     */
    stickyColumn?: boolean;

    /** Default direction when this column is sorted for the first time. Defaults to `'asc'`. */
    initialSortDirection?: 'asc' | 'desc';

    /**
     * Custom comparator for client-side sort (plan 033 v1.x-B). Receives
     * the two resolved values from `accessor` (or `formatter` output when
     * `sortByFormatted: true`) — same ergonomics as
     * `Array.prototype.sort`. Return a negative number when `a` should
     * come first, positive for `b`, zero when equal.
     *
     * Use for semver, IP addresses, locale-aware strings, custom epochs,
     * or any value where the default `<` / `>` ordering is wrong.
     */
    sortFn?: (a: unknown, b: unknown) => number;
    /**
     * When `true`, client-side sort compares the formatter output rather
     * than the raw accessor value. Default `false` — sort by raw value
     * so dates / numbers sort chronologically / numerically even when
     * the cell displays "2 days ago" / "$1,234.56". (plan 033 v1.x-B)
     */
    sortByFormatted?: boolean;
    /**
     * Client-side sort null-handling override. By default, `null` /
     * `undefined` values sort to the END regardless of direction
     * ("missing data lives at the bottom"). Set `true` to float them to
     * the start instead. (plan 033 v1.x-B)
     */
    nullsFirst?: boolean;
}

// ──────────────────────────────────────────────────────────────────────────
// Row-meta convention (plan 028 §"Row-meta escape hatch")
// ──────────────────────────────────────────────────────────────────────────

export type RowVariant =    | 'success' |
    'warning' |
    'error' |
    'info' |
    'neutral' |
    'primary';

/**
 * Row-meta escape hatch. Underscore-prefixed fields on the data row itself
 * control visual state without forcing consumers to wire a function prop or
 * additional column.
 *
 *   const users: WithRowMeta<User>[] = [
 *       { id: 1, name: 'Alice', _rowVariant: 'warning' },
 *       { id: 2, name: 'Bob',   _cellVariants: { email: 'error' } },
 *   ];
 *
 * Underscore prefix prevents collision with real data keys. Consumers that
 * send rows back to a server should strip these client-side fields.
 */
export type WithRowMeta<T> = T & {
    /** Applied to the entire `<tr>` via `tableRow.rowVariant.<value>`. */
    _rowVariant?: RowVariant | null;
    /** Applied per-cell — keyed by column key — via `tableCell.cellVariant.<value>`. */
    _cellVariants?: Partial<Record<keyof T & string, RowVariant>>;
};

// ──────────────────────────────────────────────────────────────────────────
// Sort
// ──────────────────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc';

/**
 * A single sort step. The array form `SortDescriptor[]` is the public
 * shape of `v-model:sort` from v1.x-B onward — single-column sort
 * becomes an array of length 0 or 1.
 */
export type SortDescriptor = {
    key: string;
    direction: SortDirection;
};

/**
 * Public sort state shape — always an array since v1.x-B (breaking
 * change from v0.1's `{ key, direction } | null`). An empty array
 * means "no sort active". Multi-key sort appends additional descriptors;
 * the first descriptor is the primary key, the second is the
 * tie-breaker, etc.
 */
export type TableSortState = SortDescriptor[];

// ──────────────────────────────────────────────────────────────────────────
// Theme class maps (one per shipping component — 9 total)
// ──────────────────────────────────────────────────────────────────────────

export type TableThemeClasses = {
    /** The outer `<table>` (or its `<div class="scrollContainer">` wrapper when `:scrollable`). */
    root: string;
    /** The overflow wrapper rendered when `:scrollable` is set. */
    scrollContainer: string;
};

export type TableHeaderThemeClasses = {
    /** The `<thead>` band. */
    root: string;
};

export type TableBodyThemeClasses = {
    /** The `<tbody>` band. */
    root: string;
};

export type TableFooterThemeClasses = {
    /** The `<tfoot>` band. */
    root: string;
};

export type TableRowThemeClasses = {
    /** The `<tr>` element. */
    root: string;
};

export type TableCellThemeClasses = {
    /** The `<td>` element. */
    root: string;
};

export type TableHeadCellThemeClasses = {
    /** The `<th>` element. */
    root: string;
    /** The sort-indicator wrapper rendered alongside the label when `sortable`. */
    sortIcon: string;
};

export type TableEmptyThemeClasses = {
    /** The `<tbody>` (or `<td>` child) carrying the empty-state message. */
    root: string;
};

export type TableLoadingThemeClasses = {
    /** The `<tbody>` band (default) OR the overlay `<div>` (when `:overlay`). */
    root: string;
    /** Applied only in overlay mode. */
    overlay: string;
};

export type TablePlaceholderThemeClasses = {
    /** Outer `<table>` element. */
    root: string;
    /** `<thead>` band (when `:showHeader` is on). */
    header: string;
    /** `<tbody>` band. */
    body: string;
    /** `<tfoot>` band (when `:showFooter` is on). */
    footer: string;
    /** Per-row `<tr>` element. */
    row: string;
    /** Per-cell `<td>` / `<th>` wrapper around the bar. */
    cell: string;
};

export type TableRowExpansionThemeClasses = {
    /** The expansion `<tr>` (sibling of the data `<tr>`). */
    root: string;
    /** The `<td colspan="N">` inside the expansion row. */
    cell: string;
    /** The animated wrapper `<div>` (carries `data-state` + inline `height` from the ResizeObserver). */
    panel: string;
    /** The inner content wrapper `<div>` (measured by the ResizeObserver; consumer-supplied slot content lives here). */
    panelInner: string;
};

export type TableExpandTriggerThemeClasses = {
    /** The trigger `<button>` element. */
    root: string;
    /** The auto-injected chevron `<VCIcon>` inside the button (when `chevron === 'auto'`). */
    icon: string;
};

export type TableExpandTriggerCellThemeClasses = {
    /** The auto-injected leading (or trailing) `<td>` wrapping the trigger button. */
    root: string;
};

export type TableSortIndicatorsThemeClasses = {
    /** The bar container `<div>`. */
    root: string;
    /** The leading `"Sort:"` label. */
    label: string;
    /** The empty-state hint shown when no descriptors are active. */
    empty: string;
    /** The chip wrapper `<div>` (non-interactive — holds the two buttons). */
    chip: string;
    /** The toggle `<button>` inside a chip (cycles asc ↔ desc on click). */
    chipToggle: string;
    /** The 1-based position prefix (`1.`, `2.`, …) inside the toggle button. */
    chipPosition: string;
    /** The column label inside the toggle button. */
    chipLabel: string;
    /** The direction arrow inside the toggle button (↑ / ↓). */
    chipArrow: string;
    /** The `×` remove `<button>` at the trailing edge of a chip. */
    chipRemove: string;
    /**
     * Wrapper element around the "Add column" `<select>`. Optional —
     * themes that style the `<select>` directly leave it empty
     * (Tailwind, Bootstrap). Bulma's `.select` is a wrapper pattern,
     * so theme-bulma populates this slot.
     */
    addWrapper: string;
    /** The "Add column" `<select>` element. */
    add: string;
    /** The "Clear all" trigger. */
    clear: string;
};

// ──────────────────────────────────────────────────────────────────────────
// Theme element registry augmentation
// ──────────────────────────────────────────────────────────────────────────

declare module '@vuecs/core' {
    interface ThemeElements {
        table?: ThemeElementDefinition<TableThemeClasses>;
        tableHeader?: ThemeElementDefinition<TableHeaderThemeClasses>;
        tableBody?: ThemeElementDefinition<TableBodyThemeClasses>;
        tableFooter?: ThemeElementDefinition<TableFooterThemeClasses>;
        tableRow?: ThemeElementDefinition<TableRowThemeClasses>;
        tableCell?: ThemeElementDefinition<TableCellThemeClasses>;
        tableHeadCell?: ThemeElementDefinition<TableHeadCellThemeClasses>;
        tableEmpty?: ThemeElementDefinition<TableEmptyThemeClasses>;
        tableLoading?: ThemeElementDefinition<TableLoadingThemeClasses>;
        tablePlaceholder?: ThemeElementDefinition<TablePlaceholderThemeClasses>;
        tableSortIndicators?: ThemeElementDefinition<TableSortIndicatorsThemeClasses>;
        tableRowExpansion?: ThemeElementDefinition<TableRowExpansionThemeClasses>;
        tableExpandTrigger?: ThemeElementDefinition<TableExpandTriggerThemeClasses>;
        tableExpandTriggerCell?: ThemeElementDefinition<TableExpandTriggerCellThemeClasses>;
    }
}

// ──────────────────────────────────────────────────────────────────────────
// Slot-prop types
// ──────────────────────────────────────────────────────────────────────────

export type TableSlotProps<Row = unknown> = {
    data: Row[];
    busy: boolean;
    columns: TableColumn<Row>[];
    sort: TableSortState;
    setSort: (key: string, opts?: { append?: boolean; direction?: SortDirection }) => void;
};

export type TableBodyRowSlotProps<Row = unknown> = {
    row: Row;
    index: number;
};

export type TableCellSlotProps<Row = unknown> = {
    row: Row;
    value: unknown;
    key: string;
    column: TableColumn<Row>;
    index: number;
};

export type TableHeadCellSlotProps<Row = unknown> = {
    column: TableColumn<Row>;
    key: string;
    sort: SortDirection | null;
    setSort: (direction?: SortDirection) => void;
};

export type TableExpansionSlotProps<Row = unknown> = {
    row: Row;
    index: number;
};

/**
 * Where the auto-injected trigger column lives. `'none'` opts out of
 * the auto-injection entirely — the consumer is expected to place a
 * `<VCTableExpandTrigger>` somewhere inside the row's data cells.
 */
export type TableExpandableTrigger = 'leading' | 'trailing' | 'none';

// ──────────────────────────────────────────────────────────────────────────
// Generic-component facade (issue #1601)
// ──────────────────────────────────────────────────────────────────────────

/**
 * The call/return signature `vue-tsc` (Volar) recognizes for a generic
 * component — the exact shape it emits for a `<script setup generic="…">`
 * SFC, expressed by hand so a `defineComponent` render-function component
 * (vuecs's convention — see `.agents/conventions.md`) can stay generic
 * over its row type WITHOUT switching to `<script setup>`.
 *
 * Volar reads the slot types off the `__ctx` member of the return type;
 * the `expose` / `setup` parameters mirror the compiler's emitted
 * signature so the cast survives the declaration-emit
 * (`vue-tsc --declaration`) → consume round-trip identically. `attrs` /
 * `emit` aren't inference channels, so they stay `unknown`.
 *
 * `Props` and `Slots` are the already-`Row`-substituted shapes; the
 * `<Row>` type parameter is introduced by the component alias wrapping
 * this — e.g.
 *
 *   type VCTableComponent = <Row = Record<string, unknown>>(
 *       ...args: Parameters<GenericComponentShape<TableProps<Row>, TableSlots<Row>>>
 *   ) => ReturnType<GenericComponentShape<TableProps<Row>, TableSlots<Row>>>;
 *
 * so generic inference flows from the call-site props (`:data` /
 * `:columns`) into the slot props (`#cell-…`, `#header-…`, `#expansion`).
 */
export type GenericComponentShape<Props, Slots> = (
    props: Props,
    ctx?: {
        slots: Slots; 
        attrs: unknown; 
        emit: unknown 
    },
    expose?: (exposed: Record<string, never>) => void,
    setup?: Promise<{
        props: Props;
        expose: (exposed: Record<string, never>) => void;
        attrs: unknown;
        slots: Slots;
        emit: unknown;
    }>,
) => VNode & {
    __ctx?: {
        props: Props;
        expose: (exposed: Record<string, never>) => void;
        attrs: unknown;
        slots: Slots;
        emit: unknown;
    };
};
