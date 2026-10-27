import { createMerger } from 'smob';
import {
    computed,
    getCurrentInstance,
    onMounted,
    ref,
    shallowReactive,
} from 'vue';
import type { ComputedRef, Ref } from 'vue';
import { DataLoadStatus, DataMutationStatus } from './constants';
import type {
    DataLoadOutcome,
    DataMutationOptions,
    DataMutationSettledStatus,
    DataMutationStatusLiteral,
    DataSourceMetaInput,
} from './types';

/**
 * Patch semantics for `@vuecs/data` — the single merger both the record and
 * the collection container use. Internal: deliberately NOT re-exported from
 * the package barrel.
 *
 * Call it patch-first (`mergePatch({}, patch, current)`) so the patch is the
 * left/higher-priority source. Effective semantics:
 *
 * - **deep merge, patch wins** on conflicting keys (`priority: 'left'`);
 * - **arrays REPLACE** rather than concatenate (`array: false`), so repeated
 *   realtime patches can't grow a list without bound;
 * - **inputs are cloned** (`clone: true`), so the result shares no nested
 *   reference with the caller's patch or with the record it replaced, and the
 *   caller's patch is never mutated in place;
 * - **explicitly-`undefined` patch keys are ignored** — pass `null` to clear,
 *   mirroring the repo-wide "only `undefined` falls through; `null`
 *   deliberately clears" doctrine.
 *
 * The `strategy` below reads oddly on purpose. smob consults it **only for
 * keys the target already owns**, and hands it the *source* (lower-priority)
 * value — so in a patch-first call the patch has already been folded into the
 * accumulator by the time the strategy runs, and an explicitly-`undefined`
 * patch key surfaces as `target[key] === undefined`, not as `value ===
 * undefined`. Writing the source value back and returning the target marks the
 * key handled (a non-`undefined` return means "skip the default merge");
 * returning `undefined` falls through to smob's default behaviour.
 *
 * ## Structured-clone constraint
 *
 * `clone: true` routes both inputs through `structuredClone`, so **the patch
 * and the record must be structured-cloneable**:
 *
 * - **function-valued fields throw** (`DataCloneError`) — they were merely
 *   reference-copied before this merger;
 * - **class instances are flattened** to plain objects; their methods and
 *   prototype are lost. `Date` / `RegExp` / `Map` / `Set` / nested plain
 *   objects and arrays all survive intact;
 * - **top-level reactive proxies are unwrapped with `toRaw` at the call
 *   sites** (a bare `reactive()` object would otherwise throw
 *   `DataCloneError`). A proxy nested *inside* a raw object is not unwrapped
 *   and still throws — hold raw entities in your source of truth;
 * - clone cost is **O(record size) per merge**, paid on every `merge()` /
 *   merged `update()`. Fine for entity-shaped rows; consider batching if a
 *   record is very large and patched at high frequency.
 */
export const mergePatch = createMerger({
    priority: 'left',
    array: false,
    clone: true,
    strategy: (target, key, value) => {
        if (target[key] === undefined) {
            target[key] = value;
            return target;
        }

        return undefined;
    },
});

export type AsyncSourceCore = {
    busy: ComputedRef<boolean>,
    error: Ref<unknown>,
    /**
     * Token-guarded latest-wins runner. `apply` only fires when this
     * call is still the latest; rejections are captured into `error`
     * (never rethrown — safe for autoLoad). Resolves to the call's own
     * outcome, so a caller never has to infer it from the shared `error`.
     *
     * `work` is invoked synchronously, before the first `await`.
     */
    run: <R>(work: () => Promise<R>, apply: (result: R) => void) => Promise<DataLoadOutcome>,
    /** Invalidate every in-flight `run` — each resolves `superseded`. */
    supersede: () => void,
    /** Run a consumer async op under busy/error accounting; rethrows. */
    mutate: <R>(fn: () => Promise<R>) => Promise<R>,
    /** Register onMounted(fire) when inside a component; dev-warn otherwise. */
    scheduleAutoLoad: (fire: () => Promise<unknown>) => void,
};

