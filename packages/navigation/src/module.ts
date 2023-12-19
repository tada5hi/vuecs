import {
    buildNavigationForTier,
    findNavigationItemForTier,
    isNavigationItemMatch,
    replaceNavigationTierItemActive,
    setTierForNavigationItems,
} from './core';
import { useNavigationProvider } from './provider';
import type { NavigationBuildContext } from './store';
import { injectStore } from './store';
import type { NavigationItem } from './type';

export async function buildNavigation(
    context: NavigationBuildContext = {},
): Promise<void> {
    const store = injectStore();
    const navigationProvider = useNavigationProvider();

    let itemsActive: NavigationItem[] = [];

    if (typeof context.itemsActive !== 'undefined') {
        itemsActive = context.itemsActive;
    } else if (context.route) {
        if (typeof navigationProvider.getItemsActiveByRoute !== 'undefined') {
            itemsActive = await navigationProvider.getItemsActiveByRoute(context.route);
        } else if (typeof navigationProvider.getItemsActiveByURL !== 'undefined') {
            itemsActive = await navigationProvider.getItemsActiveByURL(context.route.fullPath);
        }
    } else if (
        context.url &&
        typeof navigationProvider.getItemsActiveByURL !== 'undefined'
    ) {
        itemsActive = await navigationProvider.getItemsActiveByURL(context.url);
    }

    if (itemsActive.length > 0) {
        for (let i = 0; i < itemsActive.length; i++) {
            if (typeof itemsActive[i].tier === 'undefined') {
                itemsActive[i].tier = i;
            }
        }
    }

    let tierIndex = 0;

    let url: string | undefined;
    if (typeof context.url === 'string') {
        url = context.url;
    } else if (typeof context.route !== 'undefined') {
        url = context.route.fullPath;
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
        let items = await navigationProvider
            .getItems(tierIndex, itemsActive);

        if (!items || items.length === 0) {
            break;
        }

        // ensure tier property
        items = setTierForNavigationItems(items, tierIndex);

        let currentItem = findNavigationItemForTier(itemsActive, tierIndex);

        if (!currentItem) {
            if (url) {
                const urlMatches = items.filter(
                    (item) => isNavigationItemMatch(item, { url }),
                );
                if (urlMatches.length > 0) {
                    [currentItem] = urlMatches;
                }
            }

            if (!currentItem) {
                const defaultItem = items
                    .filter((item) => item.default);
                if (defaultItem.length > 0) {
                    currentItem = defaultItem;
                } else {
                    [currentItem] = items;
                }
            }

            currentItem.tier = tierIndex;
            itemsActive.push(currentItem);
        }

        if (!currentItem) {
            continue;
        }

        replaceNavigationTierItemActive(store, tierIndex, currentItem);

        await buildNavigationForTier(store, tierIndex, itemsActive);

        tierIndex++;
    }
}
