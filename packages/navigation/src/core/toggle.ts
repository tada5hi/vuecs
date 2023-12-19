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
