/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isRef } from 'vue';
import { Component, MaybeRef } from '../type';

export function findTierComponents(
    components: MaybeRef<Component[]>,
    tier: number,
) : Component[] {
    const filterFn = (component: Component) => typeof component.tier !== 'undefined' && component.tier === tier;

    if (isRef(components)) {
        return components.value.filter(filterFn);
    }

    return components.filter(filterFn);
}

export function findTierComponent(
    components: MaybeRef<Component[]>,
    tier: number,
) : Component | undefined {
    const items = findTierComponents(components, tier);
    if (items.length >= 1) {
        return items[0];
    }

    return undefined;
}

export function setTierForComponents(
    components: MaybeRef<Component[]>,
    tier: number,
) {
    const mapFn = (component: Component) => {
        component.tier = tier;
        return component;
    };

    if (isRef(components)) {
        return components.value.map(mapFn);
    }

    return components.map(mapFn);
}

export function removeTierFromComponents(components: MaybeRef<Component[]>, tier: number) {
    const filterFn = (component: Component) => typeof component.tier === 'undefined' || component.tier !== tier;
    if (isRef(components)) {
        return components.value.filter(filterFn);
    }

    return components.filter(filterFn);
}
