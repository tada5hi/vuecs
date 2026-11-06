import type { ComputedRef, MaybeRefOrGetter } from 'vue';

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
