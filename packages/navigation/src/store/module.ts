/* eslint-disable vue/no-ref-as-operand */
/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { App } from 'vue';
import {
    hasInjectionContext, inject, provide, ref,
} from 'vue';
import type { NavigationStore } from './type';

export const StoreSymbol = Symbol.for('VLNavigationStore');

export function isStoreInjected() {
    if (!hasInjectionContext()) {
        return false;
    }

    const instance = inject(StoreSymbol);
    return !!instance;
}

export function setupStore(app?: App) {
    const store : NavigationStore = {
        items: ref([]),
        itemsActive: ref([]),
    };

    if (typeof app === 'undefined') {
        if (isStoreInjected()) {
            return;
        }

        provide(StoreSymbol, store);
        return;
    }

    if (
        app._context &&
        app._context.provides &&
        app._context.provides[StoreSymbol]
    ) {
        return;
    }

    app.provide(StoreSymbol, store);
}

export function injectStore() : NavigationStore {
    const instance = inject(StoreSymbol);
    if (!instance) {
        throw new Error('The Store is not set.');
    }

    return instance as NavigationStore;
}
