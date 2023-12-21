import { hasInjectionContext, inject } from 'vue';
import type { App } from 'vue';
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
    let manager : StoreManager | undefined;

    const symbol = getSymbol(key);

    if (
        instance._context &&
        instance._context.provides &&
        instance._context.provides[symbol]
    ) {
        return instance._context.provides[symbol];
    }

    if (hasInjectionContext()) {
        manager = inject(symbol, undefined);
        if (manager) {
            return manager;
        }
    }

    manager = new StoreManager();

    instance.provide(symbol, manager);
    return manager;
}

export function injectStoreManager(key?: string) {
    const symbol = getSymbol(key);
    const manager = inject(symbol);
    if (!manager) {
        throw new Error('The store manager has not been setup.');
    }

    return manager as StoreManager;
}
