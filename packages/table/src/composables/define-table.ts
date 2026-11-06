import type { DefineTableOptions, TableState } from './types';
import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import type { TableColumnRaw, TableSortState } from '../types';
import { useSortMachine } from './sort';
import { normalizeColumns } from '../utils/render-utils';

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
        emit: (next) => {
            sort.value = next;
        },
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
