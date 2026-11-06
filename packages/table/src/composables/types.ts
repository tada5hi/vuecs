import type { ComputedRef, Ref } from 'vue';
import type {
    SortDirection,
    TableColumn,
    TableColumnRaw,
    TableExpandableTrigger,
    TableSortState,
} from '../types';
import type { RowSelectionKey, RowSelectionState } from './selection';



// ──────────────────────────────────────────────────────────────────────────
// Table-scope context (provided by <VCTable>, consumed by every descendant)
// ──────────────────────────────────────────────────────────────────────────

export type TableContext<Row = unknown> = {
    data: Ref<Row[]>;
    busy: Ref<boolean>;
    columns: Ref<TableColumn<Row>[]>;
    sort: Ref<TableSortState>;
    /**
     * Cycle the sort state for `key`. `opts.append` (Shift-click) adds
     * the key as a secondary/tertiary descriptor instead of replacing.
     * `opts.direction` jumps straight to a given direction.
     */
    setSort: (key: string, opts?: { append?: boolean; direction?: SortDirection }) => void;
    /**
     * Replace the entire sort state directly. Used by
     * `<VCTableSortIndicators>` to remove / reorder / clear descriptors
     * without invoking the per-key cycle logic.
     */
    setSortState: (next: TableSortState) => void;
    /**
     * Cap on the sort-state array length (`<VCTable :max-sort-keys>`).
     * Exposed so descendants like `<VCTableSortIndicators>` can
     * enforce the cap consistently — `setSortState` itself bypasses
     * cycle logic, so the cap is enforced at the call site.
     */
    maxSortKeys: Ref<number>;
    /**
     * Whether the host table can actually mutate sort state.
     * `<VCTable>` sets this to `true`; `<VCTableLite>` sets it to
     * `false` (it ships no sort machine). Descendants like
     * `<VCTableSortIndicators>` check this in their context-fallback
     * path so they refuse to silently no-op when mounted inside Lite.
     */
    supportsSortMutation: boolean;
    /** Whether `<VCTable>` was passed `:rowClickable`. */
    rowClickable: Ref<boolean>;
    /** Currently focused row index (row keyboard nav). `null` when nothing focused. */
    focusedRow: Ref<number | null>;
    setFocusedRow: (index: number | null) => void;
    /** Resolved colspan (Shape A: `columns.length`; Shape B: auto-counted from `<VCTableHeadCell>` siblings). */
    colspan: Ref<number>;
    /** Emit a `row-click` event from inside a body row. */
    emitRowClick: (row: Row, index: number, event: Event) => void;
    /**
     * The positioned wrapper element that wraps the `<table>` in the DOM.
     * `<VCTableLoading :overlay>` teleports here so its `<div>` isn't
     * fostered out of the table by the HTML parser AND so it has a real
     * positioning context for `position: absolute; inset: 0`.
     */
    wrapperEl: Ref<globalThis.HTMLElement | null>;
    /**
     * Row selection state (plan 033 v1.x-A). Always provided; reports
     * mode `undefined` and `isSelected: () => false` when selection is
     * disabled, so descendants don't need to null-check. `<VCTableRow>`
     * calls `selection.toggle()` on activation and reads `isSelected`
     * to render `aria-selected` + the `selected` theme variant.
     */
    selection: RowSelectionState;
    /** Resolve the selection key for a given row (function or index fallback). */
    getRowKey: (row: Row, index: number) => RowSelectionKey;
    /**
     * Set of row indices that are currently interactive (focusable +
     * keyboard-navigable). Each `<VCTableRow>` registers / unregisters
     * itself based on its own `isInteractive` state. Used by:
     *
     * - Roving-tabindex fallback — when `focusedRow` is unset or stale,
     *   the FIRST interactive row gets `tabindex="0"` (so a disabled
     *   row 0 doesn't lock the grid out of Tab navigation).
     * - Arrow / Home / End nav — skips disabled rows by walking the
     *   sorted registry rather than the raw data index.
     */
    interactiveRows: Ref<Set<number>>;
    registerInteractiveRow(index: number): void;
    unregisterInteractiveRow(index: number): void;
    /**
     * `true` when `<VCTable :expandable>` is set. Per-row
     * `<VCTableRow>` reads this (plus its own `:expandable`) to
     * decide whether to mount the expansion fragment + read state
     * from the table-level machine. Forwarded into `colspan`
     * resolution so the trigger column adds +1 to `<VCTableEmpty>` /
     * `<VCTableLoading>` spans.
     */
    expandable: Ref<boolean>;
    /**
     * Default trigger-column placement. Per-row `<VCTableRow
     * :expandableTrigger>` wins over this; both default to
     * `'leading'`.
     */
    expandableTrigger: Ref<TableExpandableTrigger>;
    /**
     * Table-level expansion state machine. Always provided when
     * `<VCTable>` is the host (the machine is a no-op when
     * `:expandable` is false). `<VCTableLite>` provides `undefined`.
     * Implemented via the shared `useSelectionMachine` from
     * `@vuecs/core` — the "selection" semantic generalizes to
     * "set of currently open row keys".
     */
    expansion: RowSelectionState | undefined;
};

