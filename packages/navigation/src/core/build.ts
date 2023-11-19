/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { useNavigationProvider } from '../provider';
import type { NavigationStore } from '../store';
import type { NavigationItem } from '../type';
import { refreshNavigationTierItems } from './refresh';
import { replaceNavigationTierItems } from './replace';
import { findNavigationItemForTier } from './tier';

export async function buildNavigationForTier(
    store: NavigationStore,
    tier: number,
    itemsActive?: NavigationItem[],
): Promise<void> {
    if (typeof itemsActive === 'undefined' || itemsActive.length === 0) {
        let tierStartIndex = 0;
        const tierEndIndex = tier;

        itemsActive = [];

        let found = true;

        while (tierStartIndex <= tierEndIndex && found) {
            const component = findNavigationItemForTier(store.itemsActive.value, tierStartIndex);
            if (!component) {
                found = false;
                continue;
            }

            itemsActive.push(component);

            tierStartIndex++;
        }
    }

    const items: NavigationItem[] = await useNavigationProvider()
        .getElements(
            tier,
            itemsActive,
        );

    replaceNavigationTierItems(store, tier, items);
    refreshNavigationTierItems(store, tier);
}
