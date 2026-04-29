import { computed, isRef, toValue } from 'vue';
import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import { merge } from 'smob';

/**
 * Reserved keys on the `useList()` input that vuecs treats as first-class
 * fields. Anything else on the options object flows through to the slot
 * props as-is (typed via `Extras`), per Q3 of the redesign plan.
 */
type UseListReservedKeys =    | 'data' |
    'busy' |
    'total' |
    'meta' |
    'itemId' |
    'itemKey' |
    'mergeOnUpdate' |
    'dedupCreated' |
    'filterDeleted';

export type UseListOptions<
    T = unknown,
    M = unknown,
    Extras extends object = Record<string, unknown>,
> = {
    /** Source data; reactive ref / getter / plain array. */
    data: MaybeRefOrGetter<T[]>;
    /** Whether the list is currently loading. Defaults to `false`. */
    busy?: MaybeRefOrGetter<boolean>;
    /** Server-side total. Falls back to `data.length` when undefined. */
    total?: MaybeRefOrGetter<number | undefined>;
    /** Caller-defined metadata (pagination, filters, …). Reactive. */
    meta?: MaybeRefOrGetter<M | undefined>;
    /** Resolve a stable identity for an item (used by findIndex). */
    itemId?: (item: T) => string | number;
    /** Resolve an identity by key. Falls back to `.id` when neither is set. */
    itemKey?: keyof T | ((item: T) => keyof T);

    /** Suppress create-emit when item is already in `data` (by id). Default false. */
    dedupCreated?: boolean;
    /** Suppress delete-emit when item is not in `data` (by id). Default false. */
    filterDeleted?: boolean;
    /** On update, deep-merge the new value into the existing record. Default false. */
    mergeOnUpdate?: boolean;
} & Omit<Extras, UseListReservedKeys>;

export type UseListReturn<
    T = unknown,
    M = unknown,
    Extras extends object = Record<string, unknown>,
> = {
    data: ComputedRef<T[]>;
    busy: ComputedRef<boolean>;
    /** Server-side total when provided, else `data.length`. */
    total: ComputedRef<number>;
    meta: ComputedRef<M | undefined>;
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

    /** Per-policy flag values (`mergeOnUpdate` / `dedupCreated` / `filterDeleted`). */
    flags: {
        mergeOnUpdate: boolean;
        dedupCreated: boolean;
        filterDeleted: boolean;
    };

    /**
     * Pure helpers that build a *next* `data` array honoring the configured
     * flags. Consumers wire them into their own mutation flow:
     *
     * ```ts
     * const list = useList({ data: users, mergeOnUpdate: true });
     * users.value = list.applyUpdate(users.value, edited);
     * ```
     *
     * Default flag values (all `false`) make these pass-throughs:
     * `applyCreate` appends, `applyUpdate` replaces, `applyDelete` removes.
     */
    applyCreate: (current: T[], item: T) => T[];
    applyUpdate: (current: T[], item: T) => T[];
    applyDelete: (current: T[], item: T) => T[];
} & Omit<Extras, UseListReservedKeys>;

const RESERVED_KEYS: ReadonlySet<string> = new Set<UseListReservedKeys>([
    'data',
    'busy',
    'total',
    'meta',
    'itemId',
    'itemKey',
    'mergeOnUpdate',
    'dedupCreated',
    'filterDeleted',
]);

function resolveItemId<T>(
    item: T,
    itemId?: (item: T) => string | number,
    itemKey?: keyof T | ((item: T) => keyof T),
): string | number | undefined {
    if (itemId) return itemId(item);
    if (itemKey) {
        const key = typeof itemKey === 'function' ? itemKey(item) : itemKey;
        const value = (item as Record<string, unknown>)[key as string];
        if (typeof value === 'string' || typeof value === 'number') {
            return value;
        }
    }
    if (item && typeof item === 'object' && 'id' in (item as object)) {
        const { id } = (item as Record<string, unknown>);
        if (typeof id === 'string' || typeof id === 'number') {
            return id;
        }
    }
    return undefined;
}

/**
 * Container composable for `<VCList>` state. Reactive; accepts plain values,
 * `Ref<T>`, or getters. Optional `Extras` flow through to slot consumers as
 * typed pass-through fields (Q3 of plan 010).
 */
export function useList<
    T = unknown,
    M = unknown,
    Extras extends object = Record<string, unknown>,
>(options: UseListOptions<T, M, Extras>): UseListReturn<T, M, Extras> {
    const data = computed<T[]>(() => toValue(options.data) ?? []);
    const busy = computed<boolean>(() => !!toValue(options.busy));
    const total = computed<number>(() => {
        const declared = toValue(options.total);
        if (typeof declared === 'number') return declared;
        return data.value.length;
    });
    const meta = computed<M | undefined>(() => toValue(options.meta));
    const isEmpty = computed<boolean>(() => !busy.value && total.value === 0);

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
        mergeOnUpdate: !!options.mergeOnUpdate,
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
        next[idx] = flags.mergeOnUpdate ?
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

    // Pass arbitrary extras through verbatim (Q3). Refs are forwarded as-is —
    // template consumers unwrap them automatically; render-fn consumers see
    // the same Ref they passed in.
    const extras: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(options as Record<string, unknown>)) {
        if (!RESERVED_KEYS.has(key)) {
            extras[key] = isRef(value) ? value : value;
        }
    }

    return {
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
        ...extras,
    } as UseListReturn<T, M, Extras>;
}
