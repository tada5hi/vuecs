import type { InjectionKey, Ref } from 'vue';
import { inject, provide } from 'vue';
import type {
    SortDirection,
    TableColumn,
    TableSortState,
} from '../types';

// ──────────────────────────────────────────────────────────────────────────
// Table-scope context (provided by <VCTable>, consumed by every descendant)
// ──────────────────────────────────────────────────────────────────────────

export type TableContext<Row = unknown> = {
    data: Ref<Row[]>;
    busy: Ref<boolean>;
    columns: Ref<TableColumn<Row>[]>;
    sort: Ref<TableSortState>;
    setSort: (key: string, direction?: SortDirection) => void;
    /** Whether `<VCTable>` was passed `:rowClickable`. */
    rowClickable: Ref<boolean>;
    /** Currently focused row index (row keyboard nav). `null` when nothing focused. */
    focusedRow: Ref<number | null>;
    setFocusedRow: (index: number | null) => void;
    /** Resolved colspan (Shape A: `columns.length`; Shape B: auto-counted from `<VCTableHeadCell>` siblings). */
    colspan: Ref<number>;
    /** Emit a `row-click` event from inside a body row. */
    emitRowClick: (row: Row, index: number, event: Event) => void;
};

const TABLE_CONTEXT_KEY: InjectionKey<TableContext<unknown>> = Symbol('vcTableContext');

export function provideTableContext<Row>(ctx: TableContext<Row>): void {
    provide(TABLE_CONTEXT_KEY, ctx as TableContext<unknown>);
}

export function useTable<Row = unknown>(): TableContext<Row> | null {
    return inject(TABLE_CONTEXT_KEY, null) as TableContext<Row> | null;
}

// ──────────────────────────────────────────────────────────────────────────
// Row-scope context (provided by <VCTableRow> inside <VCTableBody>'s iteration)
// ──────────────────────────────────────────────────────────────────────────

export type TableRowContext<Row = unknown> = {
    row: Ref<Row>;
    index: Ref<number>;
    /** Resolved row-level variant from `row._rowVariant`. */
    rowVariant: Ref<string | null>;
    /** Resolved per-cell variants from `row._cellVariants`. */
    cellVariants: Ref<Record<string, string>>;
    /** `true` when `useTable().focusedRow === index`. */
    focused: Ref<boolean>;
};

const TABLE_ROW_CONTEXT_KEY: InjectionKey<TableRowContext<unknown>> = Symbol('vcTableRowContext');

export function provideTableRowContext<Row>(ctx: TableRowContext<Row>): void {
    provide(TABLE_ROW_CONTEXT_KEY, ctx as TableRowContext<unknown>);
}

export function useTableRow<Row = unknown>(): TableRowContext<Row> | null {
    return inject(TABLE_ROW_CONTEXT_KEY, null) as TableRowContext<Row> | null;
}

// ──────────────────────────────────────────────────────────────────────────
// Head-cell count context (D3 — auto-count <VCTableHeadCell> siblings in
// <VCTableHeader>'s first row, used as the Shape B colspan fallback)
// ──────────────────────────────────────────────────────────────────────────

export type HeadCellCountContext = {
    register: () => void;
    unregister: () => void;
};

const TABLE_HEAD_CELL_COUNT_CONTEXT_KEY: InjectionKey<HeadCellCountContext> = Symbol(
    'vcTableHeadCellCountContext',
);

export function provideHeadCellCountContext(ctx: HeadCellCountContext): void {
    provide(TABLE_HEAD_CELL_COUNT_CONTEXT_KEY, ctx);
}

export function useHeadCellCountContext(): HeadCellCountContext | null {
    return inject(TABLE_HEAD_CELL_COUNT_CONTEXT_KEY, null);
}
