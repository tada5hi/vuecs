import type { ComputedRef } from 'vue';
import { computed, unref } from 'vue';
import { injectDefaultsManager } from './install';
import type { ComponentDefaults } from './types';

/**
 * Resolve behavioral defaults for a component via the 3-layer chain:
 *
 *   1. Instance prop (if not `undefined`)
 *   2. Global defaults registered via the DefaultsManager (may be MaybeRef)
 *   3. Hardcoded fallback provided to the composable
 *
 * Reactive sources (`ref`, `computed`) in the global defaults layer are
 * automatically unwrapped, so i18n locale changes propagate through the
 * returned `ComputedRef` without additional wiring.
 *
 * Resolution contract:
 *   - The resolved shape is driven by `Object.keys(hardcoded)` — the
 *     `hardcoded` object is the source of truth for which keys appear
 *     on the returned object. Global defaults registered for keys not
 *     present in `hardcoded` are silently ignored; component authors
 *     must list every configurable key in `hardcoded`.
 *   - Only `undefined` triggers fallthrough. An explicit `null` on the
 *     instance prop wins over both global defaults and the hardcoded
 *     fallback — use this deliberately to "unset" a value; avoid using
 *     `null` to toggle booleans off (pass `false` instead).
 */
export function useComponentDefaults<
    K extends keyof ComponentDefaults,
    H extends Record<string, any>,
>(
    componentName: K,
    props: Record<string, any>,
    hardcoded: H,
): ComputedRef<H> {
    const manager = injectDefaultsManager();
    if (!manager) {
        throw new Error(
            'DefaultsManager is not installed. Call app.use(vuecs) or installDefaultsManager(app) before using components.',
        );
    }

    return computed(() => {
        const globalDefaults = manager.get(componentName) as Record<string, any> | undefined;
        const result = {} as Record<string, any>;

        const keys = Object.keys(hardcoded);
        for (const key of keys) {
            const propValue = props[key];
            if (typeof propValue !== 'undefined') {
                result[key] = propValue;
                continue;
            }

            if (globalDefaults) {
                const globalValue = unref(globalDefaults[key]);
                if (typeof globalValue !== 'undefined') {
                    result[key] = globalValue;
                    continue;
                }
            }

            result[key] = hardcoded[key];
        }

        return result as H;
    });
}
