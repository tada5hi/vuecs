/*
 * Copyright (c) 2021-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { NavigationElement } from '../type';
import { isNavigationElementMatch } from './match';

// --------------------------------------------------

export function resetNavigationExpansion(
    items: NavigationElement[],
    rootTier = true,
) {
    for (let i = 0; i < items.length; i++) {
        items[i].display = rootTier;
        items[i].displayChildren = false;

        const { children } = items[i];

        if (typeof children !== 'undefined') {
            items[i].children = resetNavigationExpansion(children, false);
        }
    }

    return items;
}

export function setNavigationExpansion(
    items: NavigationElement[],
    item: NavigationElement,
    parentMatch = false,
) : { items: NavigationElement[], match: boolean} {
    let matchInIteration = false;

    for (let i = 0; i < items.length; i++) {
        const isMatch = isNavigationElementMatch(items[i], item);
        let isChildMatch = false;

        const { children } = items[i];

        if (typeof children !== 'undefined') {
            const { items: childItems, match: childMatch } = setNavigationExpansion(children, item, isMatch);
            items[i].children = childItems;
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
