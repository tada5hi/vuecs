/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { NavigationStore } from '../store';
import type { NavigationElement } from '../type';
import { buildNavigationForTier } from './build';
import { isNavigationElementMatch } from './match';
import { refreshNavigationTierElements } from './refresh';
import { replaceNavigationTierElementActive } from './replace';
import { calculateNavigationTiers, findNavigationElementForTier } from './tier';

export async function selectNavigationTierElement(
    store: NavigationStore,
    tier: number,
    component: NavigationElement,
) {
    const isMatch = isNavigationElementMatch(
        findNavigationElementForTier(store.itemsActive.value, tier),
        component,
    );

    if (isMatch) {
        return;
    }

    replaceNavigationTierElementActive(store, tier, component);
    refreshNavigationTierElements(store, tier);

    const tiers = await calculateNavigationTiers(store);

    let tierStartIndex = tier + 1;

    while (tierStartIndex <= tiers) {
        await buildNavigationForTier(store, tierStartIndex);

        tierStartIndex++;
    }
}