export function createAsyncSourceCore() : AsyncSourceCore {
    const busyCount = ref(0);
    const busy = computed(() => busyCount.value > 0);
    const error = ref<unknown>(undefined);

    let token = 0;

    const run = async <R>(work: () => Promise<R>, apply: (result: R) => void) : Promise<DataLoadOutcome> => {
        token += 1;
        const current = token;
        busyCount.value += 1;
        error.value = undefined;
        try {
            const result = await work();
            if (current !== token) return { status: DataLoadStatus.SUPERSEDED };
            apply(result);
            return { status: DataLoadStatus.APPLIED };
        } catch (e) {
            if (current !== token) return { status: DataLoadStatus.SUPERSEDED };
            error.value = e;
            return { status: DataLoadStatus.FAILED, error: e };
        } finally {
            busyCount.value -= 1;
        }
    };

    const supersede = () => {
        token += 1;
    };

    const mutate = async <R>(fn: () => Promise<R>) : Promise<R> => {
        busyCount.value += 1;
        try {
            return await fn();
        } catch (e) {
            error.value = e;
            throw e;
        } finally {
            busyCount.value -= 1;
        }
    };

    const scheduleAutoLoad = (fire: () => Promise<unknown>) => {
        if (getCurrentInstance()) {
            onMounted(() => {
                fire();
            });
            return;
        }

        // `globalThis.process` is the safe lookup in browser
        // ESM builds where `process` isn't a global; raw
        // `process.env.NODE_ENV` would throw ReferenceError.
        if ((globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn('[vuecs] autoLoad requires a component setup context; call load() manually.');
        }
    };

    return {
        busy,
        error,
        run,
        supersede,
        mutate,
        scheduleAutoLoad,
    };
}

/**
 * Reactive meta bag + the two write forms: object = shallow top-level
 * merge; updater fn = wholesale replace (removed keys deleted).
 */
export function createMetaBag<Meta extends object>(initial?: Meta) {
    const meta = shallowReactive({ ...(initial ?? {}) }) as Meta;

    const snapshot = () : Meta => ({ ...meta });

    /**
     * Pure: what `next` turns `base` into, without touching the bag.
     * Object = shallow top-level merge; updater fn = wholesale replace.
     */
    const resolve = (base: Meta, next?: DataSourceMetaInput<Meta>) : Meta => {
        if (!next) return { ...base };
        if (typeof next === 'function') {
            return { ...next({ ...base }) };
        }
        return { ...base, ...next };
    };

    /** Make the bag equal `next` — keys absent from it are deleted. */
    const replace = (next: Meta) => {
        for (const key of Object.keys(meta)) {
            if (!(key in next)) {
                delete (meta as Record<string, unknown>)[key];
            }
        }
        Object.assign(meta, next);
    };

    const applyInput = (next?: DataSourceMetaInput<Meta>) => {
        if (!next) return;
        replace(resolve(snapshot(), next));
    };

    const patch = (partial?: Partial<Meta>) => {
        if (!partial) return;
        Object.assign(meta, partial);
    };

    return {
        meta,
        resolve,
        replace,
        applyInput,
        patch,
        snapshot,
    };
}

export type MetaBag<Meta extends object> = ReturnType<typeof createMetaBag<Meta>>;

/**
 * Make `target` equal `source` IN PLACE: keys absent from `source` are
 * deleted, the rest assigned. Used by `deep: true` sources so a held
 * record / row keeps its identity (and its reactive proxy) across updates.
 */
export function assignInPlace(target: Record<string, any>, source: Record<string, any>) {
    for (const key of Object.keys(target)) {
        if (!(key in source)) {
            delete target[key];
        }
    }
    Object.assign(target, source);
}

type LoadControllerOptions<Meta extends object, Input, R> = {
    core: AsyncSourceCore,
    bag: MetaBag<Meta>,
    fetch: (meta: Meta, input: Input | undefined) => Promise<R>,
    /** Commit a winning result (and the input that produced it) into the container's state. */
    apply: (result: R, input: Input | undefined) => void,
};

export type ActiveLoad<Input> = {
    promise: Promise<DataLoadOutcome>,
    input: Input | undefined,
};

/**
 * The load + mutation-ordering machinery both containers share.
 *
 * - **Meta commits on success.** `load(next)` resolves `next` onto a
 *   *draft* — based on the latest pending draft, so back-to-back calls
 *   compose exactly as they did when meta committed eagerly — and hands
 *   that draft to the loader. The bag only becomes the draft when the call
 *   applies; a failed or superseded call leaves `meta` at the last request
 *   that actually succeeded.
 * - **Per-call input** is forwarded to the loader untouched.
 * - **D12 buffering.** Mutators arriving while a load is in flight are
 *   buffered and drained FIFO after every in-flight load settles (winner
 *   applied via the token guard; drain also fires on load error — realtime
 *   events must never be silently clobbered by a wholesale response
 *   assignment). Accepted v1 limitation: unbounded while a load never
 *   settles.
 * - **Immediate writes** drain the buffer (earlier writes stay earlier),
 *   supersede every in-flight load, then apply — so no older response can
 *   clobber them.
 */
export function createLoadController<Meta extends object, Input, R>(
    options: LoadControllerOptions<Meta, Input, R>,
) {
    const { core, bag } = options;

    let inFlight = 0;
    let buffered : Array<() => void> = [];
    let pendingDraft : Meta | undefined;
    let active : ActiveLoad<Input> | undefined;

    // A buffered op runs inside the load's promise chain (or ahead of an
    // immediate write), where a throw would reject a `load()` that promises
    // never to reject and drop every op queued behind it. Each op is
    // isolated instead; a failure lands in the shared `error` ref, the same
    // place a failed load reports to.
    const drain = () => {
        const ops = buffered;
        buffered = [];
        for (const op of ops) {
            try {
                op();
            } catch (e) {
                core.error.value = e;
            }
        }
    };

    const load = (next?: DataSourceMetaInput<Meta>, input?: Input) : Promise<DataLoadOutcome> => {
        const draft = bag.resolve(pendingDraft ?? bag.snapshot(), next);
        pendingDraft = draft;
        inFlight += 1;

        const promise : Promise<DataLoadOutcome> = core.run(
            () => options.fetch({ ...draft }, input),
            (result) => {
                bag.replace(draft);
                options.apply(result, input);
            },
        ).then((outcome) => {
            inFlight -= 1;
            if (active?.promise === promise) {
                active = undefined;
                pendingDraft = undefined;
            }
            if (inFlight === 0) {
                drain();
            }
            return outcome;
        });

        active = { promise, input };

        return promise;
    };

    const settle = (apply: () => boolean, opts?: DataMutationOptions) : DataMutationSettledStatus => {
        const status = apply() ? DataMutationStatus.APPLIED : DataMutationStatus.NOOP;
        opts?.onSettled?.(status);
        return status;
    };

    /** `apply` returns whether it changed state (`false` = no-op). */
    const enqueueOrApply = (apply: () => boolean, opts?: DataMutationOptions) : DataMutationStatusLiteral => {
        if (opts?.immediate) {
            drain();
            if (inFlight > 0) {
                core.supersede();
                active = undefined;
                pendingDraft = undefined;
            }
            return settle(apply, opts);
        }

        if (inFlight > 0) {
            buffered.push(() => {
                settle(apply, opts);
            });
            return DataMutationStatus.BUFFERED;
        }

        return settle(apply, opts);
    };

    return {
        load,
        enqueueOrApply,
        /** The latest in-flight load, if any (superseded loads excluded). */
        active: () => active,
    };
}
