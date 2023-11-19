/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { NavigationStore } from '../store';
import type { NavigationItem } from '../type';
import { isNavigationItemMatch } from './match';
import { refreshNavigationTierItems } from './refresh';
import { replaceNavigationTierItemActive } from './replace';
import { findNavigationItemForTier } from './tier';

export function toggleNavigation(
    store: NavigationStore,
    tier: number,
    component: NavigationItem,
) {
    const isMatch = component.displayChildren || isNavigationItemMatch(
        findNavigationItemForTier(store.itemsActive.value, tier),
        component,
    );

    if (isMatch) {
        replaceNavigationTierItemActive(store, tier, undefined);
    } else {
        replaceNavigationTierItemActive(store, tier, component);
    }

    refreshNavigationTierItems(store, tier);
}
