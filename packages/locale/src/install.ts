import { installConfigManager, provide } from '@vuecs/core';
import { useStorage } from '@vueuse/core';
import { effectScope, ref } from 'vue';
import type { App, Ref } from 'vue';
import { bindLocale } from './bind';
import {
    AUTO_LOCALE,
    DEFAULT_STORAGE_KEY,
    LOCALE_MANAGER_SYMBOL,
} from './constants';
import type { LocaleOptions, LocaleSource, UseLocaleReturn } from './types';

/**
 * Create the app-scoped locale source, bridge its resolved value into
 * `@vuecs/core`'s cross-cutting `Config`, and provide the control handles
 * for {@link useLocaleManager}.
 *
 * Bridging through `Config['locale']` (rather than a private symbol) means
 * `useLocale()` and every locale-aware component read the same value —
 * `set()` / `reset()` propagate reactively because the manager unwraps the
 * provided `ComputedRef` on every read.
 *
 * Install-order-safe: `installConfigManager` merges into an existing
 * manager, so this works whether installed before or after
 * `app.use(vuecs)`. When both set `config.locale`, the later `app.use(...)`
 * wins.
 *
 * SSR: pass `options.source` (e.g. a cookie-backed ref) and
 * `options.navigatorLanguage` (an `Accept-Language`-derived ref) so the
 * resolved value is correct on the server. The reactive wiring is owned
 * by a detached `effectScope` that is stopped on app unmount, so repeated
 * app creation (HMR, tests, micro-frontends) doesn't leak watchers /
 * listeners.
 */
export function installLocale(app: App, options: LocaleOptions = {}): UseLocaleReturn {
    const {
        initial = AUTO_LOCALE,
        persist = true,
        storageKey = DEFAULT_STORAGE_KEY,
        source: customSource,
        ...bindOptions
    } = options;

    const scope = effectScope(true);
    const handles = scope.run(() => {
        const source: Ref<LocaleSource> = customSource ?? (persist ?
            useStorage<LocaleSource>(storageKey, initial) :
            ref<LocaleSource>(initial));

        return bindLocale(source, { initial, ...bindOptions });
    }) as UseLocaleReturn;

    installConfigManager(app, { config: { locale: handles.resolved } });

    provide(LOCALE_MANAGER_SYMBOL, handles, app);

    // Vue 3.5+: tear the scope down with the app so watchers / listeners
    // created above don't outlive the app instance.
    if (typeof app.onUnmount === 'function') {
        app.onUnmount(() => scope.stop());
    }

    return handles;
}
