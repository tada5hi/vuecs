/*
 * Copyright (c) 2024-2024.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { NavigationItemNormalized } from '../types';

/**
 * Walk a normalized tree along `trace` (an ordered list of item names,
 * root → leaf) and collect the item at each depth. Returns the ordered
 * active trail: `[0]` is the top-level section, `.at(-1)` is the leaf.
 */
export function collectTrail(
    items: NavigationItemNormalized[],
    trace: string[],
): NavigationItemNormalized[] {
    const output: NavigationItemNormalized[] = [];

    let level = items;
    for (const name of trace) {
        const found = level.find((item) => item.name === name);
        if (!found) {
            break;
        }

        output.push(found);
        level = found.children;
    }

    return output;
}

/**
 * Depth-first collect of every item in the tree matching `predicate`.
 */
export function flattenWhere(
    items: NavigationItemNormalized[],
    predicate: (item: NavigationItemNormalized) => boolean,
): NavigationItemNormalized[] {
    const output: NavigationItemNormalized[] = [];

    for (const item of items) {
        if (predicate(item)) {
            output.push(item);
        }

        if (item.children.length > 0) {
            output.push(...flattenWhere(item.children, predicate));
        }
    }

    return output;
}
