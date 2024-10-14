import type { App } from 'vue';
import { inject, provide } from '../utils';
import { StoreManager } from './module';

function getSymbol(key?: string) {
    if (typeof key === 'string') {
        return Symbol.for(`VCStoreManager#${key}`);
    }

    return Symbol.for('VCStoreManager');
}

export function installStoreManager(
    instance: App,
    key?: string,
) : StoreManager {
    const symbol = getSymbol(key);
    let manager = inject<StoreManager>(symbol, instance);
    if (manager) {
        return manager;
    }

    manager = new StoreManager();
    provide(symbol, manager, instance);

    return manager;
}

export function injectStoreManager(key?: string, app?: App) {
    const symbol = getSymbol(key);
    const manager = inject<StoreManager>(symbol, app);
    if (!manager) {
        throw new Error('The store manager has not been setup.');
    }

    return manager;
}
