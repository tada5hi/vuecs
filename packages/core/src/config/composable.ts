import { computed, getCurrentInstance } from 'vue';
import type { App, ComputedRef } from 'vue';
import { injectConfigManager } from './install';
import { ConfigManager } from './manager';
import type { Config } from './types';

/**
 * Per-app fallback managers. Used when no manager is installed via
 * `app.use(vuecs)`. Keyed by Vue's `App` instance so consumers
 * within the same app share state (so `setConfig` / `withDefaults`
 * propagates between callers), but separate apps — and separate
 * SSR requests, which each get a fresh `App` — get isolated
 * managers. A module-level singleton would leak state between SSR
 * requests in the same JS runtime.
 *
 * The non-app fallback (when `getCurrentInstance()` returns null —
 * e.g. composable invoked outside `setup()` in a unit test) uses a
 * dedicated singleton sentinel keyed on `noAppFallback`.
 */
const fallbackManagers = new WeakMap<App | { __noApp: true }, ConfigManager>();
const noAppFallback: { __noApp: true } = { __noApp: true };

function resolveFallbackManager(): ConfigManager {
    const instance = getCurrentInstance();
    const key: App | { __noApp: true } = instance?.appContext.app ?? noAppFallback;
    let manager = fallbackManagers.get(key);
    if (!manager) {
        manager = new ConfigManager();
        fallbackManagers.set(key, manager);
    }
    return manager;
}

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
    const manager = injectConfigManager() ?? resolveFallbackManager();
    return computed(() => {
        const value = manager.get(key);
        return value === undefined ? fallback : value;
    });
}