// ──────────────────────────────────────────────────────────────────────────
// Row-scope context (provided by <VCTableRow> inside <VCTableBody>'s iteration)
// ──────────────────────────────────────────────────────────────────────────

/**
 * Per-row expansion state, attached to `TableRowContext.expansion` when
 * the row is `:expandable`. Null otherwise — components like
 * `<VCTableExpandTrigger>` panic with a dev warning when this is null
 * (i.e. they were mounted outside an expandable row).
 *
 * `open` is reactive; `triggerId` / `panelId` are stable across the
 * row's lifetime (used for ARIA `aria-controls` / `aria-labelledby`
 * linkage between the trigger and the expansion panel).
 */
export type TableRowExpansionState = {
    /**
     * Reactive read of the row's open state. `ComputedRef<boolean>` is
     * structurally a `Ref<boolean>` for reads; the explicit union makes
     * the read-only intent clear at the type level (callers should not
     * mutate `.value` — flip state via `toggle()` instead).
     */
    open: Readonly<Ref<boolean>>;
    toggle: () => void;
    triggerId: string;
    panelId: string;
};

export type TableRowContext<Row = unknown> = {
    row: Ref<Row>;
    index: Ref<number>;
    /** Resolved row-level variant from `row._rowVariant`. */
    rowVariant: Ref<string | null>;
    /** Resolved per-cell variants from `row._cellVariants`. */
    cellVariants: Ref<Record<string, string>>;
    /** `true` when `useTable().focusedRow === index`. */
    focused: Ref<boolean>;
    /** Resolved selection key for this row (memoized per render). */
    selectionKey: Ref<RowSelectionKey>;
    /** `true` when the parent table's selection includes this row. */
    selected: Ref<boolean>;
    /**
     * Per-row expansion state. `null` when the row isn't `:expandable`
     * — components that need to toggle expansion (the trigger button)
     * dev-warn and no-op when this is null.
     */
    expansion: TableRowExpansionState | null;
};

// ──────────────────────────────────────────────────────────────────────────
// Head-cell count context (D3 — auto-count <VCTableHeadCell> siblings in
// <VCTableHeader>'s first row, used as the Shape B colspan fallback)
// ──────────────────────────────────────────────────────────────────────────

export type HeadCellCountContext = {
    register: () => void;
    unregister: () => void;
};

export type DefineTableOptions<Row> = {
    /** Initial data array. */
    data?: Row[];
    /** Initial column definitions (TableColumn or bare-string shorthand). */
    columns?: TableColumnRaw<Row>[];
    /** Initial busy flag. */
    busy?: boolean;
    /** Initial sort state (array of descriptors). Empty array means no sort. */
    sort?: TableSortState;
    /** Max sort keys retained in multi-sort mode. `0` = unlimited. Default `3`. */
    maxSortKeys?: number;
    /** When `true`, the sort cycle skips the `null` step. Mirrors `<VCTable :must-sort>`. */
    mustSort?: boolean;
};

export type TableState<Row> = {
    data: Ref<Row[]>;
    columns: ComputedRef<TableColumn<Row>[]>;
    rawColumns: Ref<TableColumnRaw<Row>[]>;
    busy: Ref<boolean>;
    mustSort: Ref<boolean>;
    sort: Ref<TableSortState>;
    setSort: (key: string, opts?: { append?: boolean; direction?: SortDirection }) => void;
};

export type UseSortMachineOptions<Row = unknown> = {
    /** Reactive source-of-truth from the consumer's `v-model:sort`. May be `undefined`. */
    source: Ref<TableSortState | undefined>;
    /** Reactive column list — needed to resolve `initialSortDirection`. */
    columns: Ref<TableColumn<Row>[]>;
    /** When `true`, the cycle skips the `null` step → `null → asc → desc → asc`. */
    mustSort: Ref<boolean>;
    /**
     * Maximum number of sort keys retained in multi-sort mode (plan 033
     * v1.x-B). When adding a key past this cap, the oldest descriptor
     * is dropped. Defaults to `3` in `<VCTable>`.
     */
    maxSortKeys: Ref<number>;
    /** Emit handler that propagates each change back to the consumer. */
    emit: (next: TableSortState) => void;
};

export type SortMachine = {
    state: ComputedRef<TableSortState>;
    /**
     * Cycle the sort state for `key`.
     *
     * - Plain call (no opts) — replace state with this key alone. Cycles
     *   through `initial → opposite → cleared` (or `→ initial` when
     *   `mustSort`).
     * - `opts.append === true` (Shift-click) — add `key` as a secondary
     *   descriptor at the end of the array OR cycle its direction if
     *   already present. Cycling past clears just that key.
     * - `opts.direction` — jump straight to that direction. Honors
     *   `append` for placement.
     */
    setSort: (key: string, opts?: { append?: boolean; direction?: SortDirection }) => void;
    /**
     * Replace the entire sort state directly. Bypasses cycle + multi-sort
     * gating — used by the chip-row indicator UX which mutates the array
     * declaratively (remove, reorder, clear).
     */
    setState: (next: TableSortState) => void;
    /** Direction for a key (regardless of sort position), or `null`. */
    directionFor: (key: string) => SortDirection | null;
    /** 1-based position of a key within the sort array, or `null`. */
    positionFor: (key: string) => number | null;
};
