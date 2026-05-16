import { computed, ref, watch } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import type { SortDirection, TableColumn, TableSortState } from '../types';

export type UseSortMachineOptions<Row = unknown> = {
    /** Reactive source-of-truth from the consumer's `v-model:sort`. May be `undefined`. */
    source: Ref<TableSortState | undefined>;
    /** Reactive column list — needed to resolve `initialSortDirection`. */
    columns: Ref<TableColumn<Row>[]>;
    /** When `true`, the cycle skips the `null` step → `null → asc → desc → asc`. */
    mustSort: Ref<boolean>;
    /** Emit handler that propagates each change back to the consumer. */
    emit: (next: TableSortState) => void;
};

export type SortMachine = {
    state: ComputedRef<TableSortState>;
    /**
     * Cycle the sort state for `key`.
     * - First activation uses the column's `initialSortDirection` (default `'asc'`).
     * - Subsequent activations cycle `asc → desc → null (or asc when mustSort)`.
     * - Passing an explicit `direction` jumps straight to it.
     */
    setSort: (key: string, direction?: SortDirection) => void;
    /** Sort direction for a key, or `null` when this column isn't the current sort. */
    directionFor: (key: string) => SortDirection | null;
};

/**
 * Controlled single-column sort machine. The consumer owns the sort state
 * via `v-model:sort` — the table never sorts data, only emits intent.
 *
 * v0.1 scope: single-column. Multi-column / custom comparators deferred to
 * v1.x. Matches BTable's controlled mode.
 */
export function useSortMachine<Row = unknown>(
    options: UseSortMachineOptions<Row>,
): SortMachine {
    const {
        source, 
        columns, 
        mustSort, 
        emit, 
    } = options;

    // Mirror the source into a local ref so we can react to undefined→null,
    // but the source remains the single source of truth.
    const local = ref<TableSortState>(source.value ?? null);
    watch(source, (next) => {
        local.value = next ?? null;
    });

    const state = computed<TableSortState>(() => local.value);

    function findInitialDirection(key: string): SortDirection {
        const col = columns.value.find((c) => c.key === key);
        return col?.initialSortDirection ?? 'asc';
    }

    function setSort(key: string, direction?: SortDirection) {
        const current = local.value;

        let next: TableSortState;
        if (direction !== undefined) {
            next = { key, direction };
        } else if (!current || current.key !== key) {
            next = { key, direction: findInitialDirection(key) };
        } else if (current.direction === findInitialDirection(key)) {
            next = {
                key,
                direction: current.direction === 'asc' ? 'desc' : 'asc',
            };
        } else {
            // We're on the "second" direction — cycle to null unless mustSort.
            next = mustSort.value ?
                { key, direction: findInitialDirection(key) } :
                null;
        }

        local.value = next;
        emit(next);
    }

    function directionFor(key: string): SortDirection | null {
        const cur = local.value;
        if (!cur || cur.key !== key) return null;
        return cur.direction;
    }

    return {
        state, 
        setSort, 
        directionFor, 
    };
}
