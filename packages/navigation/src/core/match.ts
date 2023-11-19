/*
 * Copyright (c) 2021-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { NavigationElement } from '../type';

export function isNavigationElementMatch(
    one?: NavigationElement,
    two?: NavigationElement,
): boolean {
    if (!one || !two) {
        return false;
    }

    if (
        one.id &&
        two.id &&
        one.id === two.id
    ) {
        return true;
    }

    if (
        one.name &&
        two.name &&
        one.name === two.name
    ) {
        return true;
    }

    if (
        one.url &&
        two.url &&
        one.url === two.url
    ) {
        return true;
    }

    if (
        one.children &&
        two.children &&
        one.children.length === two.children.length
    ) {
        for (let i = 0; i < one.children.length; i++) {
            if (!isNavigationElementMatch(one.children[i], two.children[i])) {
                return false;
            }
        }

        return true;
    }

    return false;
}
