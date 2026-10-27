import type { ComputedRef, Ref } from 'vue';
import type { DataLoadStatus, DataMutationStatus } from './constants';

export type DataSourceMetaInput<Meta extends object> = Meta | ((current: Meta) => Meta);

/**
 * String-literal form of `DataLoadStatus` — compare against either the enum
 * member or the plain string (`outcome.status === 'applied'`).
 */
export type DataLoadStatusLiteral = `${DataLoadStatus}`;

export type DataLoadApplied = { status: `${DataLoadStatus.APPLIED}` };
export type DataLoadSuperseded = { status: `${DataLoadStatus.SUPERSEDED}` };
export type DataLoadFailed = {
    status: `${DataLoadStatus.FAILED}`,
    /** The same value the shared `error` ref now holds. */
    error: unknown,
};
export type DataLoadCached = { status: `${DataLoadStatus.CACHED}` };

/**
 * What a `load()` / `refresh()` call did. Never a rejection — a failure
 * resolves `failed` (an unhandled rejection is fatal under SSR).
 *
 * - `applied` — this call was the latest; its result and meta are committed.
 * - `superseded` — a newer load (or an `immediate` write) took over; this
 *   call changed nothing, whether it succeeded or failed.
 * - `failed` — this call was the latest and its loader threw.
 */
export type DataLoadOutcome = DataLoadApplied | DataLoadSuperseded | DataLoadFailed;

/** `ensure()` additionally resolves `cached` when no load was needed. */
export type DataEnsureOutcome = DataLoadOutcome | DataLoadCached;

/**
 * What a mutator call did, synchronously — the string-literal form of
 * `DataMutationStatus`.
 *
 * - `applied` — state changed now.
 * - `noop` — nothing changed (an insert dropped by `dedupCreated`, an
 *   update / delete of an absent row, a `merge()` with no record held).
 * - `buffered` — a load is in flight; the mutation is replayed once it
 *   settles. Pass `onSettled` to learn whether it then applied.
 */
export type DataMutationStatusLiteral = `${DataMutationStatus}`;

/** Where a mutation ended up once it actually ran — never `buffered`. */
export type DataMutationSettledStatus = `${DataMutationStatus.APPLIED}` | `${DataMutationStatus.NOOP}`;

export type DataMutationOptions = {
    /**
     * Fires once the mutation has actually run — synchronously for an
     * unbuffered call, after the in-flight load settles for a buffered one.
     */
    onSettled?: (status: DataMutationSettledStatus) => void,
    /**
     * Apply now, even while a load is in flight: queued mutations drain
     * first (preserving order), every in-flight load is superseded so its
     * response can't clobber this write, then the write applies. Those
     * loads resolve `superseded`. Only `set()` / `clear()` accept it.
     */
    immediate?: boolean,
};

/** `DataMutationOptions` minus `immediate` — for mutators that don't bypass the buffer. */
export type DataBufferedMutationOptions = Omit<DataMutationOptions, 'immediate'>;

export type DataCollectionLoadResult<T, Meta extends object> = {
    data: T[],
    /** Server-side total. When omitted, `total` falls back to `data.length`. */
    total?: number,
    /** Optional meta patch-back (e.g. server-corrected pagination). Shallow-merged. */
    meta?: Partial<Meta>,
};

/**
 * `meta` is the draft this call would commit (the current meta with the
 * call's `next` applied); `input` is the call's per-call argument, passed
 * through untouched (`undefined` when the call had none).
 */
export type DataCollectionLoadFn<T, Meta extends object, Input = unknown> = (
    meta: Meta,
    input?: Input,
) => Promise<DataCollectionLoadResult<T, Meta>>;

export type DataCollectionSnapshot<T, Meta extends object> = {
    /**
     * Fresh array, but the ROWS are shared by reference with the live
     * source (they stay the plain objects the loader returned — no
     * reactive proxies, also under `deep: true`). Safe to `JSON.stringify`
     * for SSR transport; mutating a row in place would still reach the
     * live source.
     */
    data: T[],
    total?: number,
    meta: Meta,
};

