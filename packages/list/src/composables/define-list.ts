import type { ListDefinition, ListMutators, ListState } from './types';
import { createCollectionMutations } from '@vuecs/core';
import { computed, isRef, toValue } from 'vue';
import type { Ref } from 'vue';
import { merge } from 'smob';

/**
 * Container composable for `<VCList>` state. Reactive; accepts plain values,
 * `Ref<T>`, or getters. Consumer-defined data lives under the typed `meta`
 * bag, forwarded verbatim — see `ListDefinition.meta`.
 *
 * Overloads (most-specific first) — the return type gains
 * `ListMutators<T>` whenever ANY writer can be derived:
 *
 *  1. Per-op handler (`onCreated` / `onUpdated` / `onDeleted`) provided.
 *  2. Unified `setData` provided.
 *  3. `data: Ref<T[]>` (auto-derived setter).
 *  4. None — pure-helpers-only return.
 *
 * Per-op handlers are dispatched directly with the raw item; setData /
 * Ref-auto receive the computed next-array. See `ListMutators` for
 * the resolution + gate-flag semantics.
 */
export function defineList<
    T = unknown,
    Meta extends object = Record<string, unknown>,
>(
    options: ListDefinition<T, Meta> & (
        | { onCreated: (item: T) => void } |
        { onUpdated: (item: T) => void } |
        { onDeleted: (item: T) => void }
    ),
): ListState<T, Meta> & ListMutators<T>;
export function defineList<
    T = unknown,
    Meta extends object = Record<string, unknown>,
>(
    options: ListDefinition<T, Meta> & { setData: (next: T[]) => void },
): ListState<T, Meta> & ListMutators<T>;
export function defineList<
    T = unknown,
    Meta extends object = Record<string, unknown>,
>(
    options: ListDefinition<T, Meta> & { data: Ref<T[]> },
): ListState<T, Meta> & ListMutators<T>;
export function defineList<
    T = unknown,
    Meta extends object = Record<string, unknown>,
>(options: ListDefinition<T, Meta>): ListState<T, Meta>;
export function defineList<
    T = unknown,
    Meta extends object = Record<string, unknown>,
>(options: ListDefinition<T, Meta>): ListState<T, Meta> {
    const data = computed<T[]>(() => toValue(options.data) ?? []);
    const busy = computed<boolean>(() => !!toValue(options.busy));
    const total = computed<number>(() => {
        const declared = toValue(options.total);

        if (typeof declared === 'number') {
            return declared;
        }

        return data.value.length;
    });
    const isEmpty = computed<boolean>(() => !busy.value && total.value === 0);

    // Forward the consumer's meta bag verbatim. Default to an empty
    // object so `list.meta.foo` accesses are safe even when the user
    // didn't supply meta. The narrow `as Meta` cast is bounded — `{}`
    // satisfies the default `Record<string, unknown>` constraint, and a
    // consumer who specified a stricter Meta but didn't pass it is on
    // the hook for the resulting undefined accesses.
    const meta = options.meta ?? ({} as Meta);

    // Identity resolution + the pure next-array builders live in
    // `@vuecs/core` so `@vuecs/data` (and third-party collection
    // components) share one implementation. `defineList` keeps the
    // reactive wiring, the writer-resolution ladder, and the mutator
    // dispatch on top of it.
    //
    // The merge adapter is deliberately LEFT-priority (smob keeps the
    // first-seen value on conflicting keys), so `mergeOnUpdated` fills
    // gaps in the existing record rather than overwriting it.
    const mutations = createCollectionMutations<T>({
        itemId: options.itemId,
        itemKey: options.itemKey,
        flags: {
            mergeOnUpdated: options.mergeOnUpdated,
            dedupCreated: options.dedupCreated,
            filterDeleted: options.filterDeleted,
        },
        merge: (target, source) => merge({}, target, source),
    });

    const {
        flags,
        getItemKey,
        indexOf,
        applyCreate,
        applyUpdate,
        applyDelete,
    } = mutations;

    // Fall back to reference equality (inside `indexOf`) so reactive
    // lists with no identity hint still resolve when the same object
    // is passed.
    const findIndex = (item: T): number => indexOf(data.value, item);

    const base: ListState<T, Meta> = {
        data,
        busy,
        total,
        meta,
        isEmpty,
        findIndex,
        getItemKey,
        flags,
        applyCreate,
        applyUpdate,
        applyDelete,
    };

    // Resolve a fallback writer (setData explicit > Ref auto). Per-op
    // handlers, when provided, intercept BEFORE the fallback writer.
    //
    // The cast to `Ref<T[]>` is intentional: `MaybeRefOrGetter` includes
    // `ComputedRef<T[]>` and `isRef` narrows to `Ref<T> | ComputedRef<T>`
    // (the latter is read-only). Writing to a ComputedRef throws at
    // runtime — that's the right failure mode for misuse.
    let fallbackWriter: ((next: T[]) => void) | undefined;

    if (options.setData) {
        fallbackWriter = options.setData;
    } else if (isRef(options.data)) {
        const dataRef = options.data as Ref<T[]>;

        fallbackWriter = (next) => {
            dataRef.value = next;
        };
    }

    const {
        onCreated,
        onUpdated,
        onDeleted,
    } = options;
    const hasAnyWriter = onCreated || onUpdated || onDeleted || fallbackWriter;

    if (hasAnyWriter) {
        // Forward to the fallback writer only when `apply*` produced a
        // *new* array. Pure helpers preserve the original reference for
        // gated no-ops (`dedupCreated` skip, missing-`itemId` update,
        // `filterDeleted` skip), and the documented contract is "silent
        // no-op" — calling `setData(currentArray)` would still trigger a
        // user-supplied writer's side effects.
        const writeNext = (next: T[]) => {
            if (!fallbackWriter || next === data.value) {
                return;
            }

            fallbackWriter(next);
        };

        const mutators: ListMutators<T> = {
            create: (item) => {
                if (onCreated) {
                    if (flags.dedupCreated && indexOf(data.value, item) >= 0) {
                        return;
                    }

                    onCreated(item);

                    return;
                }

                writeNext(applyCreate(data.value, item));
            },
            update: (item) => {
                if (onUpdated) {
                    onUpdated(item);

                    return;
                }

                writeNext(applyUpdate(data.value, item));
            },
            delete: (item) => {
                if (onDeleted) {
                    if (flags.filterDeleted && indexOf(data.value, item) < 0) {
                        return;
                    }

                    onDeleted(item);

                    return;
                }

                writeNext(applyDelete(data.value, item));
            },
        };

        return { ...base, ...mutators };
    }

    return base;
}
