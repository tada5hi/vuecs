import type { App } from 'vue';
import { provide as vueProvide } from 'vue';
import { inject, provide } from '../utils';
import { ConfigManager } from './manager';
import type { ConfigManagerOptions } from './types';

const CONFIG_MANAGER_SYMBOL = Symbol.for('VCConfigManager');

/**
 * App-level install. Idempotent — calling twice on the same app reuses the
 * existing manager. Used by `app.use(vuecs, { config })`.
 */
export function installConfigManager(
    app: App,
    options: ConfigManagerOptions = {},
): ConfigManager {
    const existing = inject<ConfigManager>(CONFIG_MANAGER_SYMBOL, app);
    if (existing) {
        return existing;
    }

    const manager = new ConfigManager(options);
    provide(CONFIG_MANAGER_SYMBOL, manager, app);
    return manager;
}

/**
 * Component-scope provide. Used by `<VCConfigProvider>` to scope a child
 * `ConfigManager` to a subtree. Must be called inside a component's
 * `setup()`.
 *
 * Bypasses vuecs's `provide` helper deliberately: that helper short-circuits
 * if the key is already in the inject chain (idempotency for plugin
 * installation), but the whole point of `<VCConfigProvider>` is to override
 * a parent provide. Uses Vue's raw `provide` directly so the subtree
 * sees the new manager.
 */
export function provideConfigManager(manager: ConfigManager): void {
    vueProvide(CONFIG_MANAGER_SYMBOL, manager);
}

export function injectConfigManager(app?: App): ConfigManager | undefined {
    return inject<ConfigManager>(CONFIG_MANAGER_SYMBOL, app);
}