export type DataCollectionDefinition<T, Meta extends object, Input = unknown> = {
    /** The only required adapter — vuecs doesn't pick the HTTP/query client. */
    load: DataCollectionLoadFn<T, Meta, Input>,
    initialMeta?: Meta,
    /**
     * Seed rows. **Aliased, not cloned** — the array is stored by
     * reference. The source never mutates the array (every mutation flow
     * replaces it wholesale; under `deep: true` it does write into the
     * row objects — see `deep`), but neither should the caller:
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
    /**
     * Hold rows deep-reactively (a `ref` instead of a `shallowRef`), so an
     * in-place write (`data.value[0].name = 'x'`) re-renders, and
     * `update()` assigns keys onto the held row instead of replacing it —
     * the row keeps its identity. Default `false`.
     *
     * Costs: one reactive proxy per row, and `data.value[i]` is a proxy, not
     * the object the loader returned. `dehydrate()` still yields raw rows.
     * Primitive rows have no keys, so `update()` still replaces them.
     *
     * **Held rows are written in place** — by `update()` and by any write
     * through `data.value`. Those rows are whatever was handed in: the
     * loader's result, `initialData`, a hydrated snapshot's rows, or a
     * `create()` argument. Pass objects you are done with, or copy them first.
     */
    deep?: boolean,
    /** Resolve a stable identity for an item (same ladder as defineList). */
    itemId?: (item: T) => string | number,
    itemKey?: Extract<keyof T, string | number> | ((item: T) => Extract<keyof T, string | number>),
    /** Gate flags — semantics identical to defineList. All default false. */
    dedupCreated?: boolean,
    filterDeleted?: boolean,
    mergeOnUpdated?: boolean,
};

export type DataCollection<T, Meta extends object, Input = unknown> = {
    /**
     * Backed by a `shallowRef` unless `deep: true` — every mutation flow
     * replaces the array wholesale, so by default the ROWS are NOT
     * deep-reactive. Mutating a field in place (`data.value[0].name = 'x'`)
     * does not re-render; replace the row instead
     * (`source.update({ ...row, name: 'x' })`), or opt into `deep: true`.
     */
    data: ComputedRef<T[]>,
    busy: ComputedRef<boolean>,
    total: ComputedRef<number>,
    /**
     * Reactive plain bag (shallowReactive). Structural match for
     * ListState.meta. Holds the meta of the last load that APPLIED — a
     * `load(next)` that fails or is superseded never commits `next`.
     */
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
    create: (item: T, options?: DataBufferedMutationOptions) => DataMutationStatusLiteral,
    update: (item: T, options?: DataBufferedMutationOptions) => DataMutationStatusLiteral,
    delete: (item: T, options?: DataBufferedMutationOptions) => DataMutationStatusLiteral,
    /**
     * `next` is applied to a draft handed to the loader and committed into
     * `meta` only when this call applies. `input` is forwarded to the
     * loader as its second argument.
     *
     * Method syntax on purpose: methods are checked bivariantly, so a
     * typed-input source stays assignable to `DataCollection<T, Meta>` (see
     * `DataRecord['load']`).
     */
    load(next?: DataSourceMetaInput<Meta>, input?: Input): Promise<DataLoadOutcome>,
    refresh(input?: Input): Promise<DataLoadOutcome>,
    mutate: <R>(fn: () => Promise<R>) => Promise<R>,
    dehydrate: () => DataCollectionSnapshot<T, Meta>,
};

export type DataRecordLoadResult<T, Meta extends object> = {
    data: T | undefined,
    meta?: Partial<Meta>,
};

/** Same `(meta, input)` contract as `DataCollectionLoadFn`. */
export type DataRecordLoadFn<T, Meta extends object, Input = unknown> = (
    meta: Meta,
    input?: Input,
) => Promise<DataRecordLoadResult<T, Meta>>;

