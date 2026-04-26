import { camelize, getCurrentInstance, toHandlerKey } from 'vue';

type EmitFn = (event: string, ...args: any[]) => void;

/**
 * Converts a component's declared `emits` array into a map of `onEventName`
 * handler props. Lets a wrapper forward the inner component's emits as
 * v-on listeners without re-declaring them.
 *
 * Mirrors reka-ui's `useEmitAsProps` (MIT, https://github.com/unovue/reka-ui).
 */
export function useEmitAsProps<E extends EmitFn>(emit: E): Record<string, (...args: any[]) => void> {
    const vm = getCurrentInstance();
    // Vue 3's `emits` option supports both array form (`emits: ['change']`)
    // and object form (`emits: { change: null, submit: payload => true }`).
    // `defineEmits<{ ... }>()` and validation-style declarations both
    // produce the object form, so reading only `string[]` silently dropped
    // those events into the empty fallback below.
    const declared = (vm?.type as { emits?: string[] | Record<string, unknown> })?.emits;
    let events: string[];
    if (Array.isArray(declared)) {
        events = declared;
    } else if (declared) {
        events = Object.keys(declared);
    } else {
        events = [];
    }
    const result: Record<string, (...args: any[]) => void> = {};

    if (!events.length) {
        // eslint-disable-next-line no-console
        console.warn(`[vuecs] No emitted event found. Please check component: ${(vm?.type as { __name?: string })?.__name ?? '<anonymous>'}`);
        return result;
    }

    events.forEach((ev) => {
        result[toHandlerKey(camelize(ev))] = (...args: any[]) => emit(ev, ...args);
    });

    return result;
}
