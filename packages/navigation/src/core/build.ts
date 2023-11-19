/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { useNavigationProvider } from '../provider';
import type { NavigationStore } from '../store';
import type { NavigationElement } from '../type';
import { refreshNavigationTierElements } from './refresh';
import { replaceNavigationTierElements } from './replace';
import { findNavigationElementForTier } from './tier';

export async function buildNavigationForTier(
    store: NavigationStore,
    tier: number,
    itemsActive?: NavigationElement[],
): Promise<void> {
    if (typeof itemsActive === 'undefined' || itemsActive.length === 0) {
        let tierStartIndex = 0;
        const tierEndIndex = tier;

        itemsActive = [];

        let found = true;

        while (tierStartIndex <= tierEndIndex && found) {
            const component = findNavigationElementForTier(store.itemsActive.value, tierStartIndex);
            if (!component) {
                found = false;
                continue;
            }

            itemsActive.push(component);

            tierStartIndex++;
        }
    }

    const items: NavigationElement[] = await useNavigationProvider()
        .getElements(
            tier,
            itemsActive,
        );

    replaceNavigationTierElements(store, tier, items);
    refreshNavigationTierElements(store, tier);
}
