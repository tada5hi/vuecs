import { createCollectionMutations } from '@vuecs/core';
import {
    computed,
    ref,
    shallowRef,
    toRaw,
} from 'vue';
import { createAsyncSourceCore, createMetaBag, mergePatch } from './core';
import type {
    DataCollection,
    DataCollectionDefinition,
    DataCollectionSnapshot,
    DataSourceMetaInput,
} from './types';

/**
 * Loader-backed collection state container. Structural superset of
 * `@vuecs/list`'s `ListState & ListMutators`, so it binds directly to
 * `<VCList :state>`.
 *
 * Rows are NOT deep-reactive (the data ref is a `shallowRef`) — replace
 * a row via `update()` rather than mutating its fields in place.
 *
 * @experimental Surface may still change while consumer adapters land.
 */
export function defineDataCollection<
    T,
    Meta extends object = Record<string, unknown>,
>(options: DataCollectionDefinition<T, Meta>) : DataCollection<T, Meta> {
    const core = createAsyncSourceCore();
    const bag = createMetaBag<Meta>(options.initialMeta);

    // `shallowRef`, not `ref`: every mutation flow below replaces the array
    // wholesale, so deep reactivity buys nothing and costs plenty — a proxy
    // per row, loader row identity broken (`data[0] !== theRowTheLoaderReturned`),
    // and reactive proxies leaking out through `dehydrate()`.
    const dataRef = shallowRef<T[]>(options.initialData ?? []);
    const totalRef = ref<number | undefined>(undefined);

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

    // D12: mutators arriving while a load is in flight are buffered and
    // drained FIFO after every in-flight load settles (winner applied via
    // the token guard; drain also fires on load error — realtime events
    // must never be silently clobbered by a wholesale response assignment).
    let inFlightLoads = 0;
    // Accepted v1 limitation: unbounded while a load never settles.
    let bufferedOps : Array<() => void> = [];

    const drainBufferedOps = () => {
        const ops = bufferedOps;
        bufferedOps = [];
        for (const op of ops) {
            op();
        }
    };

    const enqueueOrApply = (apply: () => void) => {
        if (inFlightLoads > 0) {
            bufferedOps.push(apply);
            return;
        }
        apply();
    };

    const load = (next?: DataSourceMetaInput<Meta>) : Promise<void> => {
        bag.applyInput(next);
        inFlightLoads += 1;
        return core.run(
            () => options.load(bag.snapshot()),
            (result) => {
                dataRef.value = result.data;
                if (typeof result.total === 'number') {
                    totalRef.value = result.total;
                }
                bag.patch(result.meta);
            },
        ).then(() => {
            inFlightLoads -= 1;
            if (inFlightLoads === 0) {
                drainBufferedOps();
            }
        });
    };

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
    // accumulates over a session.
    const create = (item: T) => enqueueOrApply(() => {
        const next = mutations.applyCreate(dataRef.value, item);
        if (next === dataRef.value) return;
        const delta = next.length - dataRef.value.length;
        dataRef.value = next;
        adjustTotal(delta);
    });

    const update = (item: T) => enqueueOrApply(() => {
        const next = mutations.applyUpdate(dataRef.value, item);
        if (next === dataRef.value) return;
        dataRef.value = next;
    });

    const del = (item: T) => enqueueOrApply(() => {
        const next = mutations.applyDelete(dataRef.value, item);
        if (next === dataRef.value) return;
        const delta = next.length - dataRef.value.length;
        dataRef.value = next;
        adjustTotal(delta);
    });

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
        findIndex: (item) => mutations.indexOf(dataRef.value, item),
        getItemKey: mutations.getItemKey,
        flags: mutations.flags,
        applyCreate: mutations.applyCreate,
        applyUpdate: mutations.applyUpdate,
        applyDelete: mutations.applyDelete,
        create,
        update,
        delete: del,
        load,
        refresh: () => load(),
        mutate: core.mutate,
        dehydrate: () : DataCollectionSnapshot<T, Meta> => ({
            data: [...dataRef.value],
            total: totalRef.value,
            meta: bag.snapshot(),
        }),
    };
}
