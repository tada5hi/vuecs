import type { App } from 'vue';
import { inject, provide } from '../utils';
import { ConfigManager } from './manager';
import type { ConfigManagerOptions } from './types';

const CONFIG_MANAGER_SYMBOL = Symbol.for('VCConfigManager');

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

export function injectConfigManager(app?: App): ConfigManager | undefined {
    return inject<ConfigManager>(CONFIG_MANAGER_SYMBOL, app);
}
