import { isObject } from '@vuecs/core';
import { computed, isRef, toValue } from 'vue';
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import { merge } from 'smob';

export type ListDefinition<
    T = unknown,
    Meta extends object = Record<string, unknown>,
> = {
    /** Source data; reactive ref / getter / plain array. */
    data: MaybeRefOrGetter<T[]>;
    /**
     * Optional unified setter that replaces the source array. Used by
     * the mutator dispatch when no per-op handler is provided. Falls
     * back to an auto-derived setter when `data` is a `Ref<T[]>`.
     */
    setData?: (next: T[]) => void;
    /**
     * Per-op handler invoked when `list.create(item)` runs. Receives the
     * raw item (the consumer decides whether to push, replace, route to
     * a store action, etc.). Honored before `setData`, before the Ref
     * auto-setter. When `dedupCreated` is true and the item already
     * exists in the list, the handler is skipped (gate semantics match
     * `applyCreate`).
     */
    onCreated?: (item: T) => void;
    /**
     * Per-op handler invoked when `list.update(item)` runs. Receives the
     * raw item; `mergeOnUpdated` does NOT auto-apply on this path —
     * consumers who want merge semantics call `list.applyUpdate(...)`
     * inside the handler or manage it in their own write logic.
     */
    onUpdated?: (item: T) => void;
    /**
     * Per-op handler invoked when `list.delete(item)` runs. When
     * `filterDeleted` is true and the item is not found in the list,
     * the handler is skipped (gate semantics match `applyDelete`).
     */
    onDeleted?: (item: T) => void;
    /** Whether the list is currently loading. Defaults to `false`. */
    busy?: MaybeRefOrGetter<boolean>;
    /** Server-side total. Falls back to `data.length` when undefined. */
    total?: MaybeRefOrGetter<number | undefined>;
    /**
     * Consumer-defined bag — anything that's not vuecs's first-class
     * state. Pagination cursor, filter state, callbacks (`refresh`,
     * `load`), config flags, etc. Forwarded verbatim to `ListState.meta`;
     * each entry keeps its own shape, so consumers manage reactivity by
     * putting `Ref` / `ComputedRef` values directly inside the bag.
     */
    meta?: Meta;
    /** Resolve a stable identity for an item (used by findIndex). */
    itemId?: (item: T) => string | number;
    /**
     * Resolve an identity by key. Restricted to string / number keys —
     * symbol keys can't be safely cast to property accessors at runtime,
     * and the resolver falls back to `.id` when neither is set.
     */
    itemKey?:
        | Extract<keyof T, string | number> |
        ((item: T) => Extract<keyof T, string | number>);

    /** Suppress create-emit when item is already in `data` (by id). Default false. */
    dedupCreated?: boolean;
    /** Suppress delete-emit when item is not in `data` (by id). Default false. */
    filterDeleted?: boolean;
    /** On update, deep-merge the new value into the existing record. Default false. */
    mergeOnUpdated?: boolean;
};

/**
 * Ergonomic mutator surface — present on the `defineList()` return when a
 * writer can be derived for the operation. Resolution per-op (most-
 * specific first):
 *
 *  1. `onCreated` / `onUpdated` / `onDeleted` — receives raw `item`.
 *  2. `setData` — receives the next array (computed via `apply*`).
 *  3. `data: Ref<T[]>` — auto-derived `setData`.
 *  4. None — that op's mutator is absent (TS overload reflects).
 *
 * Gate flags `dedupCreated` / `filterDeleted` apply uniformly across
 * paths: when they fire, the matching mutator is a silent no-op.
 * `mergeOnUpdated` only applies on the setData / Ref-auto paths; the
 * per-op `onUpdated` handler always receives the raw item.
 */
export type ListMutators<T> = {
    create: (item: T) => void;
    update: (item: T) => void;
    delete: (item: T) => void;
};

export type ListState<
    T = unknown,
    Meta extends object = Record<string, unknown>,
