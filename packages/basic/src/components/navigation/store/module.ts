/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { MaybeRef } from '@vue-layout/core';
import { useNavigationProvider } from '../provider';
import {
    findNavigationElementForTier,
    findNavigationElementsForTier,
    isNavigationElementMatch,
    removeTierFromNavigationElements,
    resetNavigationExpansion,
    setNavigationExpansion, setTierForNavigationElements,
} from '../utils';
import type { NavigationElement } from '../type';
import type { NavigationBuildContext } from './type';
import { setStoreItem, useStoreItem } from './singleton';

function setNavigationElementActive(tier: number, item: NavigationElement | undefined) {
    const data = useStoreItem('itemsActive');
    const componentsExisting = removeTierFromNavigationElements(data, tier);

    if (item) {
        item.tier = tier;

        setStoreItem('itemsActive', [
            ...componentsExisting,
            item,
        ]);
    } else {
        setStoreItem('itemsActive', componentsExisting);
    }
}

function setNavigationElements(tier: number, items: MaybeRef<NavigationElement[]>) {
    const data = useStoreItem('items');
    const componentsExisting = removeTierFromNavigationElements(data, tier);

    setStoreItem('items', [
        ...componentsExisting,
        ...setTierForNavigationElements(items, tier),
    ]);
}

function refreshNavigationElements(tier: number) {
    let components = getComponents(tier);
    components = resetNavigationExpansion(components);

    const component = getActiveComponent(tier);
    if (component) {
        const { items } = setNavigationExpansion(components, component);
        components = items;
    }

    setNavigationElements(tier, components);
}

async function calculateNavigationTiers() : Promise<number> {
    let tiers = useStoreItem('tiers');

    if (typeof tiers !== 'undefined') {
        return tiers;
    }

    tiers = 0;

    let match = true;
    while (match) {
        const hasTier = await useNavigationProvider().hasTier(tiers);
        if (!hasTier) {
            match = false;
        } else {
            tiers++;
        }
    }

    setStoreItem('tiers', tiers);

    return tiers;
}

// --------------------------------------------------------

export async function selectNavigationElement(
    tier: number,
    component: NavigationElement,
) {
    const isMatch = isNavigationElementMatch(getActiveComponent(tier), component);

    if (isMatch) {
        return;
    }

    setNavigationElementActive(tier, component);
    refreshNavigationElements(tier);

    const tiers = await calculateNavigationTiers();

    let tierStartIndex = tier + 1;

    while (tierStartIndex <= tiers) {
        await buildNavigationForTier(tierStartIndex);

        tierStartIndex++;
    }
}

export function toggleNavigation(tier: number, component: NavigationElement) {
    const isMatch = isNavigationElementMatch(getActiveComponent(tier), component) ||
        component.displayChildren;

    if (isMatch) {
        setNavigationElementActive(tier, undefined);
    } else {
        setNavigationElementActive(tier, component);
    }

    refreshNavigationElements(tier);
}

export async function buildNavigation(context?: NavigationBuildContext) : Promise<void> {
    const navigationProvider = useNavigationProvider();

    context = context || {};

    let itemsActive : NavigationElement[] = context.items ?? [];

    if (
        itemsActive.length === 0 &&
        context.url
    ) {
        itemsActive = await navigationProvider
            .getElementsActive(context.url);

        for (let i = 0; i < itemsActive.length; i++) {
            itemsActive[i].tier = i;
        }
    }

    const tierLength = await calculateNavigationTiers();
    let tierIndex = 0;

    let tierHasItems = true;

    while (tierIndex < tierLength && tierHasItems) {
        let items = await navigationProvider
            .getElements(tierIndex, [...itemsActive]);

        if (items.length === 0) {
            tierHasItems = false;
            continue;
        }

        // ensure tier property
        items = setTierForNavigationElements(items, tierIndex);

        let currentItem = findNavigationElementForTier(itemsActive, tierIndex);

        if (!currentItem) {
            if (context.url) {
                const urlMatches = items.filter((item) => isNavigationElementMatch(item, { url: context?.url }));
                if (urlMatches && urlMatches.length > 0) {
                    // eslint-disable-next-line prefer-destructuring
                    currentItem = urlMatches[0];
                }
            }

            if (!currentItem) {
                const defaultItem = items
                    .filter((item) => item.default);
                if (defaultItem.length > 0) {
                    currentItem = defaultItem;
                } else {
                    // eslint-disable-next-line prefer-destructuring
                    currentItem = items[0];
                }
            }

            currentItem.tier = tierIndex;
            itemsActive.push(currentItem);
        }

        if (!currentItem) {
            continue;
        }

        setNavigationElementActive(tierIndex, currentItem);

        await buildNavigationForTier(tierIndex, itemsActive);

        tierIndex++;
    }
}

export async function buildNavigationForTier(
    tier: number,
    itemsActive?: NavigationElement[],
) : Promise<void> {
    if (typeof itemsActive === 'undefined') {
        let tierStartIndex = 0;
        const tierEndIndex = tier;

        itemsActive = [];

        let found = true;

        while (tierStartIndex <= tierEndIndex && found) {
            const component = getActiveComponent(tierStartIndex);
            if (!component) {
                found = false;
                continue;
            }

            itemsActive.push(component);

            tierStartIndex++;
        }
    }

    const items : NavigationElement[] = await useNavigationProvider().getElements(
        tier,
        itemsActive,
    );

    setNavigationElements(tier, [...items]);
    refreshNavigationElements(tier);
}

// --------------------------------------------------------

export function getComponents(tier: number) : NavigationElement[] {
    const data = useStoreItem('items');
    return findNavigationElementsForTier(data, tier);
}

export function getActiveComponent(tier: number) : NavigationElement | undefined {
    const data = useStoreItem('itemsActive');
    return findNavigationElementForTier(data, tier);
}

// --------------------------------------------------------
