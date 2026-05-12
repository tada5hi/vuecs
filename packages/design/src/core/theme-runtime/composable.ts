import type { InjectionKey } from 'vue';
import { inject } from 'vue';
import type { ThemeRuntimeManager } from './types';

/**
 * Globally-shared `InjectionKey` for the ThemeManager. SSR plugins
 * (Nuxt, future frameworks) that need to look up the manager from
 * outside Vue's component context use this with `app.runWithContext`
 * (or equivalent) + `inject`.
 *
 * Bridge between `@vuecs/design` and `@vuecs/core`'s `ThemeManager`
 * without a hard runtime dep: both packages reference the same
 * `Symbol.for('VCThemeManager')` registry key, so the ThemeManager
 * provided by `installThemeManager(app)` (in `@vuecs/core`) is
 * reachable here. `Symbol.for(...)` is reference-equal across module
 * boundaries, and the `InjectionKey<ThemeRuntimeManager>` cast
 * surfaces the manager type to `inject()` callers without leaking
 * `@vuecs/core` internals.
 *
 * `inject()` returns `undefined` if no ThemeManager is installed —
 * design composables use that as the "no theme dispatch" fallback so
 * they keep working in standalone apps that import `@vuecs/design`
 * without `@vuecs/core`.
 */
export const THEME_RUNTIME_MANAGER_SYMBOL = Symbol.for('VCThemeManager') as InjectionKey<ThemeRuntimeManager>;

/**
 * Look up the ThemeManager installed by `app.use(vuecs)` (or
 * `installThemeManager(app)`). Returns `undefined` if no manager is
 * provided in the current setup context — design composables fall back
 * to no-dispatch behaviour in that case.
 *
 * Must be called during `setup()` or another composable's setup phase
 * (Vue's `inject()` requirement).
 */
export function useThemeRuntimeManager(): ThemeRuntimeManager | undefined {
    return inject(THEME_RUNTIME_MANAGER_SYMBOL, undefined);
}
