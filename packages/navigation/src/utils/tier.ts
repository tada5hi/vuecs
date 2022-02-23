/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Component } from '../type';

export function parseTier(value: string | number): string {
    return typeof value === 'string' ?
        value :
        value.toString();
}

export function buildTierIndex(value: string | number): number {
    return parseInt(`${value}`, 10);
}

export function findTierComponents(
    components: Component[],
    tier: number,
) : Component[] {
    return components.filter((component) => typeof component.tier !== 'undefined' && component.tier === tier);
}

export function findTierComponent(
    components: Component[],
    tier: number,
) : Component | undefined {
    const items = findTierComponents(components, tier);
    if (items.length >= 1) {
        return items[0];
    }

    return undefined;
}

export function setTierForComponents(
    components: Component[],
    tier: number,
) {
    return components.map((component) => {
        component.tier = tier;
        return component;
    });
}

export function removeTierFromComponents(components: Component[], tier: number) {
    return components.filter((component) => typeof component.tier === 'undefined' || component.tier !== tier);
}
