import type {
    SortDescriptor,
    SortDirection,
    TableColumn,
} from '../types';
import { resolveCellValue } from './render-utils';

export type SortRowsOptions<Row = unknown> = {
    columns: ReadonlyArray<TableColumn<Row>>;
    sorts: ReadonlyArray<SortDescriptor>;
};

/**
 * Client-side row sort (plan 033 v1.x-B).
 *
 * Returns a new array — the input is untouched. Honors:
 *
 * - **Sort key**: `column.sortByFormatted` → use `formatter` output;
 *   else → use `accessor` resolved value (default, matches v0.1
 *   `resolveCellValue`).
 * - **Comparator**: `column.sortFn(a, b) => number` when present;
 *   else a built-in compare that handles numbers, Dates, booleans,
 *   and uses `localeCompare` (with `numeric: true`) for everything
 *   else — so `'item 2'` sorts before `'item 10'`.
 * - **Null handling**: `null` / `undefined` sort LAST regardless of
 *   direction. Per-column `nullsFirst: true` floats them to the top.
 * - **Multi-key tie-break**: descriptors are applied in order. The
 *   first non-zero comparison wins.
 * - **Stability**: relies on `Array.prototype.sort`'s stable
 *   guarantee (ES2019+, every supported runtime).
 *
 * Empty `sorts` returns a shallow copy — never the input reference
 * itself, so callers can safely mutate the result.
 */
export function sortRows<Row>(
    rows: ReadonlyArray<Row>,
    options: SortRowsOptions<Row>,
): Row[] {
    if (options.sorts.length === 0) return rows.slice();
    const columnByKey = new Map<string, TableColumn<Row>>();
    for (const col of options.columns) columnByKey.set(col.key, col);

    return rows.slice().sort((a, b) => {
        for (const sort of options.sorts) {
            const column = columnByKey.get(sort.key);
            if (!column) continue;
            const cmp = compareWithColumn(a, b, column, sort.direction);
            if (cmp !== 0) return cmp;
        }
        return 0;
    });
}

function compareWithColumn<Row>(
    a: Row,
    b: Row,
    column: TableColumn<Row>,
    direction: SortDirection,
): number {
    const av = resolveSortValue(column, a);
    const bv = resolveSortValue(column, b);

    // Null handling — always before the comparator runs. `nullsFirst`
    // is per-column; default is "nulls last regardless of direction".
    const aMissing = av === null || av === undefined;
    const bMissing = bv === null || bv === undefined;
    if (aMissing && bMissing) return 0;
    if (aMissing) return column.nullsFirst ? -1 : 1;
    if (bMissing) return column.nullsFirst ? 1 : -1;

    const cmp = column.sortFn ?
        column.sortFn(av, bv) :
        defaultCompare(av, bv);
    return direction === 'asc' ? cmp : -cmp;
}

function resolveSortValue<Row>(column: TableColumn<Row>, row: Row): unknown {
    const value = resolveCellValue(column, row);
    if (!column.sortByFormatted || !column.formatter) return value;
    return column.formatter({
        value,
        key: column.key,
        row,
    });
}

/**
 * Default comparator. Locale-aware for strings, numeric for numbers,
 * chronological for Dates. Falls back to coerced-string compare so
 * mixed-type columns don't throw.
 */
function defaultCompare(a: unknown, b: unknown): number {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
    if (typeof a === 'boolean' && typeof b === 'boolean') {
        if (a === b) return 0;
        return a ? 1 : -1;
    }
    const as = typeof a === 'string' ? a : String(a);
    const bs = typeof b === 'string' ? b : String(b);
    return as.localeCompare(bs, undefined, { numeric: true });
}
