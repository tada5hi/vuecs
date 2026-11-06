import type { SortMachine, UseSortMachineOptions } from './types';
import { computed, ref, watch } from 'vue';

import type { SortDescriptor, SortDirection, TableSortState } from '../types';

/**
 * Controlled sort machine. The consumer owns the sort state via
 * `v-model:sort` — the table emits intent only. When `<VCTable
 * :client-sort>` is set, the table additionally sorts data internally
 * via `sortRows()` from `utils/sort-rows.ts`; the controlled v-model
 * still emits, so consumers stay observable.
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

    /**
     * Replace the entire sort state. Bypasses cycle logic + multi-sort
     * gating — for callers that know exactly what they want (e.g. the
     * sort-indicator chip row removes / reorders / clears descriptors
     * directly without going through Shift-click semantics).
     */
    function setState(next: TableSortState): void {
        local.value = next;
        emit(next);
    }

    return {
        state,
        setSort,
        setState,
        directionFor,
        positionFor,
    };
}

/**
 * Coerce v-model input into the canonical array shape. `undefined` /
 * `null` (which Vue may bind through during the v1.x-B migration
 * window when consumers still hold `ref<...>(null)`) become `[]`.
 */
function normalize(v: TableSortState | undefined | null): TableSortState {
    if (v == null) {
        return [];
    }

    return v;
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
