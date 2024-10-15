/*
 * Copyright (c) 2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { NavigationItem, NavigationItemNormalized } from '../type';

type NormalizeItemOptions = {
    tier: number
};

function normalizeItemIF(
    item: NavigationItem,
    defaults: NormalizeItemOptions,
    trace: string[],
) : NavigationItemNormalized {
    const output : NavigationItemNormalized = {
        ...item,
        tier: defaults.tier,
        children: [],
        trace: [
            ...trace,
            item.name,
        ],
    };

    if (!item.children) {
        return output;
    }

    for (let i = 0; i < item.children.length; i++) {
        output.children.push(normalizeItemIF(item.children[i], defaults, output.trace));
    }

    return output;
}

export function normalizeItem(
    item: NavigationItem,
    defaults: NormalizeItemOptions,
) : NavigationItemNormalized {
    return normalizeItemIF(item, defaults, []);
}

export function normalizeItems(
    items: NavigationItem[],
    options: NormalizeItemOptions,
) : NavigationItemNormalized[] {
    return items.map((item) => normalizeItem(item, options));
}
