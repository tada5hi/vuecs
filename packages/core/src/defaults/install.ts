import type { App } from 'vue';
import { inject, provide } from '../utils';
import { DefaultsManager } from './manager';
import type { DefaultsManagerOptions } from './types';

const DEFAULTS_MANAGER_SYMBOL = Symbol.for('VCDefaultsManager');

export function installDefaultsManager(
    app: App,
    options: DefaultsManagerOptions = {},
): DefaultsManager {
    const existing = inject<DefaultsManager>(DEFAULTS_MANAGER_SYMBOL, app);
    if (existing) {
        return existing;
    }

    const manager = new DefaultsManager(options);
    provide(DEFAULTS_MANAGER_SYMBOL, manager, app);
    return manager;
}

export function injectDefaultsManager(app?: App): DefaultsManager | undefined {
    return inject<DefaultsManager>(DEFAULTS_MANAGER_SYMBOL, app);
}
