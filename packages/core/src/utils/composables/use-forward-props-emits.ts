import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import { useEmitAsProps } from './use-emit-as-props';
import { useForwardProps } from './use-forward-props';

// See `use-emit-as-props.ts` — a literal-union event param (Vue's inferred
// `emit` type) must satisfy this constraint under strict, which `event: string`
// rejects via parameter contravariance.
type EmitFn = (...args: any[]) => void;

/**
 * Combines `useForwardProps` and `useEmitAsProps` into one ComputedRef
 * suitable for `v-bind`-ing onto an inner component.
 *
 * Mirrors reka-ui's `useForwardPropsEmits` (MIT, https://github.com/unovue/reka-ui).
 */
export function useForwardPropsEmits<T extends Record<string, any>, E extends EmitFn>(
    props: T,
    emit?: E,
): ComputedRef<T & Record<string, (...args: any[]) => void>> {
    const parsedProps = useForwardProps(props);
    const emitsAsProps = emit ? useEmitAsProps(emit) : {};

    return computed(() => ({
        ...parsedProps.value,
        ...emitsAsProps,
    })) as ComputedRef<T & Record<string, (...args: any[]) => void>>;
}
