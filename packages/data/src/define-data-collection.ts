import { createCollectionMutations, isObject } from '@vuecs/core';
import {
    computed,
    ref,
    shallowRef,
    toRaw,
} from 'vue';
import type { Ref } from 'vue';
import {
    assignInPlace,
    createAsyncSourceCore,
    createLoadController,
    createMetaBag,
    mergePatch,
} from './core';
import type {
    DataBufferedMutationOptions,
    DataCollection,
    DataCollectionDefinition,
    DataCollectionLoadResult,
    DataCollectionSnapshot,
} from './types';

/**
 * Loader-backed collection state container. Structural superset of
 * `@vuecs/list`'s `ListState & ListMutators`, so it binds directly to
 * `<VCList :state>`.
 *
 * Rows are NOT deep-reactive by default (the data ref is a `shallowRef`) —
 * replace a row via `update()` rather than mutating its fields in place, or
 * opt into `deep: true`.
 *
 * @experimental Surface may still change while consumer adapters land.
 */
export function defineDataCollection<
    T,
    Meta extends object = Record<string, unknown>,
    Input = unknown,
>(options: DataCollectionDefinition<T, Meta, Input>) : DataCollection<T, Meta, Input> {
    const core = createAsyncSourceCore();
    const bag = createMetaBag<Meta>(options.initialMeta);
    const deep = !!options.deep;

    // `shallowRef` by default: every mutation flow below replaces the array
    // wholesale, so deep reactivity buys nothing and costs plenty — a proxy
    // per row and loader row identity broken
    // (`data[0] !== theRowTheLoaderReturned`). `deep: true` opts into exactly
    // that trade. Every read that feeds the mutation kernel or `dehydrate()`
    // goes through `raw()`, so the array the kernel sees — and every array
    // written back — holds raw rows, never proxies.
    const dataRef = (deep ?
        ref(options.initialData ?? []) :
        shallowRef(options.initialData ?? [])) as Ref<T[]>;
    const totalRef = ref<number | undefined>(undefined);

    const raw = () : T[] => toRaw(dataRef.value);
    // Deep mode stores raw rows (Vue unwraps on write anyway), so an incoming
    // proxy is unwrapped to compare against them. Shallow mode stores exactly
    // what it is handed — a reactive row passed in stays reactive.
    const ingest = (item: T) : T => (deep ? toRaw(item) : item);

    let hydrated = false;
    if (options.hydrate) {
        const snapshot = typeof options.hydrate === 'function' ?
            options.hydrate() :
            options.hydrate;
        if (snapshot) {
            dataRef.value = [...snapshot.data];
            totalRef.value = snapshot.total;
            // The snapshot is authoritative — REPLACE the bag rather than
            // merging onto `initialMeta`, so keys the snapshot dropped
            // don't survive rehydration. The updater form does exactly that.
            bag.applyInput(() => ({ ...snapshot.meta }));
            hydrated = true;
        }
    }

    const data = computed(() => dataRef.value);
    const total = computed(() => (
        typeof totalRef.value === 'number' ? totalRef.value : dataRef.value.length
    ));
    const isEmpty = computed(() => !core.busy.value && total.value === 0);

    const mutations = createCollectionMutations<T>({
        itemId: options.itemId,
        itemKey: options.itemKey,
        flags: {
            mergeOnUpdated: options.mergeOnUpdated,
            dedupCreated: options.dedupCreated,
            filterDeleted: options.filterDeleted,
        },
        // Incoming-first, so `mergePatch`'s left priority makes the incoming
        // item win on conflicting keys — the correct semantic for a
        // loader-owned container (a realtime update must actually update).
        // Arrays REPLACE rather than concatenate, and a key the incoming item
        // sets to `undefined` is skipped (pass `null` to clear) — see
        // `mergePatch`. NB: deliberately differs from defineList's shipped
        // adapter (existing-first), which is preserved untouched in Task 2.
        // `toRaw` unwraps a reactive row (`source.update(rows.value[0])` off a
        // deep ref): the merger deep-clones its inputs and `structuredClone`
        // throws on a Proxy. `toRaw` of a plain object is that same object.
        merge: (target, source) => mergePatch({}, toRaw(source), toRaw(target)),
    });

    const controller = createLoadController<Meta, Input, DataCollectionLoadResult<T, Meta>>({
        core,
        bag,
        fetch: (meta, input) => options.load(meta, input),
        apply: (result) => {
            dataRef.value = result.data;
            if (typeof result.total === 'number') {
                totalRef.value = result.total;
            }
            bag.patch(result.meta);
        },
    });

    const { load } = controller;

    const adjustTotal = (delta: number) => {
        if (typeof totalRef.value === 'number') {
            totalRef.value += delta;
        }
    };

    // Derive the total delta from the array lengths rather than hardcoding
    // ±1. A reference-inequality check alone is NOT proof that a row moved:
    // `applyDelete` under default flags returns a FRESH same-length array
    // when the item isn't present (it falls back to a `filter` by reference),
    // so a realtime "deleted" event for an off-page row would otherwise
    // decrement `total` with nothing actually removed — corruption that
    // accumulates over a session. The same length check decides `noop`.
    const create = (item: T, opts?: DataBufferedMutationOptions) => controller.enqueueOrApply(() => {
        const current = raw();
        const next = mutations.applyCreate(current, ingest(item));
        if (next === current) return false;
        const delta = next.length - current.length;
        dataRef.value = next;
        adjustTotal(delta);
        return true;
    }, opts);

    const update = (item: T, opts?: DataBufferedMutationOptions) => controller.enqueueOrApply(() => {
        const current = raw();
        const incoming = ingest(item);
        const next = mutations.applyUpdate(current, incoming);
        if (next === current) return false;

        if (deep) {
            // Keys onto the held row — it keeps its identity (and proxy).
            // Primitive rows have no keys to assign, so they still replace.
            const index = mutations.indexOf(current, incoming);
            const held = dataRef.value[index];
            if (isObject(held) && isObject(next[index])) {
                assignInPlace(held, next[index] as Record<string, any>);
                return true;
            }
        }

        dataRef.value = next;
        return true;
    }, opts);

    const del = (item: T, opts?: DataBufferedMutationOptions) => controller.enqueueOrApply(() => {
        const current = raw();
        const next = mutations.applyDelete(current, ingest(item));
        if (next === current) return false;
        const delta = next.length - current.length;
        if (delta === 0) return false;
        dataRef.value = next;
        adjustTotal(delta);
        return true;
    }, opts);

    if (options.autoLoad ?? true) {
        if (!hydrated) {
            core.scheduleAutoLoad(() => load());
        }
    }

    return {
        data,
        busy: core.busy,
        total,
        meta: bag.meta,
        isEmpty,
        error: core.error,
        findIndex: (item) => mutations.indexOf(raw(), ingest(item)),
        getItemKey: mutations.getItemKey,
        flags: mutations.flags,
        applyCreate: mutations.applyCreate,
        applyUpdate: mutations.applyUpdate,
        applyDelete: mutations.applyDelete,
        create,
        update,
        delete: del,
        load,
        refresh: (input?: Input) => load(undefined, input),
        mutate: core.mutate,
        dehydrate: () : DataCollectionSnapshot<T, Meta> => ({
            data: [...raw()],
            total: totalRef.value,
            meta: bag.snapshot(),
        }),
    };
}
