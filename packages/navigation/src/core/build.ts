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
): Promise<boolean> {
    if (
        typeof itemsActive === 'undefined' ||
        itemsActive.length === 0
    ) {
        let tierStartIndex = 0;
        const tierEndIndex = tier;

        itemsActive = [];

        while (tierStartIndex <= tierEndIndex) {
            const component = findNavigationItemForTier(store.itemsActive.value, tierStartIndex);
            if (!component) {
                break;
            }

            itemsActive.push(component);

            tierStartIndex++;
        }
    }

    const items = await useNavigationProvider()
        .getItems(
            tier,
            itemsActive,
        );

    if (typeof items === 'undefined') {
        return false;
    }

    replaceNavigationTierItems(store, tier, items);
    refreshNavigationTierItems(store, tier);

    return true;
}
