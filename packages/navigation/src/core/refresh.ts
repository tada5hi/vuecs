import type { NavigationStore } from '../store';
import { setNavigationExpansion } from './expansion';
import { resetNavigationItem } from './reset';
import { replaceNavigationTierItems } from './replace';
import { findNavigationItemForTier, findNavigationItemsForTier } from './tier';

export function refreshNavigationTierItems(store: NavigationStore, tier: number) {
    const components = resetNavigationItem(findNavigationItemsForTier(store.items.value, tier));

    const component = findNavigationItemForTier(store.itemsActive.value, tier);
    if (component) {
        const { items } = setNavigationExpansion(components, component);
        replaceNavigationTierItems(store, tier, items);
        return;
    }

    replaceNavigationTierItems(store, tier, components);
}
