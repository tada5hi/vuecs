import { computed, ref, shallowRef } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import type {
    SortDirection,
    TableColumn,
    TableColumnRaw,
    TableSortState,
} from '../types';
import { normalizeColumns } from '../utils/render-utils';

export type DefineTableOptions<Row> = {
    /** Initial data array. */
    data?: Row[];
    /** Initial column definitions (TableColumn or bare-string shorthand). */
    columns?: TableColumnRaw<Row>[];
    /** Initial busy flag. */
    busy?: boolean;
    /** Initial sort state. */
    sort?: TableSortState;
};

export type TableState<Row> = {
    data: Ref<Row[]>;
    columns: ComputedRef<TableColumn<Row>[]>;
    rawColumns: Ref<TableColumnRaw<Row>[]>;
    busy: Ref<boolean>;
    sort: Ref<TableSortState>;
    setSort: (key: string, direction?: SortDirection) => void;
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
 */
export function defineTable<Row = unknown>(
    options: DefineTableOptions<Row> = {},
): TableState<Row> {
    const data = shallowRef<Row[]>(options.data ?? []);
    const rawColumns = shallowRef<TableColumnRaw<Row>[]>(options.columns ?? []);
    const busy = ref(options.busy ?? false);
    const sort = shallowRef<TableSortState>(options.sort ?? null);

    const columns = computed(() => normalizeColumns(rawColumns.value, data.value));

    const setSort = (key: string, direction?: SortDirection) => {
        if (direction !== undefined) {
            sort.value = { key, direction };
            return;
        }
        const current = sort.value;
        if (!current || current.key !== key) {
            sort.value = { key, direction: 'asc' };
        } else if (current.direction === 'asc') {
            sort.value = { key, direction: 'desc' };
        } else {
            sort.value = null;
        }
    };

    return {
        data, 
        columns, 
        rawColumns, 
        busy, 
        sort, 
        setSort, 
    };
}
