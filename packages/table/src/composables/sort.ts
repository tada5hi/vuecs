import { computed, ref, watch } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import type {
    SortDescriptor,
    SortDirection,
    TableColumn,
    TableSortState,
} from '../types';

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
    /** Direction for a key (regardless of sort position), or `null`. */
    directionFor: (key: string) => SortDirection | null;
    /** 1-based position of a key within the sort array, or `null`. */
    positionFor: (key: string) => number | null;
};

/**
 * Controlled sort machine. The consumer owns the sort state via
 * `v-model:sort` — the table emits intent only. When `<VCTable
 * :client-sort>` is set, the table additionally sorts data internally
 * using `accessor` / `sortFn` (see `utils/sort.ts`); the controlled
 * v-model still emits, so consumers stay observable.
 *
 * State shape is `SortDescriptor[]` from v1.x-B onward — single-column
 * sort is an array of length 0–1. Multi-key cycling lives entirely
 * here; `<VCTableHeadCell>` reads `directionFor` / `positionFor` to
 * paint the indicator + numeric badge.
 */
export function useSortMachine<Row = unknown>(
    options: UseSortMachineOptions<Row>,
): SortMachine {
    const {
        source,
        columns,
        mustSort,
        maxSortKeys,
        emit,
    } = options;

    // Mirror the source into a local ref so we can react to undefined→[],
    // but the source remains the single source of truth.
    const local = ref<TableSortState>(normalize(source.value));
    watch(source, (next) => {
        local.value = normalize(next);
    });

    const state = computed<TableSortState>(() => local.value);

    function findInitialDirection(key: string): SortDirection {
        const col = columns.value.find((c) => c.key === key);
        return col?.initialSortDirection ?? 'asc';
    }

    function setSort(
        key: string,
        opts: { append?: boolean; direction?: SortDirection } = {},
    ): void {
        const current = local.value;
        const idx = current.findIndex((s) => s.key === key);
        const initial = findInitialDirection(key);

        // Explicit direction override — same insertion rules as cycling.
        if (opts.direction !== undefined) {
            const next = opts.append ?
                upsertAppend(current, key, opts.direction, maxSortKeys.value) :
                [{
                    key,
                    direction: opts.direction,
                }];
            local.value = next;
            emit(next);
            return;
        }

        if (!opts.append) {
            // Single-sort cycle: replace state entirely.
            // - Key isn't currently sorted → start at initial.
            // - Same key matches initial direction → flip.
            // - Same key on the opposite direction → clear (or back to
            //   initial when mustSort).
            const existing = idx >= 0 ? current[idx] : null;
            let next: TableSortState;
            if (!existing) {
                next = [{
                    key,
                    direction: initial,
                }];
            } else if (existing.direction === initial) {
                next = [{
                    key,
                    direction: initial === 'asc' ? 'desc' : 'asc',
                }];
            } else {
                next = mustSort.value ?
                    [{
                        key,
                        direction: initial,
                    }] :
                    [];
            }
            local.value = next;
            emit(next);
            return;
        }

        // Append mode — Shift-click semantics. Cycle just this key's
        // direction within the array; respect maxSortKeys when adding.
        if (idx < 0) {
            // Not currently in the sort — append at the end.
            const next = appendCapped(current, {
                key,
                direction: initial,
            }, maxSortKeys.value);
            local.value = next;
            emit(next);
            return;
        }

        // Key already present in append mode — cycle direction OR remove.
        const existing = current[idx];
        let next: SortDescriptor[];
        if (existing.direction === initial) {
            next = current.map((s, i) => (i === idx ?
                {
                    key,
                    direction: initial === 'asc' ? 'desc' : 'asc',
                } :
                s));
        } else {
            // Past the "second" direction — drop this key from the
            // sort array (mustSort doesn't apply to secondary keys —
            // a multi-sort consumer can always clear individual keys).
            next = current.filter((_, i) => i !== idx);
        }
        local.value = next;
        emit(next);
    }

    function directionFor(key: string): SortDirection | null {
        const cur = local.value.find((s) => s.key === key);
        return cur ? cur.direction : null;
    }

    function positionFor(key: string): number | null {
        const i = local.value.findIndex((s) => s.key === key);
        return i < 0 ? null : i + 1;
    }

    return {
        state,
        setSort,
        directionFor,
        positionFor,
    };
}

/**
 * Coerce v-model input into the canonical array shape. `undefined` /
 * `null` become `[]`; passing a stale single-descriptor object during
 * the v1.x-B migration window is wrapped as a one-element array.
 */
function normalize(v: TableSortState | undefined | null): TableSortState {
    if (v == null) return [];
    if (Array.isArray(v)) return v;
    return [v];
}

/**
 * Append a new descriptor, evicting the oldest when over the cap.
 * Cap of `<= 0` is treated as "unlimited" so consumers can opt out.
 */
function appendCapped(
    state: SortDescriptor[],
    descriptor: SortDescriptor,
    max: number,
): SortDescriptor[] {
    const next = [...state, descriptor];
    if (max > 0 && next.length > max) {
        return next.slice(next.length - max);
    }
    return next;
}

/**
 * In-place semantic: if `key` is already in the state, update its
 * direction; else append (capped). Used by the explicit-direction
 * path when `append` is set.
 */
function upsertAppend(
    state: SortDescriptor[],
    key: string,
    direction: SortDirection,
    max: number,
): SortDescriptor[] {
    const idx = state.findIndex((s) => s.key === key);
    if (idx >= 0) {
        return state.map((s, i) => (i === idx ?
            {
                key,
                direction,
            } :
            s));
    }
    return appendCapped(state, {
        key,
        direction,
    }, max);
}