> = {
    data: ComputedRef<T[]>;
    busy: ComputedRef<boolean>;
    /** Server-side total when provided, else `data.length`. */
    total: ComputedRef<number>;
    /**
     * Consumer-supplied metadata bag, forwarded verbatim from
     * `ListDefinition.meta`. Defaults to an empty object when omitted.
     * Each entry retains its original shape — `Ref`s stay `Ref`s,
     * callbacks stay callbacks, plain values stay plain.
     */
    meta: Meta;
    /** `!busy && total === 0` */
    isEmpty: ComputedRef<boolean>;
    /** Locate an item's index in `data`. -1 when missing. */
    findIndex: (item: T) => number;
    /**
     * Resolve a stable Vue `:key` for an item. Honors the configured
     * `itemId` / `itemKey` options and falls back to `.id`. Returns
     * `undefined` when no identity hint is available — call sites should
     * fall through to the iteration index in that case.
     */
    getItemKey: (item: T) => string | number | undefined;

    /** Per-policy flag values (`mergeOnUpdated` / `dedupCreated` / `filterDeleted`). */
    flags: {
        mergeOnUpdated: boolean;
        dedupCreated: boolean;
        filterDeleted: boolean;
    };

    /**
     * Pure helpers that build a *next* `data` array honoring the configured
     * flags. Consumers wire them into their own mutation flow:
     *
     * ```ts
     * const list = defineList({ data: users, mergeOnUpdated: true });
     * users.value = list.applyUpdate(users.value, edited);
     * ```
     *
     * Default flag values (all `false`) make these pass-throughs:
     * `applyCreate` appends, `applyUpdate` replaces, `applyDelete` removes.
     */
    applyCreate: (current: T[], item: T) => T[];
    applyUpdate: (current: T[], item: T) => T[];
    applyDelete: (current: T[], item: T) => T[];
};

function resolveItemId<T>(
    item: T,
    itemId?: (item: T) => string | number,
    itemKey?:
        | Extract<keyof T, string | number> |
        ((item: T) => Extract<keyof T, string | number>),
): string | number | undefined {
    if (itemId) return itemId(item);
    if (itemKey) {
        const key = typeof itemKey === 'function' ? itemKey(item) : itemKey;
        // `key` is a string|number key of T, and we already narrowed against
        // `itemKey` being defined — so `item[key]` is sound. The runtime
        // check on `value` covers the case where the field exists but isn't
        // a string|number (resolveItemId returns undefined; caller falls
        // through to the `.id` heuristic or the index).
        const value = item[key];
        if (typeof value === 'string' || typeof value === 'number') {
            return value;
        }
    }
    // After `isObject`, item is at least an indexable record. Annotate
    // a fresh local with the structural shape we care about (`{ id? }`)
    // so we read `.id` without an `unknown` cast.
    if (isObject(item)) {
        const obj: { id?: string | number } = item;
        if (typeof obj.id === 'string' || typeof obj.id === 'number') {
            return obj.id;
        }
    }
    return undefined;
}

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
        if (typeof declared === 'number') return declared;
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

    const findIndex = (item: T): number => {
        const target = resolveItemId(item, options.itemId, options.itemKey);
        if (target === undefined) {
            // Fall back to reference equality so reactive lists with no
            // identity hint still resolve when the same object is passed.
            return data.value.indexOf(item);
        }
        return data.value.findIndex((candidate) => (
            resolveItemId(candidate, options.itemId, options.itemKey) === target
        ));
    };

    const getItemKey = (item: T): string | number | undefined => (
        resolveItemId(item, options.itemId, options.itemKey)
    );

    const flags = {
        mergeOnUpdated: !!options.mergeOnUpdated,
        dedupCreated: !!options.dedupCreated,
        filterDeleted: !!options.filterDeleted,
    };

    const indexOf = (arr: T[], item: T): number => {
        const target = resolveItemId(item, options.itemId, options.itemKey);
        if (target === undefined) return arr.indexOf(item);
        return arr.findIndex((candidate) => (
            resolveItemId(candidate, options.itemId, options.itemKey) === target
        ));
    };

    const applyCreate = (current: T[], item: T): T[] => {
        if (flags.dedupCreated && indexOf(current, item) >= 0) {
            return current;
        }
        return [...current, item];
    };

    const applyUpdate = (current: T[], item: T): T[] => {
        const idx = indexOf(current, item);
        if (idx < 0) return current;
        const next = current.slice();
        next[idx] = flags.mergeOnUpdated ?
            (merge({}, current[idx] as object, item as object) as T) :
            item;
        return next;
    };

    const applyDelete = (current: T[], item: T): T[] => {
        const idx = indexOf(current, item);
        if (idx < 0) {
            return flags.filterDeleted ? current : current.filter((c) => c !== item);
        }
        return [...current.slice(0, idx), ...current.slice(idx + 1)];
    };

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
        fallbackWriter = (next) => { dataRef.value = next; };
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
            if (!fallbackWriter || next === data.value) return;
            fallbackWriter(next);
        };

        const mutators: ListMutators<T> = {
            create: (item) => {
                if (onCreated) {
                    if (flags.dedupCreated && indexOf(data.value, item) >= 0) return;
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
                    if (flags.filterDeleted && indexOf(data.value, item) < 0) return;
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
