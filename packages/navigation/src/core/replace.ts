/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { MaybeRef } from 'vue';
import type { NavigationStore } from '../store';
import type { NavigationItem } from '../type';
import { removeTierFromNavigationItems, setTierForNavigationItems } from './tier';

export function replaceNavigationTierItemActive(
    store: NavigationStore,
    tier: number,
    item: NavigationItem | undefined,
) {
    const items = removeTierFromNavigationItems(store.itemsActive.value, tier);

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

export function replaceNavigationTierItems(
    store: NavigationStore,
    tier: number,
    items: MaybeRef<NavigationItem[]>,
) {
    const componentsExisting = removeTierFromNavigationItems(store.items.value, tier);

    store.items.value = [
        ...componentsExisting,
        ...setTierForNavigationItems(items, tier),
    ];
}
