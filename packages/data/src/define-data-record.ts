import { computed, shallowRef, toRaw } from 'vue';
import { createAsyncSourceCore, createMetaBag, mergePatch } from './core';
import type {
    DataRecord,
    DataRecordDefinition,
    DataRecordSnapshot,
    DataSourceMetaInput,
} from './types';

/**
 * Loader-backed single-record state container — the collection
 * variant's sibling for detail views and entity managers.
 *
 * @experimental Surface may still change while consumer adapters land.
 */
export function defineDataRecord<
    T,
    Meta extends object = Record<string, unknown>,
>(options: DataRecordDefinition<T, Meta>) : DataRecord<T, Meta> {
    const core = createAsyncSourceCore();
    const bag = createMetaBag<Meta>(options.initialMeta);

    // `shallowRef`, not `ref`: every mutation flow below replaces the record
    // wholesale, so deep reactivity buys nothing and costs plenty — loader
    // record identity broken (`data.value !== theRecordTheLoaderReturned`)
    // and reactive proxies leaking out through `dehydrate()`.
    const dataRef = shallowRef<T | undefined>(options.initialData);

    let hydrated = false;
    if (options.hydrate) {
        const snapshot = typeof options.hydrate === 'function' ?
            options.hydrate() :
            options.hydrate;
        if (snapshot) {
            dataRef.value = snapshot.data;
            // The snapshot is authoritative — REPLACE the bag rather than
            // merging onto `initialMeta`, so keys the snapshot dropped
            // don't survive rehydration. The updater form does exactly that.
            bag.applyInput(() => ({ ...snapshot.meta }));
            hydrated = true;
        }
    }

    const data = computed(() => dataRef.value);

    // D12: mutators arriving while a load is in flight are buffered and
    // drained FIFO after every in-flight load settles (winner applied via
    // the token guard; drain also fires on load error — realtime events
    // must never be silently clobbered by a wholesale response assignment).
    let inFlightLoads = 0;
    // Accepted v1 limitation: unbounded while a load never settles.
    let bufferedOps : Array<() => void> = [];
    // The promise `ensure()` coalesces onto. Deliberately NOT derived from
    // `core.busy`: `mutate()` raises it too, so keying off it made `ensure()`
    // resolve without fetching while a write was in flight. Hence the
    // load-specific `inFlightLoads` / `activeLoad` state tracked here.
    let activeLoad : Promise<void> | undefined;

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
        const promise = core.run(
            () => options.load(bag.snapshot()),
            (result) => {
                dataRef.value = result.data;
                bag.patch(result.meta);
            },
        ).then(() => {
            inFlightLoads -= 1;
            if (inFlightLoads === 0) {
                activeLoad = undefined;
                drainBufferedOps();
            }
        });

        activeLoad = promise;

        return promise;
    };

    const ensure = () : Promise<void> => {
        if (dataRef.value !== undefined) {
            return Promise.resolve();
        }

        if (inFlightLoads > 0 && activeLoad) {
            return activeLoad;
        }

        return load();
    };

    const set = (item: T) => enqueueOrApply(() => {
        dataRef.value = item;
    });

    // Patch-first, so `mergePatch`'s left priority makes the incoming patch win
    // on conflicting keys while untouched keys survive the deep merge — the
    // correct semantic for a loader-owned container (a realtime update must
    // actually update). Arrays REPLACE rather than concatenate, and a key the
    // patch sets to `undefined` is skipped (pass `null` to clear). Same merger
    // and ordering as the collection variant's adapter — see `mergePatch`.
    // `toRaw` unwraps a reactive patch (a consumer's `reactive()` form object):
    // the merger deep-clones its inputs, and `structuredClone` throws on a
    // Proxy. `toRaw` of a plain object is that same object, so the ordinary
    // path is untouched.
    const mergePartial = (partial: Partial<T>) => enqueueOrApply(() => {
        if (dataRef.value === undefined) return;
        dataRef.value = mergePatch(
            {},
            toRaw(partial as object),
            toRaw(dataRef.value as object),
        ) as T;
    });

    const clear = () => enqueueOrApply(() => {
        dataRef.value = undefined;
    });

    if (options.autoLoad ?? true) {
        // Hydration and the adoption path (`initialData`) both seed resolved
        // state, so neither needs the mount-time fetch.
        if (!hydrated && options.initialData === undefined) {
            core.scheduleAutoLoad(() => load());
        }
    }

    return {
        data,
        busy: core.busy,
        meta: bag.meta,
        error: core.error,
        load,
        refresh: () => load(),
        ensure,
        set,
        merge: mergePartial,
        clear,
        mutate: core.mutate,
        dehydrate: () : DataRecordSnapshot<T, Meta> => ({
            data: dataRef.value,
            meta: bag.snapshot(),
        }),
    };
}
