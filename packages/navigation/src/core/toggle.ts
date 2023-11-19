/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { NavigationStore } from '../store';
import type { NavigationElement } from '../type';
import { isNavigationElementMatch } from './match';
import { refreshNavigationTierElements } from './refresh';
import { replaceNavigationTierElementActive } from './replace';
import { findNavigationElementForTier } from './tier';

export function toggleNavigation(
    store: NavigationStore,
    tier: number,
    component: NavigationElement,
) {
    const isMatch = component.displayChildren || isNavigationElementMatch(
        findNavigationElementForTier(store.itemsActive.value, tier),
        component,
    );

    if (isMatch) {
        replaceNavigationTierElementActive(store, tier, undefined);
    } else {
        replaceNavigationTierElementActive(store, tier, component);
    }

    refreshNavigationTierElements(store, tier);
}
