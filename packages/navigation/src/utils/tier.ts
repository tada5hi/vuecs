/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { MaybeRef } from 'vue';
import { isRef } from 'vue';
import type { NavigationElement } from '../type';

export function findNavigationElementsForTier(
    items: MaybeRef<NavigationElement[]>,
    tier: number,
) : NavigationElement[] {
    const filterFn = (component: NavigationElement) => typeof component.tier !== 'undefined' && component.tier === tier;

    if (isRef(items)) {
        return items.value.filter(filterFn);
    }

    return items.filter(filterFn);
}

export function findNavigationElementForTier(
    items: MaybeRef<NavigationElement[]>,
    tier: number,
) : NavigationElement | undefined {
    const data = findNavigationElementsForTier(items, tier);
    if (data.length >= 1) {
        return data[0];
    }

    return undefined;
}

export function setTierForNavigationElements(
    items: MaybeRef<NavigationElement[]>,
    tier: number,
) {
    const mapFn = (component: NavigationElement) => {
        component.tier = tier;
        return component;
    };

    if (isRef(items)) {
        return items.value.map(mapFn);
    }

    return items.map(mapFn);
}

export function removeTierFromNavigationElements(
    items: MaybeRef<NavigationElement[]>,
    tier: number,
) {
    const filterFn = (items: NavigationElement) => typeof items.tier === 'undefined' || items.tier !== tier;
    if (isRef(items)) {
        return items.value.filter(filterFn);
    }

    return items.filter(filterFn);
}
