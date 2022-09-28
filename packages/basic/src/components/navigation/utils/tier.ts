/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { MaybeRef } from '@vue-layout/core';
import { isRef } from 'vue';
import { NavigationElement } from '../type';

export function findTierComponents(
    components: MaybeRef<NavigationElement[]>,
    tier: number,
) : NavigationElement[] {
    const filterFn = (component: NavigationElement) => typeof component.tier !== 'undefined' && component.tier === tier;

    if (isRef(components)) {
        return components.value.filter(filterFn);
    }

    return components.filter(filterFn);
}

export function findTierComponent(
    components: MaybeRef<NavigationElement[]>,
    tier: number,
) : NavigationElement | undefined {
    const items = findTierComponents(components, tier);
    if (items.length >= 1) {
        return items[0];
    }

    return undefined;
}

export function setTierForComponents(
    components: MaybeRef<NavigationElement[]>,
    tier: number,
) {
    const mapFn = (component: NavigationElement) => {
        component.tier = tier;
        return component;
    };

    if (isRef(components)) {
        return components.value.map(mapFn);
    }

    return components.map(mapFn);
}

export function removeTierFromComponents(components: MaybeRef<NavigationElement[]>, tier: number) {
    const filterFn = (component: NavigationElement) => typeof component.tier === 'undefined' || component.tier !== tier;
    if (isRef(components)) {
        return components.value.filter(filterFn);
    }

    return components.filter(filterFn);
}
