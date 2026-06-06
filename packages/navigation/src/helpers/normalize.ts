/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { NavigationItem, NavigationItemNormalized } from '../types';

function normalizeItemIF(
    item: NavigationItem,
    trace: string[],
) : NavigationItemNormalized {
    const output : NavigationItemNormalized = {
        ...item,
        children: [],
        trace: [
            ...trace,
            item.name,
        ],
        meta: item.meta || {},
    };

    if (!item.children) {
        return output;
    }

    for (let i = 0; i < item.children.length; i++) {
        output.children.push(normalizeItemIF(item.children[i], output.trace));
    }

    return output;
}

export function normalizeItem(
    item: NavigationItem,
) : NavigationItemNormalized {
    return normalizeItemIF(item, []);
}

export function normalizeItems(
    items: NavigationItem[],
) : NavigationItemNormalized[] {
    return items.map((item) => normalizeItem(item));
}
