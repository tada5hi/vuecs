/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { MaybeRef } from 'vue';
import type { NavigationStore } from '../store';
import type { NavigationElement } from '../type';
import { removeTierFromNavigationElements, setTierForNavigationElements } from './tier';

export function replaceNavigationTierElementActive(
    store: NavigationStore,
    tier: number,
    item: NavigationElement | undefined,
) {
    const items = removeTierFromNavigationElements(store.itemsActive.value, tier);

    if (item) {
        item.tier = tier;

        store.itemsActive.value = [
            ...items,
            item,
        ];
    } else {
        store.itemsActive.value = items;
    }
}

export function replaceNavigationTierElements(
    store: NavigationStore,
    tier: number,
    items: MaybeRef<NavigationElement[]>,
) {
    const componentsExisting = removeTierFromNavigationElements(store.items.value, tier);

    store.items.value = [
        ...componentsExisting,
        ...setTierForNavigationElements(items, tier),
    ];
}
