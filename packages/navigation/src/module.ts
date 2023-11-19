/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    buildNavigationForTier,
    calculateNavigationTiers,
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
        if (typeof navigationProvider.getElementsActiveByRoute !== 'undefined') {
            itemsActive = await navigationProvider.getElementsActiveByRoute(context.route);
        } else if (typeof navigationProvider.getElementsActiveByURL !== 'undefined') {
            itemsActive = await navigationProvider.getElementsActiveByURL(context.route.fullPath);
        }
    } else if (
        context.url &&
        typeof navigationProvider.getElementsActiveByURL !== 'undefined'
    ) {
        itemsActive = await navigationProvider.getElementsActiveByURL(context.url);
    }

    if (itemsActive.length > 0) {
        for (let i = 0; i < itemsActive.length; i++) {
            if (typeof itemsActive[i].tier === 'undefined') {
                itemsActive[i].tier = i;
            }
        }
    }

    const numTiers = await calculateNavigationTiers(store);
    let tierIndex = 0;

    let url: string | undefined;
    if (typeof context.url === 'string') {
        url = context.url;
    } else if (typeof context.route !== 'undefined') {
        url = context.route.fullPath;
    }

    while (tierIndex < numTiers) {
        let items = await navigationProvider
            .getElements(tierIndex, itemsActive);

        if (items.length === 0) {
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
