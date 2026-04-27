import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import { injectConfigManager } from './install';
import type { Config } from './types';

/**
 * Reactive accessor for a single config key. Returns a `ComputedRef` so
 * locale / direction changes propagate automatically.
 *
 * Falls back to the framework default when no `ConfigManager` is installed
 * — overlays should be usable without an explicit `app.use(vuecs)` call.
 */
export function useConfig<K extends keyof Config>(key: K): ComputedRef<Config[K]> {
    const manager = injectConfigManager();
    return computed(() => {
        if (!manager) {
            return key === 'dir' ? 'ltr' : 'en-US';
        }
        return manager.get(key);
    }) as ComputedRef<Config[K]>;
}
