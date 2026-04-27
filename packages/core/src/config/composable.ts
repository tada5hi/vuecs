import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import { injectConfigManager } from './install';
import { ConfigManager } from './manager';
import type { Config } from './types';

/**
 * Reactive accessor for a single config key. Returns a `ComputedRef` so
 * locale / direction changes propagate automatically.
 *
 * Falls back to a default `ConfigManager` instance when no manager is
 * installed — overlays should be usable without an explicit
 * `app.use(vuecs)` call. The fallback uses the SAME defaults source as
 * the real manager (core's CORE_DEFAULTS + any `withDefaults` calls
 * from child packages), so future keys added via declaration merging
 * resolve consistently.
 *
 * Two signatures:
 *   - `useConfig(key)` — returns `Config[K] | undefined`. Honest: keys
 *     with no consumer config + no registered default resolve to
 *     `undefined`.
 *   - `useConfig(key, fallback)` — returns the non-nullable `Config[K]`,
 *     using `fallback` whenever the manager would return `undefined`.
 *     Mirrors the pattern of `useComponentDefaults`'s `hardcoded` arg.
 */
export function useConfig<K extends keyof Config>(key: K): ComputedRef<Config[K] | undefined>;
export function useConfig<K extends keyof Config>(key: K, fallback: NonNullable<Config[K]>): ComputedRef<NonNullable<Config[K]>>;
export function useConfig<K extends keyof Config>(
    key: K,
    fallback?: NonNullable<Config[K]>,
): ComputedRef<Config[K] | undefined> {
    const manager = injectConfigManager() ?? new ConfigManager();
    return computed(() => {
        const value = manager.get(key);
        return value === undefined ? fallback : value;
    });
}
