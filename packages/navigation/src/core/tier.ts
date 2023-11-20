/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { MaybeRef } from 'vue';
import { isRef } from 'vue';
import type { NavigationItem } from '../type';

export function findNavigationItemsForTier(
    items: NavigationItem[],
    tier: number,
) : NavigationItem[] {
    const filterFn = (
        component: NavigationItem,
    ) => typeof component.tier !== 'undefined' && component.tier === tier;

    return items.filter(filterFn);
}

export function findNavigationItemForTier(
    items: NavigationItem[],
    tier: number,
) : NavigationItem | undefined {
    const data = findNavigationItemsForTier(items, tier);
    if (data.length >= 1) {
        return data[0];
    }

    return undefined;
}

export function setTierForNavigationItems(
    items: MaybeRef<NavigationItem[]>,
    tier: number,
) {
    const mapFn = (component: NavigationItem) => {
        component.tier = tier;
        return component;
    };

    if (isRef(items)) {
        return items.value.map(mapFn);
    }

    return items.map(mapFn);
}

export function removeTierFromNavigationItems(
    items: MaybeRef<NavigationItem[]>,
    tier: number,
) {
    const filterFn = (items: NavigationItem) => typeof items.tier === 'undefined' || items.tier !== tier;
    if (isRef(items)) {
        return items.value.filter(filterFn);
    }

    return items.filter(filterFn);
}
