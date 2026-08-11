import { createMerger } from 'smob';
import {
    computed,
    getCurrentInstance,
    onMounted,
    ref,
    shallowReactive,
} from 'vue';
import type { ComputedRef, Ref } from 'vue';
import type { DataSourceMetaInput } from './types';

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
     * (never rethrown — safe for autoLoad).
     */
    run: <R>(work: () => Promise<R>, apply: (result: R) => void) => Promise<void>,
    /** Run a consumer async op under busy/error accounting; rethrows. */
    mutate: <R>(fn: () => Promise<R>) => Promise<R>,
    /** Register onMounted(fire) when inside a component; dev-warn otherwise. */
    scheduleAutoLoad: (fire: () => Promise<void>) => void,
};

export function createAsyncSourceCore() : AsyncSourceCore {
    const busyCount = ref(0);
    const busy = computed(() => busyCount.value > 0);
    const error = ref<unknown>(undefined);

    let token = 0;

    const run = async <R>(work: () => Promise<R>, apply: (result: R) => void) : Promise<void> => {
        token += 1;
        const current = token;
        busyCount.value += 1;
        error.value = undefined;
        const promise = (async () => {
            try {
                const result = await work();
                if (current !== token) return;
                apply(result);
            } catch (e) {
                if (current === token) {
                    error.value = e;
                }
            } finally {
                busyCount.value -= 1;
            }
        })();
        return promise;
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

    const scheduleAutoLoad = (fire: () => Promise<void>) => {
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

    const applyInput = (next?: DataSourceMetaInput<Meta>) => {
        if (!next) return;
        if (typeof next === 'function') {
            const replacement = next({ ...meta });
            for (const key of Object.keys(meta)) {
                if (!(key in replacement)) {
                    delete (meta as Record<string, unknown>)[key];
                }
            }
            Object.assign(meta, replacement);
            return;
        }
        Object.assign(meta, next);
    };

    const patch = (partial?: Partial<Meta>) => {
        if (!partial) return;
        Object.assign(meta, partial);
    };

    const snapshot = () : Meta => ({ ...meta });

    return {
        meta,
        applyInput,
        patch,
        snapshot,
    };
}
