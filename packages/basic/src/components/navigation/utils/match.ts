/*
 * Copyright (c) 2021-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { MaybeRef } from '@vue-layout/core';
import { unref } from 'vue';
import { NavigationElement } from '../type';

function isRootLink(element: MaybeRef<NavigationElement>) {
    element = unref(element);
    return element.rootLink || (element.url && element.url === '/');
}

export function isNavigationElementMatch(
    one?: MaybeRef<NavigationElement>,
    two?: MaybeRef<NavigationElement>,
    exact = true,
): boolean {
    one = unref(one);
    two = unref(two);

    // both undefined or one of them
    if (!(one && two) || (!one || !two)) {
        return false;
    }

    // check when true
    if (one.id && two.id && one.id === two.id) {
        return true;
    }

    if (one.name && two.name && one.name === two.name) {
        return true;
    }

    if (one.url && two.url) {
        if (one.url === two.url) {
            return true;
        }

        if (!exact && !isRootLink(one) && !isRootLink(two)) {
            if (
                one.url.startsWith(two.url) ||
                two.url.startsWith(one.url)
            ) {
                return true;
            }
        }
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
