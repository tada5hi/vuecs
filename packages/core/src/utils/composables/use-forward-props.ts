import {
    camelize,
    computed,
    getCurrentInstance,
    toRef,
} from 'vue';
import type { ComputedRef } from 'vue';
import { isObject } from '../object';

/**
 * Returns a ComputedRef of props where each key is included only when the
 * caller actually passed it (or the component declares a default for it).
 * Useful for forwarding props from a wrapper to an inner component without
 * leaking `undefined` values that would override the inner component's
 * own defaults.
 *
 * Mirrors reka-ui's `useForwardProps` (MIT, https://github.com/unovue/reka-ui).
 */
export function useForwardProps<T extends Record<string, any>>(props: T): ComputedRef<T> {
    const vm = getCurrentInstance();
    const declaredProps = (vm?.type as { props?: Record<string, { default?: unknown }> })?.props ?? {};

    const defaultProps = Object.keys(declaredProps).reduce<Record<string, unknown>>((prev, curr) => {
        const declared = declaredProps[curr];
        const defaultValue = isObject(declared) ? declared.default : undefined;
        if (defaultValue !== undefined) {
            prev[curr] = defaultValue;
        }
        return prev;
    }, {});

    const refProps = toRef(props);

    return computed(() => {
        const preservedProps: Record<string, unknown> = {};
        const assignedProps = vm?.vnode.props ?? {};
        Object.keys(assignedProps).forEach((key) => {
            preservedProps[camelize(key)] = assignedProps[key];
        });

        return Object.keys({ ...defaultProps, ...preservedProps }).reduce<Record<string, unknown>>((prev, curr) => {
            if ((refProps.value as Record<string, unknown>)[curr] !== undefined) {
                prev[curr] = (refProps.value as Record<string, unknown>)[curr];
            }
            return prev;
        }, {}) as T;
    });
}