export type DataRecordSnapshot<T, Meta extends object, Input = unknown> = {
    data?: T,
    meta: Meta,
    /**
     * The input the held record came from, so a hydrated source's
     * `ensure(input)` resolves `cached` instead of refetching.
     */
    input?: Input,
};

export type DataRecordDefinition<T, Meta extends object, Input = unknown> = {
    load: DataRecordLoadFn<T, Meta, Input>,
    initialMeta?: Meta,
    /**
     * Adoption path (e.g. a record passed via prop). When set, autoLoad
     * is skipped.
     *
     * **Aliased, not cloned** — the record is stored by reference. By
     * default the source never mutates it (`set` / `merge` / `clear` all
     * replace the ref), but neither should the caller: an in-place write
     * would reach the live source without notifying the `shallowRef`.
     * Under `deep: true` the source DOES write into it — see `deep`.
     */
    initialData?: T,
    /**
     * The input `initialData` corresponds to, so `ensure(input)` treats the
     * adopted record as resolved for it instead of refetching.
     */
    initialInput?: Input,
    autoLoad?: boolean,
    hydrate?: DataRecordSnapshot<T, Meta, Input> | (() => DataRecordSnapshot<T, Meta, Input> | null | undefined),
    /**
     * Hold the record deep-reactively (a `ref` instead of a `shallowRef`),
     * so an in-place write (`data.value.parentId = x`) re-renders, and
     * `merge()` assigns keys onto the held record instead of replacing it.
     * `set()` still replaces. Default `false`.
     *
     * Costs: `data.value` is a reactive proxy, not the object the loader
     * returned. `dehydrate()` still yields the raw record.
     *
     * **The held object is written in place** — by `merge()` and by any
     * write through `data.value`. That object is whatever was handed in:
     * the loader's result, `initialData`, a hydrated snapshot's `data`, or a
     * `set()` argument. Pass objects you are done with, or copy them first.
     */
    deep?: boolean,
};

export type DataRecord<T, Meta extends object, Input = unknown> = {
    /** Backed by a `shallowRef` unless `deep: true` — replace, don't mutate in place. */
    data: ComputedRef<T | undefined>,
    busy: ComputedRef<boolean>,
    /** Meta of the last load that APPLIED — see `DataCollection['meta']`. */
    meta: Meta,
    error: Ref<unknown>,
    // Method syntax (not property arrows) for every member that takes
    // `input`: methods are checked bivariantly, so a typed-input source
    // (`DataRecord<T, Meta, number>`) stays assignable to the default-input
    // form (`DataRecord<T, Meta>`). A property arrow is contravariant in
    // `Input` and would reject it.
    load(next?: DataSourceMetaInput<Meta>, input?: Input): Promise<DataLoadOutcome>,
    refresh(input?: Input): Promise<DataLoadOutcome>,
    /**
     * Fetch only when unresolved; coalesces onto an in-flight load.
     *
     * With an `input`, "resolved" means a record is held AND it came from
     * that same input (`Object.is`) — via a load, `initialInput`, or a
     * hydrated snapshot — and it only coalesces onto an in-flight load with
     * the same input; otherwise it loads with `input`. `set()` / `clear()`
     * forget the input. Compare-by-identity: pass a primitive (an id) or a
     * stable reference. Without an `input`, any held record / in-flight load
     * satisfies it.
     */
    ensure(input?: Input): Promise<DataEnsureOutcome>,
    set: (item: T, options?: DataMutationOptions) => DataMutationStatusLiteral,
    merge: (partial: Partial<T>, options?: DataBufferedMutationOptions) => DataMutationStatusLiteral,
    clear: (options?: DataMutationOptions) => DataMutationStatusLiteral,
    mutate: <R>(fn: () => Promise<R>) => Promise<R>,
    dehydrate(): DataRecordSnapshot<T, Meta, Input>,
};
