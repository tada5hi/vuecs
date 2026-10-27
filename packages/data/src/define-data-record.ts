import {
    computed,
    ref,
    shallowRef,
    toRaw,
} from 'vue';
import type { Ref } from 'vue';
import { DataLoadStatus } from './constants';
import {
    assignInPlace,
    createAsyncSourceCore,
    createLoadController,
    createMetaBag,
    mergePatch,
} from './core';
import type {
    DataBufferedMutationOptions,
    DataEnsureOutcome,
    DataMutationOptions,
    DataRecord,
    DataRecordDefinition,
    DataRecordLoadResult,
    DataRecordSnapshot,
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
    Input = unknown,
>(options: DataRecordDefinition<T, Meta, Input>) : DataRecord<T, Meta, Input> {
    const core = createAsyncSourceCore();
    const bag = createMetaBag<Meta>(options.initialMeta);
    const deep = !!options.deep;

    // `shallowRef` by default: every mutation flow below replaces the record
    // wholesale, so deep reactivity buys nothing and costs plenty — loader
    // record identity broken (`data.value !== theRecordTheLoaderReturned`).
    // `deep: true` opts into exactly that trade for consumers that mutate the
    // held record in place. Either way `dehydrate()` reads through `toRaw`, so
    // no reactive proxy leaks into a snapshot.
    const dataRef = (deep ?
        ref(options.initialData) :
        shallowRef(options.initialData)) as Ref<T | undefined>;

    // The input that produced the held record — what `ensure(input)` compares
    // against. Seeded from `initialInput` / a hydrated snapshot, set by every
    // applied load, and forgotten by `set()` / `clear()` (the held record no
    // longer came from that input).
    let resolvedInput : Input | undefined = options.initialInput;

    let hydrated = false;
    if (options.hydrate) {
        const snapshot = typeof options.hydrate === 'function' ?
            options.hydrate() :
            options.hydrate;
        if (snapshot) {
            dataRef.value = snapshot.data;
            resolvedInput = snapshot.input;
            // The snapshot is authoritative — REPLACE the bag rather than
            // merging onto `initialMeta`, so keys the snapshot dropped
            // don't survive rehydration. The updater form does exactly that.
            bag.applyInput(() => ({ ...snapshot.meta }));
            hydrated = true;
        }
    }

    const data = computed(() => dataRef.value);

    const controller = createLoadController<Meta, Input, DataRecordLoadResult<T, Meta>>({
        core,
        bag,
        fetch: (meta, input) => options.load(meta, input),
        apply: (result, input) => {
            dataRef.value = result.data;
            resolvedInput = input;
            bag.patch(result.meta);
        },
    });

    const { load } = controller;

    const ensure = (input?: Input) : Promise<DataEnsureOutcome> => {
        // `undefined` = "any input will do" — the pre-input contract.
        const matches = (other: Input | undefined) => input === undefined || Object.is(input, other);

        if (dataRef.value !== undefined && matches(resolvedInput)) {
            return Promise.resolve({ status: DataLoadStatus.CACHED });
        }

        const active = controller.active();
        if (active && matches(active.input)) {
            return active.promise;
        }

        return load(undefined, input);
    };

    const set = (item: T, opts?: DataMutationOptions) => controller.enqueueOrApply(() => {
        dataRef.value = item;
        resolvedInput = undefined;
        return true;
    }, opts);

    // Patch-first, so `mergePatch`'s left priority makes the incoming patch win
    // on conflicting keys while untouched keys survive the deep merge — the
    // correct semantic for a loader-owned container (a realtime update must
    // actually update). Arrays REPLACE rather than concatenate, and a key the
    // patch sets to `undefined` is skipped (pass `null` to clear). Same merger
    // and ordering as the collection variant's adapter — see `mergePatch`.
    // `toRaw` unwraps a reactive patch (a consumer's `reactive()` form object,
    // or the held record itself under `deep: true`): the merger deep-clones
    // its inputs, and `structuredClone` throws on a Proxy. `toRaw` of a plain
    // object is that same object, so the ordinary path is untouched.
    const mergePartial = (partial: Partial<T>, opts?: DataBufferedMutationOptions) => controller.enqueueOrApply(() => {
        if (dataRef.value === undefined) return false;
        const merged = mergePatch(
            {},
            toRaw(partial as Record<string, any>),
            toRaw(dataRef.value as Record<string, any>),
        ) as T;

        if (deep) {
            // Keys onto the held proxy — the record keeps its identity.
            assignInPlace(dataRef.value as Record<string, any>, merged as Record<string, any>);
        } else {
            dataRef.value = merged;
        }
        return true;
    }, opts);

    const clear = (opts?: DataMutationOptions) => controller.enqueueOrApply(() => {
        resolvedInput = undefined;
        if (dataRef.value === undefined) return false;
        dataRef.value = undefined;
        return true;
    }, opts);

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
        refresh: (input?: Input) => load(undefined, input),
        ensure,
        set,
        merge: mergePartial,
        clear,
        mutate: core.mutate,
        dehydrate: () : DataRecordSnapshot<T, Meta, Input> => ({
            data: toRaw(dataRef.value),
            input: resolvedInput,
            meta: bag.snapshot(),
        }),
    };
}
