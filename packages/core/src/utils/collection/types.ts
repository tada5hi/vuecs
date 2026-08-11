export type CollectionItemIdFn<T> = (item: T) => string | number;

/**
 * Resolve an identity by key. Restricted to string / number keys —
 * symbol keys can't be safely cast to property accessors at runtime.
 */
export type CollectionItemKey<T> = Extract<keyof T, string | number> |
    ((item: T) => Extract<keyof T, string | number>);

export type CollectionMutationFlags = {
    /** On update, deep-merge the new value into the existing record. Default false. */
    mergeOnUpdated: boolean,
    /** Suppress create when the item is already present (by identity). Default false. */
    dedupCreated: boolean,
    /** Suppress delete when the item is not present (by identity). Default false. */
    filterDeleted: boolean,
};

/**
 * Injectable deep-merge. `@vuecs/core` ships no merge implementation
 * (zero-dep rule); callers pass e.g. smob's:
 * `(target, source) => merge({}, target, source)`.
 *
 * Mind the argument order — smob's `merge` is **left-priority**, so
 * `(target, source) => merge({}, target, source)` keeps the EXISTING
 * value on conflicting keys (the incoming record only contributes keys
 * the existing one lacks). Pass
 * `(target, source) => merge({}, source, target)` when the new value
 * should win instead.
 */
export type CollectionMergeFn = (target: object, source: object) => object;

export type CollectionMutationsOptions<T> = {
    itemId?: CollectionItemIdFn<T>,
    itemKey?: CollectionItemKey<T>,
    flags?: Partial<CollectionMutationFlags>,
    merge?: CollectionMergeFn,
};

export type CollectionMutations<T> = {
    flags: CollectionMutationFlags,
    getItemKey: (item: T) => string | number | undefined,
    indexOf: (arr: T[], item: T) => number,
    /**
     * Pure next-array builders. Gated no-ops return the ORIGINAL array
     * reference so callers can skip their write path on `next === current`.
     */
    applyCreate: (current: T[], item: T) => T[],
    applyUpdate: (current: T[], item: T) => T[],
    applyDelete: (current: T[], item: T) => T[],
};
