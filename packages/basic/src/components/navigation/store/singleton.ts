/* eslint-disable vue/no-ref-as-operand */
/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Ref, ref } from 'vue';
import { NavigationStore, NavigationStoreInitOptions } from './type';

let instance: Ref<NavigationStore> | undefined;

export function useStore() : Ref<NavigationStore> {
    if (typeof instance !== 'undefined') {
        return instance;
    }

    instance = ref<NavigationStore>({
        items: [],
        itemsActive: [],
        tiers: undefined,
    });

    return instance;
}

export function useStoreItem<T extends keyof NavigationStore>(
    key: T,
) : NavigationStore[T] {
    const store = useStore();
    return store.value[key];
}

export function setStoreItem<T extends keyof NavigationStore>(
    key: T,
    value: NavigationStore[T],
) {
    const store = useStore();
    store.value[key] = value;
}

export function setStore(
    store: Ref<NavigationStore>,
    options?: NavigationStoreInitOptions,
) {
    options = options || {};

    if (
        typeof instance !== 'undefined' &&
        !options.forceSet
    ) {
        return instance;
    }

    instance = store;

    return instance;
}

export function getStore() : Ref<NavigationStore> | undefined {
    return instance;
}
