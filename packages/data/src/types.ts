import type { ComputedRef, Ref } from 'vue';

export type DataSourceMetaInput<Meta extends object> = Meta | ((current: Meta) => Meta);

export type DataCollectionLoadResult<T, Meta extends object> = {
    data: T[],
    /** Server-side total. When omitted, `total` falls back to `data.length`. */
    total?: number,
    /** Optional meta patch-back (e.g. server-corrected pagination). Shallow-merged. */
    meta?: Partial<Meta>,
};

export type DataCollectionLoadFn<T, Meta extends object> = (meta: Meta) => Promise<DataCollectionLoadResult<T, Meta>>;

export type DataCollectionSnapshot<T, Meta extends object> = {
    /**
     * Fresh array, but the ROWS are shared by reference with the live
     * source (they stay the plain objects the loader returned — no
     * reactive proxies). Safe to `JSON.stringify` for SSR transport;
     * mutating a row in place would still reach the live source.
     */
    data: T[],
    total?: number,
    meta: Meta,
};

export type DataCollectionDefinition<T, Meta extends object> = {
    /** The only required adapter — vuecs doesn't pick the HTTP/query client. */
    load: DataCollectionLoadFn<T, Meta>,
    initialMeta?: Meta,
    /**
     * Seed rows. **Aliased, not cloned** — the array is stored by
     * reference. The source never mutates it (every mutation flow
     * replaces the array wholesale), but neither should the caller:
     * an in-place write would reach the live source without notifying
     * the `shallowRef`. Pass a value you are done with, or copy at the
     * call site. Contrast `hydrate`, which copies the snapshot's array
     * into fresh state (the row objects inside stay shared).
     */
    initialData?: T[],
    /** Fire load() once via onMounted. Default true. Skipped when hydration seeded state. */
    autoLoad?: boolean,
    /**
     * SSR/persistence seed. Value or lazy getter, evaluated once at setup.
     * The snapshot is authoritative — its meta REPLACES `initialMeta`
     * (keys the snapshot dropped do not survive).
     */
    hydrate?: DataCollectionSnapshot<T, Meta> | (() => DataCollectionSnapshot<T, Meta> | null | undefined),
    /** Resolve a stable identity for an item (same ladder as defineList). */
    itemId?: (item: T) => string | number,
    itemKey?: Extract<keyof T, string | number> | ((item: T) => Extract<keyof T, string | number>),
    /** Gate flags — semantics identical to defineList. All default false. */
    dedupCreated?: boolean,
    filterDeleted?: boolean,
    mergeOnUpdated?: boolean,
};

export type DataCollection<T, Meta extends object> = {
    /**
     * Backed by a `shallowRef` — every mutation flow replaces the array
     * wholesale, so the ROWS are NOT deep-reactive. Mutating a field in
     * place (`data.value[0].name = 'x'`) does not re-render; replace the
     * row instead (`source.update({ ...row, name: 'x' })`).
     */
    data: ComputedRef<T[]>,
    busy: ComputedRef<boolean>,
    total: ComputedRef<number>,
    /** Reactive plain bag (shallowReactive). Structural match for ListState.meta. */
    meta: Meta,
    isEmpty: ComputedRef<boolean>,
    error: Ref<unknown>,
    findIndex: (item: T) => number,
    getItemKey: (item: T) => string | number | undefined,
    flags: {
        mergeOnUpdated: boolean,
        dedupCreated: boolean,
        filterDeleted: boolean
    },
    applyCreate: (current: T[], item: T) => T[],
    applyUpdate: (current: T[], item: T) => T[],
    applyDelete: (current: T[], item: T) => T[],
    create: (item: T) => void,
    update: (item: T) => void,
    delete: (item: T) => void,
    load: (next?: DataSourceMetaInput<Meta>) => Promise<void>,
    refresh: () => Promise<void>,
    mutate: <R>(fn: () => Promise<R>) => Promise<R>,
    dehydrate: () => DataCollectionSnapshot<T, Meta>,
};

export type DataRecordLoadResult<T, Meta extends object> = {
    data: T | undefined,
    meta?: Partial<Meta>,
};

export type DataRecordLoadFn<T, Meta extends object> = (meta: Meta) => Promise<DataRecordLoadResult<T, Meta>>;

export type DataRecordSnapshot<T, Meta extends object> = {
    data?: T,
    meta: Meta,
};

export type DataRecordDefinition<T, Meta extends object> = {
    load: DataRecordLoadFn<T, Meta>,
    initialMeta?: Meta,
    /**
     * Adoption path (e.g. a record passed via prop). When set, autoLoad
     * is skipped.
     *
     * **Aliased, not cloned** — the record is stored by reference. The
     * source never mutates it (`set` / `merge` / `clear` all replace the
     * ref), but neither should the caller: an in-place write would reach
     * the live source without notifying the `shallowRef`.
     */
    initialData?: T,
    autoLoad?: boolean,
    hydrate?: DataRecordSnapshot<T, Meta> | (() => DataRecordSnapshot<T, Meta> | null | undefined),
};

export type DataRecord<T, Meta extends object> = {
    data: ComputedRef<T | undefined>,
    busy: ComputedRef<boolean>,
    meta: Meta,
    error: Ref<unknown>,
    load: (next?: DataSourceMetaInput<Meta>) => Promise<void>,
    refresh: () => Promise<void>,
    /** Fetch only when unresolved; coalesces onto an in-flight load. */
    ensure: () => Promise<void>,
    set: (item: T) => void,
    merge: (partial: Partial<T>) => void,
    clear: () => void,
    mutate: <R>(fn: () => Promise<R>) => Promise<R>,
    dehydrate: () => DataRecordSnapshot<T, Meta>,
};
