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
    const events = (vm?.type as { emits?: string[] })?.emits;
    const result: Record<string, (...args: any[]) => void> = {};

    if (!events?.length) {
        // eslint-disable-next-line no-console
        console.warn(`[vuecs] No emitted event found. Please check component: ${(vm?.type as { __name?: string })?.__name ?? '<anonymous>'}`);
        return result;
    }

    events.forEach((ev) => {
        result[toHandlerKey(camelize(ev))] = (...args: any[]) => emit(ev, ...args);
    });

    return result;
}
