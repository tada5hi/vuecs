/*
 * Copyright (c) 2021-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Component } from '../type';
import { isComponentMatch } from './match';

// --------------------------------------------------

export function resetNavigationExpansion(
    items: Component[],
    rootTier = true,
) {
    for (let i = 0; i < items.length; i++) {
        items[i].display = rootTier;
        items[i].displayChildren = false;

        const { components } = items[i];

        if (typeof components !== 'undefined') {
            items[i].components = resetNavigationExpansion(components, false);
        }
    }

    return items;
}

export function setNavigationExpansion(
    items: Component[],
    component: Component,
    parentMatch = false,
) : { items: Component[], match: boolean} {
    let matchInIteration = false;

    for (let i = 0; i < items.length; i++) {
        const isMatch = isComponentMatch(items[i], component);
        let isChildMatch = false;

        const { components } = items[i];

        if (typeof components !== 'undefined') {
            const { items: childItems, match: childMatch } = setNavigationExpansion(components, component, isMatch);
            items[i].components = childItems;
            isChildMatch = childMatch;
        }

        if (isMatch || isChildMatch) {
            items[i].display = true;
            items[i].displayChildren = true;
        }

        if (parentMatch) {
            items[i].display = true;
        }

        if (!matchInIteration) {
            matchInIteration = isMatch || isChildMatch;
        }
    }

    if (matchInIteration) {
        for (let i = 0; i < items.length; i++) {
            items[i].display = true;
        }
    }

    return { items, match: matchInIteration };
}
