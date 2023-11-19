/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { NavigationStore } from '../store';
import { setNavigationExpansion } from './expansion';
import { resetNavigationElements } from './reset';
import { replaceNavigationTierElements } from './replace';
import { findNavigationElementForTier, findNavigationElementsForTier } from './tier';

export function refreshNavigationTierElements(store: NavigationStore, tier: number) {
    const components = resetNavigationElements(findNavigationElementsForTier(store.items.value, tier));

    const component = findNavigationElementForTier(store.itemsActive.value, tier);
    if (component) {
        const { items } = setNavigationExpansion(components, component);
        replaceNavigationTierElements(store, tier, items);
        return;
    }

    replaceNavigationTierElements(store, tier, components);
}
