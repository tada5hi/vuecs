/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasInjectionContext, inject } from 'vue';
import type { App } from 'vue';
import { StoreManager } from './module';

const symbol = Symbol.for('VLStoreManager');

export function installStoreManager(
    instance: App,
) : StoreManager {
    let manager : StoreManager | undefined;

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

export function injectStoreManager() {
    const manager = inject(symbol);
    if (!manager) {
        throw new Error('The store manager has not been setup.');
    }

    return manager as StoreManager;
}
