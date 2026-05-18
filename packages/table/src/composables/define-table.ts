import { computed, ref } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import type {
    SortDirection,
    TableColumn,
    TableColumnRaw,
    TableSortState,
} from '../types';
import { useSortMachine } from './sort';
import { normalizeColumns } from '../utils/render-utils';

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

/**
 * Pinia-style factory mirroring `defineList()`. Returns reactive state
 * containers + a `setSort` mutator. Useful when a consumer wants to share
 * a table's state across multiple components without prop drilling, or
 * when wiring a controlled table outside the SFC.
 *
 *   const usersTable = defineTable<User>({
 *       columns: ['id', 'name', 'email'],
 *       data: [],
 *       busy: false,
 *   });
 *
 *   <VCTable :data="usersTable.data" :columns="usersTable.columns" ... />
 *
 * The sort cycle composes `useSortMachine` internally — same semantics
 * as the `<VCTable>` SFC path (honors per-column `initialSortDirection`
 * + `mustSort`).
 */
export function defineTable<Row = unknown>(
    options: DefineTableOptions<Row> = {},
): TableState<Row> {
    // Deep `ref` (not `shallowRef`) for `data` + `rawColumns` so
    // in-place array mutations (`.push`, `.splice`, item-property
    // updates) flow through to dependent computeds. `shallowRef` would
    // silently swallow these in normal state-store usage.
    const data = ref(options.data ?? []) as Ref<Row[]>;
    const rawColumns = ref(options.columns ?? []) as Ref<TableColumnRaw<Row>[]>;
    const busy = ref(options.busy ?? false);
    const mustSort = ref(options.mustSort ?? false);
    const sort = ref<TableSortState>(options.sort ?? []);
    const maxSortKeys = ref(options.maxSortKeys ?? 3);

    const columns = computed(() => normalizeColumns(rawColumns.value, data.value));

    // Compose `useSortMachine` so the cycle (initialSortDirection +
    // mustSort handling) matches the SFC path bit-for-bit. The local
    // `sort` ref serves as both source-of-truth and emit-target.
    const sortMachine = useSortMachine<Row>({
        source: sort as unknown as Ref<TableSortState | undefined>,
        columns,
        mustSort,
        maxSortKeys,
        emit: (next) => { sort.value = next; },
    });

    return {
        data,
        columns,
        rawColumns,
        busy,
        mustSort,
        sort,
        setSort: sortMachine.setSort,
    };
}
